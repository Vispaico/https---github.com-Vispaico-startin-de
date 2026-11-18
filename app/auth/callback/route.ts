import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { config } from '@/lib/config';
import { safePostAuthPath } from '@/lib/auth/redirect';

export async function GET(request: NextRequest) {
  const nextPath = safePostAuthPath(request.nextUrl.searchParams.get('next'));
  const code = request.nextUrl.searchParams.get('code');
  if (!config.hasSupabase || !code) return NextResponse.redirect(new URL('/login?next=%2Fapp', request.url));

  const jar = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (items) => items.forEach(({ name, value, options }) => jar.set(name, value, { ...options, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' })),
    },
  });
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL('/login?next=%2Fapp&error=confirmation', request.url));
  return NextResponse.redirect(new URL(nextPath, request.url));
}
