import { afterAll, describe, expect, it } from 'vitest';
import { readFile, rm } from 'node:fs/promises';
import { saveUpload, getDocument, listDocuments, deleteDocument, getPrivateBytes } from '../lib/documents/store';
import { checksum } from '../lib/documents/validation';

const root = new URL('../.private-data/', import.meta.url);
const pdf = Buffer.from('%PDF-1.4\nsynthetic private test file');

describe('candidate ownership and local private storage', () => {
  const created: Array<{ owner: string; id: string }> = [];
  afterAll(async () => { for (const item of created) await deleteDocument(item.owner, item.id).catch(() => undefined); await rm(root, { recursive: true, force: true }); });

  it('isolates document records by candidate and keeps bytes outside public paths', async () => {
    const saved = await saveUpload({ candidateId: 'candidate-a-test', type: 'german_cv', name: 'cv.pdf', extension: 'pdf', mimeType: 'application/pdf', bytes: pdf, sha256: checksum(pdf), reportLanguage: 'vi' });
    created.push({ owner: 'candidate-a-test', id: saved.id });
    expect(await getDocument('candidate-b-test', saved.id)).toBeNull();
    expect(await listDocuments('candidate-b-test')).toHaveLength(0);
    expect(await deleteDocument('candidate-b-test', saved.id)).toBe(false);
    const doc = await getDocument('candidate-a-test', saved.id);
    expect(doc?.storagePath.startsWith('candidate-a-test/')).toBe(true);
    expect(doc?.storagePath.includes('cv.pdf')).toBe(false);
    const bytes = await getPrivateBytes(doc!);
    expect(bytes.equals(pdf)).toBe(true);
    const indexed = JSON.parse(await readFile(new URL('../.private-data/document-index.json', import.meta.url), 'utf8'));
    expect(indexed).toHaveLength(1);
  });

  it('rejects exact duplicate uploads for the same candidate', async () => {
    const same = await saveUpload({ candidateId: 'candidate-duplicate-test', type: 'german_cv', name: 'resume.pdf', extension: 'pdf', mimeType: 'application/pdf', bytes: pdf, sha256: checksum(pdf), reportLanguage: 'vi' });
    created.push({ owner: 'candidate-duplicate-test', id: same.id });
    await expect(saveUpload({ candidateId: 'candidate-duplicate-test', type: 'german_cv', name: 'copy.pdf', extension: 'pdf', mimeType: 'application/pdf', bytes: pdf, sha256: checksum(pdf), reportLanguage: 'vi' })).rejects.toThrow('already in your document list');
  });
});
