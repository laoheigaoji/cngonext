import NameGenerator from "@/app-views/tools/NameGenerator";
import { getHreflangAlternates, baseUrl } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return {
    title: 'Chinese Name Generator - tripcngo.com',
    description: 'Generate a meaningful Chinese name based on your English name. AI-powered Chinese name creation with cultural significance.',
    alternates: {
      canonical: `${baseUrl}/${lang}/tools/name-generator`,
      languages: getHreflangAlternates('/tools/name-generator'),
    },
  };
}

export default function Page() {
  return <NameGenerator />;
}
