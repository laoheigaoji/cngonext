import GuideClient from "./GuideClient";
import { getGuidePageData, getTranslations } from "@/lib/server-data";
import { getSEO, guideSEO, getHreflangAlternates, baseUrl, defaultOgImage } from "@/lib/seo-config";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(guideSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/guide`,
      languages: getHreflangAlternates('/guide'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/guide`,
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
  let initialTranslations = null;

  try {
    const [data, translations] = await Promise.all([
      getGuidePageData(lang),
      getTranslations(lang, ['guide', 'common']),
    ]);
    initialData = data;
    initialTranslations = translations;
  } catch (e) {
    console.error('Failed to fetch guide data:', e);
  }

  return (
    <GuideClient
      initialData={initialData ?? undefined}
      initialTranslations={initialTranslations ?? undefined}
    />
  );
}
