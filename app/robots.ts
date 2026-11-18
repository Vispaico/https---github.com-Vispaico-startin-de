import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/public-seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/app', '/admin', '/login', '/signup', '/documents', '/reports', '/api', '/auth', '/privacy'],
    },
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
  };
}
