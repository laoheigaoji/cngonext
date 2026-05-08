import { LANGUAGES } from "@/lib/static-params";
import { getGuidePageData, getTranslations } from "@/lib/server-data";
import GuideClient from "./GuideClient";

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const [guideData, translations] = await Promise.all([
    getGuidePageData(lang),
    getTranslations(lang, ['guide', 'vpn', 'payment', 'dining', 'gifts', 'social']),
  ]);
  return <GuideClient initialData={guideData} initialTranslations={translations} />;
}
