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

// 100% static: all data + all HTML rendered at build time, zero client JS needed
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
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

      {/* City grid - all rendered server-side, no pagination, no client JS */}
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <a
              key={city.id}
              href={`/${langPrefix}/cities/${city.id}`}
              className="relative group rounded-md overflow-hidden bg-white border border-gray-100 shadow-sm transition-all duration-300 block"
            >
              <div className="relative h-[240px] md:h-[260px] overflow-hidden cursor-pointer">
                <img
                  src={city.listCover || city.heroImage || city.img}
                  alt={lang === 'zh' ? `${city.name}旅游攻略` : `Travel guide for ${city.enName || city.id}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
              </div>
              <div className="p-4 flex items-center justify-between bg-white border-t border-gray-100">
                <div>
                  <span className="text-[15px] font-bold text-gray-900">
                    {lang === 'zh' ? city.name : city.enName || city.id.charAt(0).toUpperCase() + city.id.slice(1)}
                  </span>
                </div>
                <div className="flex gap-2 text-gray-500">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-gray-50 rounded-full border border-gray-100 whitespace-nowrap">
                    <svg className="w-3.5 h-3.5 text-red-500 fill-red-500" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    {(city.stats && city.stats.wantToVisit) || 0} {t['city.stats.wantToVisit']}
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-gray-50 rounded-full border border-gray-100 whitespace-nowrap">
                    <svg className="w-3.5 h-3.5 text-green-500 fill-green-500" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                    {(city.stats && city.stats.recommended) || 0} {t['city.stats.recommended']}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
