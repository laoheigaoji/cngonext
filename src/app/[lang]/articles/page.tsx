import React from "react";
import ArticlesHero from "@/components/ArticlesHero";
import { getArticlesListData } from "@/lib/server-data";
import { getSEO, articlesSEO, getHreflangAlternates, baseUrl, defaultOgImage } from "@/lib/seo-config";
import { getServerTranslations } from "@/lib/server-i18n";
import { LANGUAGES } from "@/lib/static-params";

export function generateStaticParams() {
  return LANGUAGES.map(lang => ({ lang }));
}

export const revalidate = false;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(articlesSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/articles`,
      languages: getHreflangAlternates('/articles'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/articles`,
      siteName: 'tripcngo.com',
      images: [{ url: defaultOgImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [defaultOgImage],
    },
  };
}

const CATEGORIES = [
  { id: 'All', icon: '📋', labelKey: 'guide.cat.all' },
  { id: 'National Policy', icon: '🛡️', labelKey: 'guide.cat.policy' },
  { id: 'Payment Methods', icon: '💳', labelKey: 'guide.cat.payment' },
  { id: 'Transportation', icon: '🚌', labelKey: 'guide.cat.transport' },
  { id: 'Practical Tools', icon: '🛠️', labelKey: 'guide.cat.tools' },
  { id: 'City Guide', icon: '🏙️', labelKey: 'guide.cat.city' },
  { id: 'Tradition', icon: '🎨', labelKey: 'guide.cat.tradition' },
  { id: 'Food Culture', icon: '🥢', labelKey: 'guide.cat.food' },
];

const FILTER_CSS = `
.articles-filter { display: flex; flex-direction: column; gap: 4px; }
.articles-filter label {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; border-radius: 8px; cursor: pointer;
  color: #374151; font-weight: 700; font-size: 14px;
  transition: all 0.15s;
}
.articles-filter label:hover { background: #f9fafb; }
.articles-filter input { position: absolute; opacity: 0; pointer-events: none; }
.articles-filter input:checked + label {
  background: #1b887a; color: #fff; box-shadow: 0 4px 6px -1px rgba(0,0,0,.1);
}
.articles-filter input:checked + label:hover { background: #16796d; }
.articles-filter input:checked + label .cat-badge { background: rgba(255,255,255,.2); color: #fff; }
.cat-badge {
  font-size: 12px; padding: 2px 8px; border-radius: 9999px;
  background: #f3f4f6; color: #6b7280;
}
.article-group { display: none; flex-direction: column; gap: 24px; }
.article-group.active { display: flex; }
`;

