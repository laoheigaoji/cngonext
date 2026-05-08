const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const translations = {
  en: {
    suffix: "Travel China Go - Your Ultimate China Travel Guide",
    siteTitle: "Travel China Go - Your Ultimate China Travel Guide | tripcngo.com",
    defaultDescription: "Your ultimate guide to traveling in China. Latest visa-free policies, visa guides, transportation tips, and destination reports.",
    defaultKeywords: "China travel, visa free China, 144h transit visa free, 240h transit visa, China visa, China cities, China travel guide, China entry guide"
  },
  zh: {
    suffix: "旅行中国出发 - 您的终极中国旅游指南",
    siteTitle: "旅行中国出发 - 您的终极中国旅游指南 | tripcngo.com",
    defaultDescription: "您的中国旅行终极指南。提供最新的免签政策、签证指引、交通攻略和目的地深度报告。",
    defaultKeywords: "中国旅游, 免签中国, 144小时过境免签, 240小时过境免签, 中国签证, 中国城市, 中国旅行攻略, 中国入境指南"
  },
  tw: {
    suffix: "旅行中國出發 - 您的終極中國旅遊指南",
    siteTitle: "旅行中國出發 - 您的終極中國旅遊指南 | tripcngo.com",
    defaultDescription: "您的中國旅行終極指南。提供最新的免簽政策、簽證指引、交通攻略和目的地深度報告。",
    defaultKeywords: "中國旅遊, 免簽中國, 144小時過境免簽, 240小時過境免簽, 中國簽證, 中國城市, 中國旅行攻略, 中國入境指南"
  },
  ja: {
    suffix: "中国旅行へ出発 - 究極の中国旅行ガイド",
    siteTitle: "中国旅行へ出発 - 究極の中国旅行ガイド | tripcngo.com",
    defaultDescription: "中国旅行の究極のガイド。最新のビザ免除政策、ビザガイド、交通のヒント、目的地の詳細レポートを提供します。",
    defaultKeywords: "中国旅行, 中国ビザ免除, 144時間トランジットビザ免除, 240時間トランジットビザ, 中国ビザ, 中国の都市, 中国旅行ガイド, 中国入国ガイド"
  },
  ko: {
    suffix: "중국 여행 출발 - 최고의 중국 여행 가이드",
    siteTitle: "중국 여행 출발 - 최고의 중국 여행 가이드 | tripcngo.com",
    defaultDescription: "중국 여행을 위한 최고의 가이드. 최신 무비자 정책, 비자 가이드, 교통 팁 및 목적지 심층 보고서를 제공합니다.",
    defaultKeywords: "중국 여행, 중국 무비자, 144시간 환승 무비자, 240시간 환승 비자, 중국 비자, 중국 도시, 중국 여행 가이드, 중국 입국 가이드"
  },
  ru: {
    suffix: "Путешествие в Китай - Ваш идеальный гид по Китаю",
    siteTitle: "Путешествие в Китай - Ваш идеальный гид по Китаю | tripcngo.com",
    defaultDescription: "Ваш идеальный гид по путешествиям в Китай. Последние правила безвизового въезда, визовые руководства, советы по транспорту и подробные отчеты о направлениях.",
    defaultKeywords: "путешествие в Китай, безвизовый Китай, 144 часа безвизовый транзит, 240 часов транзитная виза, виза в Китай, города Китая, гид по Китаю, въезд в Китай"
  },
  fr: {
    suffix: "Voyage en Chine - Votre guide de voyage ultime en Chine",
    siteTitle: "Voyage en Chine - Votre guide de voyage ultime en Chine | tripcngo.com",
    defaultDescription: "Votre guide ultime pour voyager en Chine. Dernières politiques d'exemption de visa, guides des visas, conseils de transport et rapports détaillés sur les destinations.",
    defaultKeywords: "voyage en Chine, Chine sans visa, exemption de visa de transit 144h, visa de transit 240h, visa Chine, villes chinoises, guide de voyage Chine, guide d'entrée Chine"
  },
  es: {
    suffix: "Viaja a China - Tu guía definitiva de viaje a China",
    siteTitle: "Viaja a China - Tu guía definitiva de viaje a China | tripcngo.com",
    defaultDescription: "Tu guía definitiva para viajar a China. Últimas políticas de exención de visa, guías de visas, consejos de transporte e informes detallados de destinos.",
    defaultKeywords: "viaje a China, China sin visa, exención de visa de tránsito 144h, visa de tránsito 240h, visa China, ciudades chinas, guía de viaje China, guía de entrada China"
  },
  de: {
    suffix: "Reise nach China - Ihr ultimativer China-Reiseführer",
    siteTitle: "Reise nach China - Ihr ultimativer China-Reiseführer | tripcngo.com",
    defaultDescription: "Ihr ultimativer Leitfaden für Reisen nach China. Neueste Richtlinien für den visumfreien Zugang, Visumleitfäden, Transporttipps und detaillierte Zielberichte.",
    defaultKeywords: "China Reise, China visumfrei, 144h visumfreier Transit, 240h Transitvisum, China Visum, chinesische Städte, China Reiseführer, China Einreiseleitfaden"
  },
  it: {
    suffix: "Viaggio in Cina - La tua guida turistica definitiva per la Cina",
    siteTitle: "Viaggio in Cina - La tua guida turistica definitiva per la Cina | tripcngo.com",
    defaultDescription: "La tua guida definitiva per viaggiare in Cina. Ultime politiche senza visto, guide ai visti, consigli sui trasporti e reportage approfonditi sulle destinazioni.",
    defaultKeywords: "viaggio in Cina, Cina senza visto, esenzione visto transito 144h, visto transito 240h, visto Cina, città cinesi, guida turistica Cina, guida ingresso Cina"
  }
};

files.forEach(file => {
  const lang = path.basename(file, '.json');
  const filePath = path.join(localesDir, file);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Add translations
    if (translations[lang]) {
      data['seo.suffix'] = translations[lang].suffix;
      data['seo.siteTitle'] = translations[lang].siteTitle;
      data['seo.defaultDescription'] = translations[lang].defaultDescription;
      data['seo.defaultKeywords'] = translations[lang].defaultKeywords;
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
      console.log(`Updated ${file}`);
    }
  } catch (err) {
    console.error(`Error processing ${file}:`, err);
  }
});
