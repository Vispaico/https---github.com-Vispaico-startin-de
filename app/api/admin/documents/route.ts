import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/auth/admin';
import { getAdminQueue } from '@/lib/documents/store';
export async function GET() {
  const staff = await requireStaff(); if (!staff) return NextResponse.json({ error: 'Not authorised.' }, { status: 403 });
  return NextResponse.json({ documents: await getAdminQueue(staff.id, staff.role as 'advisor' | 'admin') });
}
