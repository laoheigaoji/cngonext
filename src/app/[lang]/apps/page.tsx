import AppsClient from "./AppsClient";
import { getAppsData } from "@/lib/server-data";
import { getSEO, appsSEO, getHreflangAlternates, baseUrl } from "@/lib/seo-config";

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
