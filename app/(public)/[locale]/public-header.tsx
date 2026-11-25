'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useId, useState } from 'react';
import type { Locale } from '@/lib/i18n';
import { publicContent } from '@/lib/public-content';
import { publicLabels } from '@/lib/public-labels';

const options: { value: Locale; label: string }[] = [
  { value: 'vi', label: 'VI' }, { value: 'de', label: 'DE' }, { value: 'en', label: 'EN' },
];

export default function PublicHeader({ locale }: { locale: Locale }) {
  const t = publicContent[locale]; const labels = publicLabels[locale];
  const pathname = usePathname(); const router = useRouter();
  const [open, setOpen] = useState(false); const menuId = useId();

  async function changeLanguage(next: Locale) {
    await fetch('/api/language', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale: next }) });
    const destination = pathname.replace(/^\/(vi|de|en)(?=\/|$)/, `/${next}`);
    router.push(destination); router.refresh(); setOpen(false);
  }

  return <>
    <a className="public-skip" href="#main-content">{t.skip}</a>
    <header className="public-header">
      <div className="public-header-inner">
        <Link className="public-brand" href={`/${locale}`} aria-label={t.homeLabel} onClick={() => setOpen(false)}>
          <Image src="/images/brand/startinde_logo.webp" alt="STARTIN-DE" width={180} height={52} priority />
        </Link>
        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls={menuId} aria-label={open ? t.closeMenu : t.menu} onClick={() => setOpen(!open)}>
          <span></span><span></span><span></span>
        </button>
        <div id={menuId} className={`public-menu${open ? ' is-open' : ''}`}>
          <nav className="public-nav" aria-label={locale === 'vi' ? 'Điều hướng chính' : locale === 'de' ? 'Hauptnavigation' : 'Main navigation'}>
            {t.nav.map((item, index) => <Link key={item.href} className={index === 0 ? 'nav-feature' : ''} href={`/${locale}${item.href}`} onClick={() => setOpen(false)}>{item.label}</Link>)}
          </nav>
          <div className="public-header-actions">
            <label className="public-language"><span className="sr-only">{labels.language}</span><select aria-label={labels.language} value={locale} onChange={(event) => changeLanguage(event.target.value as Locale)}>{options.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
            <Link className="public-sign-in" href="/login?next=%2Fapp" onClick={() => setOpen(false)}>{t.signIn}</Link>
            <Link className="public-cta" href={`/${locale}/ausbildung`} onClick={() => setOpen(false)}>{t.explore}<span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </div>
    </header>
  </>;
}
