'use client';
import { useState } from 'react';
export default function ApproveFeedback({ reportId }: { reportId: string }) {
  const [feedback, setFeedback] = useState(''); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  async function approve() {
    setBusy(true); setMessage('');
    const response = await fetch(`/api/admin/reports/${reportId}/approve`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ candidateVisibleFeedback: feedback }) });
    const result = await response.json(); setBusy(false); setMessage(response.ok ? 'Candidate feedback was approved and saved.' : result.error || 'Could not save feedback.');
  }
  return <div className="approve-feedback"><label htmlFor="feedback">Candidate-visible advisor feedback</label><textarea id="feedback" rows={6} maxLength={4000} value={feedback} onChange={(event) => setFeedback(event.target.value)} /><button className="primary-button" disabled={busy || !feedback.trim()} onClick={approve}>{busy ? 'Saving…' : 'Approve and send feedback'}</button><p aria-live="polite">{message}</p></div>;
}
