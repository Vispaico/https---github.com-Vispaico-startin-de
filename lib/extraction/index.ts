import 'server-only';
import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';
import { getOCRProvider } from './ocr';
import { config } from '@/lib/config';

export type ExtractedPage = { page: number; text: string };
export type ExtractionResult = { method: 'pdf_text' | 'docx_text' | 'ocr'; text: string; pages: ExtractedPage[]; pageCount: number; pageReferencesAvailable: boolean; quality: 'good' | 'partial' | 'poor'; ocrUsed: boolean; providerMetadata: Record<string, unknown> };

export async function extractDocument(bytes: Buffer, mimeType: string): Promise<ExtractionResult> {
  if (mimeType === 'application/pdf') {
    const parser = new PDFParse({ data: bytes });
    let text = ''; let pageCount = 1; let pages: ExtractedPage[] = []; let parseFailed = false;
    try {
      const info = await parser.getInfo();
      pageCount = Math.max(1, info.total || 1);
      if (pageCount > config.maxPages) return { method: 'pdf_text', text: '', pages: [], pageCount, pageReferencesAvailable: false, quality: 'poor', ocrUsed: false, providerMetadata: { parser: 'pdf-parse', result: 'page_limit_exceeded' } };
      for (let page = 1; page <= pageCount; page++) {
        const pageResult = await parser.getText({ partial: [page] });
        const pageText = pageResult.text.replace(/\u0000/g, '').trim();
        if (pageText) pages.push({ page, text: pageText });
      }
      text = pages.map((page) => page.text).join('\n\n').trim();
    } catch {
      // A damaged or image-only PDF may not be parseable as text; try the configured OCR path.
      parseFailed = true;
    } finally { await parser.destroy(); }
    if (!parseFailed && text.length >= Math.max(80, pageCount * 25)) {
      return { method: 'pdf_text', text, pages, pageCount, pageReferencesAvailable: pages.length > 0, quality: text.length > 300 ? 'good' : 'partial', ocrUsed: false, providerMetadata: { parser: 'pdf-parse' } };
    }
    let ocr;
    try { ocr = await getOCRProvider().extract(bytes, mimeType); }
    catch { return { method: 'ocr', text: '', pages: [], pageCount, pageReferencesAvailable: false, quality: 'poor', ocrUsed: true, providerMetadata: { provider: process.env.OCR_PROVIDER || 'disabled', result: 'unavailable' } }; }
    return { method: 'ocr', text: ocr.text, pages: ocr.pages, pageCount: Math.max(pageCount, ocr.pages.length), pageReferencesAvailable: ocr.pages.length > 0, quality: ocr.text.length > 300 ? 'good' : 'partial', ocrUsed: true, providerMetadata: { provider: ocr.provider, model: ocr.model, latencyMs: ocr.latencyMs, estimatedCostUsd: ocr.estimatedCostUsd } };
  }
  const result = await mammoth.extractRawText({ buffer: bytes });
  const text = result.value.replace(/\u0000/g, '').trim();
  const estimatedPages = Math.max(1, Math.ceil(text.length / 3000));
  if (!text) return { method: 'docx_text', text: '', pages: [], pageCount: 1, pageReferencesAvailable: false, quality: 'poor', ocrUsed: false, providerMetadata: { parser: 'mammoth' } };
  return { method: 'docx_text', text, pages: [], pageCount: estimatedPages, pageReferencesAvailable: false, quality: text.length > 300 ? 'good' : 'partial', ocrUsed: false, providerMetadata: { parser: 'mammoth', warnings: result.messages.length, pageCountEstimated: true } };
}
