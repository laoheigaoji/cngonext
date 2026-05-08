// Multi-language SEO metadata configuration
// All static SEO data is defined here to avoid API calls in Worker

export const LANGUAGES = ['cn', 'en', 'ja', 'ko', 'ru', 'fr', 'es', 'de', 'tw', 'it'] as const;
export type LangCode = typeof LANGUAGES[number];
export const baseUrl = 'https://tripcngo.com';
export const defaultOgImage = `${baseUrl}/og-image.jpg`;

export function getHtmlLang(lang: string): string {
  if (lang === 'cn') return 'zh-CN';
  if (lang === 'tw') return 'zh-TW';
  return lang;
}

export function getOgLocale(lang: string): string {
  const map: Record<string, string> = {
    cn: 'zh_CN', tw: 'zh_TW', en: 'en_US', ja: 'ja_JP',
    ko: 'ko_KR', ru: 'ru_RU', fr: 'fr_FR', es: 'es_ES',
    de: 'de_DE', it: 'it_IT',
  };
  return map[lang] || 'en_US';
}

export function getHreflangAlternates(path: string = '') {
  const languages: Record<string, string> = { 'x-default': `${baseUrl}/en${path}` };
  LANGUAGES.forEach(prefix => {
    const hreflang = getHtmlLang(prefix);
    languages[hreflang] = `${baseUrl}/${prefix}${path}`;
  });
  return languages;
}

// Page-level SEO translations
interface PageSEO {
  title: string;
  description: string;
  keywords?: string;
}

const homeSEO: Record<string, PageSEO> = {
  cn: {
    title: 'tripcngo.com - 中国旅行指南 | 签证、文化、AI工具',
    description: '您的终极中国旅行指南。探索真实的中国文化、详细的签证政策、实用的旅行贴士。支付、交通、必备App指南让您的旅行计划更轻松，发现美丽真实的中国。',
    keywords: '中国旅行, 中国文化, 中国签证, 旅行指南, 中国必备App, 旅行贴士, 中国旅游',
  },
  en: {
    title: 'tripcngo.com - Your Ultimate China Travel Guide',
    description: 'Your ultimate guide to traveling China. Explore authentic Chinese culture, detailed visa policies, practical travel tips. Payment, transport, and essential app guides make trip planning easy. Discover the beautiful, real China.',
    keywords: 'China travel, Chinese culture, China visa, travel guide, China apps, travel tips, China tourism',
  },
  ja: {
    title: 'tripcngo.com - あなたのための究極の中国旅行ガイド',
    description: '究極の中国旅行ガイド。本物の中国文化、詳細なビザ政策、実用的な旅行のヒントを探索しましょう。支払い、交通、必須アプリのガイドで旅を簡単に計画し、美しくリアルな中国を発見してください。',
    keywords: '中国旅行, 中国文化, 中国ビザ, 中国旅行ガイド, 中国必須アプリ, 中国旅行のヒント, 中国 観光',
  },
  ko: {
    title: 'tripcngo.com - 중국 여행의 궁극 가이드',
    description: '중국 여행의 궁극 가이드. 진정한 중국 문화, 상세한 비자 정책, 실용적인 여행 팁을 탐험하세요. 결제, 교통, 필수 앱 가이드로 여행을 쉽게 계획하고 아름다운 진짜 중국을 발견하세요.',
    keywords: '중국 여행, 중국 문화, 중국 비자, 여행 가이드, 중국 앱, 여행 팁, 중국 관광',
  },
  ru: {
    title: 'tripcngo.com - Ваш главный путеводитель по Китаю',
    description: 'Ваш главный путеводитель по Китаю. Исследуйте аутентичную китайскую культуру, подробную визовую политику, практические советы для путешественников. Руководства по оплате, транспорту и необходимым приложениям.',
    keywords: 'путешествие в Китай, китайская культура, виза в Китай, путеводитель, приложения для Китая, советы путешественникам',
  },
  fr: {
    title: 'tripcngo.com - Votre guide ultime de voyage en Chine',
    description: 'Votre guide ultime pour voyager en Chine. Explorez la culture chinoise authentique, les politiques de visa détaillées, des conseils pratiques. Guides de paiement, transport et applications essentielles.',
    keywords: 'voyage Chine, culture chinoise, visa Chine, guide voyage, applications Chine, conseils voyage',
  },
  es: {
    title: 'tripcngo.com - Tu guía definitiva para viajar a China',
    description: 'Tu guía definitiva para viajar a China. Explora la cultura china auténtica, políticas de visa detalladas, consejos prácticos. Guías de pago, transporte y aplicaciones esenciales.',
    keywords: 'viaje China, cultura china, visa China, guía viaje, apps China, consejos viaje',
  },
  de: {
    title: 'tripcngo.com - Ihr ultimativer China-Reiseführer',
    description: 'Ihr ultimativer Reiseführer für China. Entdecken Sie authentische chinesische Kultur, detaillierte Visumpolitik, praktische Reisetipps. Zahlungs-, Transport- und App-Guides.',
    keywords: 'China Reise, chinesische Kultur, China Visum, Reiseführer, China Apps, Reisetipps',
  },
  tw: {
    title: 'tripcngo.com - 中國旅行指南 | 簽證、文化、AI工具',
    description: '您的終極中國旅行指南。探索真實的中國文化、詳細的簽證政策、實用的旅行貼士。支付、交通、必備App指南讓您的旅行計劃更輕鬆，發現美麗真實的中國。',
    keywords: '中國旅行, 中國文化, 中國簽證, 旅行指南, 中國必備App, 旅行貼士, 中國旅遊',
  },
  it: {
    title: 'tripcngo.com - La tua guida definitiva per viaggiare in Cina',
    description: 'La tua guida definitiva per viaggiare in Cina. Esplora la cultura cinese autentica, politiche sui visti dettagliate, consigli pratici. Guide su pagamenti, trasporti e app essenziali.',
    keywords: 'viaggio Cina, cultura cinese, visa Cina, guida viaggio, app Cina, consigli viaggio',
  },
};

