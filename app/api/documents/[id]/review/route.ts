import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireCandidate } from '@/lib/auth/admin';
import { config } from '@/lib/config';
import { getDocument } from '@/lib/documents/store';
import { isSameOrigin } from '@/lib/security/request';
type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Context) {
  const user = await requireCandidate(); if (!user) return NextResponse.json({ error: 'Sign in to request a review.' }, { status: 401 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  if (!config.hasSupabase) return NextResponse.json({ error: 'Human review requests are not configured in local mode.' }, { status: 503 });
  const { id } = await params; const doc = await getDocument(user.id, id);
  if (!doc) return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: existing } = await db.from('candidate_human_review_requests').select('id').eq('document_id', id).maybeSingle();
  if (existing) return NextResponse.json({ ok: true, alreadyRequested: true });
  const { error: requestError } = await db.from('candidate_human_review_requests').insert({ document_id: id, candidate_id: user.id });
  if (requestError) return NextResponse.json({ error: 'Your request could not be saved.' }, { status: 503 });
  const { error: auditError } = await db.from('document_review_events').insert({ candidate_id: user.id, actor_id: user.id, document_id: id, event_type: 'candidate_human_review_requested', metadata: {} });
  if (auditError) return NextResponse.json({ error: 'Your request could not be audited.' }, { status: 503 });
  await db.from('candidate_documents').update({ status: 'needs_human_review' }).eq('id', id).eq('candidate_id', user.id);
  return NextResponse.json({ ok: true }, { status: 201 });
}
