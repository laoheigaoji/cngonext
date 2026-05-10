"use client";

import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const AboutUs = ({ translations }: { translations?: Record<string, string>; initialData?: any[]; lang?: string }) => {
  const { language, t } = useLanguage();
  const currentLang = language as string;

  const tt = (key: string): string => {
    if (translations && translations[key] && translations[key] !== key) {
      return translations[key];
    }
    return t(key);
  };

  const teamMembers = [
    { name: "Miracle Zhou", role_zh: "创始人，户外登山爱好者", role_en: "Founder, Outdoor Enthusiast", img: "https://static.tripcngo.com/ing/Miracle%20Zhou.jpg" },
    { name: "Wood Mao", role_zh: "旅行推荐官，骑行16000公里环游中国", role_en: "Travel Specialist, Circled China on Bike", img: "https://static.tripcngo.com/ing/Wood%20Mao.jpg" },
    { name: "Ting Luo", role_zh: "旅行推荐官，小众旅行爱好者", role_en: "Travel Specialist, Hidden Gem Explorer", img: "https://static.tripcngo.com/ing/Ting%20Luo.jpg" },
    { name: "Aguest Chen", role_zh: "旅行推荐官，英语老师，爱好旅行", role_en: "Travel Specialist, English Teacher", img: "https://static.tripcngo.com/ing/Aguest%20Chen.jpg" }
  ];

  const storyParagraphs = [
    tt('about.story.p1'),
    tt('about.story.p2'),
    tt('about.story.p3'),
    tt('about.story.p4'),
    tt('about.story.p5')
  ];

  return (
    <div className="bg-white">
      
      {/* Hero Section */}
      <div 
        className="relative h-[400px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(https://static.tripcngo.com/ing/banner_bg_1.jpg)` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <h1 className="relative text-white text-5xl font-bold">{tt('about.hero.title')}</h1>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Features */}
        <div className="grid md:grid-cols-3 gap-12 mb-16 text-center">
          <div>
            <div className="text-5xl mb-4">📍</div>
            <h3 className="text-xl font-bold mb-4">{tt('about.features.team.title')}</h3>
            <p className="text-gray-600">{tt('about.features.team.desc')}</p>
          </div>
          <div>
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-xl font-bold mb-4">{tt('about.features.focus.title')}</h3>
            <p className="text-gray-600">{tt('about.features.focus.desc')}</p>
          </div>
          <div>
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-4">{tt('about.features.ai.title')}</h3>
            <p className="text-gray-600">{tt('about.features.ai.desc')}</p>
          </div>
        </div>

        {/* Story */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">{tt('about.story.title')}</h2>
            {storyParagraphs.map((paragraph, index) => (
              <p 
                key={index} 
                className={`text-gray-600 mb-4 leading-relaxed ${index === storyParagraphs.length - 2 ? 'font-bold' : ''}`}
              >
                {paragraph}
              </p>
            ))}
          </div>
          <img 
            src="https://static.tripcngo.com/ing/image1bg.jpg" 
            alt="Our Story" 
            className="rounded-xl shadow-lg"
          />
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-10 text-center">{tt('about.team.title')}</h2>
          <p className="text-center text-gray-500 mb-10">{tt('about.team.subtitle')}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <div key={i} className="text-center">
                <div className="w-full aspect-square rounded-lg mb-4 overflow-hidden">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold">{member.name}</h3>
                <p className="text-sm text-gray-600">{currentLang === 'cn' || currentLang === 'zh' ? member.role_zh : member.role_en}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
