import { LANGUAGES } from "@/lib/static-params";
import { getArticlesListData } from "@/lib/server-data";
import GuideListClient from "./GuideListClient";

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export const dynamic = "force-static";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const articlesData = await getArticlesListData();
  return <GuideListClient initialData={articlesData} />;
}
