import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { publicContent, publicLocales, publicSlugs, localizedHref } from '@/lib/public-content';
import { publicMetadata } from '@/lib/public-seo';
import { pricingContent } from '@/lib/pricing-content';
import { services } from '@/lib/service-catalog';
import { guides } from '@/lib/guides';
import { AvailabilityLabel, Breadcrumbs, ImagePlaceholder, LegalPending, LinkButton, PricingCard, SectionHeading, SourceList } from '../public-components';

const staticSlugs = publicSlugs.filter((slug) => !['services', 'guides', 'tools'].includes(slug));
export function generateStaticParams() {
  return publicLocales.flatMap((locale) => staticSlugs.map((slug) => ({ locale, slug })));
}

function localizedPageMetadata(locale: Locale, slug: string): Metadata {
  const t = publicContent[locale];
  const path = slug;
  const legal = ['privacy', 'terms', 'refunds'].includes(slug);
  if (slug in t.pathways) {
    const item = t.pathways[slug as keyof typeof t.pathways];
    return publicMetadata(locale, path, item.title, item.lead);
  }
  if (slug === 'pricing') return publicMetadata(locale, slug, pricingContent[locale].title, pricingContent[locale].lead);
  if (slug === 'about') return publicMetadata(locale, slug, t.about.title, t.about.lead);
  if (slug === 'partners') return publicMetadata(locale, slug, t.partners.title, t.partners.lead);
  if (slug === 'contact') return publicMetadata(locale, slug, t.contact.title, t.contact.lead);
  if (slug === 'opportunities') { const item = t.pathways.opportunities; return publicMetadata(locale, slug, item.title, item.lead); }
  if (slug === 'tools') return publicMetadata(locale, slug, t.tools.title, t.tools.lead);
  if (slug === 'services') return publicMetadata(locale, slug, pricingContent[locale].serviceIntroTitle, pricingContent[locale].serviceIntro);
  if (slug === 'guides') return publicMetadata(locale, slug, t.home.guidesTitle, t.home.guidesIntro);
  const legalTitle = slug === 'privacy' ? t.legal.privacyTitle : slug === 'terms' ? t.legal.termsTitle : t.legal.refundsTitle;
  const legalBody = slug === 'privacy' ? t.legal.privacyLead : slug === 'terms' ? t.legal.termsLead : t.legal.refundsLead;
  return publicMetadata(locale, path, legalTitle, legalBody, { noindex: legal });
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!publicLocales.includes(rawLocale as Locale)) return {};
  return localizedPageMetadata(rawLocale as Locale, slug);
}

