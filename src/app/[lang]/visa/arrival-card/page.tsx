import VisaArrivalCard from "@/app-views/visa/VisaArrivalCard";
import { getHreflangAlternates, baseUrl } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return {
    title: 'China Arrival Card Form - tripcngo.com',
    description: 'Fill out your China arrival card online. Complete the China entry/arrival card form before your trip.',
    alternates: {
      canonical: `${baseUrl}/${lang}/visa/arrival-card`,
      languages: getHreflangAlternates('/visa/arrival-card'),
    },
  };
}

export default function Page() {
  return <VisaArrivalCard />;
}
