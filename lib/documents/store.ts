import 'server-only';
import { mkdir, readFile, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { config } from '@/lib/config';
import type { CandidateDocument, DocumentType } from './types';
import { UploadError } from './validation';

const privateRoot = path.join(process.cwd(), '.private-data');
const indexPath = path.join(privateRoot, 'document-index.json');

export type AdminQueueRow = { id: string; candidate_id: string; document_type: string; original_filename: string; status: string; created_at: string; document_reports: Array<{ id: string; outcome: string; created_at: string }> };
export type AdminUsageRow = { provider: string | null; model: string | null; input_tokens: number | null; output_tokens: number | null; estimated_cost_usd: number | string | null; created_at: string };
export type AdvisorAccount = { id: string; email: string };

function supabaseAdmin() {
  if (!config.hasSupabase) throw new Error('Supabase is not configured.');
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { autoRefreshToken: false, persistSession: false } });
}

async function readIndex(): Promise<CandidateDocument[]> {
  await mkdir(privateRoot, { recursive: true, mode: 0o700 });
  try { return JSON.parse(await readFile(indexPath, 'utf8')); } catch { return []; }
}

export async function saveUpload(input: { candidateId: string; type: DocumentType; name: string; extension: string; mimeType: string; bytes: Buffer; sha256: string; reportLanguage: string }) {
  const id = randomUUID();
  const storagePath = `${input.candidateId}/${id}.${input.extension}`;
  if (config.hasSupabase) {
    const { data: reservation, error: reservationError } = await supabaseAdmin().rpc('reserve_document_upload', { p_candidate_id: input.candidateId, p_checksum: input.sha256, p_daily_limit: config.dailyUploadLimit, p_monthly_limit: config.monthlyUploadLimit });
    if (reservationError) throw new Error('Could not reserve the upload quota.');
    if (reservation === 'duplicate') throw new UploadError('This exact file is already in your document list.', 409);
    if (reservation === 'daily_limit') throw new UploadError('You have reached today’s document upload limit. Please try again tomorrow.', 429);
    if (reservation === 'monthly_limit') throw new UploadError('You have reached this month’s document upload limit.', 429);
    if (reservation !== 'reserved') throw new Error('Could not reserve the upload quota.');
    const { error } = await supabaseAdmin().storage.from(config.bucket).upload(storagePath, input.bytes, { contentType: input.mimeType, upsert: false });
    if (error) throw new Error('Private storage upload failed.');
    const { error: insertError } = await supabaseAdmin().from('candidate_documents').insert({
      id, candidate_id: input.candidateId, document_type: input.type, original_filename: input.name,
      storage_bucket: config.bucket, storage_path: storagePath, mime_type: input.mimeType,
      file_size_bytes: input.bytes.length, sha256_checksum: input.sha256, status: 'queued',
    });
    if (insertError) { await supabaseAdmin().storage.from(config.bucket).remove([storagePath]); throw new Error('Could not create document record.'); }
    const { error: jobError } = await supabaseAdmin().from('document_review_jobs').insert({ document_id: id, candidate_id: input.candidateId, job_type: 'review', status: 'queued', report_language: input.reportLanguage, idempotency_key: `upload:${id}` });
    if (jobError) { await supabaseAdmin().from('candidate_documents').delete().eq('id', id); await supabaseAdmin().storage.from(config.bucket).remove([storagePath]); throw new Error('Could not queue document processing.'); }
    return { id };
  }
  if (!config.localAuth) throw new Error('Configure Supabase to accept uploads.');
  const current = await readIndex();
  if (current.some((item) => item.candidateId === input.candidateId && item.sha256Checksum === input.sha256)) throw new UploadError('This exact file is already in your document list.', 409);
  const now = Date.now(); const owned = current.filter((item) => item.candidateId === input.candidateId);
  if (owned.filter((item) => now - Date.parse(item.createdAt) < 24 * 60 * 60 * 1000).length >= config.dailyUploadLimit) throw new UploadError('You have reached today’s document upload limit.', 429);
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
  if (owned.filter((item) => Date.parse(item.createdAt) >= monthStart.getTime()).length >= config.monthlyUploadLimit) throw new UploadError('You have reached this month’s document upload limit.', 429);
  const objectPath = path.join(privateRoot, 'objects', ...storagePath.split('/'));
  await mkdir(path.dirname(objectPath), { recursive: true, mode: 0o700 });
  await writeFile(objectPath, input.bytes, { flag: 'wx', mode: 0o600 });
  const record: CandidateDocument = {
    id, candidateId: input.candidateId, documentType: input.type, originalFilename: input.name,
    storageBucket: 'local-private', storagePath, mimeType: input.mimeType, fileSizeBytes: input.bytes.length,
    sha256Checksum: input.sha256, status: 'queued', createdAt: new Date().toISOString(), deletedAt: null,
  };
  const records = await readIndex(); records.push(record);
  await writeFile(indexPath, JSON.stringify(records, null, 2), { mode: 0o600 });
  return { id };
}

