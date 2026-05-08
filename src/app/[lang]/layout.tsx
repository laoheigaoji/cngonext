import LangLayoutClient from "./LangLayoutClient";
import { LANGUAGES, baseUrl, getHtmlLang } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const htmlLang = getHtmlLang(lang);

  // Generate hreflang alternates for all languages
  const languages: Record<string, string> = {
    'x-default': `${baseUrl}/en`,
  };
  LANGUAGES.forEach(prefix => {
    const hreflang = getHtmlLang(prefix);
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
