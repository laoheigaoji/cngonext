import { LANGUAGES } from "@/lib/static-params";
import { getAppsData } from "@/lib/server-data";
import AppsClient from "./AppsClient";

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const appsData = await getAppsData();
  return <AppsClient initialData={appsData} />;
}