const citiesSEO: Record<string, PageSEO> = {
  cn: { title: '热门城市指南 - tripcngo.com', description: '探索中国热门旅游城市，包括北京、上海、成都等。获取每个城市的详细旅行攻略、景点推荐和实用信息。' },
  en: { title: 'Popular City Guides - tripcngo.com', description: 'Explore popular travel cities in China, including Beijing, Shanghai, Chengdu and more. Get detailed travel guides, attraction recommendations and practical info.' },
  ja: { title: '人気都市ガイド - tripcngo.com', description: '北京、上海、成都など、中国の人気旅行都市を探索。各都市の詳細な旅行ガイド、観光スポット、実用情報を入手。' },
  ko: { title: '인기 도시 가이드 - tripcngo.com', description: '베이징, 상하이, 청두 등 중국 인기 여행 도시를 탐험하세요. 상세한 여행 가이드, 관광명소 추천, 실용 정보를 확인하세요.' },
  ru: { title: 'Популярные города - tripcngo.com', description: 'Исследуйте популярные туристические города Китая: Пекин, Шанхай, Чэнду и другие.' },
  fr: { title: 'Guides de villes populaires - tripcngo.com', description: 'Explorez les villes populaires de Chine : Pékin, Shanghai, Chengdu et plus.' },
  es: { title: 'Guías de ciudades populares - tripcngo.com', description: 'Explora ciudades populares de China: Pekín, Shanghái, Chengdú y más.' },
  de: { title: 'Beliebte Stadtguides - tripcngo.com', description: 'Entdecken Sie beliebte Städte in China: Peking, Shanghai, Chengdu und mehr.' },
  tw: { title: '熱門城市指南 - tripcngo.com', description: '探索中國熱門旅遊城市，包括北京、上海、成都等。獲取每個城市的詳細旅行攻略、景點推薦和實用信息。' },
  it: { title: 'Guide delle città popolari - tripcngo.com', description: 'Esplora le città popolari della Cina: Pechino, Shanghai, Chengdu e altre.' },
};

const articlesSEO: Record<string, PageSEO> = {
  cn: { title: '旅行攻略 - tripcngo.com', description: '阅读最新的中国旅行攻略和文章，了解签证政策、文化习俗、美食推荐和实用旅行贴士。' },
  en: { title: 'Travel Articles - tripcngo.com', description: 'Read the latest China travel articles and guides. Learn about visa policies, cultural customs, food recommendations and practical travel tips.' },
  ja: { title: '旅行記事 - tripcngo.com', description: '最新の中国旅行記事とガイドを読む。ビザ政策、文化習慣、グルメおすすめ、実用的な旅行のヒントを学ぶ。' },
  ko: { title: '여행 기사 - tripcngo.com', description: '최신 중국 여행 기사와 가이드를 읽어보세요. 비자 정책, 문화 관습, 음식 추천, 실용적인 여행 팁을 알아보세요.' },
  ru: { title: 'Статьи о путешествиях - tripcngo.com', description: 'Читайте последние статьи о путешествиях в Китай.' },
  fr: { title: 'Articles de voyage - tripcngo.com', description: 'Lisez les derniers articles de voyage en Chine.' },
  es: { title: 'Artículos de viaje - tripcngo.com', description: 'Lee los últimos artículos de viaje a China.' },
  de: { title: 'Reiseartikel - tripcngo.com', description: 'Lesen Sie die neuesten China-Reiseartikel.' },
  tw: { title: '旅行攻略 - tripcngo.com', description: '閱讀最新的中國旅行攻略和文章，了解簽證政策、文化習俗、美食推薦和實用旅行貼士。' },
  it: { title: 'Articoli di viaggio - tripcngo.com', description: 'Leggi gli ultimi articoli di viaggio in Cina.' },
};

