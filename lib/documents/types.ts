export const DOCUMENT_TYPES = [
  'german_cv',
  'motivation_letter',
  'school_certificate',
  'vocational_qualification',
  'university_transcript',
  'language_certificate',
  'employment_reference',
  'other_supporting_document',
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];
export type DocumentStatus = 'uploaded' | 'queued' | 'extracting' | 'ocr_required' | 'analysing' | 'validating' | 'completed' | 'needs_human_review' | 'failed' | 'deleted';

export type CandidateDocument = {
  id: string;
  candidateId: string;
  documentType: DocumentType;
  originalFilename: string;
  storageBucket: string;
  storagePath: string;
  mimeType: string;
  fileSizeBytes: number;
  sha256Checksum: string;
  status: DocumentStatus;
  createdAt: string;
  deletedAt: string | null;
};

export const documentTypeLabels: Record<DocumentType, string> = {
  german_cv: 'German CV / Lebenslauf',
  motivation_letter: 'Motivation letter / Anschreiben',
  school_certificate: 'School certificate',
  vocational_qualification: 'Vocational qualification',
  university_transcript: 'University transcript',
  language_certificate: 'German language certificate',
  employment_reference: 'Employment reference',
  other_supporting_document: 'Other supporting document',
};
