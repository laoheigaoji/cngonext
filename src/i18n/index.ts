import type { Language } from '../context/LanguageContext';

const translationLoaders: Record<Language, () => Promise<Record<string, string>>> = {
  zh: () => import('./zh').then(m => m.default),
  en: () => import('./en').then(m => m.default),
  ja: () => import('./ja').then(m => m.default),
  ko: () => import('./ko').then(m => m.default),
  fr: () => import('./fr').then(m => m.default),
  es: () => import('./es').then(m => m.default),
  de: () => import('./de').then(m => m.default),
  tw: () => import('./tw').then(m => m.default),
  it: () => import('./it').then(m => m.default),
  ru: () => import('./ru').then(m => m.default),
};

export async function loadTranslations(lang: Language): Promise<Record<string, string>> {
  try {
    return await translationLoaders[lang]();
  } catch {
    if (lang !== 'en') {
      try { return await translationLoaders.en(); } catch { return {}; }
    }
    return {};
  }
}
