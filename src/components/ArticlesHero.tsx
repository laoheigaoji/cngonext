import React from 'react';

interface ArticlesHeroProps {
  title: string;
  desc: string;
}

export default function ArticlesHero({ title, desc }: ArticlesHeroProps) {
  return (
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
        <h1 
          className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight"
          suppressHydrationWarning
        >
          {title}
        </h1>
        <p 
          className="text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed font-medium"
          suppressHydrationWarning
        >
          {desc}
        </p>
      </div>
    </section>
  );
}
