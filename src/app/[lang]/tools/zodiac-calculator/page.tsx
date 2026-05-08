import ZodiacCalculator from "@/app-views/tools/ZodiacCalculator";
import { getHreflangAlternates, baseUrl, getSEO, zodiacSEO } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(zodiacSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/tools/zodiac-calculator`,
      languages: getHreflangAlternates('/tools/zodiac-calculator'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/tools/zodiac-calculator`,
      siteName: 'tripcngo.com',
    },
  };
}

export default function Page() {
  return <ZodiacCalculator />;
}
