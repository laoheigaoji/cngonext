import CityDetailClient from "./CityDetailClient";
import { getHreflangAlternates, baseUrl, getSEO, citiesSEO, generateCityJsonLd, defaultOgImage } from "@/lib/seo-config";
import { getCityData } from "@/lib/server-data";
import { getServerTranslation } from "@/lib/server-i18n";
import { LANGUAGES, getCityIds } from "@/lib/static-params";

export async function generateStaticParams() {
  const cityIds = await getCityIds();
  return LANGUAGES.flatMap(lang => cityIds.map(id => ({ lang, id })));
}

export const revalidate = false;

function getLocalizedField(obj: any, field: string, lang: string): string {
  const langSuffixMap: Record<string, string> = {
    cn: '', tw: '_tw', en: '_en', ja: '_ja', ko: '_ko',
    ru: '_ru', fr: '_fr', es: '_es', de: '_de', it: '_it',
  };
  const suffix = langSuffixMap[lang] || '_en';
  if (suffix && obj?.[`${field}${suffix}`]) return obj[`${field}${suffix}`];
  if (obj?.[`${field}_en`]) return obj[`${field}_en`];
  return obj?.[field] || '';
}

function getI18nField(item: any, field: string, lang: string): string {
  if (!item) return '';
  if (lang === 'cn') return item[field] || '';
  // Check translations JSONB first
  if (item.translations?.[lang]?.[field]) return item.translations[lang][field];
  // Fallback to inline fields
  const langSuffixMap: Record<string, string> = {
    en: 'En', ja: 'Ja', ko: 'Ko', ru: 'Ru', fr: 'Fr', es: 'Es', de: 'De', tw: 'Tw', it: 'It',
  };
  const suffix = langSuffixMap[lang];
  if (suffix && item[`${field}${suffix}`]) return item[`${field}${suffix}`];
  return item[field] || '';
}

function getI18nArrayField(item: any, field: string, lang: string): string[] {
  if (!item) return [];
  if (lang === 'cn') return item[field] || [];
  // Check translations JSONB first
  if (item.translations?.[lang]?.[field]) return item.translations[lang][field];
  return item[field] || [];
}

