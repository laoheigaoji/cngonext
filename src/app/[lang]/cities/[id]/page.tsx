import { LANGUAGES, getCityIds } from "@/lib/static-params";
import CityDetailClient from "./CityDetailClient";
import { getHreflangAlternates, baseUrl, getSEO, citiesSEO } from "@/lib/seo-config";
import { getCityData } from "@/lib/server-data";

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

export async function generateStaticParams() {
  const cityIds = await getCityIds();
  return LANGUAGES.flatMap((lang) =>
    cityIds.map((id) => ({ lang, id }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  const fallback = getSEO(citiesSEO, lang);

  try {
    const city = await getCityData(id);
    if (city) {
      const name = getLocalizedField(city, 'name', lang);
      const desc = getLocalizedField(city, 'description', lang) || getLocalizedField(city, 'short_description', lang);
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
          images: city.image ? [{ url: city.image }] : undefined,
          type: 'website',
        },
      };
    }
  } catch {}

  return {
    title: fallback.title,
    description: fallback.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/cities/${id}`,
      languages: getHreflangAlternates(`/cities/${id}`),
    },
  };
}

export default function Page() {
  return <CityDetailClient />;
}
