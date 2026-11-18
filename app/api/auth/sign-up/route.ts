import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { config } from '@/lib/config';
import { createLocalSession, SESSION_COOKIE } from '@/lib/auth/session';
import { createLocalAccount, validRegistration } from '@/lib/auth/local-accounts';
import { isSameOrigin } from '@/lib/security/request';

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  if (Number(request.headers.get('content-length') || 0) > 4096) return NextResponse.json({ error: 'Registration details are invalid.' }, { status: 413 });
  let rawBody = '';
  const reader = request.body?.getReader();
  if (reader) {
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      rawBody += decoder.decode(value, { stream: !done });
      if (done) break;
      if (Buffer.byteLength(rawBody, 'utf8') > 4096) {
        await reader.cancel();
        return NextResponse.json({ error: 'Registration details are invalid.' }, { status: 413 });
      }
    }
  }
  const body = (() => { try { return JSON.parse(rawBody); } catch { return null; } })();
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!validRegistration(email, password)) return NextResponse.json({ error: 'Enter a valid email and a password with at least 12 characters.' }, { status: 400 });

  if (config.localAuth) {
    const account = await createLocalAccount(email, password);
    if (!account) return NextResponse.json({ error: 'An account could not be created with this email address.' }, { status: 409 });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, createLocalSession({ ...account, role: 'candidate' }), { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 8 * 60 * 60 });
    return response;
  }

  if (!config.hasSupabase) return NextResponse.json({ error: 'Sign-up is not configured. Set up Supabase or enable local development auth.' }, { status: 503 });
  const jar = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (items) => items.forEach(({ name, value, options }) => jar.set(name, value, { ...options, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' })),
    },
  });
  const confirmationUrl = new URL('/auth/callback?next=%2Fapp', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').toString();
  const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: confirmationUrl } });
  if (error) return NextResponse.json({ error: 'An account could not be created. Check your details or try signing in.' }, { status: 400 });
  return NextResponse.json({ ok: true, confirmationRequired: !data.session });
}
