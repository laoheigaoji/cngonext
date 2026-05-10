import VisaPhoto from "@/app-views/visa/VisaPhoto";
import { getHreflangAlternates, baseUrl, getSEO, visaPhotoSEO, defaultOgImage } from "@/lib/seo-config";
import { LANGUAGES } from "@/lib/static-params";

export function generateStaticParams() {
  return LANGUAGES.map(lang => ({ lang }));
}

export const revalidate = false;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(visaPhotoSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/visa/photo`,
      languages: getHreflangAlternates('/visa/photo'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/visa/photo`,
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
  return <VisaPhoto />;
}
