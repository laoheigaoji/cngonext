import { LANGUAGES } from "@/lib/static-params";
import { getPageSections } from "@/lib/server-data";
import TermsClient from "./TermsClient";

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const sections = await getPageSections('terms_of_service');
  return <TermsClient initialData={sections} />;
}
