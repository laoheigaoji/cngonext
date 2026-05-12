import React from 'react';
import CitySearchBox from './CitySearchBox';

interface HomeHeroProps {
  title: string;
  desc: string;
  dest: string;
  aiName: string;
  searchPlaceholder: string;
  start: string;
  langPrefix: string;
  notFound: string;
  cities: { id: string; name: string; enName?: string }[];
}

export default function HomeHero({ title, desc, dest, aiName, searchPlaceholder, start, langPrefix, notFound, cities }: HomeHeroProps) {
  return (
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
          <h1 
            className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-lg"
            suppressHydrationWarning
          >
            {title}
          </h1>
          <p 
            className="text-xl md:text-2xl text-white/90 font-medium drop-shadow-md"
            suppressHydrationWarning
          >
            {desc}
          </p>
        </div>
        
        <div 
          className="w-full max-w-[800px] backdrop-blur-xl bg-white/20 p-2 rounded-[2rem] shadow-2xl border border-white/30 relative"
          suppressHydrationWarning
        >
          <div className="flex gap-2 p-1 mb-1">
            <a href={`/${langPrefix}/cities`} className="px-6 py-2.5 rounded-full text-[15px] font-bold bg-white text-[#1b887a] shadow-sm">
              {dest}
            </a>
            <a href={`/${langPrefix}/tools/name-generator`} className="px-6 py-2.5 rounded-full text-[15px] font-bold text-white hover:bg-white/10 transition-colors">
              {aiName}
            </a>
          </div>
          
          <CitySearchBox
            cities={cities}
            searchPlaceholder={searchPlaceholder}
            start={start}
            langPrefix={langPrefix}
            notFound={notFound}
          />
        </div>
      </div>
    </section>
  );
}
