import CharacterCounter from "@/app-views/tools/CharacterCounter";
import { getHreflangAlternates, baseUrl, getSEO, characterCounterSEO, defaultOgImage } from "@/lib/seo-config";
import { getServerTranslations } from "@/lib/server-i18n";

export const revalidate = false;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(characterCounterSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/tools/character-counter`,
      languages: getHreflangAlternates('/tools/character-counter'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/tools/character-counter`,
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

  const t = getServerTranslations(lang, [
    'tools.char.title',
    'tools.char.desc',
    'tools.char.total',
    'tools.char.zh',
    'tools.char.en',
    'tools.char.digits',
    'tools.char.punc',
    'tools.char.lines',
    'tools.char.placeholder',
    'tools.char.copy',
    'tools.char.clear',
    'tools.char.copied',
    // Guide
    'tools.char.guide.welcomeTitle',
    'tools.char.guide.welcomeDesc',
    'tools.char.guide.statTotal',
    'tools.char.guide.statChinese',
    'tools.char.guide.statEnglish',
    'tools.char.guide.statDigits',
    'tools.char.guide.statPunc',
    'tools.char.guide.statLines',
    'tools.char.guide.copyHint',
    'tools.char.guide.hanziTitle',
    'tools.char.guide.hanziDesc',
    'tools.char.guide.structureTitle',
    'tools.char.guide.structureDesc',
    'tools.char.guide.structureDesc2',
    'tools.char.guide.meaningTitle',
    'tools.char.guide.meaningDesc',
    'tools.char.guide.meaningDesc2',
    'tools.char.guide.pinyinTitle',
    'tools.char.guide.pinyinDesc',
    'tools.char.guide.pinyinDesc2',
    'tools.char.guide.footer',
  ]);

  return <CharacterCounter translations={t} />;
}
