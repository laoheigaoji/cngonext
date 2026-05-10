const fs = require('fs');
let raw = fs.readFileSync('messages/cn.json', 'utf-8');
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
const data = JSON.parse(raw);

// Check the keys used by each SSR page
const keys = [
  // Home page keys
  'hero.ultimate', 'hero.desc', 'hero.dest', 'hero.aiName', 'hero.searchPlaceholder', 'hero.start',
  'visa.section.title', 'visa.section.desc',
  'visa.stat.countries.title', 'visa.stat.countries.desc',
  'visa.stat.stay.title', 'visa.stat.stay.desc',
  'visa.stat.provinces.title', 'visa.stat.provinces.desc',
  'visa.stat.ports.title', 'visa.stat.ports.desc',
  // Articles page keys
  'guide.hero.title', 'guide.hero.desc',
  // Pinyin page keys
  'tools.pinyin.guide.heroTitle', 'tools.pinyin.guide.heroDesc',
  // Name generator keys
  'tools.name.title', 'tools.name.subtitle',
];

for (const key of keys) {
  const parts = key.split('.');
  let current = data;
  let found = true;
  for (const part of parts) {
    if (typeof current === 'object' && current !== null && part in current) {
      current = current[part];
    } else {
      found = false;
      break;
    }
  }
  if (found && typeof current === 'string') {
    console.log(`✅ ${key}: "${current.substring(0, 60)}"`);
  } else {
    console.log(`❌ ${key}: NOT FOUND`);
  }
}
