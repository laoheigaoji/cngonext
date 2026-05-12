// Server-side data fetching utilities for SSR/SSG
// Used in page.tsx server components to pre-fetch data for SEO

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://cxegaqhwexiidezycbyg.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZWdhcWh3ZXhpaWRlenljYnlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk0MjIyNSwiZXhwIjoyMDkzNTE4MjI1fQ.e-OEm6Gtyp8Dp0_dOorW1FSXYjEpvEdDTt6NjPQQ1W8';

const headers = {
  apikey: supabaseKey,
  Authorization: `Bearer ${supabaseKey}`,
};

async function fetchFromSupabase(table: string, query: string): Promise<any[] | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    const res = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
      headers,
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchSingleFromSupabase(table: string, query: string): Promise<any | null> {
  const data = await fetchFromSupabase(table, query);
  return data && data.length > 0 ? data[0] : null;
}

// Home page data
export async function getHomeData() {
  const [articles, cities, allCityNames, faqs] = await Promise.all([
    fetchFromSupabase('articles', 'select=id,thumbnail,title,title_en,title_ja,title_ko,subtitle,subtitle_en,subtitle_ja,subtitle_ko,views&order=createdAt.desc&limit=6'),
    fetchFromSupabase('cities', 'select=id,name,enName,listCover,heroImage,img,stats&order=created_at.asc&limit=10'),
    fetchFromSupabase('cities', 'select=id,name,enName&order=name.asc'),
    fetchFromSupabase('home_faqs', 'select=*&is_active=eq.true&order=sort_order.asc'),
  ]);
  return { articles: articles || [], cities: cities || [], allCityNames: allCityNames || [], faqs: faqs || [] };
}

// Cities list page data
export async function getCitiesListData() {
  const data = await fetchFromSupabase('cities', 'select=id,name,enName,listCover,heroImage,img,stats&order=name.asc');
  return data || [];
}

// Articles/GuideList page data
export async function getArticlesListData() {
  const data = await fetchFromSupabase('articles', 'select=*&order=createdAt.desc');
  return data || [];
}

// Guide detail page data (travel_guide table)
export async function getGuideDetailData(guideId: string, language: string = 'zh') {
  const data = await fetchFromSupabase('travel_guide', `select=*&lang=eq.${language}&order=section.asc&sort_order.asc`);
  return data || [];
}

// Guide subsection data for /guide/[id] pages (vpn, payment, dining, gifts, social)
export async function getGuideSubsectionData(subsection: string, language: string = 'zh') {
  const data = await fetchFromSupabase('travel_guide', `select=*&subsection=eq.${subsection}&order=sort_order.asc`);
  if (!data || data.length === 0) return null;
  
  // Get values by key, preferring current language then zh then en
  const getByKey = (key: string) => {
    const match = data.find((item: any) => item.key === key && item.lang === language.replace('cn', 'zh'));
    if (match) return match.value;
    const matchZh = data.find((item: any) => item.key === key && item.lang === 'zh');
    if (matchZh) return matchZh.value;
    const matchEn = data.find((item: any) => item.key === key && item.lang === 'en');
    return matchEn?.value || '';
  };

  const title = getByKey('title') || getByKey('sectionTitle');
  const subtitle = getByKey('subtitle') || getByKey('sectionSubtitle');
  
  return {
    id: subsection,
    title,
    titleEn: title,
    subtitle,
    subtitleEn: subtitle,
    category: subsection,
    views: 0,
    likes: 0,
    createdAt: new Date().toISOString(),
  };
}

// Article detail page data
export async function getArticleData(id: string) {
  return fetchSingleFromSupabase('articles', `id=eq.${id}&select=*`);
}

// City detail page data
export async function getCityData(id: string) {
  return fetchSingleFromSupabase('cities', `id=eq.${id}&select=*`);
}

// Page sections (about, terms, privacy)
export async function getPageSections(pageKey: string) {
  const data = await fetchFromSupabase('page_sections', `page_key=eq.${pageKey}&is_active=eq.true&order=sort_order.asc&select=*`);
  return data || [];
}

