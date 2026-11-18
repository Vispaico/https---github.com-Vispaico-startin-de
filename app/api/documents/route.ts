import { NextResponse } from 'next/server';
import { requireCandidate } from '@/lib/auth/admin';
import { validateUpload, inspectFile, checksum, UploadError } from '@/lib/documents/validation';
import { saveUpload, listDocuments } from '@/lib/documents/store';
import { config } from '@/lib/config';
import { isSameOrigin } from '@/lib/security/request';

export const runtime = 'nodejs';

async function readUploadBody(request: Request, maxBytes: number) {
  if (!request.body) throw new UploadError('Choose a file to upload.');
  const reader = request.body.getReader(); const chunks: Uint8Array[] = []; let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      total += value.byteLength;
      if (total > maxBytes) { await reader.cancel(); throw new UploadError('Upload is too large.', 413); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)), total);
}

export async function GET() {
  const user = await requireCandidate();
  if (!user) return NextResponse.json({ error: 'Sign in to view your documents.' }, { status: 401 });
  try {
    const documents = await listDocuments(user.id);
    return NextResponse.json({ documents: documents.map(({ id, documentType, originalFilename, mimeType, fileSizeBytes, status, createdAt }) => ({ id, documentType, originalFilename, mimeType, fileSizeBytes, status, createdAt })) });
  }
  catch { return NextResponse.json({ error: 'Documents are temporarily unavailable.' }, { status: 503 }); }
}

export async function POST(request: Request) {
  const user = await requireCandidate();
  if (!user) return NextResponse.json({ error: 'Sign in to upload a document.' }, { status: 401 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  const maxBodyBytes = config.maxUploadBytes + 256 * 1024;
  const length = Number(request.headers.get('content-length') || 0);
  if (length && length > maxBodyBytes) return NextResponse.json({ error: 'Upload is too large.' }, { status: 413 });
  try {
    const body = await readUploadBody(request, maxBodyBytes);
    const form = await new Request(request.url, { method: 'POST', headers: { 'Content-Type': request.headers.get('content-type') || '' }, body: body as unknown as BodyInit }).formData();
    const file = form.get('file');
    if (!(file instanceof File)) throw new UploadError('Choose a file to upload.');
    const validated = validateUpload(file, String(form.get('documentType') || ''), String(form.get('authorized') || ''));
    const bytes = Buffer.from(await file.arrayBuffer());
    const { mimeType } = inspectFile(bytes, validated.extension);
    const reportLanguage = String(form.get('reportLanguage') || 'vi');
    if (!['vi','de','en'].includes(reportLanguage)) throw new UploadError('Choose Vietnamese, German, or English for your report.');
    const saved = await saveUpload({ candidateId: user.id, type: validated.type, name: validated.name, extension: validated.extension, mimeType, bytes, sha256: checksum(bytes), reportLanguage });
    return NextResponse.json({ ok: true, id: saved.id }, { status: 201 });
  } catch (error) {
    if (error instanceof UploadError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: 'Upload could not be completed. Please try again.' }, { status: 503 });
  }
}
