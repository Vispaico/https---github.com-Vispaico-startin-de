import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth/session';
import { getDocument, getReports } from '@/lib/documents/store';
import { documentTypeLabels } from '@/lib/documents/types';
import DeleteButton from './delete-button';

export default async function DocumentDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser(); if (!user) redirect('/login');
  const { id } = await params; const doc = await getDocument(user.id, id); if (!doc) notFound();
  const reports = await getReports(user.id, doc.id).catch(() => []);
  return <div className="page-shell detail-shell"><Link className="back-link" href="/">← Back to My Documents</Link><section className="panel detail-card"><p className="eyebrow">DOCUMENT DETAILS</p><h1>{doc.originalFilename}</h1><p className="lead">{documentTypeLabels[doc.documentType]}</p><div className="detail-grid"><div><span>Processing status</span><strong>{doc.status.replaceAll('_', ' ')}</strong></div><div><span>File size</span><strong>{(doc.fileSizeBytes / 1024 / 1024).toFixed(2)} MB</strong></div><div><span>File type</span><strong>{doc.mimeType === 'application/pdf' ? 'PDF' : 'DOCX'}</strong></div><div><span>Uploaded</span><strong>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(new Date(doc.createdAt))}</strong></div></div>{reports.map((report) => <p key={report.id}><Link className="primary-link" href={`/reports/${report.id}`}>Open review report →</Link></p>)}{doc.status !== 'completed' && doc.status !== 'needs_human_review' && <div className="privacy-box"><strong>Processing is waiting for server configuration.</strong><p>Your document is stored privately. Background malware scanning, extraction and AI review require their configured providers. No report is generated until those checks complete.</p></div>}<DeleteButton id={doc.id} /></section></div>;
}