function getI18nArrayItems(items: any[], field: string, lang: string): any[] {
  if (!items || !Array.isArray(items)) return [];
  if (lang === 'cn') return items;

  const langSuffixMap: Record<string, string> = {
    en: 'En', ja: 'Ja', ko: 'Ko', ru: 'Ru', fr: 'Fr', es: 'Es', de: 'De', tw: 'Tw', it: 'It',
  };
  const suffix = langSuffixMap[lang];

  return items.map((item: any) => {
    const translated: any = { ...item };
    const transData = item.translations?.[lang];
    if (transData) {
      Object.keys(transData).forEach(k => {
        if (transData[k] && typeof transData[k] === 'string') {
          translated[k] = transData[k];
        }
      });
    }
    if (suffix) {
      for (const [key, val] of Object.entries(item)) {
        if (key.endsWith(suffix) && typeof val === 'string') {
          const baseKey = key.slice(0, -suffix.length);
          if (baseKey) translated[baseKey] = val;
        }
      }
    }
    return translated;
  });
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  const fallback = getSEO(citiesSEO, lang);

  try {
    const city = await getCityData(id);
    if (city) {
      const name = getLocalizedField(city, 'name', lang);
      const desc = getLocalizedField(city, 'description', lang) || getLocalizedField(city, 'short_description', lang);
      const ogImage = city.image || city.heroImage || defaultOgImage;
      return {
        title: name ? `${name} ${fallback.title} - tripcngo.com` : fallback.title,
        description: desc || fallback.description,
        alternates: {
          canonical: `${baseUrl}/${lang}/cities/${id}`,
          languages: getHreflangAlternates(`/cities/${id}`),
        },
        openGraph: {
          title: name ? `${name} ${fallback.title}` : fallback.title,
          description: desc || fallback.description,
          url: `${baseUrl}/${lang}/cities/${id}`,
          images: [{ url: ogImage, width: 1200, height: 630 }],
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: name ? `${name} ${fallback.title}` : fallback.title,
          description: desc || fallback.description,
          images: [ogImage],
        },
      };
    }
  } catch (e) {
    console.error('Failed to fetch city metadata:', e);
  }

  return {
    title: fallback.title,
    description: fallback.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/cities/${id}`,
      languages: getHreflangAlternates(`/cities/${id}`),
    },
    openGraph: {
      title: fallback.title,
      description: fallback.description,
      images: [{ url: defaultOgImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fallback.title,
      description: fallback.description,
      images: [defaultOgImage],
    },
  };
}

export default async function CityDetailPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;

  let cityJsonLd = null;
  let cityData = null;
  try {
    const city = await getCityData(id);
    if (city) {
      cityJsonLd = generateCityJsonLd(city, lang);
      cityData = city;
    }
  } catch (e) {
    console.error('Failed to fetch city data:', e);
  }

  if (!cityData) {
    return (
      <>
        {cityJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(cityJsonLd) }}
          />
        )}
        <CityDetailClient initialData={cityData} />
      </>
    );
  }

  // Pre-render SEO-critical content on the server
  const cityName = getI18nField(cityData, 'name', lang) || cityData.name || '';
  const cityEnName = cityData.enName || '';
  const langPrefix = lang === 'zh' ? 'cn' : lang;
  const paragraphs = getI18nArrayField(cityData, 'paragraphs', lang);
  const attractions = getI18nArrayItems(cityData.attractions || [], 'attractions', lang);
  const history = getI18nArrayItems(cityData.history || [], 'history', lang);
  const food = getI18nArrayItems(cityData.food || [], 'food', lang);
  const worldHeritage = getI18nArrayItems(cityData.worldHeritage || [], 'worldHeritage', lang);
  const intangibleHeritage = getI18nArrayItems(cityData.intangibleHeritage || [], 'intangibleHeritage', lang);
  const transportation = getI18nArrayItems(cityData.transportation || [], 'transportation', lang);

  // Get translations for server-rendered UI
  const tBestTimeTitle = getServerTranslation(lang, 'city.bestTime.title');
  const tBestTimeDescPrefix = getServerTranslation(lang, 'city.bestTime.descPrefix');
  const tBestTimeDescSuffix = getServerTranslation(lang, 'city.bestTime.descSuffix');
  const tHistoryTitle = getServerTranslation(lang, 'city.history.title');
  const tAttractionsTitle = getServerTranslation(lang, 'city.attractions.title');
  const tAttractionsSubtitle = getServerTranslation(lang, 'city.attractions.subtitle');
  const tAttractionsTicket = getServerTranslation(lang, 'city.attractions.ticket');
  const tAttractionsSeason = getServerTranslation(lang, 'city.attractions.season');
  const tAttractionsTime = getServerTranslation(lang, 'city.attractions.time');
  const tHeritageWorldTitle = getServerTranslation(lang, 'city.heritage.world.title');
  const tHeritageWorldSubtitle = getServerTranslation(lang, 'city.heritage.world.subtitle');
  const tHeritageIntangibleTitle = getServerTranslation(lang, 'city.heritage.intangible.title');
  const tHeritageIntangibleSubtitle = getServerTranslation(lang, 'city.heritage.intangible.subtitle');
  const tTransportTitle = getServerTranslation(lang, 'city.transport.title');
  const tTransportSubtitle = getServerTranslation(lang, 'city.transport.subtitle');
  const tFoodTitle = getServerTranslation(lang, 'city.food.title');
  const tFoodSubtitle = getServerTranslation(lang, 'city.food.subtitle');
  const tFoodIngredients = getServerTranslation(lang, 'city.food.ingredients');
  const tNone = getServerTranslation(lang, 'city.none');
  const tExploreTitle = getServerTranslation(lang, 'city.explore.title');

  // Best travel time translation
  const bestTravelTimeTrans = cityData.translations?.[lang]?.bestTravelTime;
  const bestTravelTime = bestTravelTimeTrans || cityData.bestTravelTime;

  return (
    <>
      {cityJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(cityJsonLd) }}
        />
      )}
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section - Server Rendered for SEO */}
        <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={cityData.heroImage || 'https://images.unsplash.com/photo-1540202403-b712e0e026ee?w=1600&q=80&auto=format&fit=crop'}
              alt={cityEnName} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/60 mix-blend-multiply"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="mb-10 pb-10 border-b border-white/10 flex flex-wrap items-center gap-4 md:gap-5">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-0">
                {cityName}
              </h1>
              {cityEnName && cityEnName !== cityName && (
                <span className="text-white/40 font-medium text-2xl md:text-4xl tracking-tight">{cityEnName}</span>
              )}
              {(cityData.tags || []).length > 0 && (
                <div className="flex flex-wrap items-center gap-3 ml-1 md:ml-3">
                  {(cityData.tags || []).map((tag: any, idx: number) => {
                    let tagText = tag.text || '';
                    if (lang !== 'cn') {
                      const tagTrans = cityData.translations?.[lang]?.tags?.[idx];
                      if (tagTrans?.text) tagText = tagTrans.text;
                      else if (tag[`text${lang.charAt(0).toUpperCase() + lang.slice(1)}`]) tagText = tag[`text${lang.charAt(0).toUpperCase() + lang.slice(1)}`];
                    }
                    return (
                      <span key={idx} className="px-5 py-2 bg-[#e6f4ea] text-[#1b887a] rounded-full text-[10px] font-black shadow-sm border border-[#1b887a]/20 tracking-widest uppercase">
                        {tagText}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              <div className="col-span-1 lg:col-span-2 text-white">
                <div className="space-y-6 text-white/90 text-base md:text-xl leading-relaxed max-w-4xl">
                  {paragraphs.map((p: string, idx: number) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </div>

              {/* Info Card - Server Rendered */}
              <div className="col-span-1 border border-white/10 bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 text-white shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xs text-white/50">{getServerTranslation(lang, 'city.weather.area')}</div>
                    <div className="font-semibold text-lg">{cityData.translations?.[lang]?.info?.area || cityData.info?.area || '-'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-white/50">{getServerTranslation(lang, 'city.weather.population')}</div>
                    <div className="font-semibold text-lg">{cityData.translations?.[lang]?.info?.population || cityData.info?.population || '-'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Time & History - Server Rendered */}
        <div className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Travel Time */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight text-center md:text-left">
                  {cityName}{tBestTimeTitle}
                </h2>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative">
                  <div className="absolute top-0 left-8 -translate-y-1/2 text-6xl text-gray-100 font-serif leading-none">&ldquo;</div>
                  <p className="text-lg text-gray-700 leading-relaxed font-medium mb-4 relative z-10">
                    {tBestTimeDescPrefix}{cityName}{tBestTimeDescSuffix}
                    <strong className="text-gray-900 font-bold ml-1">
                      {bestTravelTime?.strongText || '...'}
                    </strong>.
                  </p>
                  {(bestTravelTime?.paragraphs || []).map((p: string, idx: number) => (
                    <p key={idx} className="text-gray-600 leading-relaxed mb-4 relative z-10">
                      {p}
                    </p>
                  ))}
                  <div className="absolute bottom-0 right-8 translate-y-1/2 text-6xl text-gray-100 font-serif leading-none rotate-180">&rdquo;</div>
                </div>
              </div>

              {/* History */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight text-center md:text-left">
                  {cityName}{tHistoryTitle}
                </h2>
                <div className="relative border-l-2 border-green-100 pl-8 space-y-8 pb-4">
                  {history.map((item: any, idx: number) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[41px] bg-green-500 w-4 h-4 rounded-full border-4 border-white shadow-sm"></div>
                      <div className="text-sm font-semibold text-green-600 mb-1">{item.year || item.enYear || ''}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title || item.enTitle || ''}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.desc || item.enDesc || ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attractions Section - Server Rendered */}
        <div className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{cityName}{tAttractionsTitle}</h2>
              <p className="text-gray-500">{tAttractionsSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {attractions.map((spot: any, idx: number) => (
                <div key={idx} className="bg-white border text-left border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
                  <div className="h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                    <img src={spot.imageUrl || `https://images.unsplash.com/photo-1540202403-b712e0e026ee?w=600&q=80&auto=format&fit=crop&random=${idx}`} alt={spot.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {spot.rating && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-2 py-1 rounded-sm flex items-center gap-1 shadow-md">
                        ★ {spot.rating}
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{spot.name || spot.enName || ''}</h3>
                    <div className="text-xs text-gray-400 mb-3 truncate font-medium">{spot.enName || spot.name || ''}</div>
                    <p className="text-base text-green-700 mb-5 line-clamp-2 leading-relaxed flex-grow">{spot.desc || spot.enDesc || ''}</p>
                    <div className="space-y-2 text-xs text-gray-500 border-t border-gray-100 pt-4 font-medium">
                      <div className="flex items-center gap-2">
                        <span>{tAttractionsTicket} {spot.price || spot.enPrice || ''}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{tAttractionsSeason}: {spot.season || spot.enSeason || ''}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{tAttractionsTime}: {spot.time || spot.enTime || ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* World Heritage Section - Server Rendered */}
        {worldHeritage.length > 0 && (
          <div className="py-16 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{cityName}{tHeritageWorldTitle}</h2>
                <p className="text-gray-500">{tHeritageWorldSubtitle}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {worldHeritage.map((heritage: any, idx: number) => (
                  <div key={idx} className="relative h-64 rounded-xl overflow-hidden group cursor-pointer text-left">
                    <img src={heritage.imageUrl || `https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=600&q=80&auto=format&fit=crop&random=${idx}`} alt={heritage.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    {heritage.year && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                        {heritage.year}
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-xl font-bold text-white mb-2">{heritage.name || heritage.enName || ''}</h3>
                      <p className="text-white/80 text-xs line-clamp-2 leading-relaxed">{heritage.desc || heritage.enDesc || ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Intangible Cultural Heritage - Server Rendered */}
        {intangibleHeritage.length > 0 && (
          <div className="py-16 bg-gray-50 border-t border-gray-100">
            <div className="max-w-5xl mx-auto px-6 text-center">
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{cityName}{tHeritageIntangibleTitle}</h2>
                <p className="text-gray-500">{tHeritageIntangibleSubtitle}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                {intangibleHeritage.map((item: any, idx: number) => (
                  <div key={idx} className={`${idx === 2 && intangibleHeritage.length === 3 ? 'md:col-span-2' : ''} bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow`}>
                    <div className={`w-full ${idx === 2 && intangibleHeritage.length === 3 ? 'md:w-1/4' : 'md:w-1/3'} flex-shrink-0 h-40 relative overflow-hidden`}>
                      <img src={item.imageUrl || `https://images.unsplash.com/photo-1544025162-811c75c82de1?w=400&q=80&auto=format&fit=crop&random=${idx}`} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name || item.enName || ''}</h3>
                      <div className="text-xs text-gray-400 mb-3">{item.year || item.enYear || ''}</div>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {item.desc || item.enDesc || ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Transportation Section - Server Rendered */}
        {transportation.length > 0 && (
          <div className="py-16 bg-white border-t border-gray-100 text-center">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{cityName}{tTransportTitle}</h2>
                <p className="text-gray-500">{tTransportSubtitle}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                {transportation.map((item: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{item.title || item.enTitle || ''}</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-2">{item.desc || item.enDesc || ''}</p>
                    <p className="text-sm text-gray-500 font-medium">{item.price || item.enPrice || ''}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Food Section - Server Rendered */}
        {food.length > 0 && (
          <div className="py-16 bg-gray-50 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{cityName}{tFoodTitle}</h2>
                <p className="text-gray-500">{tFoodSubtitle}</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
                {food.map((foodItem: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex gap-5 hover:shadow-md transition-shadow">
                    <div className="w-32 h-32 flex-shrink-0 relative overflow-hidden">
                      <img src={foodItem.imageUrl || `https://images.unsplash.com/photo-1544025162-811c75c82de1?w=400&q=80&auto=format&fit=crop&random=${foodItem.imageIdx || idx}`} alt={foodItem.name} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 inline-block mr-2">{foodItem.name || foodItem.enName || ''}</h3>
                          {foodItem.pinyin && <span className="text-xs text-gray-400 font-serif italic">{foodItem.pinyin}</span>}
                        </div>
                        {foodItem.price && <span className="text-green-600 font-semibold">{foodItem.price}</span>}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">{foodItem.desc || foodItem.enDesc || ''}</p>
                      <div className="text-xs text-gray-500 mt-auto w-full border-t border-gray-50 pt-2">
                        <strong className="text-gray-700">{tFoodIngredients}: </strong>
                        <span className="line-clamp-1">{foodItem.ingredients || foodItem.enIngredients || ''}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Explore Deeper - Server Rendered */}
        <div className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">{tExploreTitle}</h2>
          </div>
        </div>

        {/* Client-side interactive parts (votes, weather widget, video modal, etc.) */}
        <CityDetailClient initialData={cityData} ssrContentRendered={true} />
      </div>
    </>
  );
}
