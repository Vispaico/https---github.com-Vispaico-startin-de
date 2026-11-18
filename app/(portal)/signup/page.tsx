import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { getLocale } from '@/lib/i18n-server';
import { copy } from '@/lib/i18n';
import SignUpForm from './signup-form';
import { safePostAuthPath } from '@/lib/auth/redirect';

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const query = await searchParams;
  const nextPath = safePostAuthPath(query.next);
  if (await getSessionUser()) redirect(nextPath);
  const locale = await getLocale(); const t = copy[locale];
  return <section className="login-shell"><div className="login-card">
    <p className="eyebrow">STARTIN-DE DOCUMENT CHECK CENTRE</p>
    <h1>{t.signUpTitle}</h1>
    <p className="lead">{t.signUpIntro}</p>
    <SignUpForm locale={locale} nextPath={nextPath} />
    <p className="login-foot">{t.haveAccount} <Link href={`/login?next=${encodeURIComponent(nextPath)}`}>{t.signIn}</Link></p>
    <Link href="/privacy">{t.privacy}</Link>
  </div></section>;
}
