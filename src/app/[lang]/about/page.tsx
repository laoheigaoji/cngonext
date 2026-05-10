import AboutUsClient from "./AboutUsClient";
import { getPageSections } from "@/lib/server-data";
import { getSEO, aboutSEO, getHreflangAlternates, baseUrl, defaultOgImage } from "@/lib/seo-config";
import { LANGUAGES } from "@/lib/static-params";

export function generateStaticParams() {
  return LANGUAGES.map(lang => ({ lang }));
}

export const revalidate = false;

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
    initialData = await getPageSections('about');
  } catch (e) {
    console.error('Failed to fetch about data:', e);
  }

  return <AboutUsClient initialData={initialData ?? undefined} lang={lang} />;
}
