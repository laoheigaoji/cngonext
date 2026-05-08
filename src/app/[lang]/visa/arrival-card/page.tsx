import VisaArrivalCard from "@/app-views/visa/VisaArrivalCard";
import { getHreflangAlternates, baseUrl, getSEO, visaArrivalCardSEO } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(visaArrivalCardSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/visa/arrival-card`,
      languages: getHreflangAlternates('/visa/arrival-card'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/visa/arrival-card`,
      siteName: 'tripcngo.com',
    },
  };
}

export default function Page() {
  return <VisaArrivalCard />;
}
