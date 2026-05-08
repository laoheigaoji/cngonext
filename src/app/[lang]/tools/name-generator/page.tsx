import NameGenerator from "@/app-views/tools/NameGenerator";
import { getHreflangAlternates, baseUrl, getSEO, nameGeneratorSEO } from "@/lib/seo-config";

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
    },
  };
}

export default function Page() {
  return <NameGenerator />;
}
