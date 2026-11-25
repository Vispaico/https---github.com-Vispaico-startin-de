import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { guides } from '@/lib/guides';
import { publicContent, publicLocales, localizedHref } from '@/lib/public-content';
import { publicMetadata } from '@/lib/public-seo';
import { publicLabels } from '@/lib/public-labels';
import { AvailabilityLabel, LinkButton, SectionHeading } from './public-components';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params; const locale = (publicLocales.includes(raw as Locale) ? raw : 'vi') as Locale;
  const t = publicContent[locale].home;
  return publicMetadata(locale, '', t.title, t.body);
}

export default async function PublicHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params; const locale = raw as Locale;
  const t = publicContent[locale]; const h = t.home; const labels = publicLabels[locale];
  const featured = [guides[0], guides[4], guides[5]];
  return <>
    <section className="home-hero public-container">
      <div className="home-hero-copy"><p className="public-eyebrow"><span className="eyebrow-mark" />{h.eyebrow}</p><h1>{h.title}</h1><p className="public-lead">{h.body}</p>
        <div className="hero-actions"><LinkButton href={localizedHref(locale, 'ausbildung')}>{h.primary}</LinkButton><LinkButton href={localizedHref(locale, 'tools/document-check')} tone="line">{h.secondary}</LinkButton></div>
        <p className="hero-reassurance"><span aria-hidden="true">✓</span>{h.reassure}</p>
      </div>
      <div className="home-hero-art"><div className="hero-image-frame"><Image src="/images/hero/people-in-front-of-barrels.webp" alt={locale === 'vi' ? 'Hai người mặc áo bóng đá ngồi trước những thùng bia kim loại' : locale === 'de' ? 'Zwei Personen in Fußballtrikots sitzen vor gestapelten Bierfässern' : 'Two people wearing football shirts sit in front of stacked beer kegs'} fill priority sizes="(max-width: 760px) 100vw, 48vw" /></div></div>
    </section>

    <section className="public-section section-pathways"><div className="public-container"><SectionHeading eyebrow={`01 / ${labels.pathways}`} title={h.pathTitle} intro={h.pathIntro} />
      <div className="pathway-grid">{h.pathways.map((card, index) => <article className={`pathway-card pathway-${index + 1}`} key={card.href}>
        <div className="pathway-number">0{index + 1}</div>{card.label && <span className="pathway-label">{card.label}</span>}<h3>{card.title}</h3><p>{card.body}</p><Link href={localizedHref(locale, card.href.slice(1))} className="arrow-link">{card.cta}<span aria-hidden="true">↗</span></Link>
      </article>)}</div>
    </div></section>

    <section className="public-section section-tools"><div className="public-container"><SectionHeading eyebrow={`02 / ${labels.tools}`} title={h.toolTitle} intro={h.toolIntro} />
      <div className="tool-grid">{h.tools.map((tool, index) => <article className="tool-card" key={tool.title}><div className="tool-card-top"><span className="tool-icon" aria-hidden="true">{['↗','⌖','◷','＋'][index]}</span><AvailabilityLabel tone={tool.available ? 'live' : 'planned'}>{tool.status}</AvailabilityLabel></div><h3>{tool.title}</h3><p>{tool.body}</p>{tool.available ? <Link className="arrow-link" href={localizedHref(locale, tool.href.slice(1))}>{locale === 'vi' ? 'Tìm hiểu cách dùng' : locale === 'de' ? 'So funktioniert es' : 'How it works'}<span aria-hidden="true">↗</span></Link> : <span className="disabled-link">{locale === 'vi' ? 'Chưa mở' : locale === 'de' ? 'Noch nicht verfügbar' : 'Not available yet'}</span>}</article>)}</div>
    </div></section>

    <section className="public-section section-journey"><div className="public-container"><SectionHeading eyebrow={`03 / ${labels.journey}`} title={h.journeyTitle} />
      <ol className="journey-list">{h.journey.map((step, index) => <li key={step.title}><span className="journey-count">0{index + 1}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></li>)}</ol>
    </div></section>

    <section className="public-section section-trust"><div className="public-container trust-layout"><div><SectionHeading eyebrow={`04 / ${labels.principles}`} title={h.trustTitle} /><p className="trust-intro">{locale === 'vi' ? 'Hành trình quốc tế có nhiều bước cần tự xác minh. Chúng tôi muốn giúp từng bước trở nên dễ hiểu hơn.' : locale === 'de' ? 'Ein internationaler Weg umfasst viele Punkte, die du selbst prüfen musst. Wir möchten jeden Schritt verständlicher machen.' : 'An international pathway involves many things to verify. We want to make each step easier to understand.'}</p></div><div className="trust-list">{h.trust.map((item, index) => <article key={item.title}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></article>)}</div></div></section>

    <section className="public-section section-guides"><div className="public-container"><div className="section-heading-row"><SectionHeading eyebrow={`05 / ${labels.knowledge}`} title={h.guidesTitle} intro={h.guidesIntro} /><Link className="arrow-link" href={localizedHref(locale, 'guides')}>{h.guidesCta}<span aria-hidden="true">↗</span></Link></div>
      <div className="guide-grid">{featured.map((guide, index) => <article className="guide-card" key={guide.slug}><span className="guide-index">0{index + 1} · {locale === 'vi' ? 'CẨM NANG' : locale === 'de' ? 'RATGEBER' : 'GUIDE'}</span><h3><Link href={localizedHref(locale, `guides/${guide.slug}`)}>{guide.title[locale]}</Link></h3><p>{guide.description[locale]}</p><Link className="arrow-link" href={localizedHref(locale, `guides/${guide.slug}`)}>{t.shared.readGuide}<span aria-hidden="true">↗</span></Link></article>)}</div>
    </div></section>

    <section className="public-section section-pricing"><div className="public-container pricing-teaser"><div className="pricing-mark" aria-hidden="true">↗</div><div><p className="public-eyebrow">06 / {labels.services}</p><h2>{h.pricingTitle}</h2><p>{h.pricingBody}</p></div><LinkButton href={localizedHref(locale, 'pricing')}>{h.pricingCta}</LinkButton></div></section>

    <section className="public-section section-partners"><div className="public-container partner-band"><div><p className="public-eyebrow">07 / {labels.partners}</p><h2>{h.partnerTitle}</h2><p>{h.partnerBody}</p></div><Link className="arrow-link" href={localizedHref(locale, 'partners')}>{h.partnerCta}<span aria-hidden="true">↗</span></Link></div></section>

    <section className="public-section section-final"><div className="public-container final-band"><div><p className="public-eyebrow">08 / {labels.final}</p><h2>{h.finalTitle}</h2><p>{h.finalBody}</p></div><div className="hero-actions"><LinkButton href={localizedHref(locale, 'ausbildung')}>{h.primary}</LinkButton><LinkButton href={localizedHref(locale, 'tools/document-check')} tone="light">{h.secondary}</LinkButton></div></div></section>
  </>;
}
