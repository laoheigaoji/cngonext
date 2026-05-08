import { LANGUAGES } from "@/lib/static-params";
import { getHomeData } from "@/lib/server-data";
import HomeClient from "./HomeClient";

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export const dynamic = "force-static";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const homeData = await getHomeData();
  return <HomeClient initialData={homeData} />;
}
