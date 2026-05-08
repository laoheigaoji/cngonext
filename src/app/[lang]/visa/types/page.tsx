import { LANGUAGES } from "@/lib/static-params";
import { getVisaTypesData, getTranslations } from "@/lib/server-data";
import VisaTypesClient from "./VisaTypesClient";

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const [visaData, translations] = await Promise.all([
    getVisaTypesData(),
    getTranslations(lang, ['visa', 'visa_type', 'visa_doc', 'visa.doc', 'type', 'types', 'visaType']),
  ]);
  return <VisaTypesClient initialData={visaData} initialTranslations={translations} />;
}