export async function listDocuments(candidateId: string): Promise<CandidateDocument[]> {
  if (config.hasSupabase) {
    const { data, error } = await supabaseAdmin().from('candidate_documents').select('*').eq('candidate_id', candidateId).is('deleted_at', null).order('created_at', { ascending: false });
    if (error) throw new Error('Could not load documents.');
    return (data || []).map((row) => ({ id: row.id, candidateId: row.candidate_id, documentType: row.document_type, originalFilename: row.original_filename, storageBucket: row.storage_bucket, storagePath: row.storage_path, mimeType: row.mime_type, fileSizeBytes: row.file_size_bytes, sha256Checksum: row.sha256_checksum, status: row.status, createdAt: row.created_at, deletedAt: row.deleted_at }));
  }
  if (!config.localAuth) return [];
  return (await readIndex()).filter((item) => item.candidateId === candidateId && !item.deletedAt).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getDocument(candidateId: string, id: string) {
  const docs = await listDocuments(candidateId);
  return docs.find((item) => item.id === id) || null;
}

export async function deleteDocument(candidateId: string, id: string) {
  const doc = await getDocument(candidateId, id);
  if (!doc) return false;
  if (config.hasSupabase) {
    const db = supabaseAdmin();
    const { error: auditError } = await db.from('document_review_events').insert({ candidate_id: candidateId, actor_id: candidateId, document_id: id, event_type: 'candidate_document_deleted', metadata: {} });
    if (auditError) throw new Error('Could not audit document deletion.');
    const { error: storageError } = await supabaseAdmin().storage.from(doc.storageBucket).remove([doc.storagePath]);
    if (storageError) throw new Error('Could not delete the private file.');
    await db.from('document_review_jobs').update({ status: 'cancelled', completed_at: new Date().toISOString() }).eq('document_id', id).eq('candidate_id', candidateId);
    const { error: reportError } = await db.from('document_reports').delete().eq('document_id', id).eq('candidate_id', candidateId);
    if (reportError) throw new Error('Could not delete document reports.');
    const { error: extractionError } = await db.from('document_extractions').delete().eq('document_id', id);
    if (extractionError) throw new Error('Could not delete extracted text.');
    const { error: reviewError } = await db.from('advisor_reviews').delete().eq('document_id', id);
    if (reviewError) throw new Error('Could not delete advisor notes.');
    const { error } = await db.from('candidate_documents').update({ status: 'deleted', deleted_at: new Date().toISOString(), original_filename: 'deleted-document', storage_path: `deleted/${id}`, sha256_checksum: '0'.repeat(64), page_count: null }).eq('id', id).eq('candidate_id', candidateId);
    if (error) throw new Error('Could not delete document metadata.');
    return true;
  }
  const filePath = path.join(privateRoot, 'objects', ...doc.storagePath.split('/'));
  await unlink(filePath).catch(() => undefined);
  const all = await readIndex();
  await writeFile(indexPath, JSON.stringify(all.filter((item) => item.id !== id), null, 2), { mode: 0o600 });
  return true;
}

export async function getPrivateBytes(doc: CandidateDocument) {
  if (config.hasSupabase) {
    const { data, error } = await supabaseAdmin().storage.from(doc.storageBucket).download(doc.storagePath);
    if (error || !data) throw new Error('Could not retrieve private document.');
    return Buffer.from(await data.arrayBuffer());
  }
  const filePath = path.join(privateRoot, 'objects', ...doc.storagePath.split('/'));
  return readFile(filePath);
}

export async function getReports(candidateId: string, documentId?: string) {
  if (config.hasSupabase) {
    let query = supabaseAdmin().from('document_reports').select('id,document_id,schema_version,prompt_version,outcome,indicative_score,report_json,created_at').eq('candidate_id', candidateId).order('created_at', { ascending: false });
    if (documentId) query = query.eq('document_id', documentId);
    const { data, error } = await query;
    if (error) throw new Error('Could not load reports.');
    return data || [];
  }
  return [];
}

export async function getCandidateReport(candidateId: string, reportId: string) {
  const report = (await getReports(candidateId)).find((item) => item.id === reportId) || null;
  if (!report || !await getDocument(candidateId, report.document_id)) return null;
  return report;
}

export async function getAdminQueue(staffId: string, role: 'advisor' | 'admin'): Promise<AdminQueueRow[]> {
  if (!config.hasSupabase) return [];
  const db = supabaseAdmin();
  let ids: string[] | undefined;
  if (role === 'advisor') {
    const { data: assignments, error: assignmentError } = await db.from('advisor_reviews').select('document_id').eq('advisor_id', staffId).in('status', ['assigned','in_review']);
    if (assignmentError) throw new Error('Could not load assignments.');
    const assignedIds = (assignments || []).map((row) => row.document_id) as string[];
    if (!assignedIds.length) return [];
    ids = assignedIds;
  }
  let query = db.from('candidate_documents').select('id,candidate_id,document_type,original_filename,status,created_at,document_reports(id,outcome,created_at)').is('deleted_at', null).in('status', ['needs_human_review','failed','queued']).order('created_at', { ascending: true }).limit(100);
  if (ids) query = query.in('id', ids);
  const { data, error } = await query;
  if (error) throw new Error('Could not load the review queue.');
  return (data || []) as AdminQueueRow[];
}

export async function getAdminUsage(): Promise<AdminUsageRow[]> {
  if (!config.hasSupabase) return [];
  const { data, error } = await supabaseAdmin().from('document_reports').select('provider,model,input_tokens,output_tokens,estimated_cost_usd,created_at').order('created_at', { ascending: false }).limit(500);
  if (error) throw new Error('Could not load usage data.');
  return (data || []) as AdminUsageRow[];
}

export async function getAdvisors(): Promise<AdvisorAccount[]> {
  if (!config.hasSupabase) return [];
  const { data, error } = await supabaseAdmin().auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw new Error('Could not load advisor accounts.');
  return data.users.filter((user) => user.app_metadata?.role === 'advisor').map((user) => ({ id: user.id, email: user.email || '' }));
}

export async function getCandidateFeedback(candidateId: string, documentId: string) {
  if (!await getDocument(candidateId, documentId) || !config.hasSupabase) return null;
  const { data } = await supabaseAdmin().from('advisor_reviews').select('candidate_visible_feedback,created_at').eq('document_id', documentId).eq('status', 'feedback_ready').not('candidate_visible_feedback', 'is', null).order('created_at', { ascending: false }).limit(1).maybeSingle();
  return data?.candidate_visible_feedback || null;
}

export async function getAdminReport(reportId: string) {
  if (!config.hasSupabase) return null;
  const { data, error } = await supabaseAdmin().from('document_reports').select('id,document_id,candidate_id,outcome,report_json,provider,model,input_tokens,output_tokens,estimated_cost_usd,created_at').eq('id', reportId).maybeSingle();
  if (error) throw new Error('Could not load staff report.');
  return data;
}

export async function getStaffReport(staffId: string, role: 'advisor' | 'admin', reportId: string) {
  const report = await getAdminReport(reportId);
  if (!report) return null;
  const db = supabaseAdmin();
  if (role === 'advisor') {
    const { data: assignment } = await db.from('advisor_reviews').select('id').eq('document_id', report.document_id).eq('advisor_id', staffId).in('status', ['assigned','in_review','approved','feedback_ready']).maybeSingle();
    if (!assignment) return null;
  }
  const { error: auditError } = await db.from('document_review_events').insert({ candidate_id: report.candidate_id, actor_id: staffId, document_id: report.document_id, report_id: report.id, event_type: 'staff_report_access', metadata: { role } });
  if (auditError) throw new Error('Could not audit report access.');
  return report;
}
