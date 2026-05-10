import { Suspense } from "react";
import Home from "@/app-views/Home";
import HomeHero from "@/components/HomeHero";
import HomeVisa from "@/components/HomeVisa";
import { getSEO, homeSEO, getHreflangAlternates, baseUrl, generateWebsiteJsonLd, generateOrganizationJsonLd, defaultOgImage, getOgLocale } from "@/lib/seo-config";
import { getHomeData } from "@/lib/server-data";
import { getServerTranslations } from "@/lib/server-i18n";

// Permanent cache - only revalidate on-demand via /api/revalidate
export const revalidate = false;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(homeSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: getHreflangAlternates(''),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}`,
      siteName: 'tripcngo.com',
      type: 'website',
      locale: getOgLocale(lang),
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
async function HomeData({ lang }: { lang: string }) {
  let initialData = null;
  try {
    initialData = await getHomeData();
  } catch (e) {
    console.error('Failed to fetch home data:', e);
  }

  return <Home initialData={initialData ?? undefined} skipStaticSections />;
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const websiteJsonLd = generateWebsiteJsonLd(lang);
  const orgJsonLd = generateOrganizationJsonLd();

  // Get translations for static SSR sections (Hero + Visa) - reads from local JSON, instant
  const t = getServerTranslations(lang, [
    'hero.ultimate',
    'hero.desc',
    'hero.dest',
    'hero.aiName',
    'hero.searchPlaceholder',
    'hero.start',
    'visa.section.title',
    'visa.section.desc',
    'visa.stat.countries.title',
    'visa.stat.countries.desc',
    'visa.stat.stay.title',
    'visa.stat.stay.desc',
    'visa.stat.provinces.title',
    'visa.stat.provinces.desc',
    'visa.stat.ports.title',
    'visa.stat.ports.desc',
  ]);

  const langPrefix = lang === 'cn' ? 'cn' : lang;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <div className="w-full bg-[#f7f7f7]">
        {/* Hero - SSR, no JS dependency, instant */}
        <HomeHero
          title={t['hero.ultimate']}
          desc={t['hero.desc']}
          dest={t['hero.dest']}
          aiName={t['hero.aiName']}
          searchPlaceholder={t['hero.searchPlaceholder']}
          start={t['hero.start']}
          langPrefix={langPrefix}
        />

        {/* Visa Section - SSR, no JS dependency, instant */}
        <HomeVisa
          title={t['visa.section.title']}
          desc={t['visa.section.desc']}
          countries={t['visa.stat.countries.title']}
          countriesDesc={t['visa.stat.countries.desc']}
          stay={t['visa.stat.stay.title']}
          stayDesc={t['visa.stat.stay.desc']}
          provinces={t['visa.stat.provinces.title']}
          provincesDesc={t['visa.stat.provinces.desc']}
          ports={t['visa.stat.ports.title']}
          portsDesc={t['visa.stat.ports.desc']}
        />

        {/* Client-side data-dependent sections - streams in after data is ready */}
        <Suspense fallback={
          <>
            {/* Popular Cities Skeleton */}
            <section className="py-20 bg-white">
              <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex flex-col items-center justify-center mb-8 text-center">
                  <div className="h-9 bg-gray-200 rounded w-48 mb-3" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden h-[300px] flex flex-col shadow-sm">
                      <div className="bg-gray-200 h-[220px] w-full" />
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-center">
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        }>
          <HomeData lang={lang} />
        </Suspense>
      </div>
    </>
  );
}
