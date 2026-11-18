import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';

describe('Supabase migration access controls', () => {
  it('enables RLS for all candidate and sensitive document tables', async () => {
    const migration = await readFile(new URL('../supabase/migrations/202611180001_document_check_centre.sql', import.meta.url), 'utf8');
    for (const table of ['candidate_documents','document_extractions','document_review_jobs','document_reports','document_review_events','advisor_reviews','candidate_human_review_requests','model_rate_cards','system_settings','document_upload_attempts']) {
      expect(migration).toContain(`alter table public.${table} enable row level security`);
    }
    expect(migration).toContain('candidate_id = auth.uid()');
    expect(migration).toContain("values ('startinde-private-documents','startinde-private-documents',false");
    expect(migration).not.toContain('create policy startinde_storage_insert_own');
    expect(migration).toContain('for update skip locked');
  });
});