const guideSEO: Record<string, PageSEO> = {
  cn: { title: '旅行锦囊 - tripcngo.com', description: '中国旅行实用锦囊：VPN使用、移动支付、基本中文、文化礼仪等实用指南，让您的中国之旅更顺畅。' },
  en: { title: 'Travel Tips & Guides - tripcngo.com', description: 'Practical China travel guides: VPN usage, mobile payments, basic Chinese, cultural etiquette and more to make your China trip smoother.' },
  ja: { title: '旅行のヒント - tripcngo.com', description: '中国旅行の実用ガイド：VPN利用、モバイル決済、基本中国語、文化マナーなど、中国旅行をよりスムーズに。' },
  ko: { title: '여행 팁 - tripcngo.com', description: '중국 여행 실용 가이드: VPN 사용, 모바일 결제, 기본 중국어, 문화 에티켓 등으로 중국 여행을 더 원활하게.' },
  ru: { title: 'Советы путешественникам - tripcngo.com', description: 'Практические руководства для путешествий в Китай.' },
  fr: { title: 'Conseils de voyage - tripcngo.com', description: 'Guides pratiques pour voyager en Chine.' },
  es: { title: 'Consejos de viaje - tripcngo.com', description: 'Guías prácticas para viajar a China.' },
  de: { title: 'Reisetipps - tripcngo.com', description: 'Praktische Reiseführer für China.' },
  tw: { title: '旅行錦囊 - tripcngo.com', description: '中國旅行實用錦囊：VPN使用、行動支付、基本中文、文化禮儀等實用指南，讓您的中國之旅更順暢。' },
  it: { title: 'Consigli di viaggio - tripcngo.com', description: 'Guide pratiche per viaggiare in Cina.' },
};

const appsSEO: Record<string, PageSEO> = {
  cn: { title: '中国旅行必备App - tripcngo.com', description: '中国旅行必备应用程序推荐：支付、导航、社交、翻译等App下载和使用指南。' },
  en: { title: 'Essential China Travel Apps - tripcngo.com', description: 'Essential apps for China travel: payment, navigation, social media, translation apps download and usage guides.' },
  ja: { title: '中国旅行必須アプリ - tripcngo.com', description: '中国旅行に必須のアプリ：決済、ナビ、SNS、翻訳アプリのダウンロードと使い方ガイド。' },
  ko: { title: '중국 여행 필수 앱 - tripcngo.com', description: '중국 여행 필수 앱 추천: 결제, 내비게이션, 소셜미디어, 번역 앱 다운로드 및 사용 가이드.' },
  ru: { title: 'Необходимые приложения для Китая - tripcngo.com', description: 'Необходимые приложения для путешествий в Китай.' },
  fr: { title: 'Applications essentielles Chine - tripcngo.com', description: 'Applications essentielles pour voyager en Chine.' },
  es: { title: 'Apps esenciales para China - tripcngo.com', description: 'Aplicaciones esenciales para viajar a China.' },
  de: { title: 'Wichtige China-Apps - tripcngo.com', description: 'Wichtige Apps für China-Reisen.' },
  tw: { title: '中國旅行必備App - tripcngo.com', description: '中國旅行必備應用程式推薦：支付、導航、社交、翻譯等App下載和使用指南。' },
  it: { title: 'App essenziali per la Cina - tripcngo.com', description: 'App essenziali per viaggiare in Cina.' },
};

const aboutSEO: Record<string, PageSEO> = {
  cn: { title: '关于我们 - tripcngo.com', description: '了解tripcngo.com，我们致力于为全球旅行者提供最全面的中国旅行信息和AI驱动的智能工具。' },
  en: { title: 'About Us - tripcngo.com', description: 'Learn about tripcngo.com - we are dedicated to providing the most comprehensive China travel information and AI-powered smart tools for global travelers.' },
  ja: { title: '私たちについて - tripcngo.com', description: 'tripcngo.comについて - グローバル旅行者に最も包括的な中国旅行情報とAI搭載のスマートツールを提供します。' },
  ko: { title: '소개 - tripcngo.com', description: 'tripcngo.com 소개 - 글로벌 여행자를 위한 가장 포괄적인 중국 여행 정보와 AI 기반 스마트 도구를 제공합니다.' },
  ru: { title: 'О нас - tripcngo.com', description: 'Узнайте о tripcngo.com - мы предоставляем самую полную информацию о путешествиях в Китай.' },
  fr: { title: 'À propos - tripcngo.com', description: 'Découvrez tripcngo.com - nous fournissons les informations les plus complètes sur les voyages en Chine.' },
  es: { title: 'Sobre nosotros - tripcngo.com', description: 'Conoce tripcngo.com - proporcionamos la información más completa sobre viajes a China.' },
  de: { title: 'Über uns - tripcngo.com', description: 'Erfahren Sie mehr über tripcngo.com - umfassende China-Reiseinformationen.' },
  tw: { title: '關於我們 - tripcngo.com', description: '了解tripcngo.com，我們致力於為全球旅行者提供最全面的中國旅行信息和AI驅動的智能工具。' },
  it: { title: 'Chi siamo - tripcngo.com', description: 'Scopri tripcngo.com - forniamo le informazioni più complete sui viaggi in Cina.' },
};

