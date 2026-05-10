import { Suspense } from "react";
import HomeHero from "@/components/HomeHero";
import HomeVisa from "@/components/HomeVisa";
import { getSEO, homeSEO, getHreflangAlternates, baseUrl, generateWebsiteJsonLd, generateOrganizationJsonLd, defaultOgImage, getOgLocale } from "@/lib/seo-config";
import { getHomeData } from "@/lib/server-data";
import { getServerTranslations } from "@/lib/server-i18n";
import { LANGUAGES } from "@/lib/static-params";


export function generateStaticParams() {
  return LANGUAGES.map(lang => ({ lang }));
}

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

const getI18n = (item: any, baseField: string, lang: string) => {
  if (!item) return '';
  if (lang === 'zh' || lang === 'cn') {
    return item[baseField] || '';
  }
  const snakeFieldName = `${baseField}_${lang}`;
  const camelFieldName = `${baseField}${lang.charAt(0).toUpperCase() + lang.slice(1)}`;
  return item[snakeFieldName] || item[camelFieldName] || item[`${baseField}En`] || item[`${baseField}_en`] || '';
};

// 100% static home page: all data + HTML rendered at build time
export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const langPrefix = lang === 'cn' ? 'cn' : lang;
  const websiteJsonLd = generateWebsiteJsonLd(lang);
  const orgJsonLd = generateOrganizationJsonLd();

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
    'home.cities.title',
    'home.cities.more',
    'home.guides.title',
    'home.guides.more',
    'home.guides.helpful',
    'home.faq.title',
    'home.faq.subtitle',
    'city.stats.wantToVisit',
    'city.stats.recommended',
  ]);

  // Fetch all data at build time
  let homeData: { articles: any[]; cities: any[]; faqs: any[] } = { articles: [], cities: [], faqs: [] };
  try {
    homeData = await getHomeData();
  } catch (e) {
    console.error('Failed to fetch home data:', e);
  }

  const { articles, cities, faqs } = homeData;

  // FAQ localization helper
  const getFaqContent = (faq: any) => {
    if ('q_zh' in faq) {
      const langMap: Record<string, string> = { 'cn': 'zh', 'zh': 'zh' };
      const l = langMap[lang] || lang;
      const q = faq[`q_${l}`] || faq.q_en || '';
      const a = faq[`a_${l}`] || faq.a_en || '';
      return { q, a };
    }
    // Fallback FAQ format
    const isZh = lang === 'zh' || lang === 'cn';
    return { q: isZh ? faq.q : faq.enQ, a: isZh ? faq.a : faq.enA };
  };

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
        {/* Hero - SSR */}
        <HomeHero
          title={t['hero.ultimate']}
          desc={t['hero.desc']}
          dest={t['hero.dest']}
          aiName={t['hero.aiName']}
          searchPlaceholder={t['hero.searchPlaceholder']}
          start={t['hero.start']}
          langPrefix={langPrefix}
        />

        {/* Visa Section - SSR */}
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

        {/* Popular Cities - SSR, only "want to visit" button is interactive */}
        <section className="py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex flex-col items-center justify-center mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{t['home.cities.title']}</h2>
              <a href={`/${langPrefix}/cities`} className="text-[#1b887a] text-sm font-medium hover:underline">
                {t['home.cities.more']}
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities.slice(0, 6).map((city: any) => (
                <a
                  key={city.id}
                  href={`/${langPrefix}/cities/${city.id}`}
                  className="relative group rounded-xl overflow-hidden cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-all duration-300 block"
                >
                  <div className="relative h-[240px] md:h-[260px]">
                    <img
                      src={city.listCover || city.heroImage || city.img}
                      alt={lang === 'cn' ? city.name : city.enName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  </div>
                  <div className="p-4 flex items-center justify-between bg-white border-t border-gray-100">
                    <div>
                      <span className="text-[15px] font-bold text-gray-900">
                        {lang === 'cn' ? city.name : (city.enName || city.name)}
                      </span>
                      <span className="ml-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                        {city.enName || city.name}
                      </span>
                    </div>
                    <div className="flex gap-3 text-gray-500">
                      <span className="flex items-center gap-1 text-xs font-medium">
                        <svg className="w-3.5 h-3.5 text-red-500 fill-red-500" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        {city.stats?.wantToVisit || 0}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium">
                        <svg className="w-3.5 h-3.5 text-[#1b887a] fill-[#1b887a]" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                        {city.stats?.recommended || 0}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Wandering Guides - SSR */}
        <section className="py-20 max-w-[1400px] mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl font-bold text-gray-900">{t['home.guides.title']}</h2>
            <a href={`/${langPrefix}/articles`} className="text-[#1b887a] text-sm font-medium hover:underline">
              {t['home.guides.more']}
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8">
            {articles.map((article: any) => (
              <a
                key={article.id}
                href={`/${langPrefix}/articles/${article.id}`}
                className="flex flex-col sm:flex-row gap-5 bg-transparent cursor-pointer group"
              >
                <div className="w-full sm:w-[200px] h-[140px] overflow-hidden rounded-md flex-shrink-0 shadow-sm border border-gray-200">
                  <img
                    src={article.thumbnail || ''}
                    alt={getI18n(article, 'title', lang) || article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col py-1">
                  <h3 className="text-[17px] font-bold text-gray-900 leading-snug group-hover:text-[#1b887a] transition-colors mb-2 line-clamp-2">
                    {getI18n(article, 'title', lang) || article.title}
                  </h3>
                  <p className="text-gray-500 text-[13px] line-clamp-3 mb-3 leading-relaxed">
                    {getI18n(article, 'subtitle', lang) || article.subtitle}
                  </p>
                  {article.views !== undefined && (
                    <div className="mt-auto text-xs flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-red-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                      <span className="text-red-500 font-medium">{article.views}</span>
                      <span className="text-gray-500">{t['home.guides.helpful']}</span>
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* FAQ - SSR with client-side accordion */}
        <section className="py-20 bg-[#f7f7f7]">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">{t['home.faq.title']}</h2>
            <p className="text-gray-500 text-center mb-10">{t['home.faq.subtitle']}</p>
            <div className="space-y-4">
              {faqs.map((faq: any, i: number) => {
                const { q, a } = getFaqContent(faq);
                return (
                  <details key={i} className="group bg-white rounded-md overflow-hidden shadow-sm border border-gray-100">
                    <summary className="px-6 py-5 flex justify-between items-center text-gray-900 font-bold hover:bg-gray-50 transition-colors border-b border-gray-100/50 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                      <div className="flex gap-4">
                        <span className="text-[#1b887a]">{i + 1}.</span>
                        <span>{q}</span>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-12 py-5 bg-white text-gray-600 leading-relaxed border-t border-gray-50">
                      {a}
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
