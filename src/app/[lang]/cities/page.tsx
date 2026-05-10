import CitiesClient from "./CitiesClient";
import { getCitiesListData } from "@/lib/server-data";
import { getSEO, citiesSEO, getHreflangAlternates, baseUrl, defaultOgImage } from "@/lib/seo-config";

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

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  let initialData = null;

  try {
    initialData = await getCitiesListData();
  } catch (e) {
    console.error('Failed to fetch cities data:', e);
  }

  return <CitiesClient initialData={initialData ?? undefined} />;
}
