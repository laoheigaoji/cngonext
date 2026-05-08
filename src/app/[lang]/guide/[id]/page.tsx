import { LANGUAGES, GUIDE_IDS } from "@/lib/static-params";
import { getGuideDetailData, getTranslations } from "@/lib/server-data";
import GuideDetailClient from "./GuideDetailClient";

export const dynamicParams = true;
export const dynamic = "force-static";

export function generateStaticParams() {
  return LANGUAGES.flatMap((lang) =>
    GUIDE_IDS.map((id) => ({ lang, id }))
  );
}

export default async function Page({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  const [guideData, translations] = await Promise.all([
    getGuideDetailData(id, lang),
    getTranslations(lang, ['guide', 'vpn', 'payment', 'dining', 'gifts', 'social']),
  ]);
  return <GuideDetailClient initialData={guideData} initialTranslations={translations} />;
}
