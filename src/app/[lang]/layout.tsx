import { LANGUAGES } from "@/lib/static-params";
import { getHtmlLang } from "@/lib/seo-config";
import LangLayoutClient from "./LangLayoutClient";

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const htmlLang = getHtmlLang(lang);

  return {
    other: {
      'html-lang': htmlLang,
    },
  };
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // We can't use async params directly in layout for html lang,
  // so we use a client component approach via LangLayoutClient
  return <LangLayoutClient>{children}</LangLayoutClient>;
}
