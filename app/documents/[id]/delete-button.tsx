'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter(); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function remove() {
    if (!window.confirm('Delete this document and its private file? This cannot be undone.')) return;
    setBusy(true); const response = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
    if (!response.ok) { const body = await response.json(); setError(body.error || 'Delete failed.'); setBusy(false); return; }
    router.push('/'); router.refresh();
  }
  return <div className="delete-area"><button className="danger-button" onClick={remove} disabled={busy}>{busy ? 'Deleting…' : 'Delete document'}</button><p aria-live="polite">{error}</p></div>;
}