const privacySEO: Record<string, PageSEO> = {
  cn: { title: '隐私政策 - tripcngo.com', description: 'tripcngo.com隐私政策，了解我们如何收集、使用和保护您的个人信息。' },
  en: { title: 'Privacy Policy - tripcngo.com', description: 'tripcngo.com privacy policy. Learn how we collect, use and protect your personal information.' },
  ja: { title: 'プライバシーポリシー - tripcngo.com', description: 'tripcngo.comプライバシーポリシー。個人情報の収集、利用、保護についてご確認ください。' },
  ko: { title: '개인정보 처리방침 - tripcngo.com', description: 'tripcngo.com 개인정보 처리방침. 개인정보 수집, 이용 및 보호 방법을 확인하세요.' },
  ru: { title: 'Политика конфиденциальности - tripcngo.com', description: 'Политика конфиденциальности tripcngo.com.' },
  fr: { title: 'Politique de confidentialité - tripcngo.com', description: 'Politique de confidentialité de tripcngo.com.' },
  es: { title: 'Política de privacidad - tripcngo.com', description: 'Política de privacidad de tripcngo.com.' },
  de: { title: 'Datenschutzrichtlinie - tripcngo.com', description: 'Datenschutzrichtlinie von tripcngo.com.' },
  tw: { title: '隱私政策 - tripcngo.com', description: 'tripcngo.com隱私政策，了解我們如何收集、使用和保護您的個人信息。' },
  it: { title: 'Informativa sulla privacy - tripcngo.com', description: 'Informativa sulla privacy di tripcngo.com.' },
};

const termsSEO: Record<string, PageSEO> = {
  cn: { title: '服务条款 - tripcngo.com', description: 'tripcngo.com服务条款，使用我们的服务前请仔细阅读。' },
  en: { title: 'Terms of Service - tripcngo.com', description: 'tripcngo.com terms of service. Please read carefully before using our services.' },
  ja: { title: '利用規約 - tripcngo.com', description: 'tripcngo.com利用規約。サービスご利用前に必ずお読みください。' },
  ko: { title: '이용약관 - tripcngo.com', description: 'tripcngo.com 이용약관. 서비스 이용 전 주의 깊게 읽어주세요.' },
  ru: { title: 'Условия использования - tripcngo.com', description: 'Условия использования tripcngo.com.' },
  fr: { title: "Conditions d'utilisation - tripcngo.com", description: "Conditions d'utilisation de tripcngo.com." },
  es: { title: 'Términos de servicio - tripcngo.com', description: 'Términos de servicio de tripcngo.com.' },
  de: { title: 'Nutzungsbedingungen - tripcngo.com', description: 'Nutzungsbedingungen von tripcngo.com.' },
  tw: { title: '服務條款 - tripcngo.com', description: 'tripcngo.com服務條款，使用我們的服務前請仔細閱讀。' },
  it: { title: 'Termini di servizio - tripcngo.com', description: 'Termini di servizio di tripcngo.com.' },
};

const visaTypesSEO: Record<string, PageSEO> = {
  cn: { title: '中国签证类型 - tripcngo.com', description: '了解中国各类签证类型及所需材料，包括旅游签证(L)、商务签证(M)、工作签证(Z)等详细指南。' },
  en: { title: 'China Visa Types - tripcngo.com', description: 'Learn about China visa types and required documents, including tourist visa (L), business visa (M), work visa (Z) and more.' },
  ja: { title: '中国ビザの種類 - tripcngo.com', description: '中国の各種ビザの種類と必要書類について。観光ビザ(L)、ビジネスビザ(M)、就労ビザ(Z)などの詳細ガイド。' },
  ko: { title: '중국 비자 종류 - tripcngo.com', description: '중국 비자 종류 및 필요 서류 안내. 관광비자(L), 비즈니스비자(M), 취업비자(Z) 등 상세 가이드.' },
  ru: { title: 'Типы виз в Китай - tripcngo.com', description: 'Типы виз в Китай и необходимые документы.' },
  fr: { title: 'Types de visa Chine - tripcngo.com', description: 'Types de visa pour la Chine et documents requis.' },
  es: { title: 'Tipos de visa China - tripcngo.com', description: 'Tipos de visa para China y documentos requeridos.' },
  de: { title: 'China-Visum-Typen - tripcngo.com', description: 'China-Visum-Typen und erforderliche Dokumente.' },
  tw: { title: '中國簽證類型 - tripcngo.com', description: '了解中國各類簽證類型及所需材料，包括旅遊簽證(L)、商務簽證(M)、工作簽證(Z)等詳細指南。' },
  it: { title: 'Tipi di visa Cina - tripcngo.com', description: 'Tipi di visa per la Cina e documenti richiesti.' },
};

