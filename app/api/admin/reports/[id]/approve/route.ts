import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireStaff } from '@/lib/auth/admin';
import { config } from '@/lib/config';
import { isSameOrigin } from '@/lib/security/request';
type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Context) {
  const staff = await requireStaff(); if (!staff) return NextResponse.json({ error: 'Not authorised.' }, { status: 403 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  if (Number(request.headers.get('content-length') || 0) > 8192) return NextResponse.json({ error: 'Request is too large.' }, { status: 413 });
  if (!config.hasSupabase) return NextResponse.json({ error: 'Review workflow is not configured.' }, { status: 503 });
  const { id } = await params; const body = await request.json().catch(() => null);
  const feedback = typeof body?.candidateVisibleFeedback === 'string' ? body.candidateVisibleFeedback.trim().slice(0, 4000) : '';
  if (!feedback) return NextResponse.json({ error: 'Add candidate-visible feedback before approval.' }, { status: 400 });
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: report } = await db.from('document_reports').select('id,document_id,candidate_id').eq('id', id).maybeSingle();
  if (!report) return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
  if (staff.role === 'advisor') {
    const { data: assignment } = await db.from('advisor_reviews').select('id').eq('document_id', report.document_id).eq('advisor_id', staff.id).in('status', ['assigned','in_review']).maybeSingle();
    if (!assignment) return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
  }
  const { error } = await db.from('advisor_reviews').upsert({ document_id: report.document_id, report_id: report.id, advisor_id: staff.id, status: 'feedback_ready', candidate_visible_feedback: feedback, updated_at: new Date().toISOString() }, { onConflict: 'document_id,advisor_id' });
  if (error) return NextResponse.json({ error: 'Review feedback could not be saved.' }, { status: 503 });
  await db.from('candidate_human_review_requests').update({ status: 'completed', updated_at: new Date().toISOString() }).eq('document_id', report.document_id);
  await db.from('candidate_documents').update({ status: 'completed' }).eq('id', report.document_id).eq('candidate_id', report.candidate_id);
  await db.from('document_review_events').insert({ candidate_id: report.candidate_id, actor_id: staff.id, document_id: report.document_id, report_id: report.id, event_type: 'advisor_feedback_approved', metadata: {} });
  return NextResponse.json({ ok: true });
}
