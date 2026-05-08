"use client";

import React, { Suspense, useEffect } from "react";
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

function LangLayoutInner({ children }: { children: React.ReactNode }) {
  const { lang } = useParams();
  const { language, setLanguage } = useLanguage();
  const targetLang = langMap[lang as string] || 'en';

  // Sync language from URL param on change
  useEffect(() => {
    if (language !== targetLang) {
      setLanguage(targetLang);
    }
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

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7]">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LanguageProvider initialLang={initialLang}>
        <LangLayoutInner>{children}</LangLayoutInner>
      </LanguageProvider>
    </Suspense>
  );
}
