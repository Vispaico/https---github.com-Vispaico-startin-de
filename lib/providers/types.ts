import type { ReviewReport } from '@/lib/documents/report-schema';

export type ModelTask = 'document_classification' | 'structured_extraction' | 'basic_review' | 'advanced_review' | 'cross_document_review';
export type ModelRequest = { task: ModelTask; systemPrompt: string; userPrompt: string; maxOutputTokens: number; documentLanguage?: string };
export type ModelResult = { provider: string; model: string; content: unknown; inputTokens?: number; outputTokens?: number; estimatedCostUsd?: number; latencyMs: number; finishReason?: string };
export interface LLMProvider { generateStructured(request: ModelRequest): Promise<ModelResult>; }
export type AnalysedReport = { report: ReviewReport; usage: ModelResult };
