import { LANGUAGES, getArticleIds } from "@/lib/static-params";
import ArticleDetailClient from "./ArticleDetailClient";
import { getHreflangAlternates, baseUrl } from "@/lib/seo-config";

export async function generateStaticParams() {
  const articleIds = await getArticleIds();
  return LANGUAGES.flatMap((lang) =>
    articleIds.map((id) => ({ lang, id }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;

  return {
    title: `Article - tripcngo.com`,
    description: 'Read China travel articles and guides on tripcngo.com',
    alternates: {
      canonical: `${baseUrl}/${lang}/articles/${id}`,
      languages: getHreflangAlternates(`/articles/${id}`),
    },
  };
}

export default function Page() {
  return <ArticleDetailClient />;
}
