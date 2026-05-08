import { LANGUAGES } from "@/lib/static-params";
import { getPageSections } from "@/lib/server-data";
import PrivacyClient from "./PrivacyClient";

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const sections = await getPageSections('privacy_policy');
  return <PrivacyClient initialData={sections} />;
}
