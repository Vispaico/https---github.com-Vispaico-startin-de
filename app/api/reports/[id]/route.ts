import { NextResponse } from 'next/server';
import { requireCandidate } from '@/lib/auth/admin';
import { getCandidateReport } from '@/lib/documents/store';
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const user = await requireCandidate(); if (!user) return NextResponse.json({ error: 'Sign in to view this report.' }, { status: 401 });
  const { id } = await params; const report = await getCandidateReport(user.id, id);
  if (!report) return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
  return NextResponse.json({ report: { id: report.id, documentId: report.document_id, outcome: report.outcome, report: report.report_json, createdAt: report.created_at } });
}
