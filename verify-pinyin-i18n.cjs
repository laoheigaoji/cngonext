const fs = require('fs');

function getNestedValue(obj, keyPath) {
  const parts = keyPath.split('.');
  let current = obj;
  for (const part of parts) {
    if (typeof current === 'object' && current !== null && part in current) {
      current = current[part];
    } else {
      return keyPath;
    }
  }
  return typeof current === 'string' ? current : keyPath;
}

const langs = ['cn', 'en', 'ja', 'ko', 'ru', 'fr', 'es', 'de', 'tw', 'it'];
const keys = [
  'tools.pinyin.guide.heroTitle',
  'tools.pinyin.guide.featuresTitle',
  'tools.pinyin.guide.faq5Q',
  'tools.pinyin.button',
  'tools.pinyin.guide.featurePinyin',
  'tools.pinyin.guide.faq5A',
];

for (const lang of langs) {
  let raw = fs.readFileSync('messages/' + lang + '.json', 'utf-8');
  if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
  const data = JSON.parse(raw);
  console.log(lang + ':');
  for (const key of keys) {
    const val = getNestedValue(data, key);
    const ok = val !== key;
    console.log('  ' + (ok ? '✓' : '✗') + ' ' + key + ' = ' + (ok ? val.substring(0, 50) : 'MISSING'));
  }
}
