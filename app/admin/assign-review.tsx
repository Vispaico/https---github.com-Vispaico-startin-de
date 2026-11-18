'use client';
import { useState } from 'react';
type Advisor = { id: string; email: string };
export default function AssignReview({ documentId, advisors }: { documentId: string; advisors: Advisor[] }) {
  const [advisorId, setAdvisorId] = useState(advisors[0]?.id || ''); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  async function assign() {
    setBusy(true); setMessage('');
    const response = await fetch(`/api/admin/documents/${documentId}/assign-review`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ advisorId }) });
    const result = await response.json(); setBusy(false); setMessage(response.ok ? 'Assigned' : result.error || 'Assignment failed');
  }
  if (!advisors.length) return <span className="small-note">No advisor account configured</span>;
  return <div className="assign-review"><select aria-label="Choose advisor" value={advisorId} onChange={(event) => setAdvisorId(event.target.value)}>{advisors.map((advisor) => <option key={advisor.id} value={advisor.id}>{advisor.email}</option>)}</select><button className="secondary-button" disabled={busy} onClick={assign}>{busy ? 'Saving…' : 'Assign'}</button><small aria-live="polite">{message}</small></div>;
}
