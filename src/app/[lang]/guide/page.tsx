import { Suspense } from "react";
import GuideClient from "./GuideClient";
import GuideHero from "@/components/GuideHero";
import { getGuidePageData } from "@/lib/server-data";
import { getSEO, guideSEO, getHreflangAlternates, baseUrl, defaultOgImage } from "@/lib/seo-config";
import { getServerTranslations } from "@/lib/server-i18n";
import { LANGUAGES } from "@/lib/static-params";

export function generateStaticParams() {
  return LANGUAGES.map(lang => ({ lang }));
}

export const revalidate = false;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(guideSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/guide`,
      languages: getHreflangAlternates('/guide'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/guide`,
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

// Data fetcher component - loads in parallel with static sections
async function GuideData({ lang }: { lang: string }) {
  let initialData = null;

  try {
    initialData = await getGuidePageData(lang);
  } catch (e) {
    console.error('Failed to fetch guide data:', e);
  }

  return <GuideClient initialData={initialData ?? undefined} skipHero />;
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  // Get translations for static SSR hero section - reads from local JSON, instant
  const t = getServerTranslations(lang, [
    'guide.hero.title',
    'guide.hero.subtitle',
    'guide.hero.desc',
    'guide.toolbox.title',
    'guide.toolbox.desc',
  ]);

  // Fallback values if translations are missing
  const isZh = lang === 'zh' || lang === 'cn';
  const badge = isZh ? '旅行必备指南' : 'Essential Travel Guide';
  const title = t['guide.hero.title'] || (isZh ? '旅行锦囊' : 'Travel Guide');
  const subtitle = t['guide.hero.subtitle'] || (isZh ? '中国旅行必备生存工具' : 'China Travel Survival Kit');
  const description = t['guide.hero.desc'] || (isZh ? '从网络连接到文化礼仪，一站式解决你的中国之行' : 'From internet to etiquette, everything you need for China');
  const scrollHint = isZh ? '向下滚动了解更多' : 'Scroll for more';
  const digitalTitle = t['guide.toolbox.title'] || (isZh ? '数字生存工具包' : 'Digital Survival Kit');
  const digitalSubtitle = t['guide.toolbox.desc'] || (isZh ? '网络连接与移动支付的必备指南' : 'Essential guide for internet and mobile payments');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero & Digital Section Header - SSR, no JS dependency, instant */}
      <GuideHero
        badge={badge}
        title={title}
        subtitle={subtitle}
        description={description}
        scrollHint={scrollHint}
        digitalTitle={digitalTitle}
        digitalSubtitle={digitalSubtitle}
      />

      {/* Guide content - streams in after data is ready */}
      <Suspense fallback={
        <div className="max-w-6xl mx-auto px-4 md:px-6 pb-12 space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-5 animate-pulse">
              <div className="bg-gray-200 rounded-lg p-4 h-24" />
              <div className="bg-gray-200 rounded-lg p-4 h-32" />
              <div className="bg-gray-200 rounded-lg p-4 h-48" />
            </div>
            <div className="space-y-5 animate-pulse">
              <div className="bg-gray-200 rounded-lg p-4 h-24" />
              <div className="bg-gray-200 rounded-lg p-4 h-32" />
              <div className="bg-gray-200 rounded-lg p-4 h-48" />
            </div>
          </div>
          <div className="animate-pulse">
            <div className="bg-gray-200 rounded-lg p-4 h-64" />
          </div>
        </div>
      }>
        <GuideData lang={lang} />
      </Suspense>
    </div>
  );
}
