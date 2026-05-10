import ArticleDetailClient from "./ArticleDetailClient";
import { getHreflangAlternates, baseUrl, getSEO, articlesSEO, generateArticleJsonLd, defaultOgImage } from "@/lib/seo-config";
import { getArticleData } from "@/lib/server-data";
import { getServerTranslation } from "@/lib/server-i18n";
import { marked } from "marked";

export const revalidate = false;

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
      const ogImage = article.thumbnail || defaultOgImage;
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
          images: [{ url: ogImage, width: 1200, height: 630 }],
          type: 'article',
        },
        twitter: {
          card: 'summary_large_image',
          title: title || fallback.title,
          description: desc || fallback.description,
          images: [ogImage],
        },
      };
    }
  } catch (e) {
    console.error('Failed to fetch article metadata:', e);
  }

  return {
    title: fallback.title,
    description: fallback.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/articles/${id}`,
      languages: getHreflangAlternates(`/articles/${id}`),
    },
    openGraph: {
      title: fallback.title,
      description: fallback.description,
      images: [{ url: defaultOgImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fallback.title,
      description: fallback.description,
      images: [defaultOgImage],
    },
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;

  let articleJsonLd = null;
  let articleData = null;
  try {
    const article = await getArticleData(id);
    if (article) {
      articleJsonLd = generateArticleJsonLd(article, lang);
      articleData = article;
    }
  } catch (e) {
    console.error('Failed to fetch article data:', e);
  }

  if (!articleData) {
    return (
      <>
        {articleJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
          />
        )}
        <ArticleDetailClient initialData={articleData} />
      </>
    );
  }

  // Pre-render SEO-critical content on the server
  const displayTitle = getLocalizedField(articleData, 'title', lang) || articleData.titleEn || articleData.title || '';
  const displaySubtitle = getLocalizedField(articleData, 'subtitle', lang) || articleData.subtitleEn || articleData.subtitle || '';
  const displayContent = getLocalizedField(articleData, 'content', lang) || articleData.contentEn || articleData.content || '';
  const langPrefix = lang === 'zh' ? 'cn' : lang;

  // Get translations for server-rendered UI elements
  const tHome = getServerTranslation(lang, 'nav.home');
  const tGuides = getServerTranslation(lang, 'discover.guides');
  const tAuthor = getServerTranslation(lang, 'guide.author');
  const tUpdated = getServerTranslation(lang, 'guide.updated');
  const tInCategory = getServerTranslation(lang, 'guide.inCategory');
  const tViews = getServerTranslation(lang, 'guide.views');

  return (
    <>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      <div className="w-full bg-white">
        {/* Article Header Section - Server Rendered for SEO */}
        <section className="bg-[#005043] pt-32 pb-16 text-white">
          <div className="max-w-[1240px] mx-auto px-6">
            {/* Breadcrumbs */}
            <div className="flex items-center justify-between gap-4 mb-8">
              <nav className="flex items-center gap-2 text-white/60 text-[13px] overflow-x-auto whitespace-nowrap">
                <a href={`/${langPrefix}`} className="hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  {tHome}
                </a>
                <svg className="w-3 h-3 opacity-40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                <a href={`/${langPrefix}/articles`} className="hover:text-white transition-colors">{tGuides}</a>
                <svg className="w-3 h-3 opacity-40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                <span className="text-white/40 truncate">{displayTitle}</span>
              </nav>
            </div>

            <h1 className="text-3xl md:text-5xl font-black mb-10 leading-[1.1] tracking-tight max-w-4xl">
              {displayTitle}
            </h1>

            {displaySubtitle && (
              <p className="text-lg md:text-xl text-white/70 mb-10 max-w-3xl leading-relaxed">
                {displaySubtitle}
              </p>
            )}

            <div className="flex flex-wrap gap-y-4 gap-x-8 items-center text-white/70 text-[13px] font-medium border-t border-white/10 pt-8">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <span>{tAuthor}: <span className="text-white font-bold">{articleData.author || 'TripCNGO'}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span>{tUpdated}: {articleData.createdAt ? new Date(articleData.createdAt).toISOString().split('T')[0] : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                <span>{tInCategory} {articleData.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                <span>{(articleData.views || 0) + 1} {tViews}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area - Server Rendered article body for SEO */}
        <section className="max-w-[1240px] mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16">
            <ArticleDetailClient initialData={articleData} ssrContentRendered={true} ssrArticleContent={displayContent ? marked.parse(displayContent) as string : ''} />
        </section>
      </div>
    </>
  );
}
