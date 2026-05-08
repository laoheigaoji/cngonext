import Visa from "@/app-views/Visa";
import { getHreflangAlternates, baseUrl } from "@/lib/seo-config";

const visaSEO: Record<string, { title: string; description: string }> = {
  cn: { title: '中国签证指南 - tripcngo.com', description: '全面的中国签证指南：签证类型、费用、申请流程、240小时过境免签政策等详细信息。' },
  en: { title: 'China Visa Guide - tripcngo.com', description: 'Complete China visa guide: visa types, fees, application process, 240-hour transit visa exemption policy and more.' },
  ja: { title: '中国ビザガイド - tripcngo.com', description: '中国ビザの完全ガイド：ビザの種類、費用、申請手続き、240時間トランジットビザ免除政策など。' },
  ko: { title: '중국 비자 가이드 - tripcngo.com', description: '중국 비자 완전 가이드: 비자 종류, 비용, 신청 절차, 240시간 환승 비자 면제 정책 등.' },
  ru: { title: 'Гид по визам в Китай - tripcngo.com', description: 'Полный гид по визам в Китай.' },
  fr: { title: 'Guide des visas Chine - tripcngo.com', description: 'Guide complet des visas pour la Chine.' },
  es: { title: 'Guía de visas China - tripcngo.com', description: 'Guía completa de visas para China.' },
  de: { title: 'China-Visum-Leitfaden - tripcngo.com', description: 'Vollständiger China-Visum-Leitfaden.' },
  tw: { title: '中國簽證指南 - tripcngo.com', description: '全面的中國簽證指南：簽證類型、費用、申請流程、240小時過境免簽政策等詳細信息。' },
  it: { title: 'Guida visa Cina - tripcngo.com', description: 'Guida completa ai visa per la Cina.' },
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
    },
  };
}

export default function Page() {
  return <Visa />;
}
