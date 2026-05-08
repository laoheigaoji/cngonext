import Feedback from "@/app-views/Feedback";
import { getHreflangAlternates, baseUrl, getSEO, feedbackSEO } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(feedbackSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/feedback`,
      languages: getHreflangAlternates('/feedback'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/feedback`,
      siteName: 'tripcngo.com',
    },
  };
}

export default function Page() {
  return <Feedback />;
}
