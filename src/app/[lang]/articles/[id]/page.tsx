import ArticleDetailClient from "./ArticleDetailClient";
import { getHreflangAlternates, baseUrl, getSEO, articlesSEO, generateArticleJsonLd } from "@/lib/seo-config";
import { getArticleData } from "@/lib/server-data";

export const dynamic = 'force-dynamic';

function getLocalizedField(obj: any, field: string, lang: string): string {
  const langSuffixMap: Record<string, string> = {
    cn: '', tw: '_tw', en: '_en', ja: '_ja', ko: '_ko',
    ru: '_ru', fr: '_fr', es: '_es', de: '_de', it: '_it',
  };
  const suffix = langSuffixMap[lang] || '_en';
  if (suffix && obj?.[`${field}${suffix}`]) return obj[`${field}${suffix}`];
  if (obj?.[`${field}_en`]) return obj[`${field}_en`];
  return obj?.[field] || '';
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  const fallback = getSEO(articlesSEO, lang);

  try {
    const article = await getArticleData(id);
    if (article) {
      const title = getLocalizedField(article, 'title', lang);
      const desc = getLocalizedField(article, 'subtitle', lang);
      return {
        title: title ? `${title} - tripcngo.com` : fallback.title,
        description: desc || fallback.description,
        alternates: {
          canonical: `${baseUrl}/${lang}/articles/${id}`,
          languages: getHreflangAlternates(`/articles/${id}`),
        },
        openGraph: {
          title: title || fallback.title,
          description: desc || fallback.description,
          url: `${baseUrl}/${lang}/articles/${id}`,
          images: article.thumbnail ? [{ url: article.thumbnail }] : undefined,
          type: 'article',
        },
      };
    }
  } catch {}

  return {
    title: fallback.title,
    description: fallback.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/articles/${id}`,
      languages: getHreflangAlternates(`/articles/${id}`),
    },
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;

  let articleJsonLd = null;
  try {
    const article = await getArticleData(id);
    if (article) {
      articleJsonLd = generateArticleJsonLd(article, lang);
    }
  } catch {}

  return (
    <>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      <ArticleDetailClient />
    </>
  );
}
