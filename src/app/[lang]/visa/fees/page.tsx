import VisaFeesClient from "./VisaFeesClient";
import { getVisaFeesData, getTranslations } from "@/lib/server-data";
import { getSEO, visaFeesSEO, getHreflangAlternates, baseUrl, defaultOgImage } from "@/lib/seo-config";
import { LANGUAGES } from "@/lib/static-params";

export function generateStaticParams() {
  return LANGUAGES.map(lang => ({ lang }));
}

export const revalidate = false;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(visaFeesSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/visa/fees`,
      languages: getHreflangAlternates('/visa/fees'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/visa/fees`,
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
      getVisaFeesData(),
      getTranslations(lang, ['visa', 'common']),
    ]);
    initialData = data;
    initialTranslations = translations;
  } catch (e) {
    console.error('Failed to fetch visa fees data:', e);
  }

  return (
    <VisaFeesClient
      initialData={initialData ?? undefined}
      initialTranslations={initialTranslations ?? undefined}
    />
  );
}
