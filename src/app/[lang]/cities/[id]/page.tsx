import CityDetailClient from "./CityDetailClient";
import { getCityData } from "@/lib/server-data";
import { getHreflangAlternates, baseUrl, generateCityJsonLd } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  let title = 'City Guide - tripcngo.com';
  let description = 'Explore this amazing city in China with our comprehensive travel guide.';
  let ogImage = '';

  try {
    const city = await getCityData(id);
    if (city) {
      const nameField = lang === 'cn' || lang === 'tw' ? 'name' :
        lang === 'ja' ? 'name_ja' :
        lang === 'ko' ? 'name_ko' :
        lang === 'en' ? 'name_en' : 'name_en';
      const descField = lang === 'cn' || lang === 'tw' ? 'description' :
        lang === 'ja' ? 'description_ja' :
        lang === 'ko' ? 'description_ko' : 'description_en';

      const cityName = city[nameField] || city.name_en || city.name || id;
      const cityDesc = city[descField] || city.description_en || city.description || description;
      title = `${cityName} Travel Guide - tripcngo.com`;
      description = cityDesc.substring(0, 160);
      ogImage = city.image || city.thumbnail || '';
    }
  } catch (e) {
    console.error('Failed to fetch city metadata:', e);
  }

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${lang}/cities/${id}`,
      languages: getHreflangAlternates(`/cities/${id}`),
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}/cities/${id}`,
      siteName: 'tripcngo.com',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  let initialData = null;
  let cityJsonLd = null;

  try {
    const city = await getCityData(id);
    if (city) {
      initialData = city;
      cityJsonLd = generateCityJsonLd(city, lang);
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
      <CityDetailClient initialData={initialData ?? undefined} />
    </>
  );
}
