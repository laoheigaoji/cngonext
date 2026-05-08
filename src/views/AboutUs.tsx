"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';

interface PageSection {
  id: string;
  page_key: string;
  section_key: string;
  sort_order: number;
  title_zh: string | null;
  title_en: string | null;
  title_ja: string | null;
  title_ko: string | null;
  title_ru: string | null;
  title_fr: string | null;
  title_es: string | null;
  title_de: string | null;
  title_tw: string | null;
  title_it: string | null;
  content_zh: string | null;
  content_en: string | null;
  content_ja: string | null;
  content_ko: string | null;
  content_ru: string | null;
  content_fr: string | null;
  content_es: string | null;
  content_de: string | null;
  content_tw: string | null;
  content_it: string | null;
  extra_data: Record<string, any> | null;
}

// 获取多语言字段
const getLocalizedField = (section: PageSection, field: 'title' | 'content', language: string): string => {
  const langMap: Record<string, string> = {
    'zh': 'zh',
    'en': 'en',
    'ja': 'ja',
    'ko': 'ko',
    'ru': 'ru',
    'fr': 'fr',
    'es': 'es',
    'de': 'de',
    'tw': 'tw',
    'it': 'it',
  };
  
  const lang = langMap[language] || 'en';
  const suffix = lang === 'zh' ? '' : `_${lang}`;
  
  if (field === 'title') {
    return (section as any)[`title${suffix}`] || section.title_en || '';
  }
  return (section as any)[`content${suffix}`] || section.content_en || '';
};

const AboutUs = ({ initialData }: { initialData?: any[] }) => {
  const { language, t } = useLanguage();
  const [sections, setSections] = useState<PageSection[]>(() => (initialData || []) as PageSection[]);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) return;
    const fetchSections = async () => {
      try {
        const { data, error } = await supabase
          .from('page_sections')
          .select('*')
          .eq('page_key', 'about_us')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setSections(data || []);
      } catch (error) {
        console.error('Error fetching about us sections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [initialData]);

  // 从 sections 中提取特定 section
  const getSection = (sectionKey: string) => sections.find(s => s.section_key === sectionKey);

  // 团队成员数据（目前硬编码，可后续迁移到数据库）
  const teamMembers = [
    { name: "Miracle Zhou", role_zh: "创始人，户外登山爱好者", role_en: "Founder, Outdoor Enthusiast", img: "https://static.tripcngo.com/ing/Miracle%20Zhou.jpg" },
    { name: "Wood Mao", role_zh: "旅行推荐官，骑行16000公里环游中国", role_en: "Travel Specialist, Circled China on Bike", img: "https://static.tripcngo.com/ing/Wood%20Mao.jpg" },
    { name: "Ting Luo", role_zh: "旅行推荐官，小众旅行爱好者", role_en: "Travel Specialist, Hidden Gem Explorer", img: "https://static.tripcngo.com/ing/Ting%20Luo.jpg" },
    { name: "Aguest Chen", role_zh: "旅行推荐官，英语老师，爱好旅行", role_en: "Travel Specialist, English Teacher", img: "https://static.tripcngo.com/ing/Aguest%20Chen.jpg" }
  ];

  const heroSection = getSection('hero');
  const featureTeam = getSection('feature_team');
  const featureFocus = getSection('feature_focus');
  const featureAi = getSection('feature_ai');
  const storySection = getSection('story');
  const teamSection = getSection('team');

  const heroTitle = heroSection ? getLocalizedField(heroSection, 'title', language) : t('about.hero.title');
  const heroBgImage = heroSection?.extra_data?.bg_image || 'https://static.tripcngo.com/ing/banner_bg_1.jpg';

  const storyTitle = storySection ? getLocalizedField(storySection, 'title', language) : t('about.story.title');
  const storyContent = storySection ? getLocalizedField(storySection, 'content', language) : '';
  const storyParagraphs = storyContent ? storyContent.split('|') : [
    t('about.story.p1'),
    t('about.story.p2'),
    t('about.story.p3'),
    t('about.story.p4'),
    t('about.story.p5')
  ];

  const teamTitle = teamSection ? getLocalizedField(teamSection, 'title', language) : t('about.team.title');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1b887a]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <SEO 
        title={heroTitle}
        description={language === 'zh' 
          ? '了解 tripcngo.com 的使命和故事。我们是一个热爱旅行的本土团队，致力于利用智能AI技术帮助全球旅行者探索真实而美好的中国。' 
          : 'Learn about the mission and story of tripcngo.com. We are a local team of travel enthusiasts dedicated to helping global travelers explore the real and beautiful China using smart AI technology.'}
        keywords={language === 'zh' ? '关于 tripcngo, 中国旅行团队, 旅行AI助手' : 'About tripcngo, China travel team, travel AI assistant'}
      />
      
      {/* Hero Section */}
      <div 
        className="relative h-[400px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBgImage})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <h1 className="relative text-white text-5xl font-bold">{heroTitle}</h1>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Features */}
        <div className="grid md:grid-cols-3 gap-12 mb-16 text-center">
          <div>
            <div className="text-5xl mb-4">📍</div>
            <h3 className="text-xl font-bold mb-4">{featureTeam ? getLocalizedField(featureTeam, 'title', language) : t('about.features.team.title')}</h3>
            <p className="text-gray-600">{featureTeam ? getLocalizedField(featureTeam, 'content', language) : t('about.features.team.desc')}</p>
          </div>
          <div>
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-xl font-bold mb-4">{featureFocus ? getLocalizedField(featureFocus, 'title', language) : t('about.features.focus.title')}</h3>
            <p className="text-gray-600">{featureFocus ? getLocalizedField(featureFocus, 'content', language) : t('about.features.focus.desc')}</p>
          </div>
          <div>
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-4">{featureAi ? getLocalizedField(featureAi, 'title', language) : t('about.features.ai.title')}</h3>
            <p className="text-gray-600">{featureAi ? getLocalizedField(featureAi, 'content', language) : t('about.features.ai.desc')}</p>
          </div>
        </div>

        {/* Story */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">{storyTitle}</h2>
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
          <h2 className="text-3xl font-bold mb-10 text-center">{teamTitle}</h2>
          <p className="text-center text-gray-500 mb-10">{t('about.team.subtitle')}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <div key={i} className="text-center">
                <div className="w-full aspect-square rounded-lg mb-4 overflow-hidden">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold">{member.name}</h3>
                <p className="text-sm text-gray-600">{language === 'zh' ? member.role_zh : member.role_en}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
