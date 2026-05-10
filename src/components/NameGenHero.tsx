import React from 'react';

interface NameGenHeroProps {
  title: string;
  subtitle: string;
}

export default function NameGenHero({ title, subtitle }: NameGenHeroProps) {
  return (
    <div 
      className="relative h-[300px] w-full flex items-center pt-16"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1543097692-fa13c6cd8595?q=80&w=2670&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-white">
        <h1 
          className="text-4xl md:text-5xl font-bold mb-4"
          suppressHydrationWarning
        >
          {title}
        </h1>
        <p 
          className="text-lg text-white/90"
          suppressHydrationWarning
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}
