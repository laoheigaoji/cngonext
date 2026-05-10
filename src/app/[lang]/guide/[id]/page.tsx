import GuideDetailClient from "./GuideDetailClient";
import { getHreflangAlternates, baseUrl, getSEO, guideSEO, defaultOgImage } from "@/lib/seo-config";
import { getArticleData } from "@/lib/server-data";
import { LANGUAGES, GUIDE_IDS } from "@/lib/static-params";

export function generateStaticParams() {
  return LANGUAGES.flatMap(lang => GUIDE_IDS.map(id => ({ lang, id })));
}

export const revalidate = false;

const GUIDE_SEO_OVERRIDES: Record<string, Record<string, { title: string; description: string }>> = {
  vpn: {
    cn: { title: '中国VPN使用指南 - tripcngo.com', description: '在中国旅行时如何使用VPN，推荐VPN应用和设置教程，保持网络畅通。' },
    en: { title: 'China VPN Guide - tripcngo.com', description: 'How to use VPN in China, recommended VPN apps and setup tutorials to stay connected while traveling.' },
    ja: { title: '中国VPN利用ガイド - tripcngo.com', description: '中国旅行中のVPN利用方法、おすすめVPNアプリと設定チュートリアル。' },
    ko: { title: '중국 VPN 가이드 - tripcngo.com', description: '중국 여행 중 VPN 사용법, 추천 VPN 앱 및 설정 가이드.' },
    tw: { title: '中國VPN使用指南 - tripcngo.com', description: '在中國旅行時如何使用VPN，推薦VPN應用和設置教程，保持網絡暢通。' },
  },
  payment: {
    cn: { title: '中国移动支付指南 - tripcngo.com', description: '中国移动支付完全指南：支付宝、微信支付使用教程，外卡绑定方法。' },
    en: { title: 'China Mobile Payment Guide - tripcngo.com', description: 'Complete guide to mobile payments in China: Alipay, WeChat Pay tutorials and foreign card binding methods.' },
    ja: { title: '中国モバイル決済ガイド - tripcngo.com', description: '中国のモバイル決済完全ガイド：Alipay、WeChat Payの使い方と外国カードの紐付け方法。' },
    ko: { title: '중국 모바일 결제 가이드 - tripcngo.com', description: '중국 모바일 결제 완전 가이드: Alipay, WeChat Pay 사용법 및 해외 카드 등록 방법.' },
    tw: { title: '中國行動支付指南 - tripcngo.com', description: '中國行動支付完全指南：支付寶、微信支付使用教程，外卡綁定方法。' },
  },
  dining: {
    cn: { title: '中国美食与用餐礼仪 - tripcngo.com', description: '中国美食文化和用餐礼仪指南，了解中国餐饮文化、点餐技巧和餐桌礼仪。' },
    en: { title: 'Chinese Dining & Etiquette Guide - tripcngo.com', description: 'Guide to Chinese food culture and dining etiquette, ordering tips and table manners for travelers.' },
    ja: { title: '中国グルメ＆マナーガイド - tripcngo.com', description: '中国の食文化とレストランマナーガイド、注文のコツやテーブルマナー。' },
    ko: { title: '중국 음식과 식사 예절 가이드 - tripcngo.com', description: '중국 음식 문화와 식사 예절 가이드, 주문 팁과 테이블 매너.' },
    tw: { title: '中國美食與用餐禮儀 - tripcngo.com', description: '中國美食文化和用餐禮儀指南，了解中國餐飲文化、點餐技巧和餐桌禮儀。' },
  },
  gifts: {
    cn: { title: '中国特色伴手礼指南 - tripcngo.com', description: '中国特色伴手礼推荐，了解送礼文化、热门纪念品和购物攻略。' },
    en: { title: 'China Gift & Souvenir Guide - tripcngo.com', description: 'Guide to Chinese souvenirs and gifts, understanding gift-giving culture, popular souvenirs and shopping tips.' },
    ja: { title: '中国お土産ガイド - tripcngo.com', description: '中国のお土産と贈り物ガイド、贈り物文化、人気の記念品とショッピングのヒント。' },
    ko: { title: '중국 기념품 가이드 - tripcngo.com', description: '중국 기념품과 선물 가이드, 선물 문화, 인기 기념품과 쇼핑 팁.' },
    tw: { title: '中國特色伴手禮指南 - tripcngo.com', description: '中國特色伴手禮推薦，了解送禮文化、熱門紀念品和購物攻略。' },
  },
  social: {
    cn: { title: '中国社交文化指南 - tripcngo.com', description: '中国社交文化和礼仪指南，了解中国人的社交习惯、面子文化和人情世故。' },
    en: { title: 'Chinese Social Culture Guide - tripcngo.com', description: 'Guide to Chinese social culture and etiquette, understanding social customs, face culture and interpersonal relationships.' },
    ja: { title: '中国ソーシャル文化ガイド - tripcngo.com', description: '中国のソーシャル文化とエチケットガイド、社交習慣とメンツ文化の理解。' },
    ko: { title: '중국 사회문화 가이드 - tripcngo.com', description: '중국 사회문화와 예절 가이드, 사교 관습과 체면 문화 이해.' },
    tw: { title: '中國社交文化指南 - tripcngo.com', description: '中國社交文化和禮儀指南，了解中國人的社交習慣、面子文化和人情世故。' },
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  const fallback = getSEO(guideSEO, lang);
  const override = GUIDE_SEO_OVERRIDES[id]?.[lang] || GUIDE_SEO_OVERRIDES[id]?.['en'];

  const title = override?.title || fallback.title;
  const description = override?.description || fallback.description;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${lang}/guide/${id}`,
      languages: getHreflangAlternates(`/guide/${id}`),
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}/guide/${id}`,
      type: 'article',
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;

  let articleData = null;
  try {
    articleData = await getArticleData(id);
  } catch {}

  return <GuideDetailClient initialData={articleData} />;
}
