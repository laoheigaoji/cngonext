import CitiesHero from "@/components/CitiesHero";
import { getCitiesListData } from "@/lib/server-data";
import { getSEO, citiesSEO, getHreflangAlternates, baseUrl, defaultOgImage } from "@/lib/seo-config";
import { getServerTranslations } from "@/lib/server-i18n";
import { LANGUAGES } from "@/lib/static-params";
import CitiesClient from "./CitiesClient";

export function generateStaticParams() {
  return LANGUAGES.map(lang => ({ lang }));
}

export const revalidate = 3600;

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

export default async function Page({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ q?: string }> }) {
  const { lang } = await params;
  const { q } = await searchParams;
  const langPrefix = lang === 'zh' ? 'cn' : lang;

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
    'city.stats.wantToVisit',
    'city.stats.recommended',
  ]);

  let cities: any[] = [];
  try {
    cities = await getCitiesListData();
  } catch (e) {
    console.error('Failed to fetch cities data:', e);
  }

  return (
    <div className="w-full bg-[#f9f9f9] pb-20">
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

      <CitiesClient cities={cities} lang={lang} t={t} initialQuery={q || ''} />
    </div>
  );
}
