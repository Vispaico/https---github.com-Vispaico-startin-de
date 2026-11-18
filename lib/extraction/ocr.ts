export type OcrResult = { text: string; pages: Array<{ page: number; text: string; confidence?: number }>; provider: string; model?: string; latencyMs: number; estimatedCostUsd?: number };
export interface OCRProvider { extract(bytes: Buffer, mimeType: string): Promise<OcrResult>; }
import { assertSecureServiceUrl } from '@/lib/security/url';

export class DisabledOCRProvider implements OCRProvider {
  async extract(): Promise<OcrResult> { throw new Error('OCR provider is not configured.'); }
}

export class HttpOCRProvider implements OCRProvider {
  constructor(private endpoint: string, private apiKey: string, private providerName: string) {}
  async extract(bytes: Buffer, mimeType: string): Promise<OcrResult> {
    assertSecureServiceUrl(this.endpoint);
    const started = Date.now();
    const response = await fetch(this.endpoint, { method: 'POST', headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': mimeType }, body: new Uint8Array(bytes), signal: AbortSignal.timeout(60_000) });
    if (!response.ok) throw new Error(`OCR provider returned HTTP ${response.status}.`);
    const body = await response.json() as Omit<OcrResult, 'provider' | 'latencyMs'>;
    if (typeof body.text !== 'string' || !Array.isArray(body.pages)) throw new Error('OCR provider returned an invalid response.');
    return { ...body, provider: this.providerName, latencyMs: Date.now() - started };
  }
}

export function getOCRProvider(): OCRProvider {
  if (process.env.OCR_PROVIDER && process.env.OCR_PROVIDER !== 'disabled' && process.env.OCR_PROCESSING_APPROVED !== 'true') return new DisabledOCRProvider();
  if (process.env.OCR_PROVIDER && process.env.OCR_PROVIDER !== 'disabled' && process.env.OCR_API_URL && process.env.OCR_API_KEY) return new HttpOCRProvider(process.env.OCR_API_URL, process.env.OCR_API_KEY, process.env.OCR_PROVIDER);
  return new DisabledOCRProvider();
}
