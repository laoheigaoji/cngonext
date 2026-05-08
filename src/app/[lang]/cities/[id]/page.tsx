import { LANGUAGES, getCityIds } from "@/lib/static-params";
import { getCityData } from "@/lib/server-data";
import CityDetailClient from "./CityDetailClient";

export async function generateStaticParams() {
  const cityIds = await getCityIds();
  return LANGUAGES.flatMap((lang) =>
    cityIds.map((id) => ({ lang, id }))
  );
}

export default async function Page({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { id } = await params;
  const cityData = await getCityData(id);
  return <CityDetailClient initialData={cityData} />;
}
