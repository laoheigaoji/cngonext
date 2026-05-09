"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronRight, Heart, ThumbsUp, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { useNavigate } from '@/lib/router-compat';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import { fallbackCities, fallbackArticles } from '../data/fallbackData';

interface HomeFAQ {
  id: string;
  sort_order: number;
  q_zh: string | null;
  q_en: string | null;
  q_ja: string | null;
  q_ko: string | null;
  a_zh: string | null;
  a_en: string | null;
  a_ja: string | null;
  a_ko: string | null;
}

// 获取多语言FAQ内容
const getLocalizedFAQ = (faq: HomeFAQ, language: string) => {
  const langMap: Record<string, string> = {
    'zh': 'zh',
    'en': 'en',
    'ja': 'ja',
    'ko': 'ko',
  };
  
  const lang = langMap[language] || 'en';
  const suffix = lang === 'zh' ? '_zh' : `_${lang}`;
  
  return {
    q: (faq as any)[`q${suffix}`] || faq.q_en || '',
    a: (faq as any)[`a${suffix}`] || faq.a_en || '',
  };
};

// 备用FAQ数据（用于数据库连接失败时）
const fallbackFAQS = [
  { 
    q: "这240小时是从什么时候开始计算的?", 
    enQ: "When does the 240 hours start counting?",
    a: "240小时从入境当天的次日零时起计算，出境当天的24时止。例如：12月1日入境，则10天免签期限为12月2日0时至12月11日24时，必须在12月11日24时前出境。",
    enA: "The 240 hours are calculated from 00:00 on the day following the day of entry until 24:00 on the day of exit. For example, if entering on December 1st, the 10-day visa-free period is from 00:00 on December 2nd to 24:00 on December 11th."
  },
  { 
    q: "可以跨省旅游吗?", 
    enQ: "Can I travel across provinces?",
    a: "是的，可以在10天内在免签政策覆盖的省份内自由旅行。",
    enA: "Yes, you can travel freely within the provinces covered by the visa-free policy within 10 days."
  },
  { 
    q: "根据官方政策，我可以从香港进入大陆内地吗?", 
    enQ: "Can I enter mainland China from Hong Kong?",
    a: "不可以，根据政策规定，从香港、澳门、台湾地区入境的外国人不适用于240小时过境免签政策，您需要提前申请相应签证。",
    enA: "No, according to official policy, foreigners entering from Hong Kong, Macau, or Taiwan regions are not eligible for the 240-hour transit visa-free policy and must apply for the appropriate visa in advance."
  },
  { 
    q: "可否入境后再购买出境机票？", 
    enQ: "Can I purchase an outbound ticket after entry?",
    a: "不可以，必须提前持有确定日期和座位的联程票。",
    enA: "No, you must hold confirmed connecting tickets with specific dates and seats in advance."
  },
  { 
    q: "从广州入境上海出境是否允许？", 
    enQ: "Is it allowed to enter in Guangzhou and exit from Shanghai?",
    a: "允许，支持不同口岸出入境。",
    enA: "Yes, different ports of entry and exit are supported."
  },
  { 
    q: "如何办理临时入境许可？", 
    enQ: "How to apply for a temporary entry permit?",
    a: "在指定口岸（如北京首都机场T3航站楼）设有专门柜台，需现场填写《临时入境外国人入境卡》，提交护照+联程机票，经边检审核后发放许可。",
    enA: "Special counters are available at designated ports (e.g., Beijing Capital Airport Terminal 3). You need to fill out the Temporary Entry Card for Foreigners on-site, submit your passport and connecting flight ticket, and the permit will be issued after border inspection approval."
  },
  { 
    q: "从香港/澳门转机是否适用？", 
    enQ: "Is transit via Hong Kong/Macau allowed?",
    a: "允许。例如美国→广州→香港西九龙，凭高铁票可申请免签；加拿大→珠海→澳门，凭船票同样适用。",
    enA: "Yes. For example, USA→Guangzhou→Hong Kong West Kowloon with a high-speed rail ticket is eligible; Canada→Zhuhai→Macau with a ferry ticket is also applicable."
  },
  { 
    q: "联程票可否包含陆路交通？", 
    enQ: "Can connecting tickets include land transportation?",
    a: "允许。如持有广州→香港高铁票、珠海→澳门船票等跨境陆海空联运票据均符合要求。",
    enA: "Yes. Cross-border combined transport tickets such as Guangzhou→Hong Kong high-speed rail tickets and Zhuhai→Macau ferry tickets are acceptable."
  },
  { 
    q: "证件丢失怎么办？", 
    enQ: "What if I lose my documents?",
    a: "立即向停留地公安机关报案，凭《护照报失证明》到出入境管理部门申请停留证件，同时联系本国使领馆补办旅行证件。",
    enA: "Report to the local public security bureau immediately. Apply for a stay permit at the exit-entry administration with the Passport Loss Certificate, and contact your country's embassy or consulate to apply for a new travel document."
  },
  { 
    q: "与互免签证如何选择？", 
    enQ: "How to choose between visa-free and transit visa-free?",
    a: "如属新加坡等互免国公民，建议直接使用30天免签（更灵活）；若仅过境则选240小时免签（无需签证费）。",
    enA: "If you are a citizen of visa-free countries like Singapore, it is recommended to use the 30-day visa-free entry (more flexible); if only transiting, choose the 240-hour transit visa-free (no visa fee required)."
  },
  { 
    q: "超期停留会怎样？", 
    enQ: "What if I overstay?",
    a: "每日处罚款500元，最高可处10日拘留并限期离境，且5年内不得申请过境免签。",
    enA: "A fine of 500 RMB per day will be imposed, with a maximum of 10 days of detention and a deadline for departure. You will also be barred from applying for transit visa-free entry for 5 years."
  },
  { 
    q: "如何查询实时政策？", 
    enQ: "How to check real-time policies?",
    a: "微信搜索\"国家移民管理局\"小程序，或拨打12367热线（支持英/日/韩等8语种服务）。",
    enA: "Search for the 'National Immigration Administration' mini-program on WeChat, or call the 12367 hotline (supporting 8 languages including English, Japanese, and Korean)."
  },
  { 
    q: "哪些行为会被视为非法就业？", 
    enQ: "What is considered illegal employment?",
    a: "包括商业拍摄、网络直播获利、临时授课等，即使未签订劳动合同也可能被认定违法。",
    enA: "This includes commercial filming, profiting from live streaming, and temporary teaching. These can be considered illegal even without a formal labor contract."
  },
  { 
    q: "北京首都机场办理流程有何特殊安排？", 
    enQ: "Special process at Beijing Capital Airport?",
    a: "T3航站楼设立\"过境免签快速通道\"，配备英/日/韩三语服务专员，办理时间缩短至15分钟内。需注意每日22:00-6:00时段需前往24小时应急窗口办理。",
    enA: "Terminal 3 has a 'Transit Visa-Free Fast Track' with trilingual staff (English/Japanese/Korean), reducing processing time to within 15 minutes. Note that from 22:00 to 06:00 daily, you must go to the 24-hour emergency window."
  },
  { 
    q: "上海浦东机场转机如何衔接？", 
    enQ: "How to transfer at Shanghai Pudong Airport?",
    a: "提供\"空铁联运\"服务，持高铁票可在卫星厅直接办理过境手续。例如：巴黎→上海→杭州东站的高铁联程票，可在隔离区内完成所有手续。",
    enA: "An 'Air-Rail Link' service is provided. With a high-speed rail ticket, you can complete transit procedures directly at the satellite terminal. For example, a through ticket from Paris to Shanghai to Hangzhou East can be processed within the sterile area."
  },
  { 
    q: "摄影爱好者有哪些限制？", 
    enQ: "Restrictions for photography enthusiasts?",
    a: "商业拍摄需申请工作签证，但个人旅游拍摄允许。禁飞区（如军事设施周边500米）严禁无人机航拍，违者最高罚款2万元。",
    enA: "Commercial filming requires a work visa, but personal travel photography is allowed. Drones are strictly prohibited in no-fly zones (e.g., within 500m of military facilities), with fines up to 20,000 RMB."
  },
  { 
    q: "联程票改签如何处理？", 
    enQ: "How to handle ticket changes?",
    a: "允许免费改签1次，需在停留期第7天前完成。例如原定D10香港航班改签至D11，需在D7前持新机票到入境口岸边检站备案。",
    enA: "One free ticket change is allowed and must be completed before the 7th day of your stay. For example, if you change a Day 10 flight to Day 11, you must register the new ticket with the border inspection at your port of entry by Day 7."
  },
  { 
    q: "跨境高铁票是否认可？", 
    enQ: "Are cross-border rail tickets recognized?",
    a: "中老铁路（昆明→万象）、中越铁路（南宁→河内）等国际班次车票均被认可，需提供纸质票与电子客票号双验证。",
    enA: "International rail tickets like the China-Laos Railway (Kunming-Vientiane) or China-Vietnam Railway (Nanning-Hanoi) are recognized, requiring both a paper ticket and an e-ticket number for verification."
  },
  { 
    q: "如何通过微信办理预审？", 
    enQ: "How to apply for pre-examination via WeChat?",
    a: "在\"移民局\"小程序提交护照首页+电子机票，AI系统10分钟生成《过境预审码》，可减少口岸办理时间50%。",
    enA: "Submit your passport bio-page and e-ticket in the 'Immigration' mini-program. An AI system generates a 'Transit Pre-examination Code' in 10 minutes, which can reduce port processing time by 50%."
  },
  { 
    q: "哪些行为可能引发误会？", 
    enQ: "Behaviors that might cause misunderstandings?",
    a: "避免在政府机关门前比\"V\"手势拍照、未经许可拍摄少数民族服饰者。宗教场所需注意着装要求（如寺庙不穿短裤入内）。",
    enA: "Avoid taking photos with 'V' signs in front of government offices or filming people in ethnic costumes without permission. Follow dress codes at religious sites (e.g., no shorts in temples)."
  },
  { 
    q: "突发疾病如何就医？", 
    enQ: "How to seek medical care for sudden illness?",
    a: "持护照可在二级以上医院挂急诊，推荐北京协和/上海瑞金等53家涉外医院。保留医疗票据可申请停留延期。",
    enA: "You can go to the emergency department of any Tier 2 or higher hospital with your passport. 53 foreign-related hospitals like Peking Union or Shanghai Ruijin are recommended. Keep medical receipts to apply for a stay extension."
  },
  { 
    q: "突发疾病如何延期？", 
    enQ: "How to extend stay due to illness?",
    a: "需提供医院诊断证明，在停留期满前3个工作日向所在地市级公安局出入境管理处申请，最长可延期30天。",
    enA: "You must provide a hospital diagnosis certificate and apply at the local municipal Public Security Bureau's exit-entry administration office 3 working days before your stay expires. Extensions up to 30 days are possible."
  }
];

