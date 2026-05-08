"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from '@/lib/router-compat';
import { useLanguage } from '../../context/LanguageContext';
import { ChevronRight, Heart, Eye } from 'lucide-react';
import SEO from '../../components/SEO';
import { supabase } from '../../lib/supabase';
import { fallbackArticles } from '../../data/fallbackData';

interface Article {
  _id: string;
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  thumbnail?: string;
  category: string;
  views?: number;
  likes?: number;
}

const CATEGORIES = [
  { id: 'All', key: 'guide.cat.all', icon: '📋', count: 54 },
  { id: 'National Policy', key: 'guide.cat.policy', icon: '🛡️', count: 3 },
  { id: 'Payment Methods', key: 'guide.cat.payment', icon: '💳', count: 7 },
  { id: 'Transportation', key: 'guide.cat.transport', icon: '🚌', count: 10 },
  { id: 'Practical Tools', key: 'guide.cat.tools', icon: '🛠️', count: 2 },
  { id: 'City Guide', key: 'guide.cat.city', icon: '🏙️', count: 16 },
  { id: 'Tradition', key: 'guide.cat.tradition', icon: '🎨', count: 9 },
  { id: 'Food Culture', key: 'guide.cat.food', icon: '🥢', count: 7 },
];

export default function GuideList({ initialData }: { initialData?: any[] }) {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  const [articles, setArticles] = useState<Article[]>(() => {
    if (initialData) {
      return initialData.map((doc: any) => ({
        ...doc,
        _id: doc.id,
        views: doc.views || 0,
        likes: doc.likes || 0
      })) as Article[];
    }
    return [];
  });
  const [loading, setLoading] = useState(!initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;
  const langPrefix = language === 'zh' ? 'cn' : language;

  // 获取翻译文本（兼容文章数据，支持蛇形和驼峰命名）
  const getI18n = (item: any, baseField: string) => {
    if (!item) return '';
    
    // 中文：直接返回 baseField（如 title, subtitle）
    if (language === 'zh') {
      return item[baseField] || item.title || item.subtitle || '';
    }
    
    // 蛇形命名格式（如 title_ko, title_tw）和驼峰格式（如 titleKo, titleTw）
    const snakeFieldName = `${baseField}_${language}`;
    const camelFieldName = `${baseField}${language.charAt(0).toUpperCase() + language.slice(1)}`;
    
    return item[snakeFieldName] || item[camelFieldName] || item[`${baseField}En`] || item[`${baseField}_en`] || '';
  };

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        let fetcher = supabase.from('articles').select('*').order('createdAt', { ascending: false });
        if (activeCategory !== 'All') {
          fetcher = fetcher.eq('category', activeCategory);
        }
        
        const { data, error } = await fetcher;
        if (error) throw error;
        
        const mappedData = data?.map((docData: any) => {
          return {
            ...docData,
            _id: docData.id,
            views: docData.views || 0,
            likes: docData.likes || 0
          } as Article;
        }) || [];
        
        setArticles(mappedData);
        setCurrentPage(1); 
      } catch (error) {
        console.error("Error fetching articles:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [activeCategory]);

  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const currentArticles = articles.slice((currentPage - 1) * articlesPerPage, currentPage * articlesPerPage);

  return (
    <div className="w-full bg-[#f7f7f7]">
      <SEO 
        title={t('discover.guides')}
        description={language === 'zh' 
          ? '获取最实用的中国旅行指南：从移动支付、交通换乘到目的地深度文化解析，助力您的每一次探索。' 
          : 'Get the most practical China travel guides: from mobile payments and transportation to in-depth cultural analysis of destinations.'}
        keywords={language === 'zh' ? '中国旅行指南, 中国支付攻略, 中国交通指南, 中国文化百科' : 'China travel guides, China payment guide, China transport guide, Chinese culture wiki'}
      />
      {/* Hero Header */}
      <section className="relative h-[480px] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://static.tripcngo.com/ing/banner_bg_1.jpg" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight"
          >
            {t('discover.guides')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed font-medium"
          >
            {language === 'zh' 
              ? '从掌握移动支付到使用便捷高铁出行，我们的实用指南涵盖您所需的一切，获取交通、住宿和保持联系方面的实用技巧，确保您的旅程顺畅无阻。'
              : 'From mastering mobile payments to high-speed rail, our practical guides cover everything you need to know. Get tips on transport, stay, and connectivity for a smooth journey.'}
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <div className="w-full lg:w-[300px] shrink-0">
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-32">
                <div className="p-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-lg transition-all group ${
                        activeCategory === cat.id 
                        ? 'bg-[#1b887a] text-white shadow-md' 
                        : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{cat.icon}</span>
                        <span className="font-bold text-sm">
                          {t(cat.key)}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        activeCategory === cat.id ? 'bg-white/20' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
             </div>
          </div>

          {/* Main List */}
          <div className="flex-1 space-y-6">
            {loading ? (
              <div className="space-y-6">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row h-[220px] animate-pulse">
                    <div className="md:w-[340px] h-full bg-gray-200" />
                    <div className="flex-1 p-8 space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-1/4" />
                      <div className="h-8 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : currentArticles.length > 0 ? (
              currentArticles.map((article) => (
                <Link 
                  key={article._id} 
                  to={`/${langPrefix}/articles/${article._id}`}
                  className="block group"
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col md:flex-row"
                  >
                    {/* Thumbnail */}
                    <div className="md:w-[340px] h-[220px] shrink-0 relative overflow-hidden">
                      <img 
                        src={article.thumbnail || "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=800"} 
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                           <span className="px-2 py-0.5 bg-[#1b887a]/10 text-[#1b887a] text-[10px] font-bold rounded uppercase tracking-wider">
                              {CATEGORIES.find(c => c.id === article.category)?.key ? t(CATEGORIES.find(c => c.id === article.category)!.key) : article.category}
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
                        <div className="flex items-center gap-6">
                          <div className="text-gray-400 text-xs font-medium flex items-center gap-1">
                            {article.views || 0} {t('guide.views') || 'Views'}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-red-400 transition-colors font-bold text-xs">
                           <Heart className={`w-3.5 h-3.5 ${article.likes && article.likes > 0 ? 'fill-red-400 text-red-400' : ''}`} />
                           <span>{article.likes || 0} {t('guide.helpful') || 'Helpful'}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="bg-white p-20 rounded-2xl text-center shadow-sm">
                 <p className="text-gray-400 font-bold">{t('guide.noArticles')}</p>
              </div>
            )}

            {/* Pagination Placeholder */}
            {totalPages > 1 && (
              <div className="pt-10 flex justify-center gap-2">
                 {Array.from({ length: totalPages }).map((_, i) => {
                   const p = i + 1;
                   return (
                     <button 
                      key={p} 
                      onClick={() => {
                        setCurrentPage(p);
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                        p === currentPage ? 'bg-[#1b887a] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                     >
                       {p}
                     </button>
                   );
                 })}
                 <button 
                  onClick={() => {
                    if (currentPage < totalPages) {
                      setCurrentPage(prev => prev + 1);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }
                  }}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-lg bg-white text-gray-600 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
