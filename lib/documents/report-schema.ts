import { z } from 'zod';

export const FindingSchema = z.object({
  id: z.string().min(1).max(80),
  severity: z.enum(['critical', 'important', 'minor', 'positive']),
  category: z.string().min(1).max(80),
  title: z.string().min(1).max(180),
  explanation: z.string().min(1).max(2000),
  recommendation: z.string().max(1200).optional(),
  evidence: z.object({ page: z.number().int().positive().optional(), quote: z.string().max(240).optional() }).strict().optional(),
  confidence: z.number().min(0).max(1),
}).strict();

export const ReviewReportSchema = z.object({
  schemaVersion: z.literal('1.0'),
  documentType: z.string().min(1).max(80),
  documentLanguage: z.string().min(1).max(40),
  outcome: z.enum(['good', 'revision_recommended', 'human_review_recommended', 'unable_to_assess']),
  indicativeScore: z.number().int().min(0).max(100).optional(),
  scoreExplanation: z.string().max(500).optional(),
  summary: z.string().min(1).max(2000),
  findings: z.array(FindingSchema).max(40),
  missingInformation: z.array(z.string().max(300)).max(30),
  suggestedNextSteps: z.array(z.string().max(500)).max(20),
  limitations: z.array(z.string().max(500)).max(20),
  humanReviewRecommended: z.boolean(),
  extraction: z.object({ status: z.enum(['good', 'partial', 'poor']), pageCount: z.number().int().positive().optional(), ocrUsed: z.boolean() }).strict(),
}).strict();

export type ReviewReport = z.infer<typeof ReviewReportSchema>;