const visaFeesSEO: Record<string, PageSEO> = {
  cn: { title: '中国签证费用 - tripcngo.com', description: '中国签证费用一览表，包括各国签证申请费用、加急费用等详细信息。' },
  en: { title: 'China Visa Fees - tripcngo.com', description: 'China visa fees schedule, including application fees, express fees and more for all nationalities.' },
  ja: { title: '中国ビザ費用 - tripcngo.com', description: '中国ビザ費用一覧表。各国のビザ申請費用、特急費用などの詳細情報。' },
  ko: { title: '중국 비자 비용 - tripcngo.com', description: '중국 비자 비용 안내표. 각국 비자 신청 비용, 급행 비용 등 상세 정보.' },
  ru: { title: 'Стоимость визы в Китай - tripcngo.com', description: 'Стоимость визы в Китай для всех национальностей.' },
  fr: { title: 'Frais de visa Chine - tripcngo.com', description: 'Tarifs des visas pour la Chine.' },
  es: { title: 'Tarifas de visa China - tripcngo.com', description: 'Tarifas de visa para China.' },
  de: { title: 'China-Visumgebühren - tripcngo.com', description: 'China-Visumgebühren für alle Nationalitäten.' },
  tw: { title: '中國簽證費用 - tripcngo.com', description: '中國簽證費用一覽表，包括各國簽證申請費用、加急費用等詳細信息。' },
  it: { title: 'Costi visa Cina - tripcngo.com', description: 'Tariffe dei visa per la Cina.' },
};

// Helper to get SEO data with fallback to English
function getSEO(seoMap: Record<string, PageSEO>, lang: string): PageSEO {
  return seoMap[lang] || seoMap['en'] || { title: 'tripcngo.com', description: '' };
}

const feedbackSEO: Record<string, PageSEO> = {
  cn: { title: '意见反馈 - tripcngo.com', description: '分享您的反馈和建议，帮助我们改进 tripcngo.com，为您提供更好的中国旅行信息。' },
  en: { title: 'Feedback - tripcngo.com', description: 'Share your feedback and suggestions to help us improve tripcngo.com for better China travel information.' },
  ja: { title: 'フィードバック - tripcngo.com', description: 'フィードバックやご提案をお寄せください。tripcngo.comを改善し、より良い中国旅行情報を提供します。' },
  ko: { title: '피드백 - tripcngo.com', description: '피드백과 제안을 공유해 주세요. tripcngo.com을 개선하여 더 나은 중국 여행 정보를 제공합니다.' },
  ru: { title: 'Обратная связь - tripcngo.com', description: 'Поделитесь своими отзывами и предложениями, чтобы помочь нам улучшить tripcngo.com.' },
  fr: { title: 'Commentaires - tripcngo.com', description: 'Partagez vos commentaires et suggestions pour nous aider à améliorer tripcngo.com.' },
  es: { title: 'Comentarios - tripcngo.com', description: 'Comparta sus comentarios y sugerencias para ayudarnos a mejorar tripcngo.com.' },
  de: { title: 'Feedback - tripcngo.com', description: 'Teilen Sie Ihr Feedback und Ihre Vorschläge mit, um uns bei der Verbesserung von tripcngo.com zu helfen.' },
  tw: { title: '意見反饋 - tripcngo.com', description: '分享您的反饋和建議，幫助我們改進 tripcngo.com，為您提供更好的中國旅行信息。' },
  it: { title: 'Feedback - tripcngo.com', description: 'Condividi i tuoi feedback e suggerimenti per aiutarci a migliorare tripcngo.com.' },
};

const visaDownloadsSEO: Record<string, PageSEO> = {
  cn: { title: '中国签证申请表下载 - tripcngo.com', description: '下载中国签证申请表和所需材料。获取您申请中国签证所需的所有表格。' },
  en: { title: 'China Visa Document Downloads - tripcngo.com', description: 'Download China visa application forms and required documents. Get all the forms you need for your China visa application.' },
  ja: { title: '中国ビザ申請書ダウンロード - tripcngo.com', description: '中国ビザ申請書と必要書類のダウンロード。中国ビザ申請に必要なすべてのフォームを入手。' },
  ko: { title: '중국 비자 신청서 다운로드 - tripcngo.com', description: '중국 비자 신청서 및 필요 서류 다운로드. 중국 비자 신청에 필요한 모든 양식을 받으세요.' },
  ru: { title: 'Загрузка визовых документов Китая - tripcngo.com', description: 'Скачайте анкеты и необходимые документы для визы в Китай.' },
  fr: { title: 'Téléchargement formulaires visa Chine - tripcngo.com', description: 'Téléchargez les formulaires de demande de visa pour la Chine et les documents requis.' },
  es: { title: 'Descarga formularios visa China - tripcngo.com', description: 'Descargue formularios de solicitud de visa para China y documentos requeridos.' },
  de: { title: 'China-Visumformulare Download - tripcngo.com', description: 'Laden Sie China-Visumantragsformulare und erforderliche Dokumente herunter.' },
  tw: { title: '中國簽證申請表下載 - tripcngo.com', description: '下載中國簽證申請表和所需材料。獲取您申請中國簽證所需的所有表格。' },
  it: { title: 'Download moduli visa Cina - tripcngo.com', description: 'Scarica i moduli di richiesta visa per la Cina e i documenti necessari.' },
};

