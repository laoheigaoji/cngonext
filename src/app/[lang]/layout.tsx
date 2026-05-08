import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { LANGUAGES, baseUrl, getHtmlLang } from '@/lib/seo-config';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/context/LanguageContext';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const htmlLang = getHtmlLang(lang);

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

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(routing.locales, lang)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={getHtmlLang(lang)}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <LanguageProvider>
            <div className="min-h-screen flex flex-col font-sans bg-[#f7f7f7] text-gray-800">
              <Navbar />
              <main className="flex-grow flex flex-col">
                {children}
              </main>
              <Footer />
            </div>
          </LanguageProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
