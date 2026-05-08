// Static params for Next.js static export (output: 'export')
// All dynamic route segments must provide generateStaticParams

export const LANGUAGES = ['cn', 'tw', 'en', 'ja', 'ko', 'ru', 'fr', 'es', 'de', 'it'] as const;

// Fallback IDs used when Supabase is unreachable during build
export const FALLBACK_CITY_IDS = [
  'beijing',
  'shanghai',
  'haikou',
  'fuzhou',
  'harbin',
  'shenyang',
  'ningbo',
  'wuhan',
  'shangrao',
  'zhengzhou',
  'guilin',
  'LZ1r5Fsq3bOUHUeKVgIv',
  'oNIvYqn2fcHSUN6mpv7G',
  'XxxHqxEftFPTAfw09w37',
  '成都',
] as const;

export const FALLBACK_ARTICLE_IDS = [
  'guide-1',
  'guide-2',
  'guide-3',
] as const;

export const GUIDE_IDS = [
  'vpn',
  'payment',
  'dining',
  'gifts',
  'social',
] as const;

// Fetch real IDs from Supabase at build time
async function fetchIdsFromSupabase(table: string): Promise<string[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://cxegaqhwexiidezycbyg.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZWdhcWh3ZXhpaWRlenljYnlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk0MjIyNSwiZXhwIjoyMDkzNTE4MjI1fQ.e-OEm6Gtyp8Dp0_dOorW1FSXYjEpvEdDTt6NjPQQ1W8';

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=id`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.map((row: { id: string }) => row.id);
  } catch (e) {
    console.warn(`Failed to fetch ${table} from Supabase, using fallback IDs`, e);
    return [];
  }
}

let _cachedCityIds: string[] | null = null;
let _cachedArticleIds: string[] | null = null;

export async function getCityIds(): Promise<string[]> {
  if (_cachedCityIds) return _cachedCityIds;
  const ids = await fetchIdsFromSupabase('cities');
  _cachedCityIds = ids.length > 0 ? ids : [...FALLBACK_CITY_IDS];
  return _cachedCityIds;
}

export async function getArticleIds(): Promise<string[]> {
  if (_cachedArticleIds) return _cachedArticleIds;
  const ids = await fetchIdsFromSupabase('articles');
  _cachedArticleIds = ids.length > 0 ? ids : [...FALLBACK_ARTICLE_IDS];
  return _cachedArticleIds;
}

// Sync versions for convenience (use fallback only)
export const CITY_IDS = [...FALLBACK_CITY_IDS];
export const ARTICLE_IDS = [...FALLBACK_ARTICLE_IDS];
