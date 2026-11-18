import { NextResponse } from 'next/server';
import { locales } from '@/lib/i18n';
import { isSameOrigin } from '@/lib/security/request';
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  const body = await request.json().catch(() => null); const locale = body?.locale;
  if (!locales.includes(locale)) return NextResponse.json({ error: 'Choose a supported language.' }, { status: 400 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set('startinde_lang', locale, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 365 });
  return response;
}
