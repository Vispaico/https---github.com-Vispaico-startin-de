import { createHash, randomUUID } from 'node:crypto';
import { DOCUMENT_TYPES, type DocumentType } from './types';
import { config } from '@/lib/config';

export class UploadError extends Error { constructor(message: string, readonly status = 400) { super(message); } }

export function validateUpload(file: File, type: string, consent: string) {
  if (!DOCUMENT_TYPES.includes(type as DocumentType)) throw new UploadError('Choose a supported document type.');
  if (consent !== 'true') throw new UploadError('Please confirm that you are authorised to upload this document.');
  if (!file.size) throw new UploadError('The selected file is empty.');
  if (file.size > config.maxUploadBytes) throw new UploadError(`Files must be ${Math.floor(config.maxUploadBytes / 1024 / 1024)} MB or smaller.`, 413);
  const name = file.name.replace(/[\\/\u0000-\u001f]/g, '_').slice(-180) || 'document';
  const ext = name.split('.').pop()?.toLowerCase();
  if (!['pdf', 'docx'].includes(ext || '')) throw new UploadError('Upload a PDF or DOCX file.');
  return { name, type: type as DocumentType, extension: ext! };
}

export function inspectFile(buffer: Buffer, extension: string) {
  if (extension === 'pdf') {
    if (buffer.length < 8 || buffer.subarray(0, 5).toString('ascii') !== '%PDF-') throw new UploadError('This file is not a valid PDF.');
    return { mimeType: 'application/pdf' as const };
  }
  // DOCX is an OOXML ZIP container. Require local file headers and the
  // mandatory Word document and content-type entries before accepting it.
  if (buffer.length < 128 || buffer.readUInt32LE(0) !== 0x04034b50) throw new UploadError('This file is not a valid DOCX document.');
  const scan = buffer.toString('latin1');
  if (!scan.includes('[Content_Types].xml') || !scan.includes('word/document.xml')) throw new UploadError('The Word document package is incomplete or unsupported.');
  if (scan.includes('vbaProject.bin')) throw new UploadError('Macro-enabled Word documents are not accepted.');
  let eocd = -1;
  for (let i = buffer.length - 22; i >= Math.max(0, buffer.length - 65_557); i--) {
    if (buffer.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new UploadError('The Word document package is malformed.');
  const count = buffer.readUInt16LE(eocd + 10);
  const directorySize = buffer.readUInt32LE(eocd + 12);
  let offset = buffer.readUInt32LE(eocd + 16);
  const directoryEnd = offset + directorySize;
  if (count > 500 || directoryEnd > buffer.length) throw new UploadError('The Word document package is too complex.');
  let expanded = 0;
  for (let entry = 0; entry < count; entry++) {
    if (offset + 46 > directoryEnd || buffer.readUInt32LE(offset) !== 0x02014b50) throw new UploadError('The Word document package is malformed.');
    const flags = buffer.readUInt16LE(offset + 8); const method = buffer.readUInt16LE(offset + 10);
    const compressed = buffer.readUInt32LE(offset + 20); const uncompressed = buffer.readUInt32LE(offset + 24);
    const nameLength = buffer.readUInt16LE(offset + 28); const extraLength = buffer.readUInt16LE(offset + 30); const commentLength = buffer.readUInt16LE(offset + 32);
    const name = buffer.subarray(offset + 46, offset + 46 + nameLength).toString('utf8').replaceAll('\\', '/');
    if ((flags & 1) !== 0 || ![0, 8].includes(method) || name.startsWith('/') || name.split('/').includes('..')) throw new UploadError('This Word document uses unsupported or unsafe archive features.');
    if (compressed > 0 && uncompressed / compressed > 100) throw new UploadError('This Word document has an unsafe compression ratio.');
    expanded += uncompressed;
    if (expanded > 60 * 1024 * 1024) throw new UploadError('This Word document expands beyond the allowed size.');
    offset += 46 + nameLength + extraLength + commentLength;
  }
  if (offset !== directoryEnd) throw new UploadError('The Word document package is malformed.');
  return { mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' as const };
}

export function checksum(buffer: Buffer) { return createHash('sha256').update(buffer).digest('hex'); }
export function randomObjectPath(candidateId: string, extension: string) { return `${candidateId}/${randomUUID()}.${extension}`; }
