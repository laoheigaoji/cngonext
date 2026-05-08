import { LANGUAGES, getArticleIds } from "@/lib/static-params";
import ArticleDetailClient from "./ArticleDetailClient";

export async function generateStaticParams() {
  const articleIds = await getArticleIds();
  return LANGUAGES.flatMap((lang) =>
    articleIds.map((id) => ({ lang, id }))
  );
}

export default function Page() {
  return <ArticleDetailClient />;
}
