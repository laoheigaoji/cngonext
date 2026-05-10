// Simulate exactly what server-i18n.ts does
const fs = require('fs');
const path = require('path');

const langToFile = {
  cn: 'cn.json',
  tw: 'tw.json',
  en: 'en.json',
  ja: 'ja.json',
  ko: 'ko.json',
  ru: 'ru.json',
  fr: 'fr.json',
  es: 'es.json',
  de: 'de.json',
  it: 'it.json',
};

function loadTranslations(lang) {
  const file = langToFile[lang] || 'en.json';
  const filePath = path.join(process.cwd(), 'messages', file);
  try {
    let raw = fs.readFileSync(filePath, 'utf-8');
    if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  } catch {
    return {};
  }
}

function getNestedValue(obj, keyPath) {
  const parts = keyPath.split('.');
  let current = obj;
  for (const part of parts) {
    if (typeof current === 'object' && current !== null && part in current) {
      current = current[part];
    } else {
      return keyPath; // fallback to key itself!
    }
  }
  return typeof current === 'string' ? current : keyPath;
}

// Test ALL keys used in SSR components across ALL languages
const ssrKeysByPage = {
  'Home page': [
    'hero.ultimate', 'hero.desc', 'hero.dest', 'hero.aiName', 'hero.searchPlaceholder', 'hero.start',
    'visa.section.title', 'visa.section.desc',
    'visa.stat.countries.title', 'visa.stat.countries.desc',
    'visa.stat.stay.title', 'visa.stat.stay.desc',
    'visa.stat.provinces.title', 'visa.stat.provinces.desc',
    'visa.stat.ports.title', 'visa.stat.ports.desc',
  ],
  'Articles page': [
    'guide.hero.title', 'guide.hero.desc',
  ],
  'Pinyin page': [
    'tools.pinyin.guide.heroTitle', 'tools.pinyin.guide.heroDesc',
  ],
  'Name generator page': [
    'tools.name.title', 'tools.name.subtitle',
  ],
  'Cities page': [
    'cities.hero.title', 'cities.hero.desc',
  ],
};

const langs = ['cn', 'tw', 'en', 'ja', 'ko', 'ru', 'fr', 'es', 'de', 'it'];

let totalIssues = 0;
for (const lang of langs) {
  const translations = loadTranslations(lang);
  let issues = [];
  
  for (const [page, keys] of Object.entries(ssrKeysByPage)) {
    for (const key of keys) {
      const value = getNestedValue(translations, key);
      if (value === key) { // fallback means missing
        issues.push(`${page}: ${key}`);
        totalIssues++;
      }
    }
  }
  
  if (issues.length > 0) {
    console.log(`\n❌ ${lang} - ${issues.length} missing keys:`);
    issues.forEach(i => console.log(`   ${i}`));
  } else {
    console.log(`✅ ${lang} - All SSR keys found`);
  }
}

console.log(`\n=== Total issues: ${totalIssues} ===`);
