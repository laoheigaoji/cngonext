import { MetadataRoute } from 'next';
import { LANGUAGES } from '@/lib/static-params';

const baseUrl = 'https://tripcngo.com';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cxegaqhwexiidezycbyg.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZWdhcWh3ZXhpaWRlenljYnlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk0MjIyNSwiZXhwIjoyMDkzNTE4MjI1fQ.e-OEm6Gtyp8Dp0_dOorW1FSXYjEpvEdDTt6NjPQQ1W8';

const headers = {
  apikey: supabaseKey,
  Authorization: `Bearer ${supabaseKey}`,
};

async function fetchItems(table: string, select: string): Promise<any[]> {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=${select}`, { headers });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

const STATIC_PATHS = [
  { path: '', priority: 1.0, changefreq: 'daily' },
  { path: '/visa', priority: 0.9, changefreq: 'weekly' },
  { path: '/visa/types', priority: 0.8, changefreq: 'monthly' },
  { path: '/visa/fees', priority: 0.8, changefreq: 'monthly' },
  { path: '/visa/photo', priority: 0.8, changefreq: 'monthly' },
  { path: '/visa/form', priority: 0.8, changefreq: 'monthly' },
  { path: '/visa/arrival-card', priority: 0.7, changefreq: 'monthly' },
  { path: '/visa/downloads', priority: 0.7, changefreq: 'monthly' },
  { path: '/cities', priority: 0.8, changefreq: 'weekly' },
  { path: '/guide', priority: 0.9, changefreq: 'daily' },
  { path: '/guide/vpn', priority: 0.8, changefreq: 'monthly' },
  { path: '/guide/payment', priority: 0.8, changefreq: 'monthly' },
  { path: '/guide/dining', priority: 0.8, changefreq: 'monthly' },
  { path: '/guide/gifts', priority: 0.8, changefreq: 'monthly' },
  { path: '/guide/social', priority: 0.8, changefreq: 'monthly' },
  { path: '/articles', priority: 0.8, changefreq: 'daily' },
  { path: '/apps', priority: 0.7, changefreq: 'monthly' },
  { path: '/about', priority: 0.5, changefreq: 'monthly' },
  { path: '/privacy', priority: 0.3, changefreq: 'yearly' },
  { path: '/terms', priority: 0.3, changefreq: 'yearly' },
  { path: '/feedback', priority: 0.4, changefreq: 'monthly' },
  { path: '/tools/zodiac-calculator', priority: 0.6, changefreq: 'monthly' },
  { path: '/tools/name-generator', priority: 0.6, changefreq: 'monthly' },
  { path: '/tools/menu-translator', priority: 0.6, changefreq: 'monthly' },
  { path: '/tools/pinyin-segmentation', priority: 0.5, changefreq: 'monthly' },
  { path: '/tools/character-counter', priority: 0.5, changefreq: 'monthly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cityItems, articleItems] = await Promise.all([
    fetchItems('cities', 'id,updatedAt'),
    fetchItems('articles', 'id,updatedAt'),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const lang of LANGUAGES) {
    // Static pages
    for (const { path, priority, changefreq } of STATIC_PATHS) {
      entries.push({
        url: `${baseUrl}/${lang}${path}`,
        lastModified: new Date(),
        changeFrequency: changefreq as any,
        priority,
      });
    }

    // Dynamic city detail pages
    for (const item of cityItems) {
      const lastMod = item.updatedAt ? new Date(item.updatedAt) : new Date();
      entries.push({
        url: `${baseUrl}/${lang}/cities/${item.id}`,
        lastModified: lastMod,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }

    // Dynamic article detail pages
    for (const item of articleItems) {
      const lastMod = item.updatedAt ? new Date(item.updatedAt) : new Date();
      entries.push({
        url: `${baseUrl}/${lang}/articles/${item.id}`,
        lastModified: lastMod,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
