import { Metadata } from "next";
import LangLayoutClient from "./LangLayoutClient";
import { getServerTranslations } from "@/lib/server-i18n";
import { LANGUAGES } from "@/lib/static-params";

export function generateStaticParams() {
  return LANGUAGES.map(lang => ({ lang }));
}

const htmlLangMap: Record<string, string> = {
  cn: 'zh-CN',
  tw: 'zh-TW',
  en: 'en',
  ja: 'ja',
  ko: 'ko',
  ru: 'ru',
  fr: 'fr',
  es: 'es',
  de: 'de',
  it: 'it',
};

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const htmlLang = htmlLangMap[lang] || lang;

  return (
    <LangLayoutClient htmlLang={htmlLang}>
      {children}
    </LangLayoutClient>
  );
}
