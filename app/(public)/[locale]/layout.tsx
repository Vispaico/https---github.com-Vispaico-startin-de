import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import type { Locale } from '@/lib/i18n';
import { publicLocales } from '@/lib/public-content';
import { siteUrl } from '@/lib/public-seo';
import PublicHeader from './public-header';
import { PublicFooter } from './public-components';
import '../../styles.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'STARTIN-DE — Dein Weg nach Deutschland beginnt hier', template: '%s | STARTIN-DE' },
  description: 'Explore Ausbildung, study and career pathways in Germany with practical tools and source-led information.',
  icons: { icon: '/favicon.ico' },
  applicationName: 'STARTIN-DE',
};

export function generateStaticParams() { return publicLocales.map((locale) => ({ locale })); }

export default async function PublicLocaleLayout({ children, params }: Readonly<{ children: ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale: rawLocale } = await params;
  if (!publicLocales.includes(rawLocale as Locale)) notFound();
  const locale = rawLocale as Locale;
  const schema = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'STARTIN-DE', url: siteUrl, inLanguage: locale };
  return <html lang={locale}><body className="public-body">
    <PublicHeader locale={locale} />
    <main id="main-content">{children}</main>
    <PublicFooter locale={locale} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
  </body></html>;
}