export default async function PublicContentPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  if (!publicLocales.includes(rawLocale as Locale)) notFound();
  const locale = rawLocale as Locale; const t = publicContent[locale];

  if (slug in t.pathways) {
    const item = t.pathways[slug as keyof typeof t.pathways];
    const imageDescription = slug === 'ausbildung'
      ? (locale === 'vi' ? 'Gợi ý hình ảnh: học viên đang thực hành trong môi trường đào tạo kỹ thuật hoặc dịch vụ tại Đức.' : locale === 'de' ? 'Bildidee: Auszubildende in einer technischen oder dienstleistungsbezogenen Lernumgebung in Deutschland.' : 'Suggested image: trainees practising in a technical or service training environment in Germany.')
      : slug === 'study'
        ? (locale === 'vi' ? 'Gợi ý hình ảnh: khuôn viên đại học hoặc sinh viên học tập tại Đức.' : locale === 'de' ? 'Bildidee: ein Hochschulcampus oder Studierende beim Lernen in Deutschland.' : 'Suggested image: a university campus or students studying in Germany.')
        : (locale === 'vi' ? 'Gợi ý hình ảnh: môi trường làm việc chuyên môn tại Đức.' : locale === 'de' ? 'Bildidee: ein qualifiziertes berufliches Arbeitsumfeld in Deutschland.' : 'Suggested image: a skilled professional workplace in Germany.');
    return <div className="public-container content-page">
      <Breadcrumbs locale={locale} items={[{ title: item.title }]} />
      <section className="content-hero pathway-hero"><div><p className="public-eyebrow">{item.eyebrow}</p><h1>{item.title}</h1><p className="public-lead">{item.lead}</p><div className="hero-actions">{slug === 'ausbildung' ? <LinkButton href={localizedHref(locale, 'tools/document-check')}>{'cta' in item ? item.cta : t.shared.documentsCta}</LinkButton> : <LinkButton href={localizedHref(locale, 'guides')} tone="line">{locale === 'vi' ? 'Đọc cẩm nang' : locale === 'de' ? 'Ratgeber lesen' : 'Browse guides'}</LinkButton>}</div></div>
        {slug === 'study' ? <figure className="content-photo"><Image src="/images/guides/mensa.webp" alt={locale === 'vi' ? 'Một người đang sử dụng máy tính xách tay tại bàn' : locale === 'de' ? 'Eine Person arbeitet an einem Laptop am Schreibtisch' : 'A person using a laptop at a desk'} fill sizes="(max-width: 760px) 100vw, 42vw" /></figure>
          : slug === 'ausbildung' ? <figure className="content-photo"><Image src="/images/ausbildung/azubis.webp" alt={locale === 'vi' ? 'Hai công nhân xây dựng mặc áo phản quang tại công trường' : locale === 'de' ? 'Zwei Bauarbeiter in Warnkleidung auf einer Baustelle' : 'Two construction workers wearing high-visibility clothing at a work site'} fill sizes="(max-width: 760px) 100vw, 42vw" /></figure>
            : slug === 'work' ? <figure className="content-photo"><Image src="/images/work/builders.webp" alt={locale === 'vi' ? 'Hai công nhân xây dựng mặc áo phản quang tại công trường' : locale === 'de' ? 'Zwei Bauarbeiter in Warnkleidung auf einer Baustelle' : 'Two construction workers wearing high-visibility clothing at a work site'} fill sizes="(max-width: 760px) 100vw, 42vw" /></figure>
            : slug === 'opportunities' ? <figure className="content-photo"><Image src="/images/opportunities/master-and-student.webp" alt={locale === 'vi' ? 'Một người trẻ và một người lớn tuổi cùng làm việc tại bàn trộn âm thanh' : locale === 'de' ? 'Eine jüngere und eine ältere Person arbeiten gemeinsam an einem Audiomischpult' : 'A younger and an older person working together at an audio mixing console'} fill sizes="(max-width: 760px) 100vw, 42vw" /></figure>
              : <ImagePlaceholder title={t.shared.placeholderPrefix} description={imageDescription} />}
      </section>
      <div className="content-prose-grid"><div className="content-sections">{item.sections.map((section, index) => <section className="prose-section" key={section.title}><p className="public-eyebrow">0{index + 1}</p><h2>{section.title}</h2><p>{section.body}</p></section>)}
        {'faq' in item && <section className="faq-section"><SectionHeading eyebrow="FAQ" title={slug === 'ausbildung' ? item.sections[3]?.title || item.title : item.title} intro={locale === 'vi' ? 'Câu trả lời ngắn để bạn biết cần kiểm tra gì tiếp theo.' : locale === 'de' ? 'Kurze Antworten zeigen dir, was du als Nächstes prüfen solltest.' : 'Short answers to help you identify what to check next.'} /><div className="faq-list">{item.faq.map((faq) => <details key={faq.title}><summary>{faq.title}</summary><p>{faq.body}</p></details>)}</div></section>}
        <p className="content-caveat">{('note' in item && item.note) || t.shared.notAdvice}</p>
        <SourceList locale={locale} sources={item.sources} />
      </div><aside className="content-aside"><div className="aside-sticky"><p className="public-eyebrow">{locale === 'vi' ? 'BƯỚC TIẾP THEO' : locale === 'de' ? 'NÄCHSTER SCHRITT' : 'NEXT STEP'}</p><h2>{locale === 'vi' ? 'Chuẩn bị hồ sơ của bạn' : locale === 'de' ? 'Bereite deine Unterlagen vor' : 'Prepare your documents'}</h2><p>{locale === 'vi' ? 'Xem hướng dẫn trước khi tải tài liệu lên công cụ riêng tư.' : locale === 'de' ? 'Lies die Hinweise, bevor du Unterlagen im geschützten Werkzeug hochlädst.' : 'Review the guidance before uploading documents to the private tool.'}</p><Link className="arrow-link" href={localizedHref(locale, 'tools/document-check')}>{t.shared.documentsCta}<span aria-hidden="true">↗</span></Link></div></aside></div>
    </div>;
  }

  if (slug === 'tools') return <div className="public-container content-page"><Breadcrumbs locale={locale} items={[{ title: t.tools.title }]} /><section className="simple-hero"><p className="public-eyebrow">TOOLS</p><h1>{t.tools.title}</h1><p className="public-lead">{t.tools.lead}</p></section><div className="tool-grid tool-directory">{t.tools.toolItems.map((tool, index) => <article className="tool-card" key={tool.title}><div className="tool-card-top"><span className="tool-icon" aria-hidden="true">{['↗','⌖','◷','＋'][index]}</span><AvailabilityLabel tone={tool.available ? 'live' : 'planned'}>{tool.status}</AvailabilityLabel></div><h2>{tool.title}</h2><p>{tool.body}</p>{tool.href ? <Link className="arrow-link" href={localizedHref(locale, tool.href.slice(1))}>{tool.available ? t.shared.learn : t.footerNav.opportunities}<span aria-hidden="true">↗</span></Link> : <span className="disabled-link">{t.tools.planned}</span>}</article>)}</div></div>;

  if (slug === 'pricing' || slug === 'services') {
    const pricing = pricingContent[locale]; const isPricing = slug === 'pricing';
    return <div className="public-container content-page"><Breadcrumbs locale={locale} items={[{ title: isPricing ? t.footerNav.pricing : t.footerNav.services }]} /><section className="simple-hero"><p className="public-eyebrow">{isPricing ? 'PRICING' : 'SERVICES'}</p><h1>{isPricing ? pricing.title : pricing.serviceIntroTitle}</h1><p className="public-lead">{isPricing ? pricing.lead : pricing.serviceIntro}</p></section>
      {isPricing && <div className="pricing-notice"><span aria-hidden="true">i</span><p>{pricing.finePrint}</p></div>}
      <SectionHeading title={isPricing ? pricing.subheading : locale === 'vi' ? 'Các dịch vụ và trạng thái hiện tại' : locale === 'de' ? 'Leistungen und aktueller Status' : 'Services and current status'} intro={locale === 'vi' ? 'Mọi mức giá trả phí là đề xuất. Không có chức năng mua hoặc thanh toán.' : locale === 'de' ? 'Alle kostenpflichtigen Preise sind Vorschläge. Kauf und Zahlung sind nicht verfügbar.' : 'All paid prices are proposals. Purchase and payment are not available.'} />
      <div className="pricing-grid">{services.map((service) => <PricingCard locale={locale} service={service} key={service.id} />)}</div>
      <section className="faq-section pricing-faq"><SectionHeading title={locale === 'vi' ? 'Câu hỏi về dịch vụ và chi phí' : locale === 'de' ? 'Fragen zu Leistungen und Preisen' : 'Questions about services and pricing'} /><div className="faq-list">{pricing.faq.map((faq) => <details key={faq.title}><summary>{faq.title}</summary><p>{faq.body}</p></details>)}</div></section>
      <p className="content-caveat">{t.home.reassure}</p>
    </div>;
  }

  if (slug === 'about') return <div className="public-container content-page"><Breadcrumbs locale={locale} items={[{ title: t.footerNav.about }]} /><section className="about-hero"><div><p className="public-eyebrow">ABOUT STARTIN-DE</p><h1>{t.about.title}</h1><p className="public-lead">{t.about.lead}</p></div><figure className="content-photo"><Image src="/images/pathways/people-in-conversation.webp" alt={t.about.imageAlt} fill sizes="(max-width: 760px) 100vw, 44vw" /></figure></section><div className="values-grid">{t.about.values.map((value, index) => <article key={value.title}><span>0{index + 1}</span><h2>{value.title}</h2><p>{value.body}</p></article>)}</div><div className="launch-blocker-note"><strong>{locale === 'vi' ? 'Thông tin cần xác nhận trước khi ra mắt thương mại' : locale === 'de' ? 'Angaben vor einem kommerziellen Start zu bestätigen' : 'Details to confirm before commercial launch'}</strong><p>{locale === 'vi' ? 'Pháp nhân, địa chỉ đăng ký, đầu mối liên hệ, phạm vi dịch vụ và các chính sách đang chờ chủ sở hữu xác nhận.' : locale === 'de' ? 'Rechtsträger, Geschäftsadresse, Kontakt, Leistungsumfang und Richtlinien müssen noch von der Inhaberschaft bestätigt werden.' : 'Legal entity, registered address, public contact, service scope and policies still require owner confirmation.'}</p></div></div>;

  if (slug === 'partners') return <div className="public-container content-page"><Breadcrumbs locale={locale} items={[{ title: t.footerNav.partners }]} /><section className="simple-hero"><p className="public-eyebrow">PARTNER EXCHANGE</p><h1>{t.partners.title}</h1><p className="public-lead">{t.partners.lead}</p></section><div className="partner-content"><ImagePlaceholder title={t.shared.placeholderPrefix} description={locale === 'vi' ? 'Gợi ý hình ảnh: môi trường đào tạo nghề tại doanh nghiệp hoặc cơ sở giáo dục; không hiển thị logo đối tác khi chưa được cho phép.' : locale === 'de' ? 'Bildidee: eine betriebliche oder schulische Lernumgebung; keine Partnerlogos ohne Genehmigung.' : 'Suggested image: an employer or school training environment; no partner logos without permission.'} /><div><AvailabilityLabel tone="planned">{locale === 'vi' ? 'Đang phát triển' : locale === 'de' ? 'Im Aufbau' : 'In development'}</AvailabilityLabel><p>{t.partners.note}</p><p className="contact-pending">{t.partners.contactPending}</p></div></div></div>;

  if (slug === 'contact') return <div className="public-container content-page"><Breadcrumbs locale={locale} items={[{ title: t.footerNav.contact }]} /><section className="simple-hero"><p className="public-eyebrow">CONTACT</p><h1>{t.contact.title}</h1><p className="public-lead">{t.contact.lead}</p></section><div className="contact-status"><AvailabilityLabel tone="review">{t.contact.pending}</AvailabilityLabel><h2>{t.contact.pending}</h2><p>{t.contact.detail}</p><p className="content-caveat">{t.contact.noSensitive}</p></div></div>;

  if (slug === 'privacy' || slug === 'terms' || slug === 'refunds') {
    const title = slug === 'privacy' ? t.legal.privacyTitle : slug === 'terms' ? t.legal.termsTitle : t.legal.refundsTitle;
    const body = slug === 'privacy' ? t.legal.privacyLead : slug === 'terms' ? t.legal.termsLead : t.legal.refundsLead;
    return <div className="public-container content-page"><Breadcrumbs locale={locale} items={[{ title }]} /><LegalPending locale={locale} title={title} body={body} />{slug === 'privacy' && <Link className="arrow-link" href="/privacy">{locale === 'vi' ? 'Thông báo dành cho khu vực Document Check' : locale === 'de' ? 'Hinweise für den Dokumenten-Check' : 'Document Check Centre notice'}<span aria-hidden="true">↗</span></Link>}</div>;
  }
  notFound();
}
