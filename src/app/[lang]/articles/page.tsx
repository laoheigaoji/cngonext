import { Suspense } from "react";
import GuideListClient from "./GuideListClient";
import ArticlesHero from "@/components/ArticlesHero";
import { getArticlesListData } from "@/lib/server-data";
import { getSEO, articlesSEO, getHreflangAlternates, baseUrl, defaultOgImage } from "@/lib/seo-config";
import { getServerTranslations } from "@/lib/server-i18n";

export const revalidate = false;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(articlesSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/articles`,
      languages: getHreflangAlternates('/articles'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/articles`,
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

// Data fetcher component - loads in parallel with static hero
async function ArticlesData({ initialData }: { initialData?: any[] }) {
  return <GuideListClient initialData={initialData} skipHero />;
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  let initialData = null;

  try {
    initialData = await getArticlesListData();
  } catch (e) {
    console.error('Failed to fetch articles data:', e);
  }

  // Get translations for static SSR hero section
  const t = getServerTranslations(lang, [
    'guide.hero.title',
    'guide.hero.desc',
  ]);

  return (
    <div className="w-full bg-[#f7f7f7]">
      {/* Hero - SSR, no JS dependency, instant */}
      <ArticlesHero
        title={t['guide.hero.title']}
        desc={t['guide.hero.desc']}
      />

      {/* Client-side data-dependent sections - streams in after data is ready */}
      <Suspense fallback={
        <section className="max-w-[1400px] mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-[300px] shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-2 space-y-2">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
            <div className="flex-1 space-y-6">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row h-[220px] animate-pulse">
                  <div className="md:w-[340px] h-full bg-gray-200" />
                  <div className="flex-1 p-8 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-8 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      }>
        <ArticlesData initialData={initialData ?? undefined} />
      </Suspense>
    </div>
  );
}
