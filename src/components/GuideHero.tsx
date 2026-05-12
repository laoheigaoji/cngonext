import React from 'react';
import { getRandomHeroBg } from '@/lib/hero-backgrounds';

interface GuideHeroProps {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  scrollHint: string;
  digitalTitle: string;
  digitalSubtitle: string;
}

export default function GuideHero({ badge, title, subtitle, description, scrollHint, digitalTitle, digitalSubtitle }: GuideHeroProps) {
  const heroBg = getRandomHeroBg();
  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[450px] flex items-center justify-center overflow-hidden">
        <img
          src={heroBg}
          alt="China Travel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="relative text-center text-white px-6 max-w-3xl pt-24">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="text-sm font-medium">✨ {badge}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-lg md:text-xl text-gray-200 mb-2">{subtitle}</p>
          <p className="text-gray-300 max-w-xl mx-auto">{description}</p>
          <div className="mt-8 flex flex-col items-center animate-bounce">
            <svg className="w-6 h-6 text-white/70 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-4 4m4-4l4 4" />
              <rect x="7" y="3" width="10" height="14" rx="5" strokeWidth={2} stroke="currentColor" fill="none" />
              <line x1="12" y1="7" x2="12" y2="11" strokeLinecap="round" strokeWidth={2} />
            </svg>
            <span className="text-white/60 text-sm">{scrollHint}</span>
          </div>
        </div>
      </div>

      {/* Digital Survival Kit Section Header */}
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="text-center py-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{digitalTitle}</h2>
          <p className="text-gray-500">{digitalSubtitle}</p>
        </div>
      </div>
    </>
  );
}
