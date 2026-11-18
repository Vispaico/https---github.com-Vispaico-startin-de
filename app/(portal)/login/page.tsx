import { getLocale } from '@/lib/i18n-server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import SignInForm from './sign-in-form';
import { copy } from '@/lib/i18n';
import { safePostAuthPath } from '@/lib/auth/redirect';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const query = await searchParams;
  const nextPath = safePostAuthPath(query.next);
  if (await getSessionUser()) redirect(nextPath);
  const locale = await getLocale(); const t = copy[locale];
  return <section className="login-shell"><div className="login-card"><p className="eyebrow">STARTIN-DE DOCUMENT CHECK CENTRE</p><h1>{t.signInTitle}</h1><p className="lead">{t.signInIntro}</p><SignInForm locale={locale} nextPath={nextPath} /><p className="login-foot">{t.needAccount} <Link href={`/signup?next=${encodeURIComponent(nextPath)}`}>{t.signUp}</Link></p><Link href="/privacy">{t.privacy}</Link></div></section>;
}
