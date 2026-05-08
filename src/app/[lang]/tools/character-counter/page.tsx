import CharacterCounter from "@/app-views/tools/CharacterCounter";
import { getHreflangAlternates, baseUrl } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return {
    title: 'Chinese Character Counter - tripcngo.com',
    description: 'Count Chinese characters, words, and sentences. Useful tool for writing within character limits for Chinese social media and documents.',
    alternates: {
      canonical: `${baseUrl}/${lang}/tools/character-counter`,
      languages: getHreflangAlternates('/tools/character-counter'),
    },
  };
}

export default function Page() {
  return <CharacterCounter />;
}
