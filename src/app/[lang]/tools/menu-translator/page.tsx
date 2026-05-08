import MenuTranslator from "@/app-views/tools/MenuTranslator";
import { getHreflangAlternates, baseUrl, getSEO, menuTranslatorSEO } from "@/lib/seo-config";

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
    },
  };
}

export default function Page() {
  return <MenuTranslator />;
}
