"use client";

import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from '@/lib/router-compat';
import { Clock, Navigation, Map, CloudRain, Sun, Cloud, Calendar, Building2, Users, MapPin, Tag, ArrowRight, Star, Plane, TrainFront, BusFront, Car, Bike, Train, Ship } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabase';
import WeatherWidget from '../../components/WeatherWidget';
import WeatherInjector from '../../components/WeatherInjector';
import ShareButton from '../../components/ShareButton';
import { fallbackCities } from '../../data/fallbackData';

const iconMap: Record<string, React.ElementType> = {
  Plane, TrainFront, BusFront, Car, Bike, Train, Ship
};

// Convert video URL to embed URL for iframe
function getEmbedUrl(url: string): string {
  if (!url) return '';
  // YouTube: https://www.youtube.com/watch?v=xxx or https://youtu.be/xxx
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
  // Bilibili: https://www.bilibili.com/video/BVxxx
  const biliMatch = url.match(/bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/);
  if (biliMatch) return `https://player.bilibili.com/player.html?bvid=${biliMatch[1]}&autoplay=1`;
  // Already an embed URL
  if (url.includes('youtube.com/embed/') || url.includes('player.bilibili.com')) {
    return url + (url.includes('?') ? '&' : '?') + 'autoplay=1';
  }
  // Return as-is for other URLs
  return url;
}