const visaArrivalCardSEO: Record<string, PageSEO> = {
  cn: { title: '中国入境卡填写指南 - tripcngo.com', description: '在线填写中国入境卡。出行前完成中国入境卡表格。' },
  en: { title: 'China Arrival Card Form - tripcngo.com', description: 'Fill out your China arrival card online. Complete the China entry/arrival card form before your trip.' },
  ja: { title: '中国入国カード記入 - tripcngo.com', description: '中国入国カードをオンラインで記入。旅行前に中国入国カードフォームを完了しましょう。' },
  ko: { title: '중국 입국카드 작성 - tripcngo.com', description: '온라인으로 중국 입국카드를 작성하세요. 여행 전 중국 입국카드 양식을 완료하세요.' },
  ru: { title: 'Карта прибытия в Китай - tripcngo.com', description: 'Заполните карту прибытия в Китай онлайн перед поездкой.' },
  fr: { title: 'Formulaire carte d\'arrivée Chine - tripcngo.com', description: 'Remplissez votre carte d\'arrivée en Chine en ligne avant votre voyage.' },
  es: { title: 'Formulario tarjeta de llegada China - tripcngo.com', description: 'Complete su tarjeta de llegada a China en línea antes de su viaje.' },
  de: { title: 'China Ankunftskarte - tripcngo.com', description: 'Füllen Sie Ihre China-Ankunftskarte online aus vor Ihrer Reise.' },
  tw: { title: '中國入境卡填寫指南 - tripcngo.com', description: '在線填寫中國入境卡。出行前完成中國入境卡表格。' },
  it: { title: 'Scheda di arrivo Cina - tripcngo.com', description: 'Compila la scheda di arrivo in Cina online prima del tuo viaggio.' },
};

const visaFormSEO: Record<string, PageSEO> = {
  cn: { title: '中国签证申请表填写指南 - tripcngo.com', description: '中国签证申请表填写完全指南。分步骤说明和成功申请技巧。' },
  en: { title: 'China Visa Application Form Guide - tripcngo.com', description: 'Complete guide to filling out the China visa application form. Step-by-step instructions and tips for a successful application.' },
  ja: { title: '中国ビザ申請書記入ガイド - tripcngo.com', description: '中国ビザ申請書記入の完全ガイド。ステップバイステップの手順と成功のコツ。' },
  ko: { title: '중국 비자 신청서 작성 가이드 - tripcngo.com', description: '중국 비자 신청서 작성 완전 가이드. 단계별 안내와 성공적인 신청 팁.' },
  ru: { title: 'Руководство по заполнению визовой анкеты Китая - tripcngo.com', description: 'Полное руководство по заполнению анкеты на визу в Китай.' },
  fr: { title: 'Guide formulaire visa Chine - tripcngo.com', description: 'Guide complet pour remplir le formulaire de demande de visa pour la Chine.' },
  es: { title: 'Guía formulario visa China - tripcngo.com', description: 'Guía completa para rellenar el formulario de solicitud de visa para China.' },
  de: { title: 'China-Visumantrag Leitfaden - tripcngo.com', description: 'Vollständiger Leitfaden zum Ausfüllen des China-Visumantrags.' },
  tw: { title: '中國簽證申請表填寫指南 - tripcngo.com', description: '中國簽證申請表填寫完全指南。分步驟說明和成功申請技巧。' },
  it: { title: 'Guida modulo visa Cina - tripcngo.com', description: 'Guida completa alla compilazione del modulo di richiesta visa per la Cina.' },
};

const visaPhotoSEO: Record<string, PageSEO> = {
  cn: { title: '中国签证照片要求 - tripcngo.com', description: '中国签证照片规格和要求。确保护照照片符合中国大使馆标准。' },
  en: { title: 'China Visa Photo Requirements - tripcngo.com', description: 'China visa photo specifications and requirements. Ensure your passport photo meets the Chinese embassy standards.' },
  ja: { title: '中国ビザ写真要件 - tripcngo.com', description: '中国ビザ写真の仕様と要件。パスポート写真が中国大使館の基準を満たしているか確認。' },
  ko: { title: '중국 비자 사진 요구사항 - tripcngo.com', description: '중국 비자 사진 규격 및 요구사항. 여권 사진이 중국 대사관 기준을 충족하는지 확인하세요.' },
  ru: { title: 'Требования к фото для визы в Китай - tripcngo.com', description: 'Спецификации и требования к фотографиям для визы в Китай.' },
  fr: { title: 'Exigences photo visa Chine - tripcngo.com', description: 'Spécifications et exigences des photos pour le visa Chine.' },
  es: { title: 'Requisitos foto visa China - tripcngo.com', description: 'Especificaciones y requisitos de fotos para la visa de China.' },
  de: { title: 'China-Visumfoto Anforderungen - tripcngo.com', description: 'China-Visumfoto-Spezifikationen und Anforderungen.' },
  tw: { title: '中國簽證照片要求 - tripcngo.com', description: '中國簽證照片規格和要求。確保護照照片符合中國大使館標準。' },
  it: { title: 'Requisiti foto visa Cina - tripcngo.com', description: 'Specifiche e requisiti delle foto per il visa della Cina.' },
};

