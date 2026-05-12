import React from 'react';
import { getRandomHeroBg } from '@/lib/hero-backgrounds';

interface PinyinHeroProps {
  title: string;
  desc: string;
}

export default function PinyinHero({ title, desc }: PinyinHeroProps) {
  const heroBg = getRandomHeroBg();
  return (
    <div 
      className="relative h-[340px] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/40" />
      <div className="relative text-center px-6 max-w-3xl mx-auto">
        <h1 
          className="text-white text-4xl md:text-5xl font-bold mb-4"
          suppressHydrationWarning
        >
          {title}
        </h1>
        <p 
          className="text-white/80 text-lg font-medium leading-relaxed"
          suppressHydrationWarning
        >
          {desc}
        </p>
      </div>
    </div>
  );
}
