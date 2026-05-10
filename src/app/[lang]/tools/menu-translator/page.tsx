import MenuTranslator from "@/app-views/tools/MenuTranslator";
import { getHreflangAlternates, baseUrl, getSEO, menuTranslatorSEO, defaultOgImage } from "@/lib/seo-config";
import { getServerTranslations } from "@/lib/server-i18n";

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

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  const t = getServerTranslations(lang, [
    // Pricing
    'tools.menu.pricing.title',
    'tools.menu.pricing.subtitle',
    'tools.menu.pricing.monthly',
    'tools.menu.pricing.yearly',
    'tools.menu.pricing.save',
    'tools.menu.pricing.current',
    'tools.menu.pricing.select',
    'tools.menu.pricing.popular',
    'tools.menu.pricing.perMonth',
    'tools.menu.pricing.perYear',
    // Free plan
    'tools.menu.pricing.free.name',
    'tools.menu.pricing.free.desc',
    'tools.menu.pricing.free.feature1',
    'tools.menu.pricing.free.feature2',
    'tools.menu.pricing.free.feature3',
    'tools.menu.pricing.free.feature4',
    'tools.menu.pricing.free.feature5',
    // Traveler plan
    'tools.menu.pricing.traveler.name',
    'tools.menu.pricing.traveler.desc',
    'tools.menu.pricing.traveler.feature1',
    'tools.menu.pricing.traveler.feature2',
    'tools.menu.pricing.traveler.feature3',
    'tools.menu.pricing.traveler.feature4',
    'tools.menu.pricing.traveler.feature5',
    'tools.menu.pricing.traveler.feature6',
    'tools.menu.pricing.traveler.feature7',
    // Starter plan
    'tools.menu.pricing.starter.name',
    'tools.menu.pricing.starter.desc',
    'tools.menu.pricing.starter.feature1',
    'tools.menu.pricing.starter.feature1Yearly',
    'tools.menu.pricing.starter.feature2',
    'tools.menu.pricing.starter.feature3',
    'tools.menu.pricing.starter.feature4',
    'tools.menu.pricing.starter.feature5',
    'tools.menu.pricing.starter.feature6',
    'tools.menu.pricing.starter.feature7',
    // Pro plan
    'tools.menu.pricing.pro.name',
    'tools.menu.pricing.pro.desc',
    'tools.menu.pricing.pro.feature1',
    'tools.menu.pricing.pro.feature1Yearly',
    'tools.menu.pricing.pro.feature2',
    'tools.menu.pricing.pro.feature3',
    'tools.menu.pricing.pro.feature4',
    'tools.menu.pricing.pro.feature5',
    'tools.menu.pricing.pro.feature6',
    'tools.menu.pricing.pro.feature7',
  ]);

  return <MenuTranslator translations={t} />;
}
