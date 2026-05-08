import GuideDetailClient from "./GuideDetailClient";
import { getGuideDetailData, getTranslations } from "@/lib/server-data";
import { getSEO, guideSEO, getHreflangAlternates, baseUrl } from "@/lib/seo-config";

const guideTitles: Record<string, Record<string, string>> = {
  vpn: { cn: 'VPN使用指南', en: 'VPN Guide', ja: 'VPNガイド', ko: 'VPN 가이드' },
  payment: { cn: '移动支付指南', en: 'Mobile Payment Guide', ja: 'モバイル決済ガイド', ko: '모바일 결제 가이드' },
  dining: { cn: '中国饮食文化', en: 'Chinese Dining Culture', ja: '中国食文化', ko: '중국 식문화' },
  gifts: { cn: '中国礼物指南', en: 'Gift Guide', ja: 'ギフトガイド', ko: '선물 가이드' },
  social: { cn: '中国社交礼仪', en: 'Social Etiquette', ja: '社交マナー', ko: '사회 에티켓' },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  const guideName = guideTitles[id]?.[lang] || guideTitles[id]?.['en'] || id;
  const seo = getSEO(guideSEO, lang);
  const title = `${guideName} - tripcngo.com`;

  return {
    title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/guide/${id}`,
      languages: getHreflangAlternates(`/guide/${id}`),
    },
    openGraph: {
      title,
      description: seo.description,
      url: `${baseUrl}/${lang}/guide/${id}`,
      siteName: 'tripcngo.com',
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  let initialData = null;
  let initialTranslations = null;

  try {
    const [data, translations] = await Promise.all([
      getGuideDetailData(id, lang),
      getTranslations(lang, ['guide', 'common']),
    ]);
    initialData = data;
    initialTranslations = translations;
  } catch (e) {
    console.error('Failed to fetch guide detail data:', e);
  }

  return (
    <GuideDetailClient
      initialData={initialData ?? undefined}
      initialTranslations={initialTranslations ?? undefined}
    />
  );
}
