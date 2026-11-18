import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { guides, getGuide } from '@/lib/guides';
import { publicLocales, localizedHref, publicContent } from '@/lib/public-content';
import { publicMetadata } from '@/lib/public-seo';
import { Breadcrumbs, LinkButton, SourceList } from '../../public-components';

export function generateStaticParams() { return publicLocales.flatMap((locale) => guides.map((guide) => ({ locale, slug: guide.slug }))); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug } = await params; if (!publicLocales.includes(raw as Locale)) return {};
  const locale = raw as Locale; const guide = getGuide(slug); if (!guide) return {};
  return publicMetadata(locale, `guides/${slug}`, guide.title[locale], guide.description[locale]);
}

export default async function GuideArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params; if (!publicLocales.includes(raw as Locale)) notFound();
  const locale = raw as Locale; const guide = getGuide(slug); if (!guide) notFound();
  const t = publicContent[locale];
  const reviewedLabel = locale === 'vi' ? 'Nguồn được kiểm tra' : locale === 'de' ? 'Quellen geprüft' : 'Sources checked';
  const readLabel = locale === 'vi' ? 'phút đọc' : locale === 'de' ? 'Min. Lesezeit' : 'min read';
  const shouldLinkTool = ['write-a-german-cv', 'write-a-motivation-letter', 'ausbildung-requirements'].includes(slug);
  const disclaimer = locale === 'vi' ? 'Bài viết giúp bạn tìm hiểu và chuẩn bị. Yêu cầu tuyển sinh, thị thực, công nhận và tài chính có thể thay đổi; hãy xác minh tại nguồn chính thức.' : locale === 'de' ? 'Dieser Ratgeber unterstützt deine Orientierung und Vorbereitung. Anforderungen zu Ausbildung, Visum, Anerkennung und Finanzen können sich ändern; prüfe offizielle Quellen.' : 'This guide supports research and preparation. Training, visa, recognition and financial requirements can change; verify them with official sources.';
  return <article className="public-container content-page guide-article">
    <Breadcrumbs locale={locale} items={[{ title: t.footerNav.guides, href: 'guides' }, { title: guide.title[locale] }]} />
    <header className="article-header"><p className="public-eyebrow">{locale === 'vi' ? 'CẨM NANG' : locale === 'de' ? 'RATGEBER' : 'GUIDE'}</p><h1>{guide.title[locale]}</h1><p className="public-lead">{guide.description[locale]}</p><div className="article-meta"><span>{guide.readMinutes} {readLabel}</span><span>{reviewedLabel}: {guide.reviewedOn}</span></div></header>
    <div className="article-body-layout"><div className="article-body">{guide.sections[locale].map((section, index) => <section className="prose-section" key={section.title}><p className="public-eyebrow">0{index + 1}</p><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}<p className="content-caveat">{disclaimer}</p><SourceList locale={locale} sources={guide.sources} checked={guide.reviewedOn} />
      {shouldLinkTool && <aside className="article-tool-cta"><p className="public-eyebrow">{t.tools.documentTitle}</p><h2>{locale === 'vi' ? 'Muốn nhận thêm nhận xét về CV hoặc thư động lực?' : locale === 'de' ? 'Möchtest du Feedback zu Lebenslauf oder Anschreiben erhalten?' : 'Would you like feedback on a CV or motivation letter?'}</h2><p>{t.tools.dataNote}</p><LinkButton href={localizedHref(locale, 'tools/document-check')}>{t.shared.documentsCta}</LinkButton></aside>}
      <Link className="arrow-link article-back" href={localizedHref(locale, 'guides')}>{locale === 'vi' ? 'Tất cả cẩm nang' : locale === 'de' ? 'Alle Ratgeber' : 'All guides'}<span aria-hidden="true">↗</span></Link>
    </div></div>
  </article>;
}
