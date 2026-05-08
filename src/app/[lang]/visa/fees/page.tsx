import VisaFeesClient from "./VisaFeesClient";
import { getVisaFeesData, getTranslations } from "@/lib/server-data";
import { getSEO, visaFeesSEO, getHreflangAlternates, baseUrl } from "@/lib/seo-config";

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
