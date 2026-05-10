"use client";

import React from 'react';
import { useLanguage } from '../context/LanguageContext';

// 渲染内容（支持列表）
const renderContent = (content: string) => {
  const parts = content.split('|');
  return parts.map((part, index) => {
    if (part.trim().startsWith('•') || part.includes('•')) {
      const items = part.split('•').filter(item => item.trim());
      return (
        <ul key={index} className="list-disc ml-6 space-y-2">
          {items.map((item, i) => (
            <li key={i}>{item.trim()}</li>
          ))}
        </ul>
      );
    }
    return <p key={index}>{part.trim()}</p>;
  });
};

const PrivacyPolicy = ({ translations }: { translations?: Record<string, string>; initialData?: any[]; lang?: string }) => {
  const { t } = useLanguage();

  const tt = (key: string): string => {
    if (translations && translations[key] && translations[key] !== key) {
      return translations[key];
    }
    return t(key);
  };

  const sections = ['s1', 's2', 's3', 's4', 's5', 's6'];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div 
        className="relative h-[400px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(https://static.tripcngo.com/ing/banner_bg_1.jpg)` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative text-center">
          <h1 className="text-white text-5xl font-bold mb-4">{tt('privacy.hero.title')}</h1>
          <p className="text-white/80 text-xl font-medium">{tt('privacy.hero.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose prose-green max-w-none text-gray-800">
          <p className="text-sm text-gray-500 mb-8">{tt('privacy.lastUpdated')}</p>
          
          <h2 className="text-2xl font-bold mb-4">{tt('privacy.hero.title')}</h2>
          <p>{tt('privacy.effectiveDate')}</p>
          <p>{tt('privacy.intro')}</p>
          
          {sections.map((key) => {
            const title = tt(`privacy.${key}.title`);
            const content = tt(`privacy.${key}.content`);
            if (!title && !content) return null;

            return (
              <div key={key}>
                <h3 className="text-xl font-bold mt-8 mb-4">{title}</h3>
                {content && renderContent(content)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
