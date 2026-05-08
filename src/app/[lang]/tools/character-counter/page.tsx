import CharacterCounter from "@/app-views/tools/CharacterCounter";
import { getHreflangAlternates, baseUrl, getSEO, characterCounterSEO } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(characterCounterSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/tools/character-counter`,
      languages: getHreflangAlternates('/tools/character-counter'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/tools/character-counter`,
      siteName: 'tripcngo.com',
    },
  };
}

export default function Page() {
  return <CharacterCounter />;
}
