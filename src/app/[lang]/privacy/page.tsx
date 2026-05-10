import PrivacyClient from "./PrivacyClient";
import { getSEO, privacySEO, getHreflangAlternates, baseUrl, defaultOgImage } from "@/lib/seo-config";
import { LANGUAGES } from "@/lib/static-params";
import { getServerTranslations } from "@/lib/server-i18n";

export function generateStaticParams() {
  return LANGUAGES.map(lang => ({ lang }));
}

export const revalidate = false;

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

  const t = getServerTranslations(lang, [
    'privacy.hero.title', 'privacy.hero.subtitle',
    'privacy.lastUpdated', 'privacy.effectiveDate', 'privacy.intro',
    'privacy.s1.title', 'privacy.s1.content',
    'privacy.s2.title', 'privacy.s2.content',
    'privacy.s3.title', 'privacy.s3.content',
    'privacy.s4.title', 'privacy.s4.content',
    'privacy.s5.title', 'privacy.s5.content',
    'privacy.s6.title', 'privacy.s6.content',
  ]);

  return <PrivacyClient translations={t} />;
}
