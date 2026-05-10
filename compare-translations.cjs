const fs = require('fs');

// Read cn.json
let raw = fs.readFileSync('messages/cn.json', 'utf-8');
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
const jsonData = JSON.parse(raw);

// Simulate getNestedValue
function getNestedValue(obj, keyPath) {
  const parts = keyPath.split('.');
  let current = obj;
  for (const part of parts) {
    if (typeof current === 'object' && current !== null && part in current) {
      current = current[part];
    } else {
      return keyPath; // fallback - this is what server-i18n does!
    }
  }
  return typeof current === 'string' ? current : keyPath;
}

// Test the exact keys used in page.tsx
const testKeys = [
  'tools.pinyin.guide.heroTitle',
  'tools.pinyin.guide.heroDesc',
  'tools.pinyin.guide.featuresTitle',
  'tools.pinyin.guide.featurePinyin',
  'guide.hero.title',
  'guide.hero.desc',
  'hero.ultimate',
  'hero.desc',
  // Test what happens with wrong lang
];

console.log('=== Testing getNestedValue with cn.json ===');
for (const key of testKeys) {
  const result = getNestedValue(jsonData, key);
  const isFallback = result === key;
  console.log(`${isFallback ? '❌' : '✅'} ${key}: ${isFallback ? 'FALLBACK (key returned as-is)' : '"' + result.substring(0, 50) + '"'}`);
}

// Now test what happens if lang is 'zh' (not 'cn')
console.log('\n=== What happens if lang=zh? ===');
const zhFile = { zh: 'zh.json' }; // no mapping exists!
const file = zhFile['zh']; // 'zh.json'
console.log('zh maps to file:', file);
try {
  const zhRaw = fs.readFileSync('messages/zh.json', 'utf-8');
  console.log('zh.json exists! Size:', zhRaw.length);
} catch (e) {
  console.log('zh.json does NOT exist:', e.message);
  console.log('So loadTranslations("zh") would fallback to en.json');
}

// Check: does cn.json have a different structure than what LanguageContext expects?
console.log('\n=== cn.json top-level keys ===');
console.log(Object.keys(jsonData));

console.log('\n=== tools.pinyin in cn.json ===');
console.log(JSON.stringify(jsonData.tools?.pinyin, null, 2)?.substring(0, 300));
