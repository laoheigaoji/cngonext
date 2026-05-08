import ZodiacCalculator from "@/app-views/tools/ZodiacCalculator";
import { getHreflangAlternates, baseUrl, getSEO, zodiacSEO, defaultOgImage } from "@/lib/seo-config";

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
  return <ZodiacCalculator />;
}
