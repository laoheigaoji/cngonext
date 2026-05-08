import { LANGUAGES } from "@/lib/static-params";
import { getVisaFeesData, getTranslations } from "@/lib/server-data";
import VisaFeesClient from "./VisaFeesClient";

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export const dynamic = "force-static";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const [feesData, translations] = await Promise.all([
    getVisaFeesData(),
    getTranslations(lang, ['visa', 'visa_fee', 'type', 'types', 'visaType']),
  ]);
  return <VisaFeesClient initialData={feesData} initialTranslations={translations} />;
}
