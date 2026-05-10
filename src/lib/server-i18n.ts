// Server-side translation helper for static SSR components
// Uses static imports so translations are bundled at build time
// This works on Cloudflare Workers (no fs access needed)

import cnTranslations from '../../messages/cn.json';
import twTranslations from '../../messages/tw.json';
import enTranslations from '../../messages/en.json';
import jaTranslations from '../../messages/ja.json';
import koTranslations from '../../messages/ko.json';
import ruTranslations from '../../messages/ru.json';
import frTranslations from '../../messages/fr.json';
import esTranslations from '../../messages/es.json';
import deTranslations from '../../messages/de.json';
import itTranslations from '../../messages/it.json';

type NestedRecord = { [key: string]: string | NestedRecord };

const translationMap: Record<string, NestedRecord> = {
  cn: cnTranslations,
  tw: twTranslations,
  en: enTranslations,
  ja: jaTranslations,
  ko: koTranslations,
  ru: ruTranslations,
  fr: frTranslations,
  es: esTranslations,
  de: deTranslations,
  it: itTranslations,
};

// Get a nested value like "visa.stat.countries.title" from { visa: { stat: { countries: { title: "54国" } } } }
function getNestedValue(obj: NestedRecord, keyPath: string): string {
  const parts = keyPath.split('.');
  let current: string | NestedRecord = obj;
  for (const part of parts) {
    if (typeof current === 'object' && current !== null && part in current) {
      current = (current as NestedRecord)[part];
    } else {
      return keyPath; // fallback to key itself
    }
  }
  return typeof current === 'string' ? current : keyPath;
}

export function getServerTranslation(lang: string, key: string): string {
  const translations = translationMap[lang] || translationMap['en'] || {};
  return getNestedValue(translations, key);
}

// Batch get multiple translations
export function getServerTranslations(lang: string, keys: string[]): Record<string, string> {
  const translations = translationMap[lang] || translationMap['en'] || {};
  const result: Record<string, string> = {};
  for (const key of keys) {
    result[key] = getNestedValue(translations, key);
  }
  return result;
}
