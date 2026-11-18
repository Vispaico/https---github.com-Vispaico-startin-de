import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { publicContent, publicLocales, localizedHref } from '@/lib/public-content';
import { publicMetadata } from '@/lib/public-seo';
import { pricingContent } from '@/lib/pricing-content';
import { formatVnd, getService, services } from '@/lib/service-catalog';
import { AvailabilityLabel, Breadcrumbs, LinkButton } from '../../public-components';

export function generateStaticParams() { return publicLocales.flatMap((locale) => services.map((service) => ({ locale, slug: service.id }))); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug } = await params; if (!publicLocales.includes(raw as Locale)) return {};
  const locale = raw as Locale; const service = getService(slug); if (!service) return {};
  return publicMetadata(locale, `services/${slug}`, service.names[locale], service.summaries[locale]);
}

export default async function ServiceDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params; if (!publicLocales.includes(raw as Locale)) notFound();
  const locale = raw as Locale; const service = getService(slug); if (!service) notFound();
  const t = publicContent[locale]; const pricing = pricingContent[locale];
  const statusTone = service.status === 'live' ? 'live' : service.status === 'legal_review_required' ? 'review' : 'planned';
  const amount = service.priceVnd === null || !service.showIndicativePrice ? null : service.priceVnd === 0 ? (locale === 'vi' ? 'Miễn phí' : locale === 'de' ? 'Kostenlos' : 'Free') : formatVnd(locale, service.priceVnd);
  const disclaimer = locale === 'vi' ? 'Mức giá được đánh dấu dự kiến không phải báo giá hoặc lời mời mua. Điều kiện, thuế, hóa đơn, hủy và hoàn tiền chưa được xác nhận.' : locale === 'de' ? 'Gekennzeichnete Preisvorschläge sind weder verbindliche Angebote noch eine Kaufaufforderung. Bedingungen, Steuern, Rechnungen, Stornierung und Erstattung sind noch offen.' : 'Indicative prices are not a quote or offer to purchase. Terms, taxes, invoices, cancellations and refunds are not confirmed.';
  return <div className="public-container content-page"><Breadcrumbs locale={locale} items={[{ title: t.footerNav.services, href: 'services' }, { title: service.names[locale] }]} /><section className="service-detail-hero"><p className="public-eyebrow">SERVICE DETAILS</p><AvailabilityLabel tone={statusTone}>{pricing.availability[service.status]}</AvailabilityLabel><h1>{service.names[locale]}</h1><p className="public-lead">{service.summaries[locale]}</p><div className="service-price-large">{amount ? <strong>{amount}</strong> : <strong>{pricing.availability[service.status]}</strong>}<span>{pricing.unit[service.billingUnit]}</span></div></section>
    <div className="service-detail-grid"><section className="service-detail-card"><h2>{locale === 'vi' ? 'Phạm vi hiện tại' : locale === 'de' ? 'Aktueller Leistungsumfang' : 'Current scope'}</h2><h3>{locale === 'vi' ? 'Bao gồm / dự kiến' : locale === 'de' ? 'Enthalten / vorgeschlagen' : 'Includes / proposed'}</h3><ul>{service.inclusions[locale].map((item) => <li key={item}>{item}</li>)}</ul><h3>{locale === 'vi' ? 'Không bao gồm' : locale === 'de' ? 'Nicht enthalten' : 'Not included'}</h3><ul>{service.exclusions[locale].map((item) => <li key={item}>{item}</li>)}</ul></section><aside className="service-detail-card service-detail-aside"><h2>{locale === 'vi' ? 'Cách cung cấp' : locale === 'de' ? 'Leistungsform' : 'Delivery'}</h2><dl><dt>{locale === 'vi' ? 'Xem xét bởi con người' : locale === 'de' ? 'Menschliche Prüfung' : 'Human reviewed'}</dt><dd>{service.humanReviewed ? (locale === 'vi' ? 'Đang đề xuất, chưa xác nhận' : locale === 'de' ? 'Vorgeschlagen, noch nicht bestätigt' : 'Proposed, not confirmed') : (locale === 'vi' ? 'Không' : locale === 'de' ? 'Nein' : 'No')}</dd><dt>{locale === 'vi' ? 'Thời gian' : locale === 'de' ? 'Bearbeitungszeit' : 'Turnaround'}</dt><dd>{locale === 'vi' ? 'Chưa công bố' : locale === 'de' ? 'Noch nicht veröffentlicht' : 'Not published'}</dd><dt>{locale === 'vi' ? 'Số lần chỉnh sửa' : locale === 'de' ? 'Überarbeitungen' : 'Revisions'}</dt><dd>{locale === 'vi' ? 'Chưa công bố' : locale === 'de' ? 'Noch nicht veröffentlicht' : 'Not published'}</dd></dl><p className="content-caveat">{disclaimer}</p><p className="service-payment-disabled">{t.shared.noCheckout}</p></aside></div>
    {service.id === 'basic-document-check' && <div className="service-document-cta"><p>{locale === 'vi' ? 'Công cụ hiện có trong khu vực tài khoản.' : locale === 'de' ? 'Das bestehende Werkzeug findest du in deinem Konto.' : 'The existing tool is available in your account area.'}</p><LinkButton href={localizedHref(locale, 'tools/document-check')}>{t.shared.documentsCta}</LinkButton></div>}
    <Link className="arrow-link" href={localizedHref(locale, 'pricing')}>{locale === 'vi' ? 'Xem toàn bộ bảng giá' : locale === 'de' ? 'Alle Preise ansehen' : 'View full pricing'}<span aria-hidden="true">↗</span></Link>
  </div>;
}
