import TermsClient from "./TermsClient";
import { getSEO, termsSEO, getHreflangAlternates, baseUrl, defaultOgImage } from "@/lib/seo-config";
import { LANGUAGES } from "@/lib/static-params";
import { getServerTranslations } from "@/lib/server-i18n";

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

  const t = getServerTranslations(lang, [
    'terms.hero.title', 'terms.hero.subtitle',
    'terms.s1.title', 'terms.s1.content',
    'terms.s2.title', 'terms.s2.content',
    'terms.s3.title', 'terms.s3.content',
    'terms.s4.title', 'terms.s4.content',
    'terms.s5.title', 'terms.s5.content',
    'privacy.lastUpdated',
  ]);

  return <TermsClient translations={t} />;
}
