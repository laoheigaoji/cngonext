"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage, Language, LanguageProvider } from "@/context/LanguageContext";
import { useParams } from "next/navigation";

const langMap: Record<string, Language> = {
  cn: 'zh',
  tw: 'tw',
  en: 'en',
  ja: 'ja',
  ko: 'ko',
  ru: 'ru',
  fr: 'fr',
  es: 'es',
  de: 'de',
  it: 'it'
};

const langToHtmlLang: Record<string, string> = {
  zh: 'zh-CN',
  tw: 'zh-TW',
  en: 'en',
  ja: 'ja',
  ko: 'ko',
  ru: 'ru',
  fr: 'fr',
  es: 'es',
  de: 'de',
  it: 'it'
};

function LangLayoutInner({ children }: { children: React.ReactNode }) {
  const { lang } = useParams();
  const { language, setLanguage } = useLanguage();
  const targetLang = langMap[lang as string] || 'en';

  // Sync language from URL param - URL is the single source of truth
  useEffect(() => {
    if (language !== targetLang) {
      setLanguage(targetLang);
    }
    // Always set html lang attribute from URL param
    document.documentElement.lang = langToHtmlLang[targetLang] || targetLang;
  }, [targetLang, language, setLanguage]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f7f7f7] text-gray-800">
      <Navbar />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function LangLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { lang } = useParams();
  const initialLang = langMap[lang as string] || 'en';

  // Set html lang attribute immediately on mount for SSR/SEO
  useEffect(() => {
    document.documentElement.lang = langToHtmlLang[initialLang] || initialLang;
  }, [initialLang]);

  return (
    <LanguageProvider initialLang={initialLang}>
      <LangLayoutInner>{children}</LangLayoutInner>
    </LanguageProvider>
  );
}
