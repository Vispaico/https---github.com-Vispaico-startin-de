import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { extractDocument } from '../lib/extraction';

describe('document extraction', () => {
  it('extracts text and retains a page reference from a synthetic PDF', async () => {
    const bytes = await readFile(new URL('./fixtures/sample-cv.pdf', import.meta.url));
    const result = await extractDocument(bytes, 'application/pdf');
    expect(result.method).toBe('pdf_text');
    expect(result.text).toContain('STARTIN-DE synthetic CV');
    expect(result.pageCount).toBe(1);
    expect(result.pages[0]?.page).toBe(1);
  });

  it('extracts text from an anonymised synthetic DOCX', async () => {
    const bytes = await readFile(new URL('./fixtures/sample-cv.docx', import.meta.url));
    const result = await extractDocument(bytes, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    expect(result.method).toBe('docx_text');
    expect(result.text).toContain('Lebenslauf');
    expect(result.quality).toBe('partial');
  });

  it('returns an unable-to-assess extraction when OCR is unavailable', async () => {
    const bytes = Buffer.from('%PDF-1.4\n% empty scan fixture');
    const result = await extractDocument(bytes, 'application/pdf');
    expect(result.method).toBe('ocr');
    expect(result.quality).toBe('poor');
    expect(result.text).toBe('');
    expect(result.ocrUsed).toBe(true);
  });
});
