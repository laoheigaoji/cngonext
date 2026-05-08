import GuideListClient from "./GuideListClient";
import { getArticlesListData } from "@/lib/server-data";
import { getSEO, articlesSEO, getHreflangAlternates, baseUrl } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(articlesSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/articles`,
      languages: getHreflangAlternates('/articles'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/articles`,
      siteName: 'tripcngo.com',
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  let initialData = null;

  try {
    initialData = await getArticlesListData();
  } catch (e) {
    console.error('Failed to fetch articles data:', e);
  }

  return <GuideListClient initialData={initialData ?? undefined} />;
}
