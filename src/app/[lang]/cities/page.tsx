import { LANGUAGES } from "@/lib/static-params";
import { getCitiesListData } from "@/lib/server-data";
import CitiesClient from "./CitiesClient";

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export const dynamic = "force-static";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const citiesData = await getCitiesListData();
  return <CitiesClient initialData={citiesData} />;
}
