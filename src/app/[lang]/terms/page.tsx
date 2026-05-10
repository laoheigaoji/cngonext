import TermsClient from "./TermsClient";
import { getPageSections } from "@/lib/server-data";
import { getSEO, termsSEO, getHreflangAlternates, baseUrl, defaultOgImage } from "@/lib/seo-config";
import { LANGUAGES } from "@/lib/static-params";

export function generateStaticParams() {
  return LANGUAGES.map(lang => ({ lang }));
}

export const revalidate = false;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(termsSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/terms`,
      languages: getHreflangAlternates('/terms'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/terms`,
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
    initialData = await getPageSections('terms_of_service');
  } catch (e) {
    console.error('Failed to fetch terms data:', e);
  }

  return <TermsClient initialData={initialData ?? undefined} lang={lang} />;
}
