import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

// 完整的语言映射
const languageMap: Record<string, { hreflang: string; label: string; path: string }> = {
  zh: { hreflang: 'zh-CN', label: '简体中文', path: '/cn' },
  tw: { hreflang: 'zh-TW', label: '繁體中文', path: '/tw' },
  en: { hreflang: 'en', label: 'English', path: '/en' },
  ja: { hreflang: 'ja', label: '日本語', path: '/ja' },
  ko: { hreflang: 'ko', label: '한국어', path: '/ko' },
  ru: { hreflang: 'ru', label: 'Русский', path: '/ru' },
  fr: { hreflang: 'fr', label: 'Français', path: '/fr' },
  es: { hreflang: 'es', label: 'Español', path: '/es' },
  de: { hreflang: 'de', label: 'Deutsch', path: '/de' },
  it: { hreflang: 'it', label: 'Italiano', path: '/it' },
};

const BASE_URL = 'https://tripcngo.com';

interface SEOProps {
  title?: string;
  titleZh?: string;
  description?: string;
  descriptionZh?: string;
  keywords?: string;
  keywordsZh?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  schemaData?: object;
  isHome?: boolean;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  titleZh,
  description, 
  descriptionZh,
  keywords, 
  keywordsZh,
  image = 'https://tripcngo.com/og-image.jpg',
  url = 'https://tripcngo.com', 
  type = 'website',
  schemaData,
  isHome = false
}) => {
  const { language, t } = useLanguage();
  
  const currentTitle = language === 'zh' ? (titleZh || title) : title;
  const suffix = t('seo.suffix', language === 'zh' ? '旅行中国出发 - 您的终极中国旅游指南' : 'Travel China Go - Your Ultimate China Travel Guide');
  
  const currentDescription = language === 'zh' ? (descriptionZh || description) : description;
  const metaDescription = currentDescription || t('seo.defaultDescription', language === 'zh' ? '您的中国旅行终极指南。提供最新的免签政策、签证指引、交通攻略和目的地深度报告。' : 'Your ultimate guide to traveling in China. Latest visa-free policies, visa guides, transportation tips, and destination reports.');
  
  const currentKeywords = language === 'zh' ? (keywordsZh || keywords) : keywords;
  const metaKeywords = currentKeywords || t('seo.defaultKeywords', language === 'zh' ? '中国旅游, 免签中国, 144小时过境免签, 240小时过境免签, 中国签证, 中国城市, 中国旅行攻略, 中国入境指南' : 'China travel, visa free China, 144h transit visa free, 240h transit visa, China visa, China cities, China travel guide, China entry guide');
  
  const fullTitle = currentTitle ? `${currentTitle} | tripcngo.com | ${suffix}` : `tripcngo.com | ${suffix}`;
  
  const hreflangTags = Object.entries(languageMap).map(([lang, config]) => {
    const currentPath = url.replace(BASE_URL, '');
    const langPath = languageMap[language].path;
    const relativePart = currentPath.startsWith(langPath) ? currentPath.substring(langPath.length) : currentPath;
    return {
      lang: config.hreflang,
      href: `${BASE_URL}${config.path}${relativePart}`
    };
  });
  
  const ogLocale = languageMap[language]?.hreflang || 'zh-CN';
  const ogLocales = hreflangTags.map(t => t.lang).filter(l => l !== ogLocale);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.title = fullTitle;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const setLink = (rel: string, href: string, hrefLang?: string) => {
      const selector = hrefLang
        ? `link[rel="${rel}"][hreflang="${hrefLang}"]`
        : `link[rel="${rel}"][href="${href}"]`;
      let el = document.querySelector(selector) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        if (hrefLang) el.setAttribute('hreflang', hrefLang);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    setMeta('description', metaDescription);
    setMeta('keywords', metaKeywords);
    setLink('canonical', url);

    setMeta('og:type', type, true);
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', metaDescription, true);
    setMeta('og:image', image, true);
    setMeta('og:url', url, true);
    setMeta('og:site_name', 'tripcngo', true);
    setMeta('og:locale', ogLocale, true);
    ogLocales.forEach(loc => setMeta('og:locale:alternate', loc, true));

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', metaDescription);
    setMeta('twitter:image', image);

    // Remove old hreflang tags and re-add
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
    hreflangTags.forEach(({ lang, href }) => setLink('alternate', href, lang));
    setLink('alternate', `${BASE_URL}/en`, 'x-default');

    // JSON-LD
    const schemaId = 'seo-schema';
    let scriptEl = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.type = 'application/ld+json';
      scriptEl.id = schemaId;
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schemaData || {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "tripcngo",
      "url": "https://tripcngo.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://tripcngo.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    });
  }, [fullTitle, metaDescription, metaKeywords, url, type, image, ogLocale, JSON.stringify(ogLocales), JSON.stringify(hreflangTags), schemaData]);

  return null;
};

export default SEO;
