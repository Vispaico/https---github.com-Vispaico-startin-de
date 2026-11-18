'use client';

import { useRef, useState } from 'react';
import { DOCUMENT_TYPES } from '@/lib/documents/types';
import { copy, documentLabel, type Locale } from '@/lib/i18n';
import type { FormEvent } from 'react';

export default function UploadForm({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const ref = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(''); setError(false);
    try {
      const response = await fetch('/api/documents', { method: 'POST', body: new FormData(event.currentTarget) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Upload could not be completed.');
      setMessage(locale === 'vi' ? 'Tài liệu đã được tải lên an toàn.' : locale === 'de' ? 'Das Dokument wurde sicher hochgeladen.' : 'Your document was uploaded securely.'); ref.current?.reset();
      window.location.reload();
    } catch (cause) { setError(true); setMessage(cause instanceof Error ? cause.message : 'Upload could not be completed.'); }
    finally { setBusy(false); }
  }
  return <form ref={ref} className="upload-form" onSubmit={submit}>
    <label htmlFor="document-type">{t.type}</label>
    <select id="document-type" name="documentType" required defaultValue=""><option value="" disabled>{t.chooseType}</option>{DOCUMENT_TYPES.map((type) => <option key={type} value={type}>{documentLabel(type, locale)}</option>)}</select>
    <label htmlFor="report-language">{t.reportLanguage}</label>
    <select id="report-language" name="reportLanguage" defaultValue={locale}><option value="vi">Tiếng Việt / Vietnamese</option><option value="de">Deutsch / German</option><option value="en">English</option></select>
    <label htmlFor="file">{t.chooseFile}</label>
    <div className="file-input-wrap"><input id="file" name="file" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required /><span className="file-hint">Up to 10 MB</span></div>
    <div className="privacy-box"><strong>{t.before}</strong><p>{t.privacyBody} {locale === 'vi' ? 'Chỉ bạn và người đánh giá được ủy quyền mới có thể truy cập.' : locale === 'de' ? 'Nur Sie und autorisierte Prüfende können darauf zugreifen.' : 'Only you and authorised reviewers can access it.'}</p><a href="/privacy">{t.privacyLink}</a></div>
    <label className="consent"><input type="checkbox" name="authorized" value="true" required /><span>{t.consent}</span></label>
    <button className="primary-button" type="submit" disabled={busy}>{busy ? t.uploading : t.upload} <span aria-hidden="true">→</span></button>
    <p className="form-status" aria-live="polite" data-error={error}>{message}</p>
    <p className="format-note">{t.unsupported}</p>
  </form>;
}