const zodiacSEO: Record<string, PageSEO> = {
  cn: { title: '中国生肖计算器 - tripcngo.com', description: '根据出生年份查询您的中国生肖。了解十二生肖及其文化意义。' },
  en: { title: 'Chinese Zodiac Calculator - tripcngo.com', description: 'Find your Chinese zodiac sign based on your birth year. Learn about the 12 Chinese zodiac animals and their cultural significance.' },
  ja: { title: '干支計算機 - tripcngo.com', description: '生まれ年からあなたの干支を調べましょう。十二支とその文化的な意味について学びましょう。' },
  ko: { title: '중국 띠 계산기 - tripcngo.com', description: '출생연도로 당신의 중국 띠를 찾아보세요. 12간지와 그 문화적 의미를 알아보세요.' },
  ru: { title: 'Калькулятор китайского зодиака - tripcngo.com', description: 'Узнайте свой знак китайского зодиака по году рождения.' },
  fr: { title: 'Calculateur zodiaque chinois - tripcngo.com', description: 'Trouvez votre signe du zodiaque chinois selon votre année de naissance.' },
  es: { title: 'Calculador zodiaco chino - tripcngo.com', description: 'Encuentra tu signo del zodiaco chino según tu año de nacimiento.' },
  de: { title: 'Chinesischer Tierkreiskreisrechner - tripcngo.com', description: 'Finden Sie Ihr chinesisches Tierkreiszeichen nach Ihrem Geburtsjahr.' },
  tw: { title: '中國生肖計算器 - tripcngo.com', description: '根據出生年份查詢您的中國生肖。了解十二生肖及其文化意義。' },
  it: { title: 'Calcolatore zodiaco cinese - tripcngo.com', description: 'Trova il tuo segno dello zodiaco cinese in base al tuo anno di nascita.' },
};

const nameGeneratorSEO: Record<string, PageSEO> = {
  cn: { title: '中文名字生成器 - tripcngo.com', description: '根据您的英文名生成有意义的中文名。AI驱动的中文名字创作，具有文化内涵。' },
  en: { title: 'Chinese Name Generator - tripcngo.com', description: 'Generate a meaningful Chinese name based on your English name. AI-powered Chinese name creation with cultural significance.' },
  ja: { title: '中国語名前ジェネレーター - tripcngo.com', description: '英語名から意味のある中国語名を生成。文化的な意味を持つAI搭載の中国語名作成。' },
  ko: { title: '중국어 이름 생성기 - tripcngo.com', description: '영어 이름으로 의미 있는 중국어 이름을 생성하세요. 문화적 의미를 담은 AI 기반 중국어 이름 생성.' },
  ru: { title: 'Генератор китайских имён - tripcngo.com', description: 'Создайте осмысленное китайское имя на основе вашего английского имени.' },
  fr: { title: 'Générateur de noms chinois - tripcngo.com', description: 'Générez un nom chinois significatif basé sur votre nom anglais.' },
  es: { title: 'Generador de nombres chinos - tripcngo.com', description: 'Genere un nombre chino significativo basado en su nombre en inglés.' },
  de: { title: 'Chinesischer Namensgenerator - tripcngo.com', description: 'Erzeugen Sie einen bedeutungsvollen chinesischen Namen basierend auf Ihrem englischen Namen.' },
  tw: { title: '中文名字生成器 - tripcngo.com', description: '根據您的英文名生成有意義的中文名。AI驅動的中文名字創作，具有文化內涵。' },
  it: { title: 'Generatore di nomi cinesi - tripcngo.com', description: 'Genera un nome cinese significativo basato sul tuo nome inglese.' },
};

const menuTranslatorSEO: Record<string, PageSEO> = {
  cn: { title: '中文菜单翻译器 - tripcngo.com', description: '用AI翻译中文餐厅菜单。上传照片或输入中文菜名，即时获取翻译和解释。' },
  en: { title: 'Chinese Menu Translator - tripcngo.com', description: 'Translate Chinese restaurant menus with AI. Upload a photo or type Chinese dish names to get instant translations and explanations.' },
  ja: { title: '中国語メニュー翻訳 - tripcngo.com', description: 'AIで中国語のレストランメニューを翻訳。写真をアップロードまたは中国語の料理名を入力して即座に翻訳と解説を取得。' },
  ko: { title: '중국어 메뉴 번역기 - tripcngo.com', description: 'AI로 중국어 식당 메뉴를 번역하세요. 사진을 업로드하거나 중국어 요리명을 입력하여 즉시 번역과 설명을 받으세요.' },
  ru: { title: 'Переводчик китайского меню - tripcngo.com', description: 'Переводите китайские ресторанные меню с помощью ИИ.' },
  fr: { title: 'Traducteur de menu chinois - tripcngo.com', description: 'Traduisez les menus de restaurants chinois avec l\'IA.' },
  es: { title: 'Traductor de menú chino - tripcngo.com', description: 'Traduzca menús de restaurantes chinos con IA.' },
  de: { title: 'Chinesischer Menü-Übersetzer - tripcngo.com', description: 'Übersetzen Sie chinesische Restaurantmenüs mit KI.' },
  tw: { title: '中文菜單翻譯器 - tripcngo.com', description: '用AI翻譯中文餐廳菜單。上傳照片或輸入中文菜名，即時獲取翻譯和解釋。' },
  it: { title: 'Traduttore di menu cinese - tripcngo.com', description: 'Traduci i menu dei ristoranti cinesi con l\'IA.' },
};

