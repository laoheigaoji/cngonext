import VisaForm from "@/app-views/visa/VisaForm";
import { getHreflangAlternates, baseUrl } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return {
    title: 'China Visa Application Form Guide - tripcngo.com',
    description: 'Complete guide to filling out the China visa application form. Step-by-step instructions and tips for a successful application.',
    alternates: {
      canonical: `${baseUrl}/${lang}/visa/form`,
      languages: getHreflangAlternates('/visa/form'),
    },
  };
}

export default function Page() {
  return <VisaForm />;
}
