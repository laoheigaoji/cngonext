import VisaPhoto from "@/app-views/visa/VisaPhoto";
import { getHreflangAlternates, baseUrl, getSEO, visaPhotoSEO } from "@/lib/seo-config";

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
    },
  };
}

export default function Page() {
  return <VisaPhoto />;
}
