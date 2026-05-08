import MenuTranslator from "@/app-views/tools/MenuTranslator";
import { getHreflangAlternates, baseUrl } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return {
    title: 'Chinese Menu Translator - tripcngo.com',
    description: 'Translate Chinese restaurant menus with AI. Upload a photo or type Chinese dish names to get instant translations and explanations.',
    alternates: {
      canonical: `${baseUrl}/${lang}/tools/menu-translator`,
      languages: getHreflangAlternates('/tools/menu-translator'),
    },
  };
}

export default function Page() {
  return <MenuTranslator />;
}
