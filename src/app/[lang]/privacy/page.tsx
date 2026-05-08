import { LANGUAGES } from "@/lib/static-params";
import { getPageSections } from "@/lib/server-data";
import PrivacyClient from "./PrivacyClient";

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

const langMap: Record<string, string> = {
  cn: 'zh', tw: 'tw', en: 'en', ja: 'ja', ko: 'ko',
  ru: 'ru', fr: 'fr', es: 'es', de: 'de', it: 'it'
};

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const sections = await getPageSections('privacy_policy');
  const language = langMap[lang] || 'en';
  return <PrivacyClient initialData={sections} lang={language} />;
}
