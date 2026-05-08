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
const getLocalizedField = (section: PageSection | undefined, field: 'title' | 'content', language: string): string => {
  if (!section) return '';
  
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
  const suffix = `_${lang}`;
  
  if (field === 'title') {
    return (section as any)[`title${suffix}`] || section.title_en || '';
  }
  return (section as any)[`content${suffix}`] || section.content_en || '';
};

// 渲染内容（支持列表）
const renderContent = (content: string) => {
  const parts = content.split('|');
  return parts.map((part, index) => {
    if (part.trim().startsWith('•') || part.includes('•')) {
      // 处理列表项
      const items = part.split('•').filter(item => item.trim());
      return (
        <ul key={index} className="list-disc ml-6 space-y-2">
          {items.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item.trim().replace(/<[^>]*>/g, '') }} />
          ))}
        </ul>
      );
    }
    return <p key={index} dangerouslySetInnerHTML={{ __html: part.trim().replace(/<[^>]*>/g, '') }} />;
  });
};

const PrivacyPolicy = ({ initialData, lang }: { initialData?: any[]; lang?: string }) => {
  const { language, t } = useLanguage();
  const currentLang = (lang || language) as any;
  const [sections, setSections] = useState<PageSection[]>(() => (initialData || []) as PageSection[]);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) return;
    const fetchSections = async () => {
      try {
        const { data, error } = await supabase
          .from('page_sections')
          .select('*')
          .eq('page_key', 'privacy_policy')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setSections(data || []);
      } catch (error) {
        console.error('Error fetching privacy policy sections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [initialData]);

  const getSection = (sectionKey: string) => sections.find(s => s.section_key === sectionKey);

  const heroSection = getSection('hero');
  const heroBgImage = heroSection?.extra_data?.bg_image || 'https://static.tripcngo.com/ing/banner_bg_1.jpg';
  const effectiveDate = heroSection?.extra_data?.effective_date || '2025年5月17日';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1b887a]"></div>
      </div>
    );
  }

  // 过滤掉 hero section，用于渲染内容部分
  const contentSections = sections.filter(s => s.section_key !== 'hero');

  return (
    <div className="bg-white">
      <SEO 
        title={t('privacy.hero.title')}
        description={t('privacy.hero.subtitle')}
        keywords={currentLang === 'zh' ? '隐私政策, tripcngo隐私' : 'Privacy Policy, tripcngo privacy'}
      />
      
      {/* Hero Section */}
      <div 
        className="relative h-[400px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBgImage})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative text-center">
          <h1 className="text-white text-5xl font-bold mb-4">{t('privacy.hero.title')}</h1>
          <p className="text-white/80 text-xl font-medium">{t('privacy.hero.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose prose-green max-w-none text-gray-800">
          <p className="text-sm text-gray-500 mb-8">{t('privacy.lastUpdated')}</p>
          
          <h2 className="text-2xl font-bold mb-4">{t('privacy.hero.title')}</h2>
          <p>生效日期：{effectiveDate}</p>
          <p>欢迎使用我们的网站。本隐私政策旨在告知您我们如何收集、使用、存储和保护您的个人信息。</p>
          
          {contentSections.map((section) => {
            const title = getLocalizedField(section, 'title', currentLang);
            const content = getLocalizedField(section, 'content', currentLang);

            return (
              <div key={section.id}>
                <h3 className="text-xl font-bold mt-8 mb-4">{title}</h3>
                {renderContent(content)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
