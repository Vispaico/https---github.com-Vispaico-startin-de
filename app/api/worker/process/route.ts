import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { config } from '@/lib/config';
import { getPrivateBytes } from '@/lib/documents/store';
import { extractDocument } from '@/lib/extraction';
import { createReview, failedExtractionReport } from '@/lib/documents/review';
import { getProviderIdentity } from '@/lib/providers/openai-compatible';
import { assertSecureServiceUrl } from '@/lib/security/url';
import type { CandidateDocument, DocumentType } from '@/lib/documents/types';

export const runtime = 'nodejs';
export const maxDuration = 120;

async function scanDocument(bytes: Buffer) {
  if (process.env.MALWARE_SCAN_PROVIDER === 'mock' && process.env.NODE_ENV !== 'production') return;
  const endpoint = process.env.MALWARE_SCAN_URL; const key = process.env.MALWARE_SCAN_API_KEY;
  if (!endpoint || !key || !process.env.MALWARE_SCAN_PROVIDER || process.env.MALWARE_SCAN_PROVIDER === 'disabled') throw new Error('malware_scanner_unavailable');
  assertSecureServiceUrl(endpoint);
  const response = await fetch(endpoint, { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/octet-stream' }, body: new Uint8Array(bytes), signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error('malware_scan_failed');
  const result = await response.json() as { clean?: boolean };
  if (result.clean !== true) throw new Error('malware_detected');
}

function admin() {
  if (!config.hasSupabase) throw new Error('supabase_unavailable');
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function POST(request: Request) {
  const expected = process.env.WORKER_SECRET;
  if (!expected || request.headers.get('authorization') !== `Bearer ${expected}`) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  if (!config.hasSupabase) return NextResponse.json({ error: 'Hosted worker requires Supabase.' }, { status: 503 });
  const db = admin();
  const { data: jobs, error: claimError } = await db.rpc('claim_next_document_review_job');
  if (claimError) return NextResponse.json({ error: 'Unable to claim a processing job.' }, { status: 503 });
  const job = jobs?.[0];
  if (!job) return NextResponse.json({ worked: false });
  try {
    const { data: existingReport } = await db.from('document_reports').select('id,outcome').eq('job_id', job.job_id).maybeSingle();
    if (existingReport) {
      await db.from('candidate_documents').update({ status: existingReport.outcome === 'human_review_recommended' || existingReport.outcome === 'unable_to_assess' ? 'needs_human_review' : 'completed' }).eq('id', job.document_id);
      await db.from('document_review_jobs').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', job.job_id);
      return NextResponse.json({ worked: true, status: 'completed' });
    }
    const { data: row, error } = await db.from('candidate_documents').select('*').eq('id', job.document_id).eq('candidate_id', job.candidate_id).is('deleted_at', null).single();
    if (error || !row) throw new Error('document_missing');
    const doc: CandidateDocument = { id: row.id, candidateId: row.candidate_id, documentType: row.document_type, originalFilename: row.original_filename, storageBucket: row.storage_bucket, storagePath: row.storage_path, mimeType: row.mime_type, fileSizeBytes: row.file_size_bytes, sha256Checksum: row.sha256_checksum, status: row.status, createdAt: row.created_at, deletedAt: row.deleted_at };
    await db.from('candidate_documents').update({ status: 'extracting' }).eq('id', doc.id);
    const bytes = await getPrivateBytes(doc);
    await scanDocument(bytes);
    const extraction = await extractDocument(bytes, doc.mimeType);
    if (extraction.pageCount > config.maxPages) throw new Error('page_limit_exceeded');
    if (extraction.quality === 'poor') {
      const report = failedExtractionReport(doc.documentType, extraction.pageCount, extraction.ocrUsed, job.report_language || 'vi');
      const { error: reportError } = await db.from('document_reports').upsert({ job_id: job.job_id, document_id: doc.id, candidate_id: doc.candidateId, schema_version: '1.0', prompt_version: 'review-v1.0', outcome: report.outcome, report_json: report, provider: 'none', model: 'none' }, { onConflict: 'job_id' });
      if (reportError) throw new Error('report_store_failed');
      await db.from('candidate_documents').update({ status: 'needs_human_review', page_count: extraction.pageCount }).eq('id', doc.id);
      await db.from('document_review_jobs').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', job.job_id);
      return NextResponse.json({ worked: true, status: 'needs_human_review' });
    }
    const { error: extractionError } = await db.from('document_extractions').upsert({ document_id: doc.id, extraction_version: 'native-v1', extraction_method: extraction.method, extracted_text: extraction.text, page_map: extraction.pages, quality_status: extraction.quality, ocr_used: extraction.ocrUsed, provider_metadata: extraction.providerMetadata }, { onConflict: 'document_id,extraction_version' });
    if (extractionError) throw new Error('extraction_store_failed');
    await db.from('candidate_documents').update({ status: 'analysing', page_count: extraction.pageCount }).eq('id', doc.id);
    const identity = getProviderIdentity();
    const developmentMock = identity.provider === 'mock' && process.env.NODE_ENV !== 'production';
    if (!developmentMock && process.env.DOCUMENT_AI_APPROVED !== 'true') throw new Error('document_ai_not_approved');
    let inputRate = 0; let outputRate = 0;
    if (!developmentMock) {
      if (!identity.model) throw new Error('model_not_configured');
      const { data: rateCard } = await db.from('model_rate_cards').select('input_usd_per_million,output_usd_per_million').eq('provider', identity.provider).eq('model_id', identity.model).eq('active', true).order('effective_at', { ascending: false }).limit(1).maybeSingle();
      const inputRateValue = rateCard?.input_usd_per_million ?? process.env.LLM_INPUT_USD_PER_MILLION;
      const outputRateValue = rateCard?.output_usd_per_million ?? process.env.LLM_OUTPUT_USD_PER_MILLION;
      inputRate = inputRateValue === null || inputRateValue === undefined || String(inputRateValue).trim() === '' ? Number.NaN : Number(inputRateValue);
      outputRate = outputRateValue === null || outputRateValue === undefined || String(outputRateValue).trim() === '' ? Number.NaN : Number(outputRateValue);
      if (!Number.isFinite(inputRate) || !Number.isFinite(outputRate)) throw new Error('model_rate_card_missing');
    }
    const inputEstimate = Math.ceil(extraction.text.slice(0, 24_000).length / 3.5) + 2_000;
    const projectedCost = (inputEstimate * 2 * inputRate + 3_200 * outputRate) / 1_000_000;
    if (projectedCost > config.maxEstimatedCostUsd) {
      const limited = failedExtractionReport(doc.documentType, extraction.pageCount, extraction.ocrUsed, job.report_language || 'vi');
      limited.summary = 'This document needs a human review because it exceeds the automated review cost limit.';
      limited.limitations = ['Automated analysis was not started because the configured cost limit would be exceeded.'];
      limited.suggestedNextSteps = ['Request an advisor review or upload a shorter, relevant version.'];
      const { error: reportError } = await db.from('document_reports').upsert({ job_id: job.job_id, document_id: doc.id, candidate_id: doc.candidateId, schema_version: '1.0', prompt_version: 'review-v1.0', outcome: 'human_review_recommended', report_json: { ...limited, outcome: 'human_review_recommended' }, provider: 'none', model: 'none' }, { onConflict: 'job_id' });
      if (reportError) throw new Error('report_store_failed');
      await db.from('candidate_documents').update({ status: 'needs_human_review' }).eq('id', doc.id);
      await db.from('document_review_jobs').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', job.job_id);
      return NextResponse.json({ worked: true, status: 'needs_human_review' });
    }
    const { report, usage } = await createReview({ type: doc.documentType, extraction, language: job.report_language || 'vi' });
    const inputTokens = usage.inputTokens ?? inputEstimate * 2;
    const outputTokens = usage.outputTokens ?? 3_200;
    const estimatedCost = (inputTokens * inputRate + outputTokens * outputRate) / 1_000_000;
    if (estimatedCost > config.maxEstimatedCostUsd) {
      const limited = failedExtractionReport(doc.documentType, extraction.pageCount, extraction.ocrUsed, job.report_language || 'vi');
      limited.outcome = 'human_review_recommended';
      limited.summary = 'Automated feedback could not be completed within the configured cost limit. An advisor can review this document.';
      limited.limitations = ['The model response was withheld because the estimated cost exceeded the configured limit.'];
      const { error: reportError } = await db.from('document_reports').upsert({ job_id: job.job_id, document_id: doc.id, candidate_id: doc.candidateId, schema_version: '1.0', prompt_version: 'review-v1.0', outcome: limited.outcome, report_json: limited, provider: usage.provider, model: usage.model, input_tokens: inputTokens, output_tokens: outputTokens, estimated_cost_usd: estimatedCost, latency_ms: usage.latencyMs }, { onConflict: 'job_id' });
      if (reportError) throw new Error('report_store_failed');
      await db.from('candidate_documents').update({ status: 'needs_human_review' }).eq('id', doc.id);
      await db.from('document_review_jobs').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', job.job_id);
      return NextResponse.json({ worked: true, status: 'needs_human_review' });
    }
    const { error: reportError } = await db.from('document_reports').upsert({ job_id: job.job_id, document_id: doc.id, candidate_id: doc.candidateId, schema_version: report.schemaVersion, prompt_version: 'review-v1.0', outcome: report.outcome, indicative_score: report.indicativeScore ?? null, report_json: report, provider: usage.provider, model: usage.model, input_tokens: inputTokens, output_tokens: outputTokens, estimated_cost_usd: estimatedCost, latency_ms: usage.latencyMs }, { onConflict: 'job_id' });
    if (reportError) throw new Error('report_store_failed');
    const status = report.humanReviewRecommended ? 'needs_human_review' : 'completed';
    await db.from('candidate_documents').update({ status }).eq('id', doc.id);
    await db.from('document_review_jobs').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', job.job_id);
    return NextResponse.json({ worked: true, status });
  } catch (error) {
    const rawCode = error instanceof Error ? error.message : 'processing_failed';
    const code = /^[a-z_]{1,80}$/.test(rawCode) ? rawCode : 'processing_failed';
    const retry = Number(job.attempt_count) < 3 && !['malware_detected','page_limit_exceeded','document_missing'].includes(code);
    await db.from('document_review_jobs').update({ status: retry ? 'retrying' : 'failed', last_error_code: code.slice(0, 80), ...(retry ? { locked_at: null } : { completed_at: new Date().toISOString() }) }).eq('id', job.job_id);
    await db.from('candidate_documents').update({ status: retry ? 'queued' : 'failed' }).eq('id', job.document_id);
    return NextResponse.json({ worked: true, status: retry ? 'retrying' : 'failed', code }, { status: 202 });
  }
}
