'use client';
import { useRouter } from 'next/navigation';
import type { ChangeEvent } from 'react';
export default function LanguageSwitcher({ locale }: { locale: string }) {
  const router = useRouter();
  async function change(event: ChangeEvent<HTMLSelectElement>) {
    const response = await fetch('/api/language', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale: event.target.value }) });
    if (response.ok) router.refresh();
  }
  return <label className="language-select"><span className="sr-only">Interface language</span><select aria-label="Interface language" value={locale} onChange={change}><option value="vi">VI</option><option value="de">DE</option><option value="en">EN</option></select></label>;
}
