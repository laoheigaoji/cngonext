import CityDetailClient from "./CityDetailClient";
import { getHreflangAlternates, baseUrl, getSEO, citiesSEO, generateCityJsonLd, defaultOgImage } from "@/lib/seo-config";
import { getCityData } from "@/lib/server-data";

export const dynamic = 'force-dynamic';

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

export async function generateMetadata({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  const fallback = getSEO(citiesSEO, lang);

  try {
    const city = await getCityData(id);
    if (city) {
      const name = getLocalizedField(city, 'name', lang);
      const desc = getLocalizedField(city, 'description', lang) || getLocalizedField(city, 'short_description', lang);
      const ogImage = city.image || defaultOgImage;
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
