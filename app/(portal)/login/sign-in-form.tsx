'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { copy, type Locale } from '@/lib/i18n';
import type { FormEvent } from 'react';

export default function SignInForm({ locale, nextPath }: { locale: Locale; nextPath: string }) {
  const t = copy[locale];
  const router = useRouter(); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('');
    const values = new FormData(event.currentTarget);
    const body: Record<string, string> = {};
    values.forEach((value, key) => { body[key] = String(value); });
    const response = await fetch('/api/auth/sign-in', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const result = await response.json();
    if (!response.ok) { setError(result.error || 'Sign in could not be completed.'); setBusy(false); return; }
    router.push(nextPath); router.refresh();
  }
  return <form className="upload-form" onSubmit={submit}><label htmlFor="email">{t.email}</label><input id="email" name="email" type="email" autoComplete="username" required /><label htmlFor="password">{t.password}</label><input id="password" name="password" type="password" autoComplete="current-password" required /><button className="primary-button" disabled={busy}>{busy ? t.signingIn : t.signIn} <span aria-hidden="true">→</span></button><p className="form-status" aria-live="polite" data-error="true">{error}</p></form>;
}
