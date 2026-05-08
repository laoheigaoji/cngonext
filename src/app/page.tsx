"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage, LanguageProvider } from "@/context/LanguageContext";

function RootPageInner() {
  const router = useRouter();
  const { language } = useLanguage();

  useEffect(() => {
    const langToPrefix: Record<string, string> = {
      zh: 'cn',
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
    const prefix = langToPrefix[language] || 'en';
    router.replace(`/${prefix}`);
  }, [language, router]);

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
