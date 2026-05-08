import ArticleDetailClient from "./ArticleDetailClient";
import { getArticleData } from "@/lib/server-data";
import { getHreflangAlternates, baseUrl, generateArticleJsonLd } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  let title = 'Travel Article - tripcngo.com';
  let description = 'Read this travel article about China on tripcngo.com.';
  let ogImage = '';

  try {
    const article = await getArticleData(id);
    if (article) {
      const titleField = lang === 'cn' || lang === 'tw' ? 'title' :
        lang === 'ja' ? 'title_ja' :
        lang === 'ko' ? 'title_ko' : 'title_en';
      const subtitleField = lang === 'cn' || lang === 'tw' ? 'subtitle' :
        lang === 'ja' ? 'subtitle_ja' :
        lang === 'ko' ? 'subtitle_ko' : 'subtitle_en';

      const articleTitle = article[titleField] || article.title_en || article.title || id;
      const articleDesc = article[subtitleField] || article.subtitle_en || article.subtitle || description;
      title = `${articleTitle} - tripcngo.com`;
      description = articleDesc.substring(0, 160);
      ogImage = article.thumbnail || '';
    }
  } catch (e) {
    console.error('Failed to fetch article metadata:', e);
  }

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${lang}/articles/${id}`,
      languages: getHreflangAlternates(`/articles/${id}`),
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}/articles/${id}`,
      siteName: 'tripcngo.com',
      type: 'article',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  let initialData = null;
  let articleJsonLd = null;

  try {
    const article = await getArticleData(id);
    if (article) {
      initialData = article;
      articleJsonLd = generateArticleJsonLd(article, lang);
    }
  } catch (e) {
    console.error('Failed to fetch article data:', e);
  }

  return (
    <>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      <ArticleDetailClient initialData={initialData ?? undefined} />
    </>
  );
}
