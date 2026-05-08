import VisaPhoto from "@/app-views/visa/VisaPhoto";
import { getHreflangAlternates, baseUrl } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return {
    title: 'China Visa Photo Requirements - tripcngo.com',
    description: 'China visa photo specifications and requirements. Ensure your passport photo meets the Chinese embassy standards.',
    alternates: {
      canonical: `${baseUrl}/${lang}/visa/photo`,
      languages: getHreflangAlternates('/visa/photo'),
    },
  };
}

export default function Page() {
  return <VisaPhoto />;
}
