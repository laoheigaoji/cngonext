'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface CityItem {
  id: string;
  name: string;
  enName?: string;
}

interface CitySearchBoxProps {
  cities: CityItem[];
  searchPlaceholder: string;
  start: string;
  langPrefix: string;
  notFound: string;
}

export default function CitySearchBox({ cities, searchPlaceholder, start, langPrefix, notFound }: CitySearchBoxProps) {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState<CityItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const doSearch = useCallback((val: string) => {
    const q = val.trim().toLowerCase();
    if (!q) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    const filtered = cities.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.enName && c.enName.toLowerCase().includes(q))
    );
    setResults(filtered);
    setShowDropdown(true);
  }, [cities]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    doSearch(val);
  };

  const handleSelect = (city: CityItem) => {
    setShowDropdown(false);
    setQuery('');
    window.location.href = `/${langPrefix}/cities/${city.id}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length === 1) {
      handleSelect(results[0]);
    } else if (results.length > 1) {
      // multiple results, do nothing (user should pick)
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="bg-white rounded-[1.5rem] p-1.5 flex items-center relative group">
        <div className="flex-1 flex items-center px-4">
          <svg className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => { if (query.trim()) doSearch(query); }}
            placeholder={searchPlaceholder}
            className="w-full py-3.5 outline-none text-gray-800 text-[16px]"
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          className="bg-[#1b887a] hover:bg-[#008055] text-white px-8 py-3.5 rounded-[1.2rem] font-bold transition-all flex items-center gap-2 active:scale-95 shadow-md flex-shrink-0"
        >
          {start}
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
      </form>

      {showDropdown && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-[360px] overflow-y-auto">
          {results.length > 0 ? (
            <div className="py-2">
              {results.map(city => (
                <button
                  key={city.id}
                  onClick={() => handleSelect(city)}
                  className="w-full px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <svg className="w-4 h-4 text-[#1b887a] flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span className="font-bold text-gray-900 text-[15px]">{city.name}</span>
                  {city.enName && (
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{city.enName}</span>
                  )}
                  <svg className="w-4 h-4 text-gray-300 ml-auto flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-8 px-5 text-center">
              <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/></svg>
              <p className="text-gray-400 text-sm font-medium">{notFound}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
