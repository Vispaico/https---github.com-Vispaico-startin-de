'use client';
import { useState } from 'react';
export default function RequestReview({ documentId }: { documentId: string }) {
  const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  async function requestReview() {
    setBusy(true); setMessage('');
    const response = await fetch(`/api/documents/${documentId}/review`, { method: 'POST' });
    const result = await response.json(); setBusy(false);
    setMessage(response.ok ? 'Your request has been added to the advisor queue.' : result.error || 'The request could not be saved.');
  }
  return <div className="request-review"><button className="secondary-button" disabled={busy} onClick={requestReview}>{busy ? 'Sending…' : 'Request human review'}</button><p aria-live="polite">{message}</p></div>;
}
