import type { MetadataRoute } from 'next';
import { guides } from '@/lib/guides';
import { publicLocales, publicSlugs } from '@/lib/public-content';
import { services } from '@/lib/service-catalog';
import { siteUrl } from '@/lib/public-seo';

const noindex = new Set(['privacy', 'terms', 'refunds']);
const publicPages = publicSlugs.filter((slug) => !noindex.has(slug));

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = publicLocales.flatMap((locale) => [
    { url: new URL(`/${locale}`, siteUrl).toString(), changeFrequency: 'weekly', priority: locale === 'vi' ? 1 : 0.9 },
    ...publicPages.filter((slug) => !['guides', 'services'].includes(slug)).map((slug) => ({ url: new URL(`/${locale}/${slug}`, siteUrl).toString(), changeFrequency: 'monthly' as const, priority: 0.7 })),
    { url: new URL(`/${locale}/guides`, siteUrl).toString(), changeFrequency: 'monthly' as const, priority: 0.65 },
    { url: new URL(`/${locale}/services`, siteUrl).toString(), changeFrequency: 'monthly' as const, priority: 0.65 },
    ...guides.map((guide) => ({ url: new URL(`/${locale}/guides/${guide.slug}`, siteUrl).toString(), lastModified: new Date(guide.reviewedOn), changeFrequency: 'yearly' as const, priority: 0.55 })),
    ...services.map((service) => ({ url: new URL(`/${locale}/services/${service.id}`, siteUrl).toString(), changeFrequency: 'monthly' as const, priority: 0.5 })),
  ]);
  return pages;
}
