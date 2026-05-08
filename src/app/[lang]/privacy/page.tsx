import PrivacyClient from "./PrivacyClient";
import { getPageSections } from "@/lib/server-data";
import { getSEO, privacySEO, getHreflangAlternates, baseUrl, defaultOgImage } from "@/lib/seo-config";

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
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/privacy`,
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
    initialData = await getPageSections('privacy');
  } catch (e) {
    console.error('Failed to fetch privacy data:', e);
  }

  return <PrivacyClient initialData={initialData ?? undefined} lang={lang} />;
}
