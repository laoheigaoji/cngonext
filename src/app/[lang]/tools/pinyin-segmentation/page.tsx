import PinyinSegmentation from "@/app-views/tools/PinyinSegmentation";
import { getHreflangAlternates, baseUrl } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return {
    title: 'Pinyin Segmentation Tool - tripcngo.com',
    description: 'Segment continuous pinyin into individual words. Useful for learning Chinese pronunciation and converting pinyin to Chinese characters.',
    alternates: {
      canonical: `${baseUrl}/${lang}/tools/pinyin-segmentation`,
      languages: getHreflangAlternates('/tools/pinyin-segmentation'),
    },
  };
}

export default function Page() {
  return <PinyinSegmentation />;
}
