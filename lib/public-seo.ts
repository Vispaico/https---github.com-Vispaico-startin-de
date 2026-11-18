import type { Metadata } from 'next';
import type { Locale } from './i18n';

export const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export function publicMetadata(locale: Locale, pathname: string, title: string, description: string, options: { noindex?: boolean } = {}): Metadata {
  const canonical = `/${locale}${pathname ? `/${pathname.replace(/^\/+/, '')}` : ''}`;
  const localizedPath = (language: Locale) => `/${language}${pathname ? `/${pathname.replace(/^\/+/, '')}` : ''}`;
  return {
    title,
    description,
    alternates: { canonical, languages: { vi: localizedPath('vi'), de: localizedPath('de'), en: localizedPath('en'), 'x-default': localizedPath('vi') } },
    openGraph: { type: 'website', title, description, url: canonical, siteName: 'STARTIN-DE', locale: locale === 'vi' ? 'vi_VN' : locale === 'de' ? 'de_DE' : 'en_US', images: [{ url: '/images/hero/people-on-their-way.webp', width: 1800, height: 1200, alt: 'Two people talking beside a city train platform' }] },
    twitter: { card: 'summary_large_image', title, description, images: ['/images/hero/people-on-their-way.webp'] },
    robots: options.noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
