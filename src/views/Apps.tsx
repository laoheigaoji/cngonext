"use client";

import React, { useState, useEffect } from 'react';
import { Plane, Bed, TrainFront, Globe, Youtube, Phone, Music, Shield, Play, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';
import { LucideIcon } from 'lucide-react';

// 从数据库获取的数据类型
interface AppItem {
  id: string;
  category: string;
  sort_order: number;
  name: string;
  name_en?: string;
  name_ja?: string;
  name_ko?: string;
  name_ru?: string;
  name_fr?: string;
  name_es?: string;
  name_de?: string;
  name_tw?: string;
  name_it?: string;
  desc?: string;
  desc_en?: string;
  desc_ja?: string;
  desc_ko?: string;
  desc_ru?: string;
  desc_fr?: string;
  desc_es?: string;
  desc_de?: string;
  desc_tw?: string;
  desc_it?: string;
  logo?: string;
  url?: string;
}

// 菜单项类型
interface MenuItem {
  id: string;
  name: string;
  icon: LucideIcon;
}

// 语言代码到字段后缀的映射
const langSuffixMap: Record<string, string> = {
  'zh': '',
  'en': '_en',
  'ja': '_ja',
  'ko': '_ko',
  'ru': '_ru',
  'fr': '_fr',
  'es': '_es',
  'de': '_de',
  'tw': '_tw',
  'it': '_it',
};

// 分类到菜单名称的映射
const categoryNames: Record<string, Record<string, string>> = {
  apps: { zh: '旅行必备APP', en: 'Essential Apps', ja: '旅行必須APP', ko: '여행 필수 APP', ru: 'Необходимые приложения', fr: 'Apps indispensables', es: 'Apps imprescindibles', de: 'Unverzichtbare Apps', tw: '必備App', it: 'App indispensabili' },
  hotels: { zh: '酒店预定', en: 'Hotel Booking', ja: 'ホテル予約', ko: '호텔 예약', ru: 'Бронирование отелей', fr: 'Réservation d\'hôtels', es: 'Reservas de hoteles', de: 'Hotelbuchungen', tw: '酒店預訂', it: 'Prenotazioni hotel' },
  transit: { zh: '交通出行', en: 'Transportation', ja: '交通出行', ko: '교통出行', ru: 'Транспорт', fr: 'Transports', es: 'Transporte', de: 'Transport', tw: '交通出行', it: 'Trasporti' },
  websites: { zh: '权威网站', en: 'Official Sites', ja: '权威ウェブサイト', ko: '권위 웹사이트', ru: 'Официальные сайты', fr: 'Sites officiels', es: 'Sitios oficiales', de: 'Offizielle Websites', tw: '官網網站', it: 'Siti ufficiali' },
  youtube: { zh: 'YouTube达人', en: 'YouTube Creators', ja: 'YouTube達人', ko: 'YouTube 다자', ru: 'YouTube блогеры', fr: 'Youtubers', es: 'Youtubers', de: 'YouTuber', tw: 'Youtuber', it: 'Youtuber' },
  tiktok: { zh: 'TikTok达人', en: 'TikTok Creators', ja: 'TikTok達人', ko: 'TikTok 다자', ru: 'TikTok блогеры', fr: 'TikTokeurs', es: 'TikTokers', de: 'TikToker', tw: 'TikToker', it: 'TikToker' },
  phones: { zh: '服务热线', en: 'Service Hotlines', ja: 'サービスホットライン', ko: '서비스ホット라인', ru: 'Горячие линии', fr: 'Lignes directes', es: 'Líneas directas', de: 'Hotlines', tw: '服務熱線', it: 'Linee dirette' },
};

// Hero 区域文本
const heroTexts: Record<string, { title: string; subtitle: string; desc: string }> = {
  zh: { title: '中国之旅必备应用 2026', subtitle: '（最新版）', desc: 'Google、Uber 在中国无法使用？无需担心。本指南为您收录 2026 年最受当地人喜爱的必备 App，涵盖移动支付、交通、社交、外卖，让您像本地人一样轻松畅游中国。' },
  en: { title: 'Must-Have Apps for China 2026', subtitle: '(v2.0)', desc: 'Google and Uber don\'t work in China? No worries. This guide lists the 2026 essential apps favored by locals, covering mobile payments, transport, social media, and food delivery, helping you travel China like a pro.' },
  ja: { title: '中国旅行必需的App 2026', subtitle: '（最新板）', desc: 'Google、Uber は中国では使えません？心配はいりません。このガイドでは、2026年に地元の人々に愛される必需Appを紹介しています。モバイル決済、交通、SNS、食品配達などをカバーしています。' },
  ko: { title: '중국 여행 필수 앱 2026', subtitle: '（최신판）', desc: 'Google, Uber在中国无法使用？无需担心.本指南为您收录2026年最受当地人喜爱的必备App，涵盖移动支付、交通、社交媒体、外卖，让您像本地人一样轻松畅游中国。' },
  ru: { title: 'Необходимые приложения для Китая 2026', subtitle: '(Последняя версия)', desc: 'Google и Uber не работают в Китае? Не беспокойтесь. Этот гид собрал лучшие приложения 2026 года, популярные среди местных жителей: мобильные платежи, транспорт, социальные сети и доставка еды.' },
  fr: { title: 'Applications indispensables pour la Chine 2026', subtitle: '(Dernière version)', desc: 'Google et Uber ne fonctionnent pas en Chine ? Pas de souci. Ce guide recense les meilleures applications de 2026 appréciées des locaux.' },
  es: { title: 'Aplicaciones imprescindibles para China 2026', subtitle: '(Última versión)', desc: '¿Google y Uber no funcionan en China? No te preocupes. Esta guía recopila las mejores aplicaciones de 2026 apreciadas por los locales.' },
  de: { title: 'Unverzichtbare Apps für China 2026', subtitle: '(Neueste Version)', desc: 'Funktionieren Google und Uber nicht in China? Keine Sorge. Dieser Leitfaden listet die besten Apps von 2026 auf, die bei Einheimischen beliebt sind.' },
  tw: { title: '2026年中國必備App', subtitle: '（最新版本）', desc: 'Google和Uber在中國不能用？沒關係。本指南為您整理了2026年最受當地人喜愛的最佳App：行動支付、交通、社交媒體和外賣。' },
  it: { title: 'App indispensabili per la Cina 2026', subtitle: '(Ultima versione)', desc: 'Google e Uber non funzionano in Cina? Nessun problema. Questa guida raccoglie le migliori app del 2026 apprezzate dagli locals.' },
};

export default function Apps({ initialData }: { initialData?: any[] }) {
  const { language, t } = useLanguage();
  const [activeSection, setActiveSection] = useState('apps');
  const [appData, setAppData] = useState<AppItem[]>(() => (initialData || []) as AppItem[]);
  const [loading, setLoading] = useState(!initialData);

  // 从数据库获取数据
  useEffect(() => {
    if (initialData) return;
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('apps_catalog')
          .select('*')
          .eq('is_active', true)
          .order('category')
          .order('sort_order');
        
        if (error) throw error;
        setAppData(data || []);
      } catch (error) {
        console.error('Error fetching apps data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [initialData]);

  // 菜单配置
  const iconMap: Record<string, LucideIcon> = {
    apps: Plane,
    hotels: Bed,
    transit: TrainFront,
    websites: Globe,
    youtube: Youtube,
    tiktok: Music,
    phones: PhoneCall,
  };

  // 根据当前语言获取菜单项
  const menuItems: MenuItem[] = Object.keys(categoryNames).map(cat => ({
    id: cat,
    name: categoryNames[cat][language] || categoryNames[cat]['en'] || cat,
    icon: iconMap[cat] || Globe,
  }));

  // 根据语言获取字段值
  const getLocalizedValue = (item: AppItem, field: 'name' | 'desc'): string => {
    const suffix = langSuffixMap[language] || '_en';
    const localizedField = suffix === '' ? field : `${field}${suffix}`;
    
    return (item as any)[localizedField] || 
           (item as any)[`${field}_en`] || 
           (item as any)[field] || 
           '';
  };

  // 监听滚动以更新活动分类
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) {
        setActiveSection(visible.target.id.replace('section-', ''));
      }
    }, { rootMargin: '-20% 0px -60% 0px' });

    // 等待 DOM 渲染完成后观察
    const timeoutId = setTimeout(() => {
      menuItems.forEach(item => {
        const el = document.getElementById(`section-${item.id}`);
        if (el) observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [appData, language]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(`section-${id}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // 按分类分组数据
  const groupedData = menuItems.map(menu => ({
    ...menu,
    items: appData.filter(item => item.category === menu.id),
  }));

  // 获取当前语言的 Hero 文本
  const heroText = heroTexts[language] || heroTexts['en'];

  if (loading) {
    return (
      <div className="w-full bg-[#f9f9f9] pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f9f9f9] pb-20">
      <SEO 
        title={t('nav.catalog')}
        description={heroText.desc}
      />
      {/* Header Banner */}
      <section className="relative h-[480px] flex items-center pt-16 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://static.tripcngo.com/ing/mulubg.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        
        <div className="max-w-[1240px] w-full mx-auto px-6 relative z-10 text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md tracking-tight">
            {heroText.title}<span className="text-white/90 font-normal">{heroText.subtitle}</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed drop-shadow-sm font-medium">
            {heroText.desc}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1280px] mx-auto px-6 mt-12 flex flex-col lg:flex-row gap-8 lg:gap-12 relative items-start">
        
        {/* Left Sidebar Menu */}
        <div className="hidden lg:block lg:w-[240px] flex-shrink-0 sticky top-24 z-20">
           <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
             <nav className="space-y-1">
               {menuItems.map((item) => {
                 const isActive = activeSection === item.id;
                 return (
                   <a 
                     key={item.id}
                     href={`#section-${item.id}`} 
                     onClick={(e) => scrollToSection(e, item.id)}
                     className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                       isActive 
                         ? 'bg-green-50 text-green-600 font-bold' 
                         : 'text-gray-600 hover:bg-gray-50 font-medium'
                     }`}
                   >
                     <item.icon className="w-[18px] h-[18px]" /> {item.name}
                   </a>
                 );
               })}
             </nav>
           </div>
        </div>

        {/* Dynamic Content Sections */}
        <div className="flex-1 space-y-12">
           {groupedData.map((section) => (
             <section key={section.id} id={`section-${section.id}`} className="scroll-mt-24">
               <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <section.icon className="w-6 h-6" />
                 {section.name}
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {section.items.map((item) => (
                    <a 
                      key={item.id}
                      href={item.url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white border border-gray-100 rounded-2xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer group"
                    >
                      {item.logo ? (
                        <img src={item.logo} className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm bg-gray-100 flex-shrink-0" alt={getLocalizedValue(item, 'name')} />
                      ) : (
                        <div className="w-[52px] h-[52px] rounded-[14px] bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-500 border border-gray-100 shadow-sm">
                          <PhoneCall className="w-6 h-6" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-green-600 transition-colors">{getLocalizedValue(item, 'name')}</h3>
                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">{getLocalizedValue(item, 'desc')}</p>
                      </div>
                    </a>
                 ))}
               </div>
             </section>
           ))}

           {/* Ad Banner Mock */}
           <div className="mt-16 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-8 justify-between">
              <span className="absolute top-2 right-2 text-[10px] text-blue-400 bg-blue-50 px-1 py-[2px] rounded flex items-center border border-blue-100">
                {language === 'zh' ? '广告' : language === 'en' ? 'Ads' : '広告'}
              </span>
              <div className="w-full md:w-[300px] h-[200px] md:h-[180px] bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 shadow-inner">
                 <img src="https://images.unsplash.com/photo-1541348263662-e06836264be4?auto=format&fit=crop&q=80&w=800" alt="F1 Race" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-center md:text-left flex flex-col justify-center items-center md:items-start py-4">
                 <h3 className="text-3xl font-bold mb-4 whitespace-nowrap">Spa 2026 Tickets</h3>
                 <div className="flex items-center justify-between w-full mt-auto">
                    <div className="flex items-center gap-2 bg-yellow-400 font-bold px-2 py-1 rounded w-max text-sm">
                      <div className="w-6 h-6 bg-black rounded-lg text-yellow-400 flex items-center justify-center text-xs relative">
                         G<div className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      </div>
                      Global-Tickets
                    </div>
                    <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors shadow-md">
                      Book Now
                    </button>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
