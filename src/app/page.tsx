"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LanguageProvider, Language } from "@/context/LanguageContext";

// Detect browser language for root page redirect only
function detectBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en';
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('zh')) {
    if (browserLang.includes('tw') || browserLang.includes('hant')) return 'tw';
    return 'zh';
  }
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang.startsWith('ko')) return 'ko';
  if (browserLang.startsWith('ru')) return 'ru';
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('it')) return 'it';
  return 'en';
}

function RootPageInner() {
  const router = useRouter();

  useEffect(() => {
    const langToPrefix: Record<string, string> = {
      zh: 'cn', tw: 'tw', en: 'en', ja: 'ja', ko: 'ko',
      ru: 'ru', fr: 'fr', es: 'es', de: 'de', it: 'it'
    };
    const lang = detectBrowserLanguage();
    const prefix = langToPrefix[lang] || 'en';
    router.replace(`/${prefix}`);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7]">
      <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function RootPage() {
  return (
    <LanguageProvider>
      <RootPageInner />
    </LanguageProvider>
  );
}
