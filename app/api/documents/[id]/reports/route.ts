import { NextResponse } from 'next/server';
import { requireCandidate } from '@/lib/auth/admin';
import { getDocument, getReports } from '@/lib/documents/store';
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const user = await requireCandidate(); if (!user) return NextResponse.json({ error: 'Sign in to view reports.' }, { status: 401 });
  const { id } = await params;
  if (!await getDocument(user.id, id)) return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
  return NextResponse.json({ reports: await getReports(user.id, id) });
}
