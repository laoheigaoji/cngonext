"use client";

import React, { useState, useMemo, useEffect } from 'react';

const ITEMS_PER_PAGE = 9;

export default function CitiesClient({ cities, lang, t, initialQuery }: { cities: any[]; lang: string; t: Record<string, string>; initialQuery?: string }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  const [currentPage, setCurrentPage] = useState(1);
  const langPrefix = lang === 'zh' ? 'cn' : lang;

  // Filter cities by search query
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return cities;
    const q = searchQuery.trim().toLowerCase();
    return cities.filter(city =>
      (city.name && city.name.toLowerCase().includes(q)) ||
      (city.enName && city.enName.toLowerCase().includes(q)) ||
      (city.id && city.id.toLowerCase().includes(q))
    );
  }, [cities, searchQuery]);

  const totalPages = Math.ceil(filteredCities.length / ITEMS_PER_PAGE);
  const currentCities = filteredCities.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="max-w-[1240px] mx-auto px-6">
      {/* Search bar */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t['hero.searchPlaceholder'] || '搜索目的地...'}
            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1b887a]/30 focus:border-[#1b887a] text-[15px] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-center text-sm text-gray-500 mt-3">
            {filteredCities.length > 0
              ? `${t['cities.searchResult'] || '找到'} ${filteredCities.length} ${t['cities.searchUnit'] || '个城市'}`
              : (t['cities.noResult'] || '未找到匹配的城市')
            }
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentCities.map((city) => (
          <a
            key={city.id}
            href={`/${langPrefix}/cities/${city.id}`}
            className="relative group rounded-md overflow-hidden bg-white border border-gray-100 shadow-sm transition-all duration-300 block"
          >
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
                <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-gray-50 rounded-full border border-gray-100 whitespace-nowrap">
                  <svg className="w-3.5 h-3.5 text-red-500 fill-red-500" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  {(city.stats && city.stats.wantToVisit) || 0} {t['city.stats.wantToVisit']}
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-gray-50 rounded-full border border-gray-100 whitespace-nowrap">
                  <svg className="w-3.5 h-3.5 text-green-500 fill-green-500" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                  {(city.stats && city.stats.recommended) || 0} {t['city.stats.recommended']}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Empty state */}
      {filteredCities.length === 0 && searchQuery && (
        <div className="text-center py-20 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <p className="text-lg">{t['cities.noResult'] || '未找到匹配的城市'}</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded text-sm flex items-center justify-center bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ‹
          </button>

          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
            let page;
            if (totalPages <= 10) {
              page = i + 1;
            } else if (currentPage <= 5) {
              page = i + 1;
            } else if (currentPage >= totalPages - 4) {
              page = totalPages - 9 + i;
            } else {
              page = currentPage - 5 + i + 1;
            }
            return (
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
            );
          })}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded text-sm flex items-center justify-center bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