// Apps catalog data
export async function getAppsData() {
  const data = await fetchFromSupabase('apps_catalog', 'select=*&order=sort_order.asc');
  return data || [];
}

// Visa types and fees data are now static (see src/data/visa-data.ts)
// Removed getVisaTypesData() and getVisaFeesData() - no longer needed

// Guide page data (organized travel_guide data)
export async function getGuidePageData(language: string = 'zh') {
  const data = await fetchFromSupabase('travel_guide', `lang=eq.${language}&select=*&order=section.asc&sort_order.asc`);
  if (!data || data.length === 0) return null;
  
  // Organize data the same way as useTravelGuide hook
  const result: Record<string, any> = {
    hero: {},
    digital: { vpn: {}, payment: {} },
    language: { vocabulary: {} },
    character: {},
    culture: { dining: {}, gift: {}, social: {} },
    paywall: {}
  };

  const keyMap = new Map<string, any>();
  data.forEach((item: any) => {
    const mapKey = `${item.section}|${item.subsection || ''}|${item.key}`;
    if (!keyMap.has(mapKey)) {
      keyMap.set(mapKey, item);
    } else {
      const existing = keyMap.get(mapKey)!;
      if (item.lang === language && existing.lang !== language) {
        keyMap.set(mapKey, item);
      } else if (item.lang === 'zh' && existing.lang !== 'zh' && existing.lang !== language) {
        keyMap.set(mapKey, item);
      } else if (item.lang === 'en' && existing.lang !== 'zh' && existing.lang !== language) {
        keyMap.set(mapKey, item);
      }
    }
  });

  keyMap.forEach((item: any) => {
    const { section, subsection, key, value } = item;
    switch (section) {
      case 'hero':
        result.hero[key] = value;
        break;
      case 'digital':
        if (subsection === 'vpn') {
          result.digital.vpn[key] = value;
        } else if (subsection === 'payment') {
          result.digital.payment[key] = value;
        } else if (key === 'sectionTitle') {
          result.digital.sectionTitle = value;
        } else if (key === 'sectionSubtitle') {
          result.digital.sectionSubtitle = value;
        }
        break;
      case 'language':
        if (subsection === 'vocabulary') {
          result.language.vocabulary[key] = value;
        }
        break;
      case 'character':
        result.character[key] = value;
        break;
      case 'culture':
        if (subsection === 'dining') {
          result.culture.dining[key] = value;
        } else if (subsection === 'gift') {
          result.culture.gift[key] = value;
        } else if (subsection === 'social') {
          result.culture.social[key] = value;
        }
        break;
      case 'paywall':
        result.paywall[key] = value;
        break;
    }
  });

  return result;
}

// Related articles for name generator tool
export async function getNameRelatedArticles() {
  const data = await fetchFromSupabase('articles', 'select=id,title,title_en,title_ja,title_ko,title_tw,subtitle,subtitle_en,subtitle_ja,subtitle_ko,thumbnail,category&order=createdAt.desc');
  if (!data) return [];
  // Filter articles related to Chinese names / naming
  const keywords = ['姓名', '姓氏', '取名', '命名', '复姓', '中文名', '名字', 'surname', 'nickname', 'Chinese name'];
  return data.filter((a: any) =>
    keywords.some(k => (a.title || '').includes(k) || (a.title_en || '').toLowerCase().includes(k))
  ).slice(0, 6);
}

// Translations data
export async function getTranslations(language: string, categories: string[]) {
  const categoryFilter = categories.map(c => `category.eq.${c}`).join(',');
  const data = await fetchFromSupabase('translations', `lang=eq.${language}&or=(${categoryFilter})&select=key,value`);
  if (!data) return {};
  const map: Record<string, string> = {};
  data.forEach((item: { key: string; value: string }) => { map[item.key] = item.value; });
  return map;
}
