import Link from 'next/link';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { guides } from '@/lib/guides';
import { publicContent, publicLocales, localizedHref } from '@/lib/public-content';
import { publicMetadata } from '@/lib/public-seo';
import { Breadcrumbs, SectionHeading } from '../public-components';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params; const locale = (publicLocales.includes(raw as Locale) ? raw : 'vi') as Locale; const t = publicContent[locale];
  return publicMetadata(locale, 'guides', t.home.guidesTitle, t.home.guidesIntro);
}

export default async function GuideIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params; const locale = raw as Locale; const t = publicContent[locale];
  return <div className="public-container content-page"><Breadcrumbs locale={locale} items={[{ title: t.footerNav.guides }]} /><section className="simple-hero"><p className="public-eyebrow">KNOWLEDGE CENTRE</p><h1>{t.home.guidesTitle}</h1><p className="public-lead">{t.home.guidesIntro}</p></section>
    <div className="guide-index-grid">{guides.map((guide, index) => <article className="guide-index-card" key={guide.slug}><div className="guide-card-meta"><span>{locale === 'vi' ? 'CẨM NANG' : locale === 'de' ? 'RATGEBER' : 'GUIDE'} · 0{index + 1}</span><span>{guide.readMinutes} {locale === 'vi' ? 'phút đọc' : locale === 'de' ? 'Min. Lesezeit' : 'min read'}</span></div><h2><Link href={localizedHref(locale, `guides/${guide.slug}`)}>{guide.title[locale]}</Link></h2><p>{guide.description[locale]}</p><Link className="arrow-link" href={localizedHref(locale, `guides/${guide.slug}`)}>{t.shared.readGuide}<span aria-hidden="true">↗</span></Link></article>)}</div>
    <section className="unpublished-guides"><SectionHeading eyebrow="EDITORIAL ROADMAP" title={locale === 'vi' ? 'Các chủ đề đang được nghiên cứu' : locale === 'de' ? 'Themen in redaktioneller Prüfung' : 'Topics in the editorial queue'} intro={locale === 'vi' ? 'Các bài về phỏng vấn, giấy tờ, hệ thống đào tạo và đời sống tại Đức sẽ chỉ được xuất bản sau khi có nguồn chính thức và được rà soát.' : locale === 'de' ? 'Beiträge zu Gesprächen, Unterlagen, Ausbildungssystem und Alltag erscheinen erst nach Quellenprüfung.' : 'Guides on interviews, documents, training systems and life in Germany will be published after source verification.'} /><p>{locale === 'vi' ? 'Chưa có bản nháp hoặc nội dung giữ chỗ được xuất bản cho các chủ đề này.' : locale === 'de' ? 'Zu diesen Themen wurden keine Platzhalter oder ungeprüften Entwürfe veröffentlicht.' : 'No placeholder or unreviewed drafts are published for these topics.'}</p></section>
  </div>;
}
