import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';
import { listDocuments } from '@/lib/documents/store';
import { documentLabel, getLocale, copy } from '@/lib/i18n';
import UploadForm from './upload-form';

const date = (value: string) => new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(value));
const size = (bytes: number) => bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export default async function Home() {
  const user = await getSessionUser(); if (!user) redirect('/login');
  const locale = await getLocale(); const t = copy[locale];
  const docs = await listDocuments(user.id).catch(() => []);
  return <div className="page-shell">
    <section className="hero"><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p className="lead">{t.intro}</p><div className="trust-note"><span className="shield">✓</span><span>{t.trust}</span></div></section>
    <div className="workspace-grid">
      <section className="panel upload-panel"><div className="panel-heading"><div><p className="eyebrow">{t.check}</p><h2>{t.add}</h2></div><span className="step">{t.step}</span></div><UploadForm locale={locale} /></section>
      <section className="panel documents-panel"><div className="panel-heading"><div><p className="eyebrow">{t.workspace}</p><h2>{t.uploaded} <span className="count">{docs.length}</span></h2></div></div>
        {docs.length === 0 ? <div className="empty-state"><div className="empty-icon">↗</div><h3>{t.ready}</h3><p>{t.empty}</p></div> : <ul className="document-list">{docs.map((doc) => <li key={doc.id} className="document-row"><div className="file-mark">{doc.mimeType === 'application/pdf' ? 'PDF' : 'DOC'}</div><div className="document-info"><div className="document-title">{doc.originalFilename}</div><div className="document-meta">{documentLabel(doc.documentType, locale)} · {size(doc.fileSizeBytes)} · {date(doc.createdAt)}</div><div className="status"><i aria-hidden="true" />{t[doc.status] || doc.status}</div></div><div className="row-actions"><Link href={`/documents/${doc.id}`} aria-label={`${t.details}: ${doc.originalFilename}`}>{t.details} <span aria-hidden="true">↗</span></Link></div></li>)}</ul>}
        {docs.length > 0 && <p className="small-note">{t.versions}</p>}
      </section>
    </div>
    <section className="scope-card"><div><p className="eyebrow">{t.check}</p><h2>{t.scope}</h2></div><p>{t.scopeText}</p></section>
  </div>;
}
