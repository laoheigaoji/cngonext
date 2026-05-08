import VisaTypesClient from "./VisaTypesClient";
import { getVisaTypesData, getTranslations } from "@/lib/server-data";
import { getSEO, visaTypesSEO, getHreflangAlternates, baseUrl } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(visaTypesSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/visa/types`,
      languages: getHreflangAlternates('/visa/types'),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  let initialData = null;
  let initialTranslations = null;

  try {
    const [data, translations] = await Promise.all([
      getVisaTypesData(),
      getTranslations(lang, ['visa', 'common']),
    ]);
    initialData = data;
    initialTranslations = translations;
  } catch (e) {
    console.error('Failed to fetch visa types data:', e);
  }

  return (
    <VisaTypesClient
      initialData={initialData ?? undefined}
      initialTranslations={initialTranslations ?? undefined}
    />
  );
}
