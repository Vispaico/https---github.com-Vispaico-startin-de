'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { copy, type Locale } from '@/lib/i18n';
import type { FormEvent } from 'react';

export default function SignUpForm({ locale, nextPath }: { locale: Locale; nextPath: string }) {
  const t = copy[locale];
  const router = useRouter();
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    const values = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.get('email'), password: values.get('password') }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t.signupUnavailable);
      if (result.confirmationRequired) { setNotice(t.checkEmail); setBusy(false); return; }
      router.push(nextPath); router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t.signupUnavailable);
      setBusy(false);
    }
  }

  return <form className="upload-form" onSubmit={submit}>
    <label htmlFor="email">{t.email}</label>
    <input id="email" name="email" type="email" autoComplete="email" maxLength={254} required />
    <label htmlFor="password">{t.password}</label>
    <input id="password" name="password" type="password" autoComplete="new-password" minLength={12} maxLength={1024} required />
    <p className="format-note">{t.passwordHint}</p>
    <button className="primary-button" disabled={busy}>{busy ? t.creatingAccount : t.signUp}<span aria-hidden="true">→</span></button>
    <p className="form-status" aria-live="polite" data-error="true">{error}</p>
    <p className="form-status" aria-live="polite">{notice}</p>
  </form>;
}
