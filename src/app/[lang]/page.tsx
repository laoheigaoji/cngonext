import Home from "@/app-views/Home";
import { getSEO, homeSEO, getHreflangAlternates, baseUrl, generateWebsiteJsonLd, generateOrganizationJsonLd } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(homeSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: getHreflangAlternates(''),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}`,
      siteName: 'tripcngo.com',
      type: 'website',
      locale: lang === 'cn' ? 'zh_CN' : lang === 'tw' ? 'zh_TW' : lang === 'ja' ? 'ja_JP' : lang === 'ko' ? 'ko_KR' : lang === 'ru' ? 'ru_RU' : lang === 'fr' ? 'fr_FR' : lang === 'es' ? 'es_ES' : lang === 'de' ? 'de_DE' : lang === 'it' ? 'it_IT' : 'en_US',
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const websiteJsonLd = generateWebsiteJsonLd(lang);
  const orgJsonLd = generateOrganizationJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <Home />
    </>
  );
}
