import PrivacyClient from "./PrivacyClient";
import { getPageSections } from "@/lib/server-data";
import { getSEO, privacySEO, getHreflangAlternates, baseUrl } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(privacySEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/privacy`,
      languages: getHreflangAlternates('/privacy'),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  let initialData = null;

  try {
    initialData = await getPageSections('privacy');
  } catch (e) {
    console.error('Failed to fetch privacy data:', e);
  }

  return <PrivacyClient initialData={initialData ?? undefined} lang={lang} />;
}
