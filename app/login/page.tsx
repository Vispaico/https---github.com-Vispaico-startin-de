import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import SignInForm from './sign-in-form';
import { getLocale, copy } from '@/lib/i18n';

export default async function LoginPage() {
  if (await getSessionUser()) redirect('/');
  const locale = await getLocale(); const t = copy[locale];
  return <section className="login-shell"><div className="login-card"><p className="eyebrow">STARTIN-DE DOCUMENT CHECK CENTRE</p><h1>{t.signInTitle}</h1><p className="lead">{t.signInIntro}</p><SignInForm locale={locale} /><p className="login-foot">{t.needAccount}</p><Link href="/privacy">{t.privacy}</Link></div></section>;
}
