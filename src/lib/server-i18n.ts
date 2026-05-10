// Server-side translation helper for static SSR components
// Reads from messages/xx.json files to avoid client-side JS dependency

import fs from 'fs';
import path from 'path';

type NestedRecord = { [key: string]: string | NestedRecord };

const langToFile: Record<string, string> = {
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

// Cache translations in memory
const translationCache: Record<string, NestedRecord> = {};

function loadTranslations(lang: string): NestedRecord {
  const file = langToFile[lang] || 'en.json';
  if (translationCache[file]) return translationCache[file];

  const filePath = path.join(process.cwd(), 'messages', file);
  try {
    let raw = fs.readFileSync(filePath, 'utf-8');
    // Strip BOM if present (many JSON files are saved with UTF-8 BOM)
    if (raw.charCodeAt(0) === 0xFEFF) {
      raw = raw.slice(1);
    }
    try {
      const data = JSON.parse(raw);
      translationCache[file] = data;
      return data;
    } catch {
      // JSON parse failed - likely due to unescaped double quotes used as Chinese quotation marks
      // Fix by replacing "CJK_text" patterns inside JSON string values
      const fixed = fixUnescapedQuotes(raw);
      try {
        const data = JSON.parse(fixed);
        translationCache[file] = data;
        return data;
      } catch {
        return {};
      }
    }
  } catch {
    return {};
  }
}

// Fix unescaped ASCII double quotes used as Chinese emphasis marks in JSON values
// Replaces patterns like "text" (inside JSON string values) with \u201ctext\u201d
function fixUnescapedQuotes(raw: string): string {
  const lines = raw.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match JSON value lines: "key": "value",
    const match = line.match(/^(\s*"[^"]*":\s*")(.*)(",?\s*)$/);
    if (!match) continue;
    
    const prefix = match[1];
    let value = match[2];
    const suffix = match[3];
    
    // Replace unescaped " used as Chinese quotes within the value
    // Pattern: " followed by short CJK/alpha content then another "
    // These appear as: 如"图书馆" etc.
    let fixed = value;
    // Replace paired "CJK_text" patterns
    fixed = fixed.replace(/"([\u4e00-\u9fffA-Za-z0-9\u3000-\u303f\uff00-\uffef\u00c0-\u024f\u0100-\u017f\u1e00-\u1eff\u0400-\u04ff\u0500-\u052f\u2190-\u21ff\u2200-\u22ff\u25a0-\u25ff\u2600-\u26ff\u2700-\u27bf\u00b0-\u00bf\u2018\u2019\u201c\u201d\s\-\+\(\)\[\]]{1,30}?)"(?=[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef\uff0c\u3002\u3001\uff1b\uff1a\uff01\uff1f\u201d\s，。、；：！？\)\]])/g,
      (_, content) => '\u201c' + content + '\u201d'
    );
    // Also handle remaining unescaped " preceded by CJK (closing quotes)
    fixed = fixed.replace(/([\u4e00-\u9fff\u201c])"/g, '$1\u201d');
    // And " followed by CJK (opening quotes)  
    fixed = fixed.replace(/"([\u4e00-\u9fff])/g, '\u201c$1');
    
    if (fixed !== value) {
      lines[i] = prefix + fixed + suffix;
    }
  }
  return lines.join('\n');
}

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
  const translations = loadTranslations(lang);
  return getNestedValue(translations, key);
}

// Batch get multiple translations
export function getServerTranslations(lang: string, keys: string[]): Record<string, string> {
  const translations = loadTranslations(lang);
  const result: Record<string, string> = {};
  for (const key of keys) {
    result[key] = getNestedValue(translations, key);
  }
  return result;
}
