import React from "react";
import { getSEO, visaFeesSEO, getHreflangAlternates, baseUrl, defaultOgImage } from "@/lib/seo-config";
import { getServerTranslations } from "@/lib/server-i18n";
import { LANGUAGES } from "@/lib/static-params";
import { VISA_FEES, LangKey } from "@/data/visa-data";

export function generateStaticParams() {
  return LANGUAGES.map(lang => ({ lang }));
}

export const revalidate = false;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(visaFeesSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/visa/fees`,
      languages: getHreflangAlternates('/visa/fees'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/visa/fees`,
      siteName: 'tripcngo.com',
      images: [{ url: defaultOgImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [defaultOgImage],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const langPrefix = lang === 'zh' ? 'cn' : lang;

  const langKey = (lang === 'zh' ? 'cn' : lang) as LangKey;

  const t = getServerTranslations(lang, [
    'visa.menu.fee', 'visa.page.fee.visaType', 'visa.page.fee.mainPurpose',
    'visa.page.fee.costRange', 'visa.page.fee.notes', 'visa.page.fee.visaSuffix',
    'visa.page.fee.additionalInfo', 'visa.page.fee.reciprocal', 'visa.page.fee.reciprocalDesc',
    'visa.page.fee.additionalFees', 'visa.page.fee.expedited', 'visa.page.fee.mailing',
    'visa.page.fee.medical', 'visa.page.fee.residencePermit', 'visa.page.fee.permit1',
    'visa.page.fee.permit2', 'visa.page.fee.permit3', 'visa.page.fee.note',
    'visa.page.fee.feeNote1', 'visa.page.fee.feeNote2',
    'visa.hero.title', 'visa.hero.desc', 'visa.mega.title', 'visa.nav.title',
    'nav.home', 'visa.menu.types', 'visa.menu.photo', 'visa.menu.form',
    'visa.menu.entryCard', 'visa.menu.download',
  ]);

  const sidebarLinks = [
    { text: t['visa.menu.types'], path: `/${langPrefix}/visa/types` },
    { text: t['visa.menu.photo'], path: `/${langPrefix}/visa/photo` },
    { text: t['visa.menu.fee'], path: `/${langPrefix}/visa/fees` },
    { text: t['visa.menu.form'], path: `/${langPrefix}/visa/form` },
    { text: t['visa.menu.entryCard'], path: `/${langPrefix}/visa/arrival-card` },
    { text: t['visa.menu.download'], path: `/${langPrefix}/visa/downloads` },
  ];

  return (
    <div className="w-full flex-grow flex flex-col bg-[#fcfcfc]">
      {/* Hero */}
      <div
        className="relative h-[180px] sm:h-[300px] w-full flex items-end sm:items-center pt-8 sm:pt-16 pb-6 sm:pb-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1543097692-fa13c6cd8595?q=80&w=2670&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-6">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4">{t['visa.hero.title']}</h1>
          <p className="text-sm sm:text-lg text-white/90">{t['visa.hero.desc']}</p>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 flex flex-col flex-grow">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-4 sm:mb-8">
          <a href={`/${langPrefix}`} className="hover:text-[#1b887a] flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" /></svg>
            {t['nav.home']}
          </a>
          <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <a href={`/${langPrefix}/visa`} className="hover:text-[#1b887a]">{t['visa.mega.title']}</a>
          <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-gray-900">{t['visa.menu.fee']}</span>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden -mx-3 sm:-mx-6 px-3 sm:px-6 mb-4 overflow-x-auto scrollbar-hide">
          <nav className="flex gap-2 pb-2 min-w-max">
            {sidebarLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  link.path === `/${langPrefix}/visa/fees`
                    ? 'bg-[#1b887a] text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1b887a] hover:text-[#1b887a]'
                }`}
              >
                {link.text}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col md:flex-row gap-4 sm:gap-8 items-start flex-grow">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-full md:w-64 flex-shrink-0 bg-white border border-gray-100 rounded-sm shadow-sm p-4">
            <div className="text-center font-bold text-gray-800 py-3 mb-2 border-b border-gray-100">
              {t['visa.nav.title']}
            </div>
            <nav className="flex flex-col">
              {sidebarLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  className={`block py-3 px-4 text-[14px] transition-colors rounded-sm text-left ${
                    link.path === `/${langPrefix}/visa/fees`
                      ? 'bg-[#1b887a] text-white font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#1b887a]'
                  }`}
                >
                  {link.text}
                </a>
              ))}
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 w-full min-h-[500px]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t['visa.menu.fee']}</h2>

            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-sm border border-gray-200 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1b887a] text-white">
                    <th className="text-left px-6 py-4 font-semibold">{t['visa.page.fee.visaType']}</th>
                    <th className="text-left px-6 py-4 font-semibold">{t['visa.page.fee.mainPurpose']}</th>
                    <th className="text-left px-6 py-4 font-semibold">{t['visa.page.fee.costRange']}</th>
                    <th className="text-left px-6 py-4 font-semibold">{t['visa.page.fee.notes']}</th>
                  </tr>
                </thead>
                <tbody>
                  {VISA_FEES.map((v, i) => (
                    <tr key={v.visaCode} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">{v.visaCode} {t['visa.page.fee.visaSuffix']}</td>
                      <td className="px-6 py-4 text-gray-600">{v.purpose[langKey] || v.purpose.en}</td>
                      <td className="px-6 py-4 text-[#1b887a] font-semibold whitespace-nowrap">{v.feeRange}</td>
                      <td className="px-6 py-4 text-gray-500 text-xs">{v.note[langKey] || v.note.en}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {VISA_FEES.map((v, i) => (
                <div key={v.visaCode} className={`rounded-lg border border-gray-200 overflow-hidden ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-[#1b887a]/5">
                    <span className="font-bold text-gray-900">{v.visaCode} {t['visa.page.fee.visaSuffix']}</span>
                    <span className="text-[#1b887a] font-bold">{v.feeRange}</span>
                  </div>
                  <div className="px-4 py-3 space-y-1.5">
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-gray-400 whitespace-nowrap mt-0.5">{t['visa.page.fee.mainPurpose']}</span>
                      <span className="text-sm text-gray-700">{v.purpose[langKey] || v.purpose.en}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-gray-400 whitespace-nowrap mt-0.5">{t['visa.page.fee.notes']}</span>
                      <span className="text-xs text-gray-500">{v.note[langKey] || v.note.en}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional info */}
            <div className="mt-6 space-y-6 text-sm text-gray-700">
              <h3 className="font-bold text-lg text-gray-900">{t['visa.page.fee.additionalInfo']}</h3>
              <div>
                <h4 className="font-semibold text-gray-900">{t['visa.page.fee.reciprocal']}</h4>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>{t['visa.page.fee.reciprocalDesc']}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{t['visa.page.fee.additionalFees']}</h4>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>{t['visa.page.fee.expedited']}</li>
                  <li>{t['visa.page.fee.mailing']}</li>
                  <li>{t['visa.page.fee.medical']}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{t['visa.page.fee.residencePermit']}</h4>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>{t['visa.page.fee.permit1']}</li>
                  <li>{t['visa.page.fee.permit2']}</li>
                  <li>{t['visa.page.fee.permit3']}</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded border border-gray-200 text-xs text-gray-500">
                <p className="font-semibold text-gray-700 mb-1">{t['visa.page.fee.note']}</p>
                <p>{t['visa.page.fee.feeNote1']}</p>
                <p>{t['visa.page.fee.feeNote2']}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Discover more */}
        <div className="mt-12 w-full max-w-3xl border border-gray-100 rounded-lg bg-white overflow-hidden shadow-sm mx-auto mb-10 hidden sm:block">
          <div className="bg-gray-50 px-6 py-4 font-bold text-gray-800 border-b border-gray-100">{t['nav.home']}</div>
          <div>
            <a href={`/${langPrefix}`} className="flex items-center justify-between px-6 py-4 border-b border-gray-100 hover:bg-gray-50 text-gray-600">
              <span>{t['visa.mega.title']}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>
            <a href={`/${langPrefix}/cities`} className="flex items-center justify-between px-6 py-4 border-b border-gray-100 hover:bg-gray-50 text-gray-600">
              <span>{t['visa.menu.types']}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>
            <a href={`/${langPrefix}/visa`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 text-gray-600">
              <span>{t['visa.hero.desc']}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
