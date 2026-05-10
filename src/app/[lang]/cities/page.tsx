import { Suspense } from "react";
import CitiesClient from "./CitiesClient";
import CitiesHero from "@/components/CitiesHero";
import { getCitiesListData } from "@/lib/server-data";
import { getSEO, citiesSEO, getHreflangAlternates, baseUrl, defaultOgImage } from "@/lib/seo-config";
import { getServerTranslations } from "@/lib/server-i18n";
import { LANGUAGES } from "@/lib/static-params";

export function generateStaticParams() {
  return LANGUAGES.map(lang => ({ lang }));
}

export const revalidate = false;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(citiesSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/cities`,
      languages: getHreflangAlternates('/cities'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/cities`,
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
async function CitiesData() {
  let initialData = null;
  try {
    initialData = await getCitiesListData();
  } catch (e) {
    console.error('Failed to fetch cities data:', e);
  }

  return <CitiesClient initialData={initialData ?? undefined} skipStaticSections />;
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  // Get translations for static SSR hero section - reads from local JSON, instant
  const t = getServerTranslations(lang, [
    'cities.hero.title',
    'cities.hero.desc',
    'cities.intro.title',
    'cities.intro.p1',
    'cities.intro.p2',
    'cities.intro.p3',
    'cities.intro.p4',
    'cities.intro.p5',
    'cities.intro.p6',
  ]);

  return (
    <div className="w-full bg-[#f9f9f9] pb-20">
      {/* Hero & Intro - SSR, no JS dependency, instant */}
      <CitiesHero
        title={t['cities.hero.title']}
        desc={t['cities.hero.desc']}
        introTitle={t['cities.intro.title']}
        introP1={t['cities.intro.p1']}
        introP2={t['cities.intro.p2']}
        introP3={t['cities.intro.p3']}
        introP4={t['cities.intro.p4']}
        introP5={t['cities.intro.p5']}
        introP6={t['cities.intro.p6']}
      />

      {/* City grid - streams in after data is ready */}
      <Suspense fallback={
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1,2,3,4,5,6,7,8,9].map(i => (
              <div key={i} className="bg-white rounded-md border border-gray-100 overflow-hidden h-[300px] flex flex-col shadow-sm">
                <div className="bg-gray-200 h-[240px] w-full" />
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-center">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }>
        <CitiesData />
      </Suspense>
    </div>
  );
}
