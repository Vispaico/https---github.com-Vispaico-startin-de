import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../styles.css';

export const metadata: Metadata = {
  title: 'STARTIN-DE — Your future in Germany starts here',
  description: 'Explore pathways and prepare practical next steps for Germany.',
};

export default function RedirectLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
