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
  if (staff.role !== 'admin' || !config.hasSupabase) return NextResponse.json({ error: 'Only an administrator can assign reviews.' }, { status: 403 });
  const { id } = await params; const body = await request.json().catch(() => null); const advisorId = String(body?.advisorId || '');
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: advisor } = await db.auth.admin.getUserById(advisorId);
  if (!advisor.user || !['advisor','admin'].includes(advisor.user.app_metadata?.role)) return NextResponse.json({ error: 'Choose an authorised advisor.' }, { status: 400 });
  const { data: doc } = await db.from('candidate_documents').select('id,candidate_id').eq('id', id).is('deleted_at', null).maybeSingle();
  if (!doc) return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
  const { error } = await db.from('advisor_reviews').upsert({ document_id: id, advisor_id: advisorId, status: 'assigned' }, { onConflict: 'document_id,advisor_id' });
  if (error) return NextResponse.json({ error: 'Assignment could not be saved.' }, { status: 503 });
  await db.from('candidate_human_review_requests').update({ status: 'assigned', updated_at: new Date().toISOString() }).eq('document_id', id);
  await db.from('document_review_events').insert({ candidate_id: doc.candidate_id, actor_id: staff.id, document_id: id, event_type: 'advisor_assigned', metadata: { advisorId } });
  return NextResponse.json({ ok: true });
}
