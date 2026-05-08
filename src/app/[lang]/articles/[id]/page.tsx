import { LANGUAGES, getArticleIds } from "@/lib/static-params";
import { getArticleData } from "@/lib/server-data";
import ArticleDetailClient from "./ArticleDetailClient";

export const dynamicParams = false;
export const dynamic = "force-static";

export async function generateStaticParams() {
  const articleIds = await getArticleIds();
  return LANGUAGES.flatMap((lang) =>
    articleIds.map((id) => ({ lang, id }))
  );
}

export default async function Page({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { id } = await params;
  const articleData = await getArticleData(id);
  return <ArticleDetailClient initialData={articleData} />;
}
