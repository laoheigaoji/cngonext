import VisaDownloads from "@/app-views/visa/VisaDownloads";
import { getHreflangAlternates, baseUrl } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return {
    title: 'China Visa Document Downloads - tripcngo.com',
    description: 'Download China visa application forms and required documents. Get all the forms you need for your China visa application.',
    alternates: {
      canonical: `${baseUrl}/${lang}/visa/downloads`,
      languages: getHreflangAlternates('/visa/downloads'),
    },
  };
}

export default function Page() {
  return <VisaDownloads />;
}
