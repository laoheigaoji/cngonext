import PinyinSegmentation from "@/app-views/tools/PinyinSegmentation";
import PinyinHero from "@/components/PinyinHero";
import { getHreflangAlternates, baseUrl, getSEO, pinyinSEO, defaultOgImage } from "@/lib/seo-config";
import { getServerTranslations } from "@/lib/server-i18n";

export const revalidate = false;

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
      images: [{ url: defaultOgImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [defaultOgImage],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  // Get ALL translations for pinyin tool from messages/xx.json - single source of truth
  const t = getServerTranslations(lang, [
    // Hero
    'tools.pinyin.guide.heroTitle',
    'tools.pinyin.guide.heroDesc',
    // Tool UI
    'tools.pinyin.inputPlaceholder',
    'tools.pinyin.button',
    'tools.pinyin.result',
    // Features
    'tools.pinyin.guide.featuresTitle',
    'tools.pinyin.guide.featurePinyin',
    'tools.pinyin.guide.featurePinyinDesc',
    'tools.pinyin.guide.featureSegment',
    'tools.pinyin.guide.featureSegmentDesc',
    'tools.pinyin.guide.featureStroke',
    'tools.pinyin.guide.featureStrokeDesc',
    'tools.pinyin.guide.featureTranslate',
    'tools.pinyin.guide.featureTranslateDesc',
    'tools.pinyin.guide.featureVoice',
    'tools.pinyin.guide.featureVoiceDesc',
    // Guide
    'tools.pinyin.guide.guideTitle',
    'tools.pinyin.guide.whatIsPinyin',
    'tools.pinyin.guide.whatIsPinyinDesc',
    'tools.pinyin.guide.toneMarks',
    'tools.pinyin.guide.toneIntro',
    'tools.pinyin.guide.toneCol',
    'tools.pinyin.guide.symbolCol',
    'tools.pinyin.guide.descCol',
    'tools.pinyin.guide.tone1',
    'tools.pinyin.guide.tone1Desc',
    'tools.pinyin.guide.tone2',
    'tools.pinyin.guide.tone2Desc',
    'tools.pinyin.guide.tone3',
    'tools.pinyin.guide.tone3Desc',
    'tools.pinyin.guide.tone4',
    'tools.pinyin.guide.tone4Desc',
    'tools.pinyin.guide.toneNeutral',
    'tools.pinyin.guide.toneNeutralDesc',
    'tools.pinyin.guide.howToUse',
    'tools.pinyin.guide.step1',
    'tools.pinyin.guide.step2',
    'tools.pinyin.guide.step3',
    'tools.pinyin.guide.step4',
    'tools.pinyin.guide.step5',
    'tools.pinyin.guide.segmentation',
    'tools.pinyin.guide.segmentDesc',
    'tools.pinyin.guide.segmentExample',
    'tools.pinyin.guide.segmentExampleDesc',
    'tools.pinyin.guide.strokeOrder',
    'tools.pinyin.guide.strokeDesc',
    'tools.pinyin.guide.strokeRule1',
    'tools.pinyin.guide.strokeRule2',
    'tools.pinyin.guide.strokeRule3',
    // FAQ
    'tools.pinyin.guide.faqTitle',
    'tools.pinyin.guide.faq1Q',
    'tools.pinyin.guide.faq1A',
    'tools.pinyin.guide.faq2Q',
    'tools.pinyin.guide.faq2A',
    'tools.pinyin.guide.faq3Q',
    'tools.pinyin.guide.faq3A',
    'tools.pinyin.guide.faq4Q',
    'tools.pinyin.guide.faq4A',
    'tools.pinyin.guide.faq5Q',
    'tools.pinyin.guide.faq5A',
  ]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Hero - SSR, no JS dependency, instant */}
      <PinyinHero
        title={t['tools.pinyin.guide.heroTitle']}
        desc={t['tools.pinyin.guide.heroDesc']}
      />

      {/* Client-side interactive tool - receives SSR translations from JSON */}
      <PinyinSegmentation skipHero translations={t} />
    </div>
  );
}
