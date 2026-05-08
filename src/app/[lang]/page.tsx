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
    },
  };
}

export default function Page() {
  return <Home />;
}
