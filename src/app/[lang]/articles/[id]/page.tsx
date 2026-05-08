import { LANGUAGES, getArticleIds } from "@/lib/static-params";
import ArticleDetailClient from "./ArticleDetailClient";
import { getHreflangAlternates, baseUrl, getSEO, articlesSEO } from "@/lib/seo-config";
import { getArticleData } from "@/lib/server-data";

function getLocalizedField(obj: any, field: string, lang: string): string {
  const langSuffixMap: Record<string, string> = {
    cn: '', tw: '_tw', en: '_en', ja: '_ja', ko: '_ko',
    ru: '_ru', fr: '_fr', es: '_es', de: '_de', it: '_it',
  };
  const suffix = langSuffixMap[lang] || '_en';
  // Try lang-specific field first, then English, then base field
  if (suffix && obj?.[`${field}${suffix}`]) return obj[`${field}${suffix}`];
  if (obj?.[`${field}_en`]) return obj[`${field}_en`];
  return obj?.[field] || '';
}

export async function generateStaticParams() {
  const articleIds = await getArticleIds();
  return LANGUAGES.flatMap((lang) =>
    articleIds.map((id) => ({ lang, id }))
  );
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

export default function Page() {
  return <ArticleDetailClient />;
}
