import { LANGUAGES } from "@/lib/static-params";
import LangLayoutClient from "./LangLayoutClient";

const langPrefixes = ['cn', 'en', 'ja', 'ko', 'ru', 'fr', 'es', 'de', 'tw', 'it'];
const baseUrl = 'https://tripcngo.com';

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export const dynamic = "force-static";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const htmlLang = lang === 'cn' ? 'zh-CN' : lang === 'tw' ? 'zh-TW' : lang;

  // Generate hreflang alternates for all languages
  const languages: Record<string, string> = {
    'x-default': `${baseUrl}/en`,
  };
  langPrefixes.forEach(prefix => {
    const hreflang = prefix === 'cn' ? 'zh-CN' : prefix === 'tw' ? 'zh-TW' : prefix;
    languages[hreflang] = `${baseUrl}/${prefix}`;
  });

  return {
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages,
    },
    other: {
      'html-lang': htmlLang,
    },
  };
}

export default function LangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LangLayoutClient>{children}</LangLayoutClient>;
}
