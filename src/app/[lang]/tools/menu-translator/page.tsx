import MenuTranslator from "@/app-views/tools/MenuTranslator";
import { getHreflangAlternates, baseUrl, getSEO, menuTranslatorSEO, defaultOgImage } from "@/lib/seo-config";

export const revalidate = false;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(menuTranslatorSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/tools/menu-translator`,
      languages: getHreflangAlternates('/tools/menu-translator'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/tools/menu-translator`,
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

export default function Page() {
  return <MenuTranslator />;
}
