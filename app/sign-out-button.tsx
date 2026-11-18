'use client';
import { useRouter } from 'next/navigation';
export default function SignOutButton({ label }: { label: string }) {
  const router = useRouter();
  async function signOut() { await fetch('/api/auth/sign-out', { method: 'POST' }); router.push('/login'); router.refresh(); }
  return <button className="nav-button" type="button" onClick={signOut}>{label}</button>;
}
