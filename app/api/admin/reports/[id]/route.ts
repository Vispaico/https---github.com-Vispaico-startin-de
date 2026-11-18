import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/auth/admin';
import { getStaffReport } from '@/lib/documents/store';
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const staff = await requireStaff(); if (!staff) return NextResponse.json({ error: 'Not authorised.' }, { status: 403 });
  const { id } = await params; const report = await getStaffReport(staff.id, staff.role as 'advisor' | 'admin', id);
  if (!report) return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
  return NextResponse.json({ report });
}
