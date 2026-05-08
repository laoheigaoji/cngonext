import VisaForm from "@/app-views/visa/VisaForm";
import { getHreflangAlternates, baseUrl, getSEO, visaFormSEO } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(visaFormSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/visa/form`,
      languages: getHreflangAlternates('/visa/form'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/visa/form`,
      siteName: 'tripcngo.com',
    },
  };
}

export default function Page() {
  return <VisaForm />;
}
