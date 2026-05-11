import Visa from "@/app-views/Visa";
import { getHreflangAlternates, baseUrl, defaultOgImage } from "@/lib/seo-config";
import { LANGUAGES } from "@/lib/static-params";

export function generateStaticParams() {
  return LANGUAGES.map(lang => ({ lang }));
}

export const revalidate = false;

const visaSEO: Record<string, { title: string; description: string }> = {
  cn: { title: '中国免签政策：24/72/144小时过境免签指南 | tripcngo.com', description: '全面解读中国免签政策：24小时、72小时、144小时过境免签适用城市、申请条件、停留规则。包含签证类型、费用、申请流程等实用信息。' },
  en: { title: 'China Visa-Free Policy: 24/72/144-Hour Transit Visa Exemption Guide | tripcngo.com', description: 'Complete guide to China visa-free transit policy: 24-hour, 72-hour, and 144-hour transit visa exemption eligible cities, requirements, and stay rules. Includes visa types, fees, and application process.' },
  ja: { title: '中国ビザ免除政策：24/72/144時間トランジットビザ免除ガイド | tripcngo.com', description: '中国のビザ免除政策を完全解説：24時間・72時間・144時間トランジットビザ免除の対象都市、申請条件、滞在ルール。ビザの種類、費用、申請手続きも網羅。' },
  ko: { title: '중국 무비자 정책: 24/72/144시간 환승 비자 면제 가이드 | tripcngo.com', description: '중국 무비자 정책 완전 가이드: 24시간, 72시간, 144시간 환승 비자 면제 대상 도시, 신청 조건, 체류 규칙. 비자 종류, 비용, 신청 절차 포함.' },
  ru: { title: 'Безвизовая политика Китая: Руководство по 24/72/144-часовому транзиту без визы | tripcngo.com', description: 'Полное руководство по безвизовому транзиту в Китае: 24, 72 и 144 часа — подходящие города, условия и правила пребывания.' },
  fr: { title: 'Politique d\'exemption de visa Chine : Guide 24/72/144 heures de transit sans visa | tripcngo.com', description: 'Guide complet de la politique d\'exemption de visa de la Chine : villes éligibles, conditions et règles de séjour pour les exemptions de 24, 72 et 144 heures.' },
  es: { title: 'Política de exención de visa de China: Guía de exención de visa de tránsito 24/72/144 horas | tripcngo.com', description: 'Guía completa de la política de exención de visa de China: ciudades elegibles, requisitos y reglas de estadía para 24, 72 y 144 horas de tránsito sin visa.' },
  de: { title: 'Chinas Visumfrei-Politik: Leitfaden zur 24/72/144-Stunden-Transitvisumbefreiung | tripcngo.com', description: 'Vollständiger Leitfaden zu Chinas visumfreier Transitpolitik: berechtigte Städte, Voraussetzungen und Aufenthaltsregeln für 24, 72 und 144 Stunden.' },
  tw: { title: '中國免簽政策：24/72/144小時過境免簽指南 | tripcngo.com', description: '全面解讀中國免簽政策：24小時、72小時、144小時過境免簽適用城市、申請條件、停留規則。包含簽證類型、費用、申請流程等實用信息。' },
  it: { title: 'Politica di esenzione visa Cina: Guida all\'esenzione visa transito 24/72/144 ore | tripcngo.com', description: 'Guida completa alla politica di esenzione visa della Cina: città eleggibili, requisiti e regole di soggiorno per 24, 72 e 144 ore di transito senza visa.' },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = visaSEO[lang] || visaSEO['en'];

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/visa`,
      languages: getHreflangAlternates('/visa'),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${baseUrl}/${lang}/visa`,
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

export default function Page() {
  return <Visa />;
}