interface HomeInitialData {
  articles: any[];
  cities: any[];
  faqs: any[];
}

export default function Home({ initialData }: { initialData?: HomeInitialData }) {
  const { t, language } = useLanguage();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Map initial articles to guide format
  const mapArticlesToGuides = (articles: any[]) => {
    const mappedData = articles.map((doc: any) => ({
       id: doc.id,
       img: doc.thumbnail || '',
       title: doc.title || '',
       enTitle: doc.title_en || doc.title || '',
       jaTitle: doc.title_ja || doc.title_en || doc.title || '',
       koTitle: doc.title_ko || doc.title_en || doc.title || '',
       desc: doc.subtitle || '',
       enDesc: doc.subtitle_en || doc.subtitle || '',
       jaDesc: doc.subtitle_ja || doc.subtitle_en || doc.subtitle || '',
       koDesc: doc.subtitle_ko || doc.subtitle_en || doc.subtitle || '',
       views: doc.views || undefined
    }));
    return mappedData.length > 0 ? mappedData : fallbackArticles;
  };

  const [guides, setGuides] = useState<any[]>(() =>
    initialData?.articles ? mapArticlesToGuides(initialData.articles) : []
  );
  const [cities, setCities] = useState<any[]>(() => initialData?.cities || []);
  const [faqs, setFaqs] = useState<HomeFAQ[]>(() => initialData?.faqs || []);
  const [loading, setLoading] = useState(() => !initialData);
  const navigate = useNavigate();
  const langPrefix = language === 'zh' ? 'cn' : language;

  useEffect(() => {
    // If we already have initialData from SSR, skip the client-side fetch
    if (initialData) return;

    const fetchData = async () => {
      setLoading(true);
      // Parallelize all fetches
      try {
        await Promise.all([
          // Fetch Guides
          (async () => {
            try {
              const { data, error } = await supabase
                .from('articles')
                .select('id, thumbnail, title, title_en, title_ja, title_ko, subtitle, subtitle_en, subtitle_ja, subtitle_ko, views')
                .order('createdAt', { ascending: false })
                .limit(6);
                
              if (error) throw error;

              const mappedData = data?.map((doc: any) => ({
                 id: doc.id,
                 img: doc.thumbnail || '',
                 title: doc.title || '',
                 enTitle: doc.title_en || doc.title || '',
                 jaTitle: doc.title_ja || doc.title_en || doc.title || '',
                 koTitle: doc.title_ko || doc.title_en || doc.title || '',
                 desc: doc.subtitle || '',
                 enDesc: doc.subtitle_en || doc.subtitle || '',
                 jaDesc: doc.subtitle_ja || doc.subtitle_en || doc.subtitle || '',
                 koDesc: doc.subtitle_ko || doc.subtitle_en || doc.subtitle || '',
                 views: doc.views || undefined
              })) || [];
              
              setGuides(mappedData.length > 0 ? mappedData : fallbackArticles);
            } catch (err) {
              console.error("Error fetching latest guides:", err);
            }
          })(),

          // Fetch Cities
          (async () => {
            try {
              const { data, error } = await supabase
                .from('cities')
                .select('*');
                
              if (error) throw error;
              setCities(data || []);
            } catch (err) {
              console.error("Error fetching cities:", err);
            }
          })(),

          // Fetch FAQs
          (async () => {
            try {
              const { data, error } = await supabase
                .from('home_faqs')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });
                
              if (error) throw error;
              setFaqs(data || []);
            } catch (err) {
              console.error("Error fetching FAQs:", err);
            }
          })()
        ]);
      } catch (err) {
        console.error("Global data fetch error in Home:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const [votedCities, setVotedCities] = useState<string[]>([]);

  const toggleWantToVisit = async (e: React.MouseEvent, cityId: string) => {
    e.stopPropagation();
    if (votedCities.includes(cityId)) return;

    setVotedCities(prev => [...prev, cityId]);
    
    // Optimistic UI update
    setCities(prev => prev.map(c => 
      c.id === cityId 
        ? { ...c, stats: { ...c.stats, wantToVisit: (c.stats?.wantToVisit || 0) + 1 } }
        : c
    ));

    try {
      const city = cities.find(c => c.id === cityId);
      if (!city) return;

      const currentStats = city.stats || {};
      const newCount = (currentStats.wantToVisit || 0) + 1;

      await supabase
        .from('cities')
        .update({
          stats: { ...currentStats, wantToVisit: newCount }
        })
        .eq('id', cityId);
    } catch (err) {
      console.error("Error updating heart count:", err);
    }
  };

  const handleSearch = () => {
    const city = cities.find(c => 
      c.name.includes(searchTerm.trim()) || 
      (c.enName && c.enName.toLowerCase().includes(searchTerm.trim().toLowerCase()))
    );
    if (city) {
      navigate(`/${langPrefix}/cities/${city.id}`);
    }
  };

  const filteredCities = searchTerm.trim() 
    ? cities.filter(c => 
        c.name.includes(searchTerm.trim()) || 
        (c.enName && c.enName.toLowerCase().includes(searchTerm.trim().toLowerCase()))
      ).slice(0, 5)
    : [];

  return (
    <div className="w-full bg-[#f7f7f7]">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex px-6 pb-20 pt-32">
        <div className="absolute inset-0 overflow-hidden">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
            src="https://static.tripcngo.com/video/12121.mp4"
            poster="https://static.tripcngo.com/ing/image1.webp"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col justify-end items-center">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              suppressHydrationWarning
              className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-lg"
            >
              {t('hero.ultimate')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              suppressHydrationWarning
              className="text-xl md:text-2xl text-white/90 font-medium drop-shadow-md"
            >
              {t('hero.desc')}
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            suppressHydrationWarning
            className="w-full max-w-[800px] backdrop-blur-xl bg-white/20 p-2 rounded-[2rem] shadow-2xl border border-white/30 relative"
          >
            <div className="flex gap-2 p-1 mb-1">
              <button className="px-6 py-2.5 rounded-full text-[15px] font-bold bg-white text-[#1b887a] shadow-sm">
                {t('hero.dest')}
              </button>
              <button 
                onClick={() => navigate(`/${langPrefix}/tools/name`)}
                className="px-6 py-2.5 rounded-full text-[15px] font-bold text-white hover:bg-white/10 transition-colors"
              >
                {t('hero.aiName')}
              </button>
            </div>
            
            <div className="bg-white rounded-[1.5rem] p-1.5 flex items-center relative group">
              <div className="flex-1 flex items-center px-4">
                <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder={t('hero.searchPlaceholder')} 
                  className="w-full py-3.5 outline-none text-gray-800 text-[16px]"
                />
              </div>
              <button 
                onClick={handleSearch}
                className="bg-[#1b887a] hover:bg-[#008055] text-white px-8 py-3.5 rounded-[1.2rem] font-bold transition-all flex items-center gap-2 active:scale-95 shadow-md flex-shrink-0"
              >
                {t('hero.start')}
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Search Suggestions Dropdown */}
            {isSearchFocused && searchTerm.trim() && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute left-0 right-0 bottom-[calc(100%+12px)] bg-white rounded-2xl shadow-2xl overflow-hidden z-[50] border border-gray-100"
              >
                {filteredCities.length > 0 ? (
                  <div className="p-2">
                    {filteredCities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => navigate(`/${langPrefix}/cities/${city.id}`)}
                        className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left group"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <img 
                            src={city.listCover || city.heroImage || 'https://images.unsplash.com/photo-1540202403-b712e0e026ee?w=100&q=80&auto=format&fit=crop'} 
                            alt={city.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-base">{language === 'zh' ? city.name : (city.enName || city.name)}</div>
                          <div className="text-sm text-gray-500">{language === 'zh' ? city.enName : city.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500 font-medium">
                    {language === 'zh' ? '未找到相关城市' : 'No matching cities found'}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* 240 hours Visa Free Section */}
      <section className="py-24 max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
             <img src="https://static.tripcngo.com/ing/image.png" alt="Visa Free Policy" className="w-full h-auto object-contain" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{t('visa.section.title')}</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              {t('visa.section.desc')}
            </p>
            <div className="grid grid-cols-2 gap-y-10 gap-x-6">
               <div>
                  <div className="font-black text-4xl text-[#1b887a] mb-2">{t('visa.stat.countries')}</div>
                  <div className="text-gray-500 font-medium flex items-center gap-2">{t('visa.stat.countries.desc')}<ChevronRight className="w-4 h-4 text-[#1b887a]"/></div>
               </div>
               <div>
                  <div className="font-black text-4xl text-[#1b887a] mb-2">{t('visa.stat.stay')}</div>
                  <div className="text-gray-500 font-medium flex items-center gap-2">{t('visa.stat.stay.desc')}<ChevronRight className="w-4 h-4 text-[#1b887a]"/></div>
               </div>
               <div>
                  <div className="font-black text-4xl text-gray-900 mb-2">{t('visa.stat.provinces')}</div>
                  <div className="text-gray-500 font-medium flex items-center gap-2">{t('visa.stat.provinces.desc')}<ChevronRight className="w-4 h-4 text-gray-900"/></div>
               </div>
               <div>
                  <div className="font-black text-4xl text-gray-900 mb-2">{t('visa.stat.ports')}</div>
                  <div className="text-gray-500 font-medium flex items-center gap-2">{t('visa.stat.ports.desc')}<ChevronRight className="w-4 h-4 text-gray-900"/></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col items-center justify-center mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t('home.cities.title')}</h2>
            <button className="text-[#1b887a] text-sm font-medium hover:underline" onClick={() => navigate(`/${langPrefix}/cities`)}>
               {t('home.cities.more')}
            </button>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${loading ? 'animate-pulse' : ''}`}>
            {loading ? (
              [...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden h-[300px] flex flex-col shadow-sm">
                    <div className="bg-gray-200 h-[220px] w-full" />
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-center">
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-1/4" />
                    </div>
                  </div>
              ))
            ) : (
              cities.slice(0, 6).map((city) => (
                <div 
                  key={city.id} 
                  className="relative group rounded-xl overflow-hidden cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-all duration-300"
                  onClick={() => navigate(`/${langPrefix}/cities/${city.id}`)}
                >
                  <div className="relative h-[240px] md:h-[260px]">
                    <img src={city.listCover || city.heroImage || city.img} alt={language === 'zh' ? city.name : city.enName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  </div>
                  <div className="p-4 flex items-center justify-between bg-white border-t border-gray-100">
                    <div>
                      <span className="text-[15px] font-bold text-gray-900">{language === 'zh' ? city.name : (city.enName || city.name)}</span>
                      <span className="ml-2 text-xs text-gray-500 font-medium uppercase tracking-wider">{city.enName || city.name}</span>
                    </div>
                    <div className="flex gap-3 text-gray-500">
                      <button 
                        onClick={(e) => toggleWantToVisit(e, city.id)}
                        className={`flex items-center gap-1 text-xs font-medium transition-colors hover:text-red-500 ${votedCities.includes(city.id) ? 'text-red-500' : ''}`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${votedCities.includes(city.id) ? 'fill-red-500 text-red-500' : ''}`} /> 
                        {city.stats?.wantToVisit || 0}
                      </button>
                      <span className="flex items-center gap-1 text-xs font-medium"><ThumbsUp className="w-3.5 h-3.5 text-[#1b887a] fill-[#1b887a]" /> {city.stats?.recommended || 0}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Wandering Guides */}
      <section className="py-20 max-w-[1400px] mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-bold text-gray-900">{t('home.guides.title')}</h2>
          <button className="text-[#1b887a] text-sm font-medium hover:underline" onClick={() => navigate(`/${langPrefix}/articles`)}>
             {t('home.guides.more')}
          </button>
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8 ${loading ? 'animate-pulse' : ''}`}>
          {loading ? (
             [...Array(4)].map((_, i) => (
               <div key={i} className="flex flex-col sm:flex-row gap-5 bg-transparent">
                 <div className="w-full sm:w-[200px] h-[140px] bg-gray-200 rounded-md shadow-sm flex-shrink-0" />
                 <div className="flex-1 space-y-3 py-2">
                   <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                   <div className="h-4 bg-gray-200 rounded w-full"></div>
                   <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                 </div>
               </div>
            ))
          ) : (
            guides.map((guide, i) => {
              // 多语言标题和描述选择
              const displayTitle = language === 'zh' 
                ? guide.title 
                : language === 'ja' 
                  ? guide.jaTitle 
                  : language === 'ko' 
                    ? guide.koTitle 
                    : guide.enTitle || guide.title;
              const displayDesc = language === 'zh' 
                ? guide.desc 
                : language === 'ja' 
                  ? guide.jaDesc 
                  : language === 'ko' 
                    ? guide.koDesc 
                    : guide.enDesc || guide.desc;
              
              return (
             <div key={i} className="flex flex-col sm:flex-row gap-5 bg-transparent cursor-pointer group" onClick={() => navigate(`/${langPrefix}/articles/${guide.id}`)}>
               <div className="w-full sm:w-[200px] h-[140px] overflow-hidden rounded-md flex-shrink-0 shadow-sm border border-gray-200">
                  <img src={guide.img} alt={displayTitle} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
               </div>
               <div className="flex flex-col py-1">
                 <h3 className="text-[17px] font-bold text-gray-900 leading-snug group-hover:text-[#1b887a] transition-colors mb-2 line-clamp-2">
                    {displayTitle}
                 </h3>
                 <p className="text-gray-500 text-[13px] line-clamp-3 mb-3 leading-relaxed">
                   {displayDesc}
                 </p>
                 {guide.views !== undefined && (
                   <div className="mt-auto text-xs flex items-center gap-1">
                     <ThumbsUp className="w-3.5 h-3.5 text-red-500 shrink-0" />
                     <span className="text-red-500 font-medium">{guide.views}</span>
                     <span className="text-gray-500">{t('home.guides.helpful')}</span>
                   </div>
                 )}
               </div>
             </div>
            );
            })
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#f7f7f7]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">{t('home.faq.title')}</h2>
          <p className="text-gray-500 text-center mb-10">{t('home.faq.subtitle')}</p>
          
          <div className="space-y-4">
            {(faqs.length > 0 ? faqs : fallbackFAQS.map((f, i) => ({ ...f, id: String(i) }))).map((faq, i) => {
              // 优先从数据库获取，否则使用备用数据
              const isDbFaq = 'q_zh' in faq;
              const localizedContent = isDbFaq 
                ? getLocalizedFAQ(faq as HomeFAQ, language)
                : { q: (faq as any).q, a: (faq as any).a };
              const displayQ = isDbFaq ? localizedContent.q : (language === 'zh' ? (faq as any).q : (faq as any).enQ);
              const displayA = isDbFaq ? localizedContent.a : (language === 'zh' ? (faq as any).a : (faq as any).enA);
              
              return (
                <div key={i} className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-100 cursor-pointer" onClick={() => setOpenFAQ(openFAQ === i ? null : i)}>
                  <div className="px-6 py-5 flex justify-between items-center text-gray-900 font-bold hover:bg-gray-50 transition-colors border-b border-gray-100/50">
                    <div className="flex gap-4">
                      <span className="text-[#1b887a]">{i + 1}.</span>
                      <span>{displayQ}</span>
                    </div>
                    {openFAQ === i ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                  {openFAQ === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="overflow-hidden"
                    >
                      <div className="px-12 py-5 bg-white text-gray-600 leading-relaxed border-t border-gray-50">
                        {displayA}
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
