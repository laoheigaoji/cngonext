"use client";

import { useParams } from "@/lib/router-compat";
import TermsClient from "./TermsClient";

const langMap: Record<string, string> = {
  cn: 'zh', tw: 'tw', en: 'en', ja: 'ja', ko: 'ko',
  ru: 'ru', fr: 'fr', es: 'es', de: 'de', it: 'it'
};

export default function Page() {
  const { lang } = useParams<{ lang: string }>();
  const language = langMap[lang] || 'en';
  return <TermsClient lang={language} />;
}