// Fully static: all data + all HTML rendered at build time, zero client JS for content
// Uses CSS :has() for category filtering - works without JavaScript
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const langPrefix = lang === 'zh' ? 'cn' : lang;

  let allArticles: any[] = [];
  try {
    allArticles = await getArticlesListData();
  } catch (e) {
    console.error('Failed to fetch articles data:', e);
  }

  const t = getServerTranslations(lang, [
    'guide.hero.title',
    'guide.hero.desc',
    'guide.cat.all',
    'guide.cat.policy',
    'guide.cat.payment',
    'guide.cat.transport',
    'guide.cat.tools',
    'guide.cat.city',
    'guide.cat.tradition',
    'guide.cat.food',
    'guide.noArticles',
    'guide.views',
    'guide.helpful',
  ]);

  const catLabelMap: Record<string, string> = {};
  for (const cat of CATEGORIES) {
    catLabelMap[cat.id] = t[cat.labelKey];
  }

  const catCountMap: Record<string, number> = { 'All': allArticles.length };
  for (const cat of CATEGORIES) {
    if (cat.id !== 'All') {
      catCountMap[cat.id] = allArticles.filter((a: any) => a.category === cat.id).length;
    }
  }

  const getI18n = (item: any, baseField: string) => {
    if (!item) return '';
    if (lang === 'zh' || lang === 'cn') {
      return item[baseField] || item.title || item.subtitle || '';
    }
    const snakeFieldName = `${baseField}_${lang}`;
    const camelFieldName = `${baseField}${lang.charAt(0).toUpperCase() + lang.slice(1)}`;
    return item[snakeFieldName] || item[camelFieldName] || item[`${baseField}En`] || item[`${baseField}_en`] || '';
  };

  return (
    <div className="w-full bg-[#f7f7f7]">
      <ArticlesHero title={t['guide.hero.title']} desc={t['guide.hero.desc']} />

      <section className="max-w-[1400px] mx-auto px-6 py-16">
        <style dangerouslySetInnerHTML={{ __html: FILTER_CSS }} />
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - pure CSS radio-based filtering, zero JS */}
          <div className="w-full lg:w-[300px] shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-32 p-2 articles-filter">
              {CATEGORIES.map((cat, i) => (
                <React.Fragment key={cat.id}>
                  <input
                    type="radio"
                    name="article-cat"
                    id={`cat-${cat.id}`}
                    defaultChecked={i === 0}
                    className="sr-only"
                  />
                  <label htmlFor={`cat-${cat.id}`}>
                    <span className="flex items-center gap-3">
                      <span className="text-xl">{cat.icon}</span>
                      <span>{catLabelMap[cat.id]}</span>
                    </span>
                    <span className="cat-badge">{catCountMap[cat.id] || 0}</span>
                  </label>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Article list - pre-rendered per category, CSS toggles visibility */}
          <div className="flex-1">
            {CATEGORIES.map((cat) => {
              const catArticles = cat.id === 'All' ? allArticles : allArticles.filter((a: any) => a.category === cat.id);
              return (
                <div key={cat.id} className={`article-group${cat.id === 'All' ? ' active' : ''}`} data-cat={cat.id}>
                  {catArticles.length > 0 ? (
                    catArticles.map((article: any) => (
                      <a
                        key={article.id || article._id}
                        href={`/${langPrefix}/articles/${article.id || article._id}`}
                        className="block group"
                      >
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col md:flex-row">
                          <div className="md:w-[340px] h-[220px] shrink-0 relative overflow-hidden">
                            <img
                              src={article.thumbnail || "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=800"}
                              alt={getI18n(article, 'title') || article.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-1 p-8 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 bg-[#1b887a]/10 text-[#1b887a] text-[10px] font-bold rounded uppercase tracking-wider">
                                  {catLabelMap[article.category] || article.category}
                                </span>
                              </div>
                              <h2 className="text-2xl font-black text-gray-900 group-hover:text-[#1b887a] transition-colors mb-3 leading-tight">
                                {getI18n(article, 'title') || article.title}
                              </h2>
                              <p className="text-gray-500 text-sm md:text-base line-clamp-3 leading-relaxed mb-6">
                                {getI18n(article, 'subtitle') || article.subtitle}
                              </p>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                              <div className="text-gray-400 text-xs font-medium flex items-center gap-1">
                                {article.views || 0} {t['guide.views']}
                              </div>
                              <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-red-400 transition-colors font-bold text-xs">
                                <svg className="w-3.5 h-3.5" fill={article.likes > 0 ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                <span>{article.likes || 0} {t['guide.helpful']}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    ))
                  ) : (
                    <div className="bg-white p-20 rounded-2xl text-center shadow-sm">
                      <p className="text-gray-400 font-bold">{t['guide.noArticles']}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Inline script for category filtering - tiny, no framework needed */}
      <script dangerouslySetInnerHTML={{ __html: `
document.addEventListener('click', function(e) {
  var lbl = e.target.closest('.articles-filter label');
  if (!lbl) return;
  var input = lbl.previousElementSibling;
  if (!input) return;
  var cat = input.id.replace('cat-', '');
  document.querySelectorAll('.article-group').forEach(function(g) {
    g.classList.toggle('active', g.getAttribute('data-cat') === cat);
  });
});
      `}} />
    </div>
  );
}
