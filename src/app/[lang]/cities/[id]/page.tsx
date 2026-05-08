import { LANGUAGES, getCityIds } from "@/lib/static-params";
import CityDetailClient from "./CityDetailClient";

export async function generateStaticParams() {
  const cityIds = await getCityIds();
  return LANGUAGES.flatMap((lang) =>
    cityIds.map((id) => ({ lang, id }))
  );
}

export default function Page() {
  return <CityDetailClient />;
}
