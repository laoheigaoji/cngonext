import AppsClient from "./AppsClient";
import { getAppsData } from "@/lib/server-data";
import { getSEO, appsSEO, getHreflangAlternates, baseUrl, defaultOgImage } from "@/lib/seo-config";

export const revalidate = false;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(appsSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/apps`,
      languages: getHreflangAlternates('/apps'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/apps`,
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
    initialData = await getAppsData();
  } catch (e) {
    console.error('Failed to fetch apps data:', e);
  }

  return <AppsClient initialData={initialData ?? undefined} />;
}
