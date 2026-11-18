import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { inspectFile, validateUpload, UploadError } from '../lib/documents/validation';
import { ReviewReportSchema } from '../lib/documents/report-schema';

describe('secure upload validation', () => {
  it('accepts a PDF only when its bytes match the PDF signature', () => {
    expect(inspectFile(Buffer.from('%PDF-1.7\n%valid fixture'), 'pdf').mimeType).toBe('application/pdf');
    expect(() => inspectFile(Buffer.from('not actually a pdf'), 'pdf')).toThrow(UploadError);
  });

  it('rejects unsupported extensions and missing consent', () => {
    const unsupported = new File(['text'], 'document.exe', { type: 'application/pdf' });
    expect(() => validateUpload(unsupported, 'german_cv', 'true')).toThrow('Upload a PDF or DOCX file.');
    const pdf = new File(['%PDF-1.4\nfixture'], 'cv.pdf', { type: 'application/pdf' });
    expect(() => validateUpload(pdf, 'german_cv', 'false')).toThrow('authorised');
  });

  it('rejects blank files and spoofed document type values', () => {
    expect(() => validateUpload(new File([], 'empty.pdf'), 'german_cv', 'true')).toThrow('empty');
    expect(() => validateUpload(new File(['%PDF-1.4'], 'a.pdf'), 'passport', 'true')).toThrow('supported document type');
  });

  it('rejects incomplete and macro-enabled Word packages', () => {
    const header = Buffer.alloc(128); header.writeUInt32LE(0x04034b50, 0); header.write('[Content_Types].xml word/document.xml vbaProject.bin', 4, 'latin1');
    expect(() => inspectFile(header, 'docx')).toThrow('Macro-enabled');
    expect(() => inspectFile(Buffer.from('PK\u0003\u0004 bad archive'), 'docx')).toThrow('valid DOCX');
  });
  it('accepts the synthetic Word fixture based on its package signature', async () => {
    const docx = await readFile(new URL('./fixtures/sample-cv.docx', import.meta.url));
    expect(inspectFile(docx, 'docx').mimeType).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  });
});

describe('structured report schema', () => {
  it('accepts report data that matches the public contract', () => {
    const report = { schemaVersion: '1.0', documentType: 'german_cv', documentLanguage: 'de', outcome: 'revision_recommended', summary: 'Some clear improvements are available.', findings: [{ id: 'f1', severity: 'minor', category: 'structure', title: 'Add a clear education heading', explanation: 'An education section is not easy to identify.', recommendation: 'Add a concise heading.', confidence: 0.88 }], missingInformation: [], suggestedNextSteps: [], limitations: [], humanReviewRecommended: false, extraction: { status: 'good', pageCount: 1, ocrUsed: false } };
    expect(ReviewReportSchema.safeParse(report).success).toBe(true);
  });
  it('rejects out-of-range confidence and unexpected fields', () => {
    const report = { schemaVersion: '1.0', documentType: 'german_cv', documentLanguage: 'de', outcome: 'good', summary: 'Looks clear.', findings: [{ id: 'x', severity: 'positive', category: 'layout', title: 'Clear structure', explanation: 'Sections are easy to find.', confidence: 1.3 }], missingInformation: [], suggestedNextSteps: [], limitations: [], humanReviewRecommended: false, extraction: { status: 'good', pageCount: 1, ocrUsed: false }, hidden: 'extra' };
    expect(ReviewReportSchema.safeParse(report).success).toBe(false);
  });
});
