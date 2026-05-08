import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface TravelGuideItem {
  id: number;
  section: string;
  subsection: string | null;
  key: string;
  lang: string;
  value: string;
  extra: any;
  sort_order: number;
}

export interface GuideData {
  hero: Record<string, string>;
  digital: {
    sectionTitle?: string;
    sectionSubtitle?: string;
    vpn: Record<string, string>;
    payment: Record<string, string>;
  };
  language: {
    vocabulary: Record<string, string>;
  };
  character: Record<string, string>;
  culture: {
    dining: Record<string, string>;
    gift: Record<string, string>;
    social: Record<string, string>;
  };
  paywall: Record<string, string>;
}

export function useTravelGuide(language: string = 'zh') {
  const [data, setData] = useState<GuideData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGuideData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 直接按语言查询
      const { data: guideData, error: fetchError } = await supabase
        .from('travel_guide')
        .select('*')
        .eq('lang', language)
        .order('section')
        .order('sort_order');

      if (fetchError) {
        throw fetchError;
      }

      if (guideData && guideData.length > 0) {
        const organizedData = organizeGuideData(guideData, language);
        setData(organizedData);
      } else {
        // 如果没有数据，设置空数据
        setData({
          hero: {},
          digital: { vpn: {}, payment: {} },
          language: { vocabulary: {} },
          character: {},
          culture: { dining: {}, gift: {}, social: {} },
          paywall: {}
        });
      }
    } catch (err: any) {
      console.error('Error fetching travel guide:', err);
      setError(err.message || 'Failed to load travel guide');
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchGuideData();
  }, [fetchGuideData]);

  return { data, loading, error, refetch: fetchGuideData };
}

function organizeGuideData(items: TravelGuideItem[], currentLanguage: string): GuideData {
  const result: GuideData = {
    hero: {},
    digital: {
      vpn: {},
      payment: {}
    },
    language: {
      vocabulary: {}
    },
    character: {},
    culture: {
      dining: {},
      gift: {},
      social: {}
    },
    paywall: {}
  };

  // 按语言和 key 分组，同一 key 只保留一个语言版本
  const keyMap = new Map<string, TravelGuideItem>();
  
  items.forEach(item => {
    const mapKey = `${item.section}|${item.subsection || ''}|${item.key}`;
    
    // 如果还没有这个 key，直接添加
    if (!keyMap.has(mapKey)) {
      keyMap.set(mapKey, item);
    } else {
      const existing = keyMap.get(mapKey)!;
      // 优先当前语言
      if (item.lang === currentLanguage && existing.lang !== currentLanguage) {
        keyMap.set(mapKey, item);
      }
      // 其次中文
      else if (item.lang === 'zh' && existing.lang !== 'zh' && existing.lang !== currentLanguage) {
        keyMap.set(mapKey, item);
      }
      // 最后英文
      else if (item.lang === 'en' && existing.lang !== 'zh' && existing.lang !== currentLanguage) {
        keyMap.set(mapKey, item);
      }
    }
  });

  // 处理过滤后的数据
  keyMap.forEach(item => {
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

// Helper function to get text with fallback
export function getGuideText(
  data: GuideData | null,
  section: keyof GuideData,
  key: string,
  lang: string,
  fallback: string = ''
): string {
  if (!data) return fallback;
  
  const sectionData = data[section];
  if (typeof sectionData === 'object' && sectionData !== null) {
    const value = (sectionData as any)[key];
    return value || fallback;
  }
  
  return fallback;
}
