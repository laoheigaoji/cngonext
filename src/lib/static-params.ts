// Static params for Next.js static export (output: 'export')
// All dynamic route segments must provide generateStaticParams

export const LANGUAGES = ['cn', 'tw', 'en', 'ja', 'ko', 'ru', 'fr', 'es', 'de', 'it'] as const;

export const CITY_IDS_FALLBACK = [
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
  'LZ1r5Fsq3bOUHUeKVgIv',  // guangzhou from supabase
  'oNIvYqn2fcHSUN6mpv7G',  // shenzhen from supabase
  'XxxHqxEftFPTAfw09w37',  // hangzhou from supabase
  '成都',
];

export const GUIDE_IDS = [
  'vpn',
  'payment',
  'dining',
  'gifts',
  'social',
] as const;

export const ARTICLE_IDS_FALLBACK = [
  'guide-1',
  'guide-2',
  'guide-3',
];

// Fetch IDs dynamically from Supabase for generateStaticParams
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://cxegaqhwexiidezycbyg.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZWdhcWh3ZXhpaWRlenljYnlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk0MjIyNSwiZXhwIjoyMDkzNTE4MjI1fQ.e-OEm6Gtyp8Dp0_dOorW1FSXYjEpvEdDTt6NjPQQ1W8';

async function fetchIdsFromSupabase(table: string, fallback: string[]): Promise<string[]> {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=id`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
    });
    if (!res.ok) return fallback;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return fallback;
    return data.map((item: any) => String(item.id));
  } catch {
    return fallback;
  }
}

export async function getArticleIds(): Promise<string[]> {
  return fetchIdsFromSupabase('articles', ARTICLE_IDS_FALLBACK);
}

export async function getCityIds(): Promise<string[]> {
  return fetchIdsFromSupabase('cities', CITY_IDS_FALLBACK);
}
