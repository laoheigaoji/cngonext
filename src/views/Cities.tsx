"use client";

import React, { useState, useEffect } from 'react';
import { Heart, ThumbsUp } from 'lucide-react';
import { Link } from '@/lib/router-compat';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import { fallbackCities } from '../data/fallbackData';

const ITEMS_PER_PAGE = 9;

export default function Cities({ initialData, skipStaticSections }: { initialData?: any[]; skipStaticSections?: boolean }) {
  const { language, t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [allCities, setAllCities] = useState<any[]>(() => initialData || []);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) return;
    const fetchCities = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('cities').select('*');
        if (error) throw error;
        
        setAllCities(data || []);
      } catch (err) {
        console.error("Error fetching cities:", err);
        setAllCities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  const totalPages = Math.ceil(allCities.length / ITEMS_PER_PAGE);
  const currentCities = allCities.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const langPrefix = language === 'zh' ? 'cn' : language;

  return (
    <>
      {/* Hero & Intro - only render if not already SSR'd */}
      {!skipStaticSections && (<>
      <section className="relative h-[400px] flex items-center pt-16 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://static.tripcngo.com/ing/Fbanner_bg_2.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="max-w-[1240px] w-full mx-auto px-6 relative z-10 text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
            {t('cities.hero.title')}
          </h1>
          <p className="text-white/95 text-base max-w-3xl drop-shadow-md">
            {t('cities.hero.desc')}
          </p>
        </div>
      </section>

      <div className="max-w-[1240px] mx-auto px-6 mt-12 bg-[#f5fff9] rounded border border-green-500 border-dashed p-8 mb-12">
        <div className="text-center mb-6">
          <h2 className="text-[28px] font-bold text-green-600 inline-block">{t('cities.intro.title')}</h2>
        </div>
        <div className="space-y-4 text-[15px] text-gray-700 leading-[1.8]">
          <p>{t('cities.intro.p1')}</p>
          <p>{t('cities.intro.p2')}</p>
          <p>{t('cities.intro.p3')}</p>
          <p>{t('cities.intro.p4')}</p>
          <p>{t('cities.intro.p5')}</p>
          <p>{t('cities.intro.p6')}</p>
        </div>
      </div>
      </>)}

      <div className="max-w-[1240px] mx-auto px-6">
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${loading ? '' : ''}`}>
          {loading ? (
             [...Array(ITEMS_PER_PAGE)].map((_, i) => (
               <div key={i} className="bg-white rounded-md border border-gray-100 overflow-hidden h-[300px] flex flex-col shadow-sm animate-pulse">
                 <div className="bg-gray-200 h-[240px] w-full" />
                 <div className="p-4 space-y-2 flex-1 flex flex-col justify-center">
                   <div className="h-4 bg-gray-200 rounded w-1/2" />
                   <div className="h-3 bg-gray-200 rounded w-1/4" />
                 </div>
               </div>
             ))
          ) : (
            currentCities.map((city) => (
              <Link to={`/${langPrefix}/cities/${city.id}`} key={city.id} className="relative group rounded-md overflow-hidden bg-white border border-gray-100 shadow-sm transition-all duration-300 block">
                 <div className="relative h-[240px] md:h-[260px] overflow-hidden cursor-pointer">
                   <img 
                     src={city.listCover || city.heroImage || city.img} 
                     alt={language === 'zh' ? `${city.name}旅游攻略` : `Travel guide for ${city.enName || city.id}`} 
                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                     loading="lazy"
                   />
                   <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                 </div>
                 <div className="p-4 flex items-center justify-between bg-white border-t border-gray-100">
                   <div>
                     <span className="text-[15px] font-bold text-gray-900">{language === 'zh' ? city.name : city.enName || city.id.charAt(0).toUpperCase() + city.id.slice(1)}</span>
                   </div>
                   <div className="flex gap-2 text-gray-500">
                     <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-gray-50 rounded-full border border-gray-100 whitespace-nowrap"><Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> {(city.stats && city.stats.wantToVisit) || 0} {t('city.stats.wantToVisit')}</span>
                     <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-gray-50 rounded-full border border-gray-100 whitespace-nowrap"><ThumbsUp className="w-3.5 h-3.5 text-green-500 fill-green-500" /> {(city.stats && city.stats.recommended) || 0} {t('city.stats.recommended')}</span>
                   </div>
                 </div>
               </Link>
            ))
          )}
        </div>
        
        {/* Pagination mock */}
        {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded text-sm flex items-center justify-center bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 font-medium font-serif disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ‹
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded text-sm flex items-center justify-center font-medium transition-colors ${
                  currentPage === page 
                    ? 'bg-[#f5fff9] text-green-500 border border-green-500' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded text-sm flex items-center justify-center bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 font-medium font-serif disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ›
            </button>
        </div>
        )}
      </div>
    </>
  );
}
