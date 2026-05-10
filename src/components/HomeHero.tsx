import React from 'react';

interface HomeHeroProps {
  title: string;
  desc: string;
  dest: string;
  aiName: string;
  searchPlaceholder: string;
  start: string;
  langPrefix: string;
}

export default function HomeHero({ title, desc, dest, aiName, searchPlaceholder, start, langPrefix }: HomeHeroProps) {
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
          
          <form action={`/${langPrefix}/cities`} className="bg-white rounded-[1.5rem] p-1.5 flex items-center relative group">
            <div className="flex-1 flex items-center px-4">
              <svg className="w-5 h-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <input 
                type="text" 
                name="q"
                placeholder={searchPlaceholder} 
                className="w-full py-3.5 outline-none text-gray-800 text-[16px]"
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
        </div>
      </div>
    </section>
  );
}