export default function CityDetail({ initialData, ssrContentRendered }: { initialData?: any; ssrContentRendered?: boolean }) {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const [city, setCity] = useState<any>(() => initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [voted, setVoted] = useState<Record<string, boolean>>({});
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    // Check local storage for previous votes
    if (id) {
      const wantToVisit = localStorage.getItem(`voted_want_${id}`);
      const recommended = localStorage.getItem(`voted_rec_${id}`);
      setVoted({
        wantToVisit: !!wantToVisit,
        recommended: !!recommended
      });
    }
  }, [id]);

  useEffect(() => {
    // If we have initialData from SSR, skip the fetch
    if (initialData) return;
    const fetchCity = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.from('cities').select('*').eq('id', id).single();
        if (!error && data) {
          setCity(data);
        } else {
          console.warn("No such city with id:", id, error);
          setError(error?.message || "City Not Found");
        }
      } catch (err) {
        console.error("Error fetching city:", err);
        setError("Could not connect to the database. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchCity();
  }, [id]);

  if (loading && !ssrContentRendered) return <div className="p-20 text-center flex flex-col items-center gap-4">
    <div className="w-8 h-8 border-4 border-[#1b887a] border-t-transparent rounded-full animate-spin"></div>
    <div className="text-gray-500 font-medium">Loading destination info...</div>
  </div>;
  
  if (error && !city && !ssrContentRendered) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="bg-red-50 p-8 rounded-2xl border border-red-100 max-w-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Connection Failed</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-[#1b887a] text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (!city && !ssrContentRendered) return <Navigate to="/cities" replace />;

  // If SSR already rendered the content, only render interactive parts
  if (ssrContentRendered && city) {
    return (
      <>
        {/* Inject WeatherWidget into the SSR-rendered info card slot */}
        <WeatherInjector cityName={city.name} enCityName={city.enName} language={language} />

        {/* Video Modal - full screen no border */}
        {showVideoModal && city.videoUrl && (
          <div 
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center" 
            onClick={() => setShowVideoModal(false)}
          >
            <div className="relative w-full max-w-5xl mx-4" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setShowVideoModal(false)}
                className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors flex items-center gap-2 text-sm"
              >
                <span>{isEn ? 'Close' : '关闭'}</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="relative w-full overflow-hidden rounded-2xl" style={{ paddingBottom: '56.25%' }}>
                <iframe 
                  src={getEmbedUrl(city.videoUrl)} 
                  className="absolute inset-0 w-full h-full" 
                  allowFullScreen 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // 从 translations 字段获取翻译内容
  const getTranslation = (lang: string): any => {
    if (!city?.translations) return {};
    return city.translations[lang] || {};
  };
  
  // 获取翻译文本 - 从 translations JSONB 字段读取
  const getI18n = (item: any, baseField: string) => {
    if (!item) return '';
    
    // 中文：直接返回原字段
    if (language === 'zh') {
      return item[baseField] || '';
    }
    
    // 从 translations 获取当前语言的翻译
    const langTranslation = getTranslation(language);
    
    // 先从 translations 中查找
    if (langTranslation && langTranslation[baseField]) {
      return langTranslation[baseField];
    }
    
    // 回退到原字段（如 enParagraphs）
    return item[baseField] || '';
  };
  
  // 获取翻译文本数组（如 paragraphs）
  const getI18nArray = (item: any, baseField: string): string[] => {
    if (!item) return [];
    
    // 中文：直接返回原字段
    if (language === 'zh') {
      return item[baseField] || [];
    }
    
    // 从 translations 获取当前语言的翻译
    const langTranslation = getTranslation(language);
    
    // 先从 translations 中查找
    if (langTranslation && Array.isArray(langTranslation[baseField])) {
      return langTranslation[baseField];
    }
    
    // 回退到原字段
    const result = item[baseField];
    return Array.isArray(result) ? result : [];
  };
  
  // 获取 bestTravelTime 的翻译内容
  const getBestTravelTimeTranslation = () => {
    if (!city?.translations) return null;
    const langTranslation = city.translations[language];
    if (langTranslation?.bestTravelTime) {
      return langTranslation.bestTravelTime;
    }
    return null;
  };
  
  // 获取翻译后的对象数组（如 attractions, history, food）
  const getI18nArrayItems = (baseField: string): any[] => {
    if (language === 'zh') {
      return city?.[baseField] || [];
    }
    
    // 语言代码映射
    const langSuffixMap: Record<string, string> = {
      'en': 'En', 'ja': 'Ja', 'ko': 'Ko', 'ru': 'Ru',
      'fr': 'Fr', 'es': 'Es', 'de': 'De', 'tw': 'Tw', 'it': 'It'
    };
    const suffix = langSuffixMap[language];
    
    const originalItems = city?.[baseField] || [];
    
    // 优先尝试从 translations JSONB 字段获取翻译
    const langTranslation = getTranslation(language);
    if (langTranslation && Array.isArray(langTranslation[baseField])) {
      const translatedItems = langTranslation[baseField];
      return originalItems.map((original: any, idx: number) => ({
        ...original,
        ...(translatedItems[idx] || {})
      }));
    }
    
    // 如果 translations JSONB 中没有翻译，则使用内联翻译字段（如 nameJa, descJa）
    if (suffix && Array.isArray(originalItems)) {
      return originalItems.map((item: any) => {
        const translated: any = { ...item };
        
        // 检查是否有内联翻译字段
        if (item[`name${suffix}`]) {
          translated.name = item[`name${suffix}`];
        }
        if (item[`desc${suffix}`]) {
          translated.desc = item[`desc${suffix}`];
        }
        if (item[`price${suffix}`]) {
          translated.price = item[`price${suffix}`];
        }
        if (item[`title${suffix}`]) {
          translated.title = item[`title${suffix}`];
        }
        if (item[`year${suffix}`]) {
          translated.year = item[`year${suffix}`];
        }
        if (item[`ingredients${suffix}`]) {
          translated.ingredients = item[`ingredients${suffix}`];
        }
        
        return translated;
      });
    }
    
    return originalItems;
  };

  // 获取城市主名称
  const getCityName = () => {
    return getI18n(city, 'name') || city?.name || '';
  };
  
  const getCityEnName = () => city?.enName || '';
  const getCityZhName = () => city?.name || '';

  const handleStatsUpdate = async (field: 'wantToVisit' | 'recommended') => {
    if (!id || !city) return;
    
    const storageKey = field === 'wantToVisit' ? `voted_want_${id}` : `voted_rec_${id}`;
    if (localStorage.getItem(storageKey)) return;

    try {
      // Optimistic update
      setCity((prev: any) => ({
        ...prev,
        stats: {
          ...prev.stats,
          [field]: (prev.stats[field] || 0) + 1
        }
      }));
      setVoted(prev => ({ ...prev, [field]: true }));
      localStorage.setItem(storageKey, 'true');

      const currentStats = city.stats || {};
      const { error } = await supabase.from('cities').update({
        stats: {
          ...currentStats,
          [field]: (currentStats[field] || 0) + 1
        }
      }).eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      // Revert if failed
      setVoted(prev => ({ ...prev, [field]: false }));
      localStorage.removeItem(storageKey);
      // We'd ideally re-fetch or revert state here
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
{/* Hero Section */}
      <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={city.heroImage || 'https://images.unsplash.com/photo-1540202403-b712e0e026ee?w=1600&q=80&auto=format&fit=crop'}
            alt={city.enName} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/60 mix-blend-multiply"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-10 pb-10 border-b border-white/10 flex flex-wrap items-center gap-4 md:gap-5">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-0">
              {getCityName()}
            </h1>
            {getCityEnName() && getCityEnName() !== getCityName() && (
              <span className="text-white/40 font-medium text-2xl md:text-4xl tracking-tight">{getCityEnName()}</span>
            )}
            {language !== 'zh' && getCityZhName() !== getCityName() && (
              <span className="text-white/40 font-medium text-xl md:text-2xl tracking-tight">{getCityZhName()}</span>
            )}
            <div className="flex flex-wrap items-center gap-3 ml-1 md:ml-3">
                {(city.tags || []).map((tag: any, idx: number) => {
                  const langSuffixMap: Record<string, string> = {
                    'en': 'En', 'ja': 'Ja', 'ko': 'Ko', 'ru': 'Ru',
                    'fr': 'Fr', 'es': 'Es', 'de': 'De', 'tw': 'Tw', 'it': 'It'
                  };
                  const suffix = langSuffixMap[language];
                  let tagText = tag.text || '';
                  if (language !== 'zh') {
                    if (suffix && tag[`text${suffix}`]) {
                      tagText = tag[`text${suffix}`];
                    } else {
                      const tagTranslations = getTranslation(language)?.tags?.[idx];
                      if (tagTranslations?.text) {
                        tagText = tagTranslations.text;
                      }
                    }
                  }
                  return (
                    <span key={idx} className="px-5 py-2 bg-[#e6f4ea] text-[#1b887a] rounded-full text-[10px] font-black shadow-sm border border-[#1b887a]/20 tracking-widest uppercase">
                      {tagText}
                    </span>
                  );
                })}
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="col-span-1 lg:col-span-2 text-white">
              <div className="space-y-6 text-white/90 text-base md:text-xl leading-relaxed max-w-4xl">
                {getI18nArray(city, 'paragraphs').map((p: string, idx: number) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-12">
                <button 
                  onClick={() => handleStatsUpdate('wantToVisit')}
                  disabled={voted.wantToVisit}
                  className={`px-6 py-3 rounded-2xl text-sm font-black transition-all flex items-center gap-3 shadow-lg ${
                    voted.wantToVisit 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default' 
                    : 'bg-emerald-500 text-white hover:bg-emerald-400 hover:scale-105 active:scale-95'
                  }`}
                >
                  <Star className={`w-4 h-4 ${voted.wantToVisit ? 'fill-current' : ''}`} />
                  <span>{voted.wantToVisit ? (isEn ? 'Added to Wishlist' : '已在想去清单') : t('city.stats.wantToVisit')}</span> 
                  <span className="bg-black/20 px-2 py-0.5 rounded-lg text-xs">{city.stats?.wantToVisit || 0}</span>
                </button>
                <button 
                  onClick={() => handleStatsUpdate('recommended')}
                  disabled={voted.recommended}
                  className={`px-6 py-3 rounded-2xl text-sm font-black transition-all flex items-center gap-3 shadow-lg ${
                    voted.recommended 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 cursor-default' 
                    : 'bg-blue-500 text-white hover:bg-blue-400 hover:scale-105 active:scale-95'
                  }`}
                >
                  <Tag className={`w-4 h-4 ${voted.recommended ? 'fill-current' : ''}`} />
                  <span>{voted.recommended ? (isEn ? 'Recommended' : '已推荐给他人') : t('city.stats.recommended')}</span> 
                  <span className="bg-black/20 px-2 py-0.5 rounded-lg text-xs">{city.stats?.recommended || 0}</span>
                </button>
                <ShareButton title={getCityName()} url={typeof window !== 'undefined' ? window.location.href : ''} />
              </div>
            </div>

            {/* Weather / Info Card */}
            <div className="col-span-1 border border-white/10 bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 text-white shadow-2xl">
              <WeatherWidget cityName={city.name} enCityName={city.enName} language={language} />

              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
                <div className="text-center">
                  <MapPin className="w-5 h-5 mx-auto text-white/50 mb-2" />
                  <div className="text-xs text-white/50">{t('city.weather.area')}</div>
                  <div className="font-semibold text-lg">{city.translations?.[language]?.info?.area || city.info?.area || '-'}</div>
                </div>
                <div className="text-center">
                  <Users className="w-5 h-5 mx-auto text-white/50 mb-2" />
                  <div className="text-xs text-white/50">{t('city.weather.population')}</div>
                  <div className="font-semibold text-lg">{city.translations?.[language]?.info?.population || city.info?.population || '-'}</div>
                </div>
              </div>
            </div>

            {/* Video Card - only show if videoUrl exists */}
            {city.videoUrl && (
              <div className="col-span-1 border border-white/10 bg-slate-900/60 backdrop-blur-md rounded-2xl overflow-hidden text-white shadow-2xl cursor-pointer group" onClick={() => setShowVideoModal(true)}>
                <div className="relative aspect-video bg-black/40 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1b887a]/20 to-purple-900/20" />
                  <div className="relative w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                    <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs text-white/70 font-medium">{isEn ? 'Watch City Video' : '观看城市视频'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Travel Time */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight text-center md:text-left">
                  {getCityName()}{t('city.bestTime.title')}
                </h2>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative">
                  <div className="absolute top-0 left-8 -translate-y-1/2 text-6xl text-gray-100 font-serif leading-none">"</div>
                  <p className="text-lg text-gray-700 leading-relaxed font-medium mb-4 relative z-10">
                    {t('city.bestTime.descPrefix')}{getCityName()}{t('city.bestTime.descSuffix')}
                    <strong className="text-gray-900 font-bold ml-1">
                      {getBestTravelTimeTranslation()?.strongText || city.bestTravelTime?.strongText || '...'}
                    </strong>.
                  </p>
                  {(getBestTravelTimeTranslation()?.paragraphs || city.bestTravelTime?.paragraphs || []).map((p: string, idx: number) => (
                    <p key={idx} className="text-gray-600 leading-relaxed mb-4 relative z-10">
                      {p}
                    </p>
                  ))}
                  <div className="absolute bottom-0 right-8 translate-y-1/2 text-6xl text-gray-100 font-serif leading-none rotate-180">"</div>
                </div>
              </div>

            {/* History */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight text-center md:text-left">
                  {getCityName()}{t('city.history.title')}
                </h2>
                <div className="relative border-l-2 border-green-100 pl-8 space-y-8 pb-4">
                  {getI18nArrayItems('history').map((item: any, idx: number) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[41px] bg-green-500 w-4 h-4 rounded-full border-4 border-white shadow-sm"></div>
                      <div className="text-sm font-semibold text-green-600 mb-1">{item.year || item.enYear || ''}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title || item.enTitle || ''}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.desc || item.enDesc || ''}</p>
                    </div>
                  ))}
                </div>
              </div>

          </div>
        </div>
      </div>

      {/* Attractions Section */}
      <div className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{getCityName()}{t('city.attractions.title')}</h2>
            <p className="text-gray-500">{t('city.attractions.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getI18nArrayItems('attractions').map((spot: any, idx: number) => (
              <div key={idx} className="bg-white border text-left border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
                <div className="h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#e6f4ea] opacity-30"></div>
                  <img src={spot.imageUrl || `https://images.unsplash.com/photo-1540202403-b712e0e026ee?w=600&q=80&auto=format&fit=crop&random=${idx}`} alt={spot.name} className="w-full h-full object-cover mix-blend-overlay opacity-80 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute z-10 font-bold text-gray-300/80 text-xl tracking-wider flex items-center gap-2">
                    <span className="text-green-700/60">tripcngo</span>
                    <span className="text-gray-500/60">.com</span>
                  </div>
                  {spot.rating && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-2 py-1 rounded-sm flex items-center gap-1 shadow-md">
                      <Star className="w-3 h-3 fill-current" />
                        {spot.rating}
                    </div>
                  )}
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{spot.name || spot.enName || ''}</h3>
                  <div className="text-xs text-gray-400 mb-3 truncate font-medium">{spot.enName || spot.name || ''}</div>
                  <p className="text-base text-green-700 mb-5 line-clamp-2 leading-relaxed flex-grow">{spot.desc || spot.enDesc || ''}</p>
                  
                  <div className="space-y-2 text-xs text-gray-500 border-t border-gray-100 pt-4 font-medium">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-blue-500" />
                      <span>{t('city.attractions.ticket')} {spot.price || spot.enPrice || ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      <span>{t('city.attractions.season')}: {spot.season || spot.enSeason || ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span>{t('city.attractions.time')}: {spot.time || spot.enTime || ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

            {/* Optional World Heritage Section */}
        <div className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{getCityName()}{t('city.heritage.world.title')}</h2>
              <p className="text-gray-500">{t('city.heritage.world.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getI18nArrayItems('worldHeritage').length > 0 ? getI18nArrayItems('worldHeritage').map((heritage: any, idx: number) => (
                <div key={idx} className="relative h-64 rounded-xl overflow-hidden group cursor-pointer text-left">
                  <img src={heritage.imageUrl || `https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=600&q=80&auto=format&fit=crop&random=${idx}`} alt={heritage.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                    {heritage.year || heritage.enYear || ''}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl font-bold text-white mb-2">{heritage.name || heritage.enName || ''}</h3>
                    <p className="text-white/80 text-xs line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">{heritage.desc || heritage.enDesc || ''}</p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 w-full text-center">{t('city.none')}</p>
              )}
            </div>
          </div>
        </div>

       {/* Optional Intangible Cultural Heritage */}
        <div className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{getCityName()}{t('city.heritage.intangible.title')}</h2>
              <p className="text-gray-500">{t('city.heritage.intangible.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {getI18nArrayItems('intangibleHeritage').length > 0 ? getI18nArrayItems('intangibleHeritage').map((item: any, idx: number) => (
                <div key={idx} className={`${idx === 2 && getI18nArrayItems('intangibleHeritage').length === 3 ? 'md:col-span-2' : ''} bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow`}>
                  <div className={`w-full ${idx === 2 && getI18nArrayItems('intangibleHeritage').length === 3 ? 'md:w-1/4' : 'md:w-1/3'} flex-shrink-0 h-40 relative overflow-hidden flex items-center justify-center`}>
                    <div className="absolute inset-0 bg-[#e6f4ea] opacity-30"></div>
                    <img src={item.imageUrl || `https://images.unsplash.com/photo-1544025162-811c75c82de1?w=400&q=80&auto=format&fit=crop&random=${idx}`} alt={item.name} className="w-full h-full object-cover mix-blend-overlay opacity-80" />
                    <div className="absolute z-10 font-bold text-gray-300/80 text-xs tracking-wider flex items-center gap-1">
                      <span className="text-green-700/60">tripcngo</span>
                      <span className="text-gray-500/60">.com</span>
                    </div>
                  </div>
                  <div className="flex-grow flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name || item.enName || ''}</h3>
                    <div className="text-xs text-gray-400 mb-3">{item.year || item.enYear || ''}</div>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {item.desc || item.enDesc || ''}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 w-full text-center">{t('city.none')}</p>
              )}
            </div>
          </div>
        </div>

      {/* Transportation Section */}
      <div className="py-16 bg-white border-t border-gray-100 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{getCityName()}{t('city.transport.title')}</h2>
            <p className="text-gray-500">{t('city.transport.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {getI18nArrayItems('transportation').map((item: any, idx: number) => {
              const Icon = iconMap[item.iconName] || Navigation;
              return (
                <div key={idx} className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{item.title || item.enTitle || ''}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-2">{item.desc || item.enDesc || ''}</p>
                  <p className="text-sm text-gray-500 font-medium">{item.price || item.enPrice || ''}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Food Section */}
      <div className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{getCityName()}{t('city.food.title')}</h2>
            <p className="text-gray-500">{t('city.food.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
            {getI18nArrayItems('food').map((food: any, idx: number) => (
              <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex gap-5 hover:shadow-md transition-shadow">
                <div className="w-32 h-32 flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#e6f4ea] opacity-30"></div>
                  <img src={food.imageUrl || `https://images.unsplash.com/photo-1544025162-811c75c82de1?w=400&q=80&auto=format&fit=crop&random=${food.imageIdx || idx}`} alt={food.name} className="w-full h-full object-cover mix-blend-overlay opacity-80 rounded-lg" />
                  <div className="absolute z-10 font-bold text-gray-300/80 text-xs tracking-wider flex items-center gap-1">
                    <span className="text-green-700/60">tripcngo</span>
                    <span className="text-gray-500/60">.com</span>
                  </div>
                </div>
                <div className="flex-grow flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 inline-block mr-2">{food.name || food.enName || ''}</h3>
                      <span className="text-xs text-gray-400 font-serif italic">{food.pinyin}</span>
                    </div>
                    <span className="text-green-600 font-semibold">{food.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">{food.desc || food.enDesc || ''}</p>
                  <div className="text-xs text-gray-500 mt-auto w-full border-t border-gray-50 pt-2">
                    <strong className="text-gray-700">{t('city.food.ingredients')}: </strong>
                    <span className="line-clamp-1">{food.ingredients || food.enIngredients || ''}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explore Deeper */}
      <div className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">{t('city.explore.title')}</h2>
          <div className="space-y-4">
            {[
              { id: 'travel', title: t('city.explore.travel') },
              { id: 'hotels', title: t('city.explore.hotels') },
              { id: 'tools', title: t('city.explore.tools') }
            ].map((item) => (
              <button key={item.id} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100 text-left cursor-pointer">
                <span className="text-gray-800 font-medium">{item.title}</span>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal - full screen no border */}
      {showVideoModal && city.videoUrl && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center" 
          onClick={() => setShowVideoModal(false)}
        >
          <div className="relative w-full max-w-5xl mx-4" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowVideoModal(false)}
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors flex items-center gap-2 text-sm"
            >
              <span>{isEn ? 'Close' : '关闭'}</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="relative w-full overflow-hidden rounded-2xl" style={{ paddingBottom: '56.25%' }}>
              <iframe 
                src={getEmbedUrl(city.videoUrl)} 
                className="absolute inset-0 w-full h-full" 
                allowFullScreen 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
