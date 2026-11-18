import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { config } from '@/lib/config';

export type SessionUser = { id: string; email: string; role: 'candidate' | 'advisor' | 'admin' };
const COOKIE = 'startinde_session';

function sign(payload: string) {
  const secret = process.env.LOCAL_DEV_SECRET;
  if (!secret || secret.length < 32) throw new Error('LOCAL_DEV_SECRET must contain at least 32 characters.');
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createLocalSession(user: SessionUser) {
  const body = Buffer.from(JSON.stringify({ ...user, exp: Date.now() + 8 * 60 * 60 * 1000 })).toString('base64url');
  return `${body}.${sign(body)}`;
}

function readLocalSession(value?: string): SessionUser | null {
  if (!value) return null;
  const [body, mac] = value.split('.');
  if (!body || !mac) return null;
  const expected = Buffer.from(sign(body));
  const supplied = Buffer.from(mac);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (typeof parsed.exp !== 'number' || parsed.exp < Date.now() || parsed.role !== 'candidate') return null;
    return { id: String(parsed.id), email: String(parsed.email), role: 'candidate' };
  } catch { return null; }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  if (config.localAuth) return readLocalSession(jar.get(COOKIE)?.value);
  if (!config.hasSupabase) return null;
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (values) => { try { values.forEach(({ name, value, options }) => jar.set(name, value, { ...options, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' })); } catch { /* Middleware refreshes cookies on the next request. */ } },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const role = user.app_metadata?.role;
  return { id: user.id, email: user.email || '', role: role === 'admin' || role === 'advisor' ? role : 'candidate' };
}

export { COOKIE as SESSION_COOKIE };
