import { LANGUAGES } from "@/lib/static-params";
import { getPageSections } from "@/lib/server-data";
import TermsClient from "./TermsClient";

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

const langMap: Record<string, string> = {
  cn: 'zh', tw: 'tw', en: 'en', ja: 'ja', ko: 'ko',
  ru: 'ru', fr: 'fr', es: 'es', de: 'de', it: 'it'
};

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const sections = await getPageSections('terms_of_service');
  const language = langMap[lang] || 'en';
  return <TermsClient initialData={sections} lang={language} />;
}
