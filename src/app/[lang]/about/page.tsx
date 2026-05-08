import { LANGUAGES } from "@/lib/static-params";
import { getPageSections } from "@/lib/server-data";
import AboutUsClient from "./AboutUsClient";

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export const dynamic = "force-static";

const langMap: Record<string, string> = {
  cn: 'zh', tw: 'tw', en: 'en', ja: 'ja', ko: 'ko',
  ru: 'ru', fr: 'fr', es: 'es', de: 'de', it: 'it'
};

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const sections = await getPageSections('about_us');
  const language = langMap[lang] || 'en';
  return <AboutUsClient initialData={sections} lang={language} />;
}
