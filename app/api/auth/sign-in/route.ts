import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { config } from '@/lib/config';
import { createLocalSession, SESSION_COOKIE } from '@/lib/auth/session';
import { verifyLocalAccount } from '@/lib/auth/local-accounts';
import { isSameOrigin } from '@/lib/security/request';

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (config.localAuth) {
    const email = typeof body?.email === 'string' ? body.email : '';
    const password = typeof body?.password === 'string' ? body.password : '';
    const account = await verifyLocalAccount(email, password);
    const legacyTestAccount = email.trim().toLowerCase() === 'candidate@example.test' && password === process.env.LOCAL_DEV_SECRET;
    if (!account && !legacyTestAccount) return NextResponse.json({ error: 'Email or password was not accepted.' }, { status: 401 });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, createLocalSession({ id: account?.id || 'local-candidate-001', email: account?.email || 'candidate@example.test', role: 'candidate' }), { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 8 * 60 * 60 });
    return response;
  }
  if (!config.hasSupabase) return NextResponse.json({ error: 'Authentication is not configured. Set up Supabase or enable local development auth.' }, { status: 503 });
  const jar = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { getAll: () => jar.getAll(), setAll: (items) => items.forEach(({ name, value, options }) => jar.set(name, value, { ...options, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' })) } });
  const { error } = await supabase.auth.signInWithPassword({ email: String(body?.email || ''), password: String(body?.password || '') });
  if (error) return NextResponse.json({ error: 'Email or password was not accepted.' }, { status: 401 });
  return NextResponse.json({ ok: true });
}
