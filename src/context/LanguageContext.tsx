"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useTranslations, useLocale } from 'next-intl';

export type Language = 'zh' | 'en' | 'ja' | 'ko' | 'ru' | 'fr' | 'es' | 'de' | 'tw' | 'it';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  dbTranslationsLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const localeToLanguage: Record<string, Language> = {
  cn: 'zh', tw: 'tw', en: 'en', ja: 'ja', ko: 'ko',
  ru: 'ru', fr: 'fr', es: 'es', de: 'de', it: 'it'
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    const defaultT = (key: string, fallback?: string) => fallback || key;
    return { language: 'en' as Language, setLanguage: () => {}, t: defaultT, dbTranslationsLoaded: false };
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: ReactNode; initialLang?: Language }) => {
  const nextIntlT = useTranslations();
  const locale = useLocale();
  const language = localeToLanguage[locale] || 'en';

  const t = (key: string, fallback?: string) => {
    try {
      const value = nextIntlT(key);
      if (value && value !== key) return value;
    } catch {
      // Key not found in next-intl
    }
    return fallback || key;
  };

  // setLanguage is now a no-op since language is derived from URL via next-intl
  const setLanguage = (_lang: Language) => {
    console.warn('setLanguage is deprecated. Use next-intl router.replace(pathname, {locale}) instead.');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dbTranslationsLoaded: true }}>
      {children}
    </LanguageContext.Provider>
  );
};
