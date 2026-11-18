import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireStaff } from '@/lib/auth/admin';
import { config } from '@/lib/config';
import { getPrivateBytes } from '@/lib/documents/store';
import type { CandidateDocument } from '@/lib/documents/types';
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const staff = await requireStaff(); if (!staff) return NextResponse.json({ error: 'Not authorised.' }, { status: 403 });
  if (!config.hasSupabase) return NextResponse.json({ error: 'Private storage is not configured.' }, { status: 503 });
  const { id } = await params; const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: row } = await db.from('candidate_documents').select('*').eq('id', id).is('deleted_at', null).maybeSingle();
  if (!row) return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
  if (staff.role === 'advisor') {
    const { data: assignment } = await db.from('advisor_reviews').select('id').eq('document_id', id).eq('advisor_id', staff.id).in('status', ['assigned','in_review','approved','feedback_ready']).maybeSingle();
    if (!assignment) return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
  }
  // Audit the sensitive access before returning file bytes; the event excludes
  // original filename and document content to keep the log low risk.
  const { error: auditError } = await db.from('document_review_events').insert({ candidate_id: row.candidate_id, actor_id: staff.id, document_id: id, event_type: 'staff_document_access', metadata: { role: staff.role } });
  if (auditError) return NextResponse.json({ error: 'Access could not be audited.' }, { status: 503 });
  const doc: CandidateDocument = { id: row.id, candidateId: row.candidate_id, documentType: row.document_type, originalFilename: row.original_filename, storageBucket: row.storage_bucket, storagePath: row.storage_path, mimeType: row.mime_type, fileSizeBytes: row.file_size_bytes, sha256Checksum: row.sha256_checksum, status: row.status, createdAt: row.created_at, deletedAt: row.deleted_at };
  try {
    const bytes = await getPrivateBytes(doc);
    return new NextResponse(new Uint8Array(bytes), { headers: { 'Content-Type': 'application/octet-stream', 'Content-Disposition': `attachment; filename="document-${doc.id}"`, 'Cache-Control': 'private, no-store, max-age=0', 'X-Robots-Tag': 'noindex, nofollow' } });
  } catch { return NextResponse.json({ error: 'Private document is unavailable.' }, { status: 503 }); }
}