const pinyinSEO: Record<string, PageSEO> = {
  cn: { title: '拼音分词工具 - tripcngo.com', description: '将连续拼音分词为单独词语。有助于学习中文发音和拼音转汉字。' },
  en: { title: 'Pinyin Segmentation Tool - tripcngo.com', description: 'Segment continuous pinyin into individual words. Useful for learning Chinese pronunciation and converting pinyin to Chinese characters.' },
  ja: { title: 'ピンイン分割ツール - tripcngo.com', description: '連続ピンインを個別の単語に分割。中国語の発音学習やピンインから漢字への変換に便利。' },
  ko: { title: '병음 분할 도구 - tripcngo.com', description: '연속 병음을 개별 단어로 분할하세요. 중국어 발음 학습과 병음-한자 변환에 유용합니다.' },
  ru: { title: 'Инструмент сегментации пиньинь - tripcngo.com', description: 'Разделяйте непрерывный пиньинь на отдельные слова.' },
  fr: { title: 'Outil de segmentation pinyin - tripcngo.com', description: 'Segmentez le pinyin continu en mots individuels.' },
  es: { title: 'Herramienta de segmentación pinyin - tripcngo.com', description: 'Segmenta el pinyin continuo en palabras individuales.' },
  de: { title: 'Pinyin-Segmentierungstool - tripcngo.com', description: 'Segmentieren Sie fortlaufendes Pinyin in einzelne Wörter.' },
  tw: { title: '拼音分詞工具 - tripcngo.com', description: '將連續拼音分詞為單獨詞語。有助於學習中文發音和拼音轉漢字。' },
  it: { title: 'Strumento di segmentazione pinyin - tripcngo.com', description: 'Segmenta il pinyin continuo in parole individuali.' },
};

const characterCounterSEO: Record<string, PageSEO> = {
  cn: { title: '中文字数统计 - tripcngo.com', description: '统计中文字符、词语和句子数。适用于中文社交媒体和文档的字数限制写作。' },
  en: { title: 'Chinese Character Counter - tripcngo.com', description: 'Count Chinese characters, words, and sentences. Useful tool for writing within character limits for Chinese social media and documents.' },
  ja: { title: '中国語文字カウンター - tripcngo.com', description: '中国語の文字、単語、文をカウント。中国語SNSやドキュメントの文字数制限内での執筆に便利。' },
  ko: { title: '중국어 글자 수 카운터 - tripcngo.com', description: '중국어 글자, 단어, 문장 수를 세세요. 중국어 소셜미디어와 문서의 글자 수 제한 내 작성에 유용합니다.' },
  ru: { title: 'Счётчик китайских иероглифов - tripcngo.com', description: 'Подсчитывайте китайские иероглифы, слова и предложения.' },
  fr: { title: 'Compteur de caractères chinois - tripcngo.com', description: 'Comptez les caractères, mots et phrases chinois.' },
  es: { title: 'Contador de caracteres chinos - tripcngo.com', description: 'Cuenta caracteres, palabras y oraciones en chino.' },
  de: { title: 'Chinesisch Zeichenzähler - tripcngo.com', description: 'Zählen Sie chinesische Zeichen, Wörter und Sätze.' },
  tw: { title: '中文字數統計 - tripcngo.com', description: '統計中文字符、詞語和句子數。適用於中文社群媒體和文檔的字數限制寫作。' },
  it: { title: 'Contatore caratteri cinesi - tripcngo.com', description: 'Conta caratteri, parole e frasi cinesi.' },
};

export { homeSEO, citiesSEO, articlesSEO, guideSEO, appsSEO, aboutSEO, privacySEO, termsSEO, visaTypesSEO, visaFeesSEO, feedbackSEO, visaDownloadsSEO, visaArrivalCardSEO, visaFormSEO, visaPhotoSEO, zodiacSEO, nameGeneratorSEO, menuTranslatorSEO, pinyinSEO, characterCounterSEO, getSEO, defaultOgImage, getOgLocale };

// JSON-LD generators
export function generateWebsiteJsonLd(lang: string) {
  const seo = getSEO(homeSEO, lang);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'tripcngo.com',
    url: `${baseUrl}/${lang}`,
    description: seo.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/${lang}/cities?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'tripcngo.com',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
  };
}

export function generateFAQJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateArticleJsonLd(article: { title: string; description?: string; thumbnail?: string; createdAt?: string; updatedAt?: string; author?: string; id: string }, lang: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description || '',
    image: article.thumbnail || '',
    url: `${baseUrl}/${lang}/articles/${article.id}`,
    datePublished: article.createdAt || new Date().toISOString(),
    dateModified: article.updatedAt || article.createdAt || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: article.author || 'tripcngo.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'tripcngo.com',
      logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.png` },
    },
  };
}

export function generateCityJsonLd(city: { name: string; name_en?: string; description?: string; image?: string; id: string }, lang: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'City',
    name: city.name,
    alternateName: city.name_en || '',
    description: city.description || '',
    image: city.image || '',
    url: `${baseUrl}/${lang}/cities/${city.id}`,
  };
}
