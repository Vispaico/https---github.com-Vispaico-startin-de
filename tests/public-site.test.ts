import { describe, expect, it } from 'vitest';
import { safePostAuthPath } from '../lib/auth/redirect';
import { guides } from '../lib/guides';
import { publicContent, publicLocales, publicSlugs } from '../lib/public-content';
import { canCheckout, services } from '../lib/service-catalog';

describe('public website content and availability guardrails', () => {
  it('provides the localized public experience in all supported languages', () => {
    expect(publicLocales).toEqual(['vi', 'de', 'en']);
    for (const locale of publicLocales) {
      expect(publicContent[locale].home.title.length).toBeGreaterThan(10);
      expect(publicContent[locale].nav).toHaveLength(7);
      expect(publicContent[locale].pathways.ausbildung.sources.every((source) => source.href.startsWith('https://'))).toBe(true);
    }
    expect(publicSlugs).toContain('ausbildung');
    expect(publicSlugs).toContain('pricing');
    expect(publicSlugs).toContain('contact');
  });

  it('publishes six sourced, localized guides with reviewed dates', () => {
    expect(guides).toHaveLength(6);
    for (const guide of guides) {
      expect(guide.reviewedOn).toBe('2026-11-18');
      expect(guide.sources.length).toBeGreaterThan(0);
      for (const locale of publicLocales) {
        expect(guide.title[locale]).toBeTruthy();
        expect(guide.sections[locale].length).toBeGreaterThanOrEqual(3);
      }
      expect(guide.sources.every((source) => source.href.startsWith('https://'))).toBe(true);
    }
  });

  it('keeps all proposed and legal-review services unavailable for checkout', () => {
    for (const service of services) {
      if (service.status !== 'live') expect(canCheckout(service)).toBe(false);
      expect(service.checkoutEnabled).toBe(false);
    }
    expect(services.find((service) => service.id === 'application-ready')?.showIndicativePrice).toBe(false);
    expect(services.find((service) => service.id === 'career-preparation')?.status).toBe('legal_review_required');
  });

  it('allows only the workspace destination after authentication', () => {
    expect(safePostAuthPath('/app')).toBe('/app');
    expect(safePostAuthPath('https://evil.example')).toBe('/app');
    expect(safePostAuthPath('//evil.example')).toBe('/app');
    expect(safePostAuthPath('/admin')).toBe('/app');
  });
});
