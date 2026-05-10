import React from "react";
import { getSEO, visaTypesSEO, getHreflangAlternates, baseUrl, defaultOgImage } from "@/lib/seo-config";
import { getServerTranslations } from "@/lib/server-i18n";
import { LANGUAGES } from "@/lib/static-params";
import { VISA_TYPES, VISA_DOCUMENTS } from "@/data/visa-data";
import VisaTypesClient from "./VisaTypesClient";

export function generateStaticParams() {
  return LANGUAGES.map(lang => ({ lang }));
}

export const revalidate = false;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = getSEO(visaTypesSEO, lang);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/visa/types`,
      languages: getHreflangAlternates('/visa/types'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/visa/types`,
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
  const langKey = (lang === 'zh' || lang === 'cn') ? 'cn' : 'en';

  const t = getServerTranslations(lang, [
    'visa.page.types.title', 'visa.page.types.visaName', 'visa.page.types.code',
    'visa.page.types.description', 'visa.page.types.viewDocs', 'visa.page.types.requiredDocs',
    'visa.page.types.generalDocs', 'visa.page.types.specialDocs', 'visa.page.types.optional',
    'visa.page.types.clickToView', 'visa.page.types.noDocs',
    'visa.hero.title', 'visa.hero.desc', 'visa.mega.title', 'visa.nav.title',
    'nav.home', 'visa.menu.types', 'visa.menu.photo', 'visa.menu.fee', 'visa.menu.form',
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

  // Build visa types with localized text from inline data
  const visaTypesData = VISA_TYPES.map(vt => ({
    code: vt.code,
    name: vt.name[langKey] || vt.name.en,
    description: vt.description[langKey] || vt.description.en,
  }));

  // Build documents grouped by visa code, with localized text from inline data
  const documentsByCode: Record<string, { general: any[]; special: any[] }> = {};
  for (const doc of VISA_DOCUMENTS) {
    if (!documentsByCode[doc.visaCode]) {
      documentsByCode[doc.visaCode] = { general: [], special: [] };
    }
    const docData = {
      icon: doc.icon,
      title: doc.title[langKey] || doc.title.en,
      description: doc.description[langKey] || doc.description.en,
      linkUrl: doc.linkUrl || null,
      isRequired: doc.isRequired,
    };
    documentsByCode[doc.visaCode][doc.section].push(docData);
  }

  return (
    <VisaTypesClient
      langPrefix={langPrefix}
      t={t}
      sidebarLinks={sidebarLinks}
      visaTypesData={visaTypesData}
      documentsByCode={documentsByCode}
    />
  );
}
