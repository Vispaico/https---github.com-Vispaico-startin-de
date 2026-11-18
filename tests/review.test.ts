import { describe, expect, it } from 'vitest';
import { createReview } from '../lib/documents/review';

describe('development mock analysis', () => {
  it('returns a clear unable-to-assess notice without sending document text to a provider', async () => {
    const result = await createReview({ type: 'german_cv', language: 'vi', extraction: { method: 'pdf_text', text: 'synthetic private text', pages: [{ page: 1, text: 'synthetic private text' }], pageCount: 1, pageReferencesAvailable: true, quality: 'good', ocrUsed: false, providerMetadata: {} } });
    expect(result.usage.provider).toBe('mock');
    expect(result.usage.inputTokens).toBe(0);
    expect(result.report.outcome).toBe('unable_to_assess');
    expect(result.report.summary).toContain('No automated document feedback was generated');
    expect(result.report.findings).toHaveLength(0);
  });
});
