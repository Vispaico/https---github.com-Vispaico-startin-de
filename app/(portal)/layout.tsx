import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getLocale } from '@/lib/i18n-server';
import { copy } from '@/lib/i18n';
import LanguageSwitcher from '../language-switcher';
import SignOutButton from '../sign-out-button';
import '../styles.css';

export const metadata: Metadata = {
  title: 'Document Check Centre | STARTIN-DE',
  description: 'Prepare application documents with clear, practical feedback.',
  icons: { icon: '/favicon.ico' },
};

export default async function PortalLayout({ children }: Readonly<{ children: ReactNode }>) {
  const locale = await getLocale(); const t = copy[locale];
  return <html lang={locale}><body>
    <header className="portal-topbar"><Link className="brand" href="/vi" aria-label="STARTIN-DE public website"><Image src="/startinde_logo.webp" alt="STARTIN-DE" width={152} height={42} priority /></Link>
      <nav aria-label="Workspace navigation"><Link href="/app">{t.documents}</Link><Link href="/vi">STARTIN-DE</Link><Link href="/privacy">{t.privacy}</Link><LanguageSwitcher locale={locale} /><SignOutButton label={t.signOut} /></nav>
    </header>
    <main>{children}</main>
    <footer className="portal-footer"><span>STARTIN-DE · {t.title}</span><span>{t.scopeText}</span></footer>
  </body></html>;
}
