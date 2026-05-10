const fs = require('fs');
const langs = ['en', 'ja', 'ko', 'ru', 'fr', 'es', 'de', 'it', 'tw'];
for (const lang of langs) {
  try {
    let raw = fs.readFileSync('messages/' + lang + '.json', 'utf-8');
    if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
    const data = JSON.parse(raw);
    const heroTitle = data.hero ? (data.hero.ultimate || 'MISSING') : 'MISSING';
    const guideTitle = data.guide ? (data.guide.hero ? (data.guide.hero.title || 'MISSING') : 'MISSING') : 'MISSING';
    const pinyinTitle = data.tools ? (data.tools.pinyin ? (data.tools.pinyin.guide ? (data.tools.pinyin.guide.heroTitle || 'MISSING') : 'MISSING') : 'MISSING') : 'MISSING';
    console.log(`${lang}: ${Object.keys(data).length} root keys, hero.ultimate="${String(heroTitle).substring(0, 30)}", guide.hero.title="${String(guideTitle).substring(0, 20)}", tools.pinyin.guide.heroTitle="${String(pinyinTitle).substring(0, 20)}"`);
  } catch (e) {
    console.log(`${lang}: ERROR - ${e.message}`);
  }
}
