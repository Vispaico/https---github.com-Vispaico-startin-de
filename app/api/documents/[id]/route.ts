import { NextResponse } from 'next/server';
import { requireCandidate } from '@/lib/auth/admin';
import { deleteDocument, getDocument } from '@/lib/documents/store';
import { isSameOrigin } from '@/lib/security/request';

type Context = { params: Promise<{ id: string }> };
export async function GET(_request: Request, { params }: Context) {
  const user = await requireCandidate();
  if (!user) return NextResponse.json({ error: 'Sign in to view this document.' }, { status: 401 });
  const { id } = await params;
  const doc = await getDocument(user.id, id);
  if (!doc) return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
  return NextResponse.json({ document: { ...doc, storagePath: undefined, storageBucket: undefined, sha256Checksum: undefined } });
}

export async function DELETE(request: Request, { params }: Context) {
  const user = await requireCandidate();
  if (!user) return NextResponse.json({ error: 'Sign in to delete this document.' }, { status: 401 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  const { id } = await params;
  try {
    const deleted = await deleteDocument(user.id, id);
    return deleted ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'Document not found.' }, { status: 404 });
  } catch { return NextResponse.json({ error: 'Document could not be deleted.' }, { status: 503 }); }
}
