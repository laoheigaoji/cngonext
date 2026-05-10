import Feedback from "@/app-views/Feedback";
import { getHreflangAlternates, baseUrl, getSEO, feedbackSEO, defaultOgImage } from "@/lib/seo-config";
import { LANGUAGES } from "@/lib/static-params";
import { getServerTranslations } from "@/lib/server-i18n";

export function generateStaticParams() {
  return LANGUAGES.map(lang => ({ lang }));
}

export const revalidate = false;

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
    'feedback.title', 'feedback.subtitle',
    'feedback.nameName', 'feedback.name.placeholder',
    'feedback.emailName', 'feedback.email.placeholder',
    'feedback.messageName', 'feedback.message.placeholder',
    'feedback.submit', 'feedback.success', 'feedback.error',
  ]);

  return <Feedback translations={t} />;
}
