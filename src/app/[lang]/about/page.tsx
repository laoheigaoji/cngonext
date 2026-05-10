import AboutUsClient from "./AboutUsClient";
import { getSEO, aboutSEO, getHreflangAlternates, baseUrl, defaultOgImage } from "@/lib/seo-config";
import { LANGUAGES } from "@/lib/static-params";
import { getServerTranslations } from "@/lib/server-i18n";

export function generateStaticParams() {
  return LANGUAGES.map(lang => ({ lang }));
}

export const revalidate = false;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(aboutSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/about`,
      languages: getHreflangAlternates('/about'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/about`,
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
    'about.hero.title',
    'about.features.team.title', 'about.features.team.desc',
    'about.features.focus.title', 'about.features.focus.desc',
    'about.features.ai.title', 'about.features.ai.desc',
    'about.story.title', 'about.story.p1', 'about.story.p2', 'about.story.p3', 'about.story.p4', 'about.story.p5',
    'about.team.title', 'about.team.subtitle',
  ]);

  return <AboutUsClient translations={t} />;
}
