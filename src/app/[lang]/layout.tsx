import { LANGUAGES } from "@/lib/static-params";
import { Metadata } from "next";

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // We use a script to set html lang attribute before paint
  // This is because Next.js App Router doesn't allow modifying <html> from child layouts
  return (
    <>
      <LangScript />
      {children}
    </>
  );
}

// Client-side minimal script to set html lang
function LangScript() {
  const script = `
    (function(){
      var p = window.location.pathname.split('/');
      var lang = p[1] || 'en';
      var map = {cn:'zh-CN',tw:'zh-TW',en:'en',ja:'ja',ko:'ko',ru:'ru',fr:'fr',es:'es',de:'de',it:'it'};
      document.documentElement.lang = map[lang] || lang;
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
