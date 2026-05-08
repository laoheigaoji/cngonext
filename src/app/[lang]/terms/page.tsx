import TermsClient from "./TermsClient";
import { getPageSections } from "@/lib/server-data";
import { getSEO, termsSEO, getHreflangAlternates, baseUrl } from "@/lib/seo-config";

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
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  let initialData = null;

  try {
    initialData = await getPageSections('terms');
  } catch (e) {
    console.error('Failed to fetch terms data:', e);
  }

  return <TermsClient initialData={initialData ?? undefined} lang={lang} />;
}
