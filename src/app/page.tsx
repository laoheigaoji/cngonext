import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

function detectBrowserLanguage(acceptLanguage: string): string {
  if (!acceptLanguage) return 'en';
  const lang = acceptLanguage.toLowerCase();
  if (lang.includes('zh-tw') || lang.includes('zh-hant') || lang.includes('zh-hk')) return 'tw';
  if (lang.includes('zh')) return 'cn';
  if (lang.startsWith('ja')) return 'ja';
  if (lang.startsWith('ko')) return 'ko';
  if (lang.startsWith('ru')) return 'ru';
  if (lang.startsWith('fr')) return 'fr';
  if (lang.startsWith('es')) return 'es';
  if (lang.startsWith('de')) return 'de';
  if (lang.startsWith('it')) return 'it';
  return 'en';
}

export default async function RootPage() {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  const lang = detectBrowserLanguage(acceptLanguage);
  redirect(`/${lang}`);
}
