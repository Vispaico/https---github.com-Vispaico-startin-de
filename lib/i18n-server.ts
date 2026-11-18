import { cookies } from 'next/headers';
import { locales, type Locale } from './i18n';

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get('startinde_lang')?.value;
  return locales.includes(value as Locale) ? value as Locale : 'vi';
}
