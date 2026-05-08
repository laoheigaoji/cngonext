import ZodiacCalculator from "@/app-views/tools/ZodiacCalculator";
import { getHreflangAlternates, baseUrl } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return {
    title: 'Chinese Zodiac Calculator - tripcngo.com',
    description: 'Find your Chinese zodiac sign based on your birth year. Learn about the 12 Chinese zodiac animals and their cultural significance.',
    alternates: {
      canonical: `${baseUrl}/${lang}/tools/zodiac-calculator`,
      languages: getHreflangAlternates('/tools/zodiac-calculator'),
    },
  };
}

export default function Page() {
  return <ZodiacCalculator />;
}
