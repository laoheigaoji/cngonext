import NameGenerator from "@/app-views/tools/NameGenerator";
import NameGenHero from "@/components/NameGenHero";
import { getHreflangAlternates, baseUrl, getSEO, nameGeneratorSEO, defaultOgImage } from "@/lib/seo-config";
import { getServerTranslations } from "@/lib/server-i18n";

export const revalidate = false;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(nameGeneratorSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/tools/name-generator`,
      languages: getHreflangAlternates('/tools/name-generator'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/tools/name-generator`,
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

  // Get translations for static SSR hero section - reads from local JSON, instant
  const t = getServerTranslations(lang, [
    'tools.name.title',
    'tools.name.subtitle',
  ]);

  return (
    <>
      {/* Hero - SSR, no JS dependency, instant */}
      <NameGenHero
        title={t['tools.name.title']}
        subtitle={t['tools.name.subtitle']}
      />

      {/* Client-side interactive tool */}
      <NameGenerator skipHero />
    </>
  );
}
