"use client";

import React, { useState } from 'react';
import { Heart, ThumbsUp } from 'lucide-react';
import { Link } from '@/lib/router-compat';

const ITEMS_PER_PAGE = 9;

export default function CitiesClient({ cities, lang, t }: { cities: any[]; lang: string; t: Record<string, string> }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(cities.length / ITEMS_PER_PAGE);
  const currentCities = cities.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const langPrefix = lang === 'zh' ? 'cn' : lang;

  return (
    <div className="max-w-[1240px] mx-auto px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentCities.map((city) => (
          <Link to={`/${langPrefix}/cities/${city.id}`} key={city.id} className="relative group rounded-md overflow-hidden bg-white border border-gray-100 shadow-sm transition-all duration-300 block">
            <div className="relative h-[240px] md:h-[260px] overflow-hidden cursor-pointer">
              <img 
                src={city.listCover || city.heroImage || city.img} 
                alt={lang === 'zh' ? `${city.name}旅游攻略` : `Travel guide for ${city.enName || city.id}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
            </div>
            <div className="p-4 flex items-center justify-between bg-white border-t border-gray-100">
              <div>
                <span className="text-[15px] font-bold text-gray-900">{lang === 'zh' ? city.name : city.enName || city.id.charAt(0).toUpperCase() + city.id.slice(1)}</span>
              </div>
              <div className="flex gap-2 text-gray-500">
                <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-gray-50 rounded-full border border-gray-100 whitespace-nowrap"><Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> {(city.stats && city.stats.wantToVisit) || 0} {t['city.stats.wantToVisit']}</span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-gray-50 rounded-full border border-gray-100 whitespace-nowrap"><ThumbsUp className="w-3.5 h-3.5 text-green-500 fill-green-500" /> {(city.stats && city.stats.recommended) || 0} {t['city.stats.recommended']}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
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
  );
}
