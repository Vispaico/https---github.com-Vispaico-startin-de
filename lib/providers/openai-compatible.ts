import type { LLMProvider, ModelRequest, ModelResult } from './types';
import { assertSecureServiceUrl } from '@/lib/security/url';

export class OpenAICompatibleProvider implements LLMProvider {
  constructor(private provider: 'openrouter' | 'nvidia', private endpoint: string, private apiKey: string, private model: string) {}
  async generateStructured(request: ModelRequest): Promise<ModelResult> {
    if (!this.endpoint || !this.apiKey || !this.model) throw new Error(`${this.provider} provider is not fully configured.`);
    assertSecureServiceUrl(this.endpoint);
    const started = Date.now();
    const response = await fetch(`${this.endpoint.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json', ...(this.provider === 'openrouter' ? { 'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', 'X-Title': 'STARTIN-DE Document Check Centre' } : {}) },
      body: JSON.stringify({ model: this.model, messages: [{ role: 'system', content: request.systemPrompt }, { role: 'user', content: request.userPrompt }], max_tokens: request.maxOutputTokens, response_format: { type: 'json_object' } }),
      signal: AbortSignal.timeout(45_000),
    });
    if (!response.ok) throw new Error(`${this.provider} request failed with HTTP ${response.status}.`);
    const payload = await response.json() as { choices?: Array<{ message?: { content?: string | null }; finish_reason?: string }>; usage?: { prompt_tokens?: number; completion_tokens?: number } };
    const raw = payload.choices?.[0]?.message?.content;
    if (!raw) throw new Error(`${this.provider} returned an empty response.`);
    let content: unknown;
    // Preserve usage metadata but discard malformed content. The report engine
    // performs its one bounded schema retry without retaining raw provider text.
    try { content = JSON.parse(raw); } catch { content = null; }
    const usage = payload.usage;
    return { provider: this.provider, model: this.model, content, inputTokens: usage?.prompt_tokens, outputTokens: usage?.completion_tokens, latencyMs: Date.now() - started, finishReason: payload.choices?.[0]?.finish_reason };
  }
}

export function getProvider(): LLMProvider {
  const provider = process.env.LLM_PROVIDER || 'mock';
  if (provider !== 'mock' && process.env.DOCUMENT_AI_APPROVED !== 'true') return { generateStructured: async () => { throw new Error('document_ai_not_approved'); } };
  if (provider === 'openrouter') return new OpenAICompatibleProvider('openrouter', process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1', process.env.OPENROUTER_API_KEY || '', process.env.OPENROUTER_PRIMARY_MODEL || '');
  if (provider === 'nvidia') return new OpenAICompatibleProvider('nvidia', process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1', process.env.NVIDIA_API_KEY || '', process.env.NVIDIA_PRIMARY_MODEL || '');
  return { generateStructured: async () => { throw new Error('AI analysis is disabled. Set LLM_PROVIDER and configure an approved provider before processing candidate documents.'); } };
}

export function getProviderIdentity() {
  const provider = process.env.LLM_PROVIDER || 'mock';
  if (provider === 'openrouter') return { provider, model: process.env.OPENROUTER_PRIMARY_MODEL || '' };
  if (provider === 'nvidia') return { provider, model: process.env.NVIDIA_PRIMARY_MODEL || '' };
  return { provider: 'mock', model: 'disabled' };
}
