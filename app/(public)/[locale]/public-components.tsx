import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Locale } from '@/lib/i18n';
import { localizedHref, publicContent } from '@/lib/public-content';
import { formatVnd, type ServiceOffer } from '@/lib/service-catalog';
import { pricingContent } from '@/lib/pricing-content';
import { publicLabels } from '@/lib/public-labels';

export function SectionHeading({ eyebrow, title, intro, align = 'left' }: { eyebrow?: string; title: string; intro?: string; align?: 'left' | 'center' }) {
  return <div className={`section-heading align-${align}`}>{eyebrow && <p className="public-eyebrow">{eyebrow}</p>}<h2>{title}</h2>{intro && <p>{intro}</p>}</div>;
}

export function LinkButton({ href, children, tone = 'dark' }: { href: string; children: ReactNode; tone?: 'dark' | 'light' | 'line' }) {
  return <Link className={`public-button button-${tone}`} href={href}>{children}<span aria-hidden="true">↗</span></Link>;
}

export function PublicFooter({ locale }: { locale: Locale }) {
  const t = publicContent[locale]; const labels = t.footerNav;
  const columns = [
    [{ title: labels.ausbildung, href: 'ausbildung' }, { title: labels.study, href: 'study' }, { title: labels.work, href: 'work' }, { title: labels.opportunities, href: 'opportunities' }],
    [{ title: labels.tools, href: 'tools' }, { title: labels.guides, href: 'guides' }, { title: labels.services, href: 'services' }, { title: labels.pricing, href: 'pricing' }],
    [{ title: labels.about, href: 'about' }, { title: labels.partners, href: 'partners' }, { title: labels.contact, href: 'contact' }],
    [{ title: labels.privacy, href: 'privacy' }, { title: labels.terms, href: 'terms' }, { title: labels.refunds, href: 'refunds' }],
  ];
  return <footer className="public-footer">
    <div className="public-footer-main">
      <div className="footer-brand"><Link href={localizedHref(locale)} aria-label={t.homeLabel}><Image className="footer-brand-logo" src="/images/brand/startinde_logo.webp" alt="STARTIN-DE" width={132} height={38} /></Link><p>{publicLabels[locale].homeTagline}</p></div>
      {columns.map((column, index) => <nav className="footer-column" aria-label={`${t.footerGroups[index]}`} key={index}><h2>{t.footerGroups[index]}</h2>{column.map((item) => <Link key={item.href} href={localizedHref(locale, item.href)}>{item.title}</Link>)}</nav>)}
    </div>
    <div className="public-footer-bottom"><span>© {new Date().getFullYear()} STARTIN-DE</span><p></p><Link href="/login?next=%2Fapp">{t.signIn} ↗</Link></div>
  </footer>;
}

export function Breadcrumbs({ locale, items }: { locale: Locale; items: { title: string; href?: string }[] }) {
  return <nav aria-label={locale === 'vi' ? 'Đường dẫn' : locale === 'de' ? 'Brotkrumennavigation' : 'Breadcrumb'} className="breadcrumbs">
    <ol><li><Link href={localizedHref(locale)}>{locale === 'vi' ? 'Trang chủ' : locale === 'de' ? 'Startseite' : 'Home'}</Link></li>{items.map((item, index) => <li key={`${item.title}-${index}`}>{item.href ? <Link href={localizedHref(locale, item.href)}>{item.title}</Link> : <span aria-current="page">{item.title}</span>}</li>)}</ol>
  </nav>;
}

export function AvailabilityLabel({ children, tone = 'planned' }: { children: ReactNode; tone?: 'planned' | 'live' | 'review' }) {
  return <span className={`availability availability-${tone}`}><i aria-hidden="true" />{children}</span>;
}

