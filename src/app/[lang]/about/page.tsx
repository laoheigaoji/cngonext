import AboutUsClient from "./AboutUsClient";
import { getPageSections } from "@/lib/server-data";
import { getSEO, aboutSEO, getHreflangAlternates, baseUrl } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(aboutSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/about`,
      languages: getHreflangAlternates('/about'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/about`,
      siteName: 'tripcngo.com',
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  let initialData = null;

  try {
    initialData = await getPageSections('about');
  } catch (e) {
    console.error('Failed to fetch about data:', e);
  }

  return <AboutUsClient initialData={initialData ?? undefined} lang={lang} />;
}
