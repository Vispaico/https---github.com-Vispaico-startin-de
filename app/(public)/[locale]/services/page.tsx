import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { publicContent, publicLocales } from '@/lib/public-content';
import { publicMetadata } from '@/lib/public-seo';
import { pricingContent } from '@/lib/pricing-content';
import { services } from '@/lib/service-catalog';
import { Breadcrumbs, PricingCard, SectionHeading } from '../public-components';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params; const locale = (publicLocales.includes(raw as Locale) ? raw : 'vi') as Locale;
  return publicMetadata(locale, 'services', pricingContent[locale].serviceIntroTitle, pricingContent[locale].serviceIntro);
}

export default async function ServicesIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params; const locale = raw as Locale; const t = publicContent[locale]; const pricing = pricingContent[locale];
  return <div className="public-container content-page"><Breadcrumbs locale={locale} items={[{ title: t.footerNav.services }]} /><section className="simple-hero"><p className="public-eyebrow">SERVICES</p><h1>{pricing.serviceIntroTitle}</h1><p className="public-lead">{pricing.serviceIntro}</p></section><div className="pricing-notice"><span aria-hidden="true">i</span><p>{pricing.finePrint} {locale === 'vi' ? 'Không có chức năng mua hoặc thanh toán.' : locale === 'de' ? 'Kauf und Zahlung sind nicht verfügbar.' : 'Purchase and payment are not available.'}</p></div><SectionHeading title={locale === 'vi' ? 'Dịch vụ và trạng thái' : locale === 'de' ? 'Leistungen und Status' : 'Services and availability'} /><div className="pricing-grid">{services.map((service) => <PricingCard locale={locale} service={service} key={service.id} />)}</div></div>;
}