export function ImagePlaceholder({ title, description }: { title: string; description: string }) {
  return <figure className="image-placeholder" role="img" aria-label={`${title}. ${description}`}>
    <span className="placeholder-mark" aria-hidden="true">＋</span>
    <figcaption><strong>{title}</strong><span>{description}</span></figcaption>
  </figure>;
}

export function SourceList({ locale, sources, checked }: { locale: Locale; sources: { title: string; href: string }[]; checked?: string }) {
  const t = publicContent[locale];
  return <section className="source-list"><h2>{t.shared.officialSources}</h2><ul>{sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer">{source.title}<span aria-hidden="true">↗</span></a></li>)}</ul>{checked && <p>{t.shared.updated}: {checked}</p>}</section>;
}

export function LegalPending({ locale, title, body }: { locale: Locale; title: string; body: string }) {
  const t = publicContent[locale];
  return <div className="public-legal-pending"><p className="public-eyebrow">STARTIN-DE</p><h1>{title}</h1><p className="public-lead">{body}</p><p className="legal-blocker"><span aria-hidden="true">!</span>{t.legal.blocker}</p><Link className="text-link" href={localizedHref(locale)}>{t.legal.back} <span aria-hidden="true">↗</span></Link></div>;
}

export function PricingCard({ locale, service }: { locale: Locale; service: ServiceOffer }) {
  const labels = pricingContent[locale]; const t = publicContent[locale];
  const statusTone = service.status === 'live' ? 'live' : service.status === 'legal_review_required' ? 'review' : 'planned';
  const price = service.priceVnd === null || !service.showIndicativePrice ? null : service.priceVnd === 0 ? (locale === 'vi' ? 'Miễn phí' : locale === 'de' ? 'Kostenlos' : 'Free') : formatVnd(locale, service.priceVnd);
  const action = service.id === 'basic-document-check'
    ? { label: t.shared.documentsCta, href: localizedHref(locale, 'tools/document-check') }
    : service.id === 'explorer'
      ? { label: t.shared.browseGuides, href: localizedHref(locale, 'guides') }
      : { label: t.shared.serviceDetail, href: localizedHref(locale, `services/${service.id}`) };
  return <article className={`pricing-card${service.status === 'live' ? ' pricing-card-live' : ''}`}>
    <div className="pricing-card-heading"><h3>{service.names[locale]}</h3><AvailabilityLabel tone={statusTone}>{labels.availability[service.status]}</AvailabilityLabel></div>
    <p>{service.summaries[locale]}</p>
    <div className="price-line">{price ? <><strong>{price}</strong>{service.priceVnd !== 0 && service.showIndicativePrice && <span>{t.shared.indicative}</span>}</> : <strong className="price-pending">{labels.availability[service.status]}</strong>}<span className="price-unit">{labels.unit[service.billingUnit]}</span></div>
    <div className="pricing-detail"><h4>{locale === 'vi' ? 'Bao gồm / dự kiến' : locale === 'de' ? 'Enthalten / vorgeschlagen' : 'Includes / proposed'}</h4><ul>{service.inclusions[locale].map((item) => <li key={item}>{item}</li>)}</ul></div>
    <div className="pricing-detail pricing-exclusions"><h4>{locale === 'vi' ? 'Không bao gồm' : locale === 'de' ? 'Nicht enthalten' : 'Not included'}</h4><ul>{service.exclusions[locale].map((item) => <li key={item}>{item}</li>)}</ul></div>
    <div className="pricing-meta"><span>{service.humanReviewed ? (locale === 'vi' ? 'Dự kiến có con người tham gia' : locale === 'de' ? 'Menschliche Prüfung vorgeschlagen' : 'Human input proposed') : (locale === 'vi' ? 'Tự động / tài nguyên công khai' : locale === 'de' ? 'Automatisiert / öffentliche Inhalte' : 'Automated / public resources')}</span><span>{t.shared.noCheckout}</span></div>
    <Link className="arrow-link" href={action.href}>{action.label}<span aria-hidden="true">↗</span></Link>
  </article>;
}
