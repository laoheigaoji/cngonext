import HomeClient from "./HomeClient";
import { getHomeData } from "@/lib/server-data";
import { getSEO, homeSEO, getHreflangAlternates, baseUrl, generateWebsiteJsonLd, generateOrganizationJsonLd, generateFAQJsonLd } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(homeSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: getHreflangAlternates(),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}`,
      siteName: 'tripcngo.com',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  let initialData = null;
  let faqJsonLd = null;

  try {
    const data = await getHomeData();
    initialData = data;

    // Generate FAQ JSON-LD
    if (data.faqs && data.faqs.length > 0) {
      const faqField = lang === 'cn' || lang === 'tw' ? 'question' :
        lang === 'ja' ? 'question_ja' :
        lang === 'ko' ? 'question_ko' :
        lang === 'ru' ? 'question_ru' :
        lang === 'fr' ? 'question_fr' :
        lang === 'es' ? 'question_es' :
        lang === 'de' ? 'question_de' :
        lang === 'it' ? 'question_it' : 'question_en';
      const answerField = faqField.replace('question', 'answer');

      faqJsonLd = generateFAQJsonLd(
        data.faqs.map((faq: any) => ({
          question: faq[faqField] || faq.question_en || faq.question || '',
          answer: faq[answerField] || faq.answer_en || faq.answer || '',
        }))
      );
    }
  } catch (e) {
    console.error('Failed to fetch home data:', e);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateWebsiteJsonLd(lang),
            generateOrganizationJsonLd(),
            ...(faqJsonLd ? [faqJsonLd] : []),
          ]),
        }}
      />
      <HomeClient initialData={initialData ?? undefined} />
    </>
  );
}
