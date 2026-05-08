import PinyinSegmentation from "@/app-views/tools/PinyinSegmentation";
import { getHreflangAlternates, baseUrl, getSEO, pinyinSEO } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(pinyinSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/tools/pinyin-segmentation`,
      languages: getHreflangAlternates('/tools/pinyin-segmentation'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/tools/pinyin-segmentation`,
      siteName: 'tripcngo.com',
    },
  };
}

export default function Page() {
  return <PinyinSegmentation />;
}
