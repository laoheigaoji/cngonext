import GuideListClient from "./GuideListClient";
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

// SSR: Hero + Category Menu are static, articles list rendered from server data
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  let initialData = null;

  try {
    initialData = await getArticlesListData();
  } catch (e) {
    console.error('Failed to fetch articles data:', e);
  }

  // Get translations for static SSR sections
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

  return (
    <div className="w-full bg-[#f7f7f7]">
      {/* Hero - SSR, no JS dependency, instant */}
      <ArticlesHero
        title={t['guide.hero.title']}
        desc={t['guide.hero.desc']}
      />

      {/* Content Section - SSR category menu + client article list */}
      <section className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - SSR Categories, no JS needed */}
          <div className="w-full lg:w-[300px] shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-32">
              <div className="p-2">
                {[
                  { id: 'All', label: t['guide.cat.all'], icon: '📋', count: initialData?.length || 0 },
                  { id: 'National Policy', label: t['guide.cat.policy'], icon: '🛡️', count: initialData?.filter((a: any) => a.category === 'National Policy').length || 0 },
                  { id: 'Payment Methods', label: t['guide.cat.payment'], icon: '💳', count: initialData?.filter((a: any) => a.category === 'Payment Methods').length || 0 },
                  { id: 'Transportation', label: t['guide.cat.transport'], icon: '🚌', count: initialData?.filter((a: any) => a.category === 'Transportation').length || 0 },
                  { id: 'Practical Tools', label: t['guide.cat.tools'], icon: '🛠️', count: initialData?.filter((a: any) => a.category === 'Practical Tools').length || 0 },
                  { id: 'City Guide', label: t['guide.cat.city'], icon: '🏙️', count: initialData?.filter((a: any) => a.category === 'City Guide').length || 0 },
                  { id: 'Tradition', label: t['guide.cat.tradition'], icon: '🎨', count: initialData?.filter((a: any) => a.category === 'Tradition').length || 0 },
                  { id: 'Food Culture', label: t['guide.cat.food'], icon: '🥢', count: initialData?.filter((a: any) => a.category === 'Food Culture').length || 0 },
                ].map((cat) => (
                  <div key={cat.id} data-category={cat.id} className="guide-category-btn w-full flex items-center justify-between p-4 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{cat.icon}</span>
                      <span className="font-bold text-sm">{cat.label}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      {cat.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main List - Client-side for interactivity (filtering, pagination) */}
          <GuideListClient initialData={initialData ?? undefined} skipHero />
        </div>
      </section>
    </div>
  );
}
