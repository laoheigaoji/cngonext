import GuideListClient from "./GuideListClient";
import { getArticlesListData } from "@/lib/server-data";
import { getSEO, articlesSEO, getHreflangAlternates, baseUrl, defaultOgImage } from "@/lib/seo-config";

export const revalidate = false;

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
    initialData = await getArticlesListData();
  } catch (e) {
    console.error('Failed to fetch articles data:', e);
  }

  return <GuideListClient initialData={initialData ?? undefined} />;
}
