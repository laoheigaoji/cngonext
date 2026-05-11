import React from 'react';

interface NameGenHeroProps {
  title: string;
  subtitle: string;
}

export default function NameGenHero({ title, subtitle }: NameGenHeroProps) {
  return (
    <div 
      className="relative h-[400px] flex items-end justify-center bg-cover bg-center pb-16"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1543097692-fa13c6cd8595?q=80&w=2670&auto=format&fit=crop)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/40" />
      <div className="relative text-center px-6 max-w-3xl mx-auto">
        <h1 
          className="text-white text-4xl md:text-5xl font-bold"
          suppressHydrationWarning
        >
          {title}
        </h1>
      </div>
    </div>
  );
}
