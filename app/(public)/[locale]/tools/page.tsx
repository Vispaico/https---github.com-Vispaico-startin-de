import Link from 'next/link';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { publicContent, publicLocales, localizedHref } from '@/lib/public-content';
import { publicMetadata } from '@/lib/public-seo';
import { AvailabilityLabel, Breadcrumbs, SectionHeading } from '../public-components';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params; const locale = (publicLocales.includes(raw as Locale) ? raw : 'vi') as Locale; const t = publicContent[locale];
  return publicMetadata(locale, 'tools', t.tools.title, t.tools.lead);
}

export default async function ToolsDirectory({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params; const locale = raw as Locale; const t = publicContent[locale];
  return <div className="public-container content-page"><Breadcrumbs locale={locale} items={[{ title: t.footerNav.tools }]} /><section className="simple-hero"><p className="public-eyebrow">TOOLS</p><h1>{t.tools.title}</h1><p className="public-lead">{t.tools.lead}</p></section><SectionHeading title={locale === 'vi' ? 'Công cụ hiện có và đang phát triển' : locale === 'de' ? 'Verfügbare Werkzeuge und Entwicklungen' : 'Current and planned tools'} />
    <div className="tool-grid tool-directory">{t.tools.toolItems.map((tool, index) => <article className="tool-card" key={tool.title}><div className="tool-card-top"><span className="tool-icon" aria-hidden="true">{['↗','⌖','◷','＋'][index]}</span><AvailabilityLabel tone={tool.available ? 'live' : 'planned'}>{tool.status}</AvailabilityLabel></div><h2>{tool.title}</h2><p>{tool.body}</p>{tool.href ? <Link className="arrow-link" href={localizedHref(locale, tool.href.slice(1))}>{t.shared.learn}<span aria-hidden="true">↗</span></Link> : <span className="disabled-link">{t.tools.planned}</span>}</article>)}</div>
  </div>;
}
