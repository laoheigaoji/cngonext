import VisaDownloads from "@/app-views/visa/VisaDownloads";
import { getHreflangAlternates, baseUrl, getSEO, visaDownloadsSEO } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(visaDownloadsSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/visa/downloads`,
      languages: getHreflangAlternates('/visa/downloads'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/visa/downloads`,
      siteName: 'tripcngo.com',
    },
  };
}

export default function Page() {
  return <VisaDownloads />;
}
