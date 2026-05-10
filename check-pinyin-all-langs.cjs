const fs = require('fs');
const langs = ['cn', 'tw', 'en', 'ja', 'ko', 'ru', 'fr', 'es', 'de', 'it'];

const keys = [
  'tools.pinyin.guide.featuresTitle',
  'tools.pinyin.guide.featurePinyin',
  'tools.pinyin.guide.featurePinyinDesc',
  'tools.pinyin.guide.featureSegment',
  'tools.pinyin.guide.featureSegmentDesc',
  'tools.pinyin.guide.featureStroke',
  'tools.pinyin.guide.featureStrokeDesc',
  'tools.pinyin.guide.featureTranslate',
  'tools.pinyin.guide.featureTranslateDesc',
  'tools.pinyin.guide.featureVoice',
  'tools.pinyin.guide.featureVoiceDesc',
  'tools.pinyin.guide.guideTitle',
  'tools.pinyin.guide.whatIsPinyin',
  'tools.pinyin.guide.whatIsPinyinDesc',
  'tools.pinyin.guide.toneMarks',
  'tools.pinyin.guide.howToUse',
  'tools.pinyin.guide.segmentation',
  'tools.pinyin.guide.strokeOrder',
  'tools.pinyin.guide.faqTitle',
  'tools.pinyin.guide.faq1Q',
  'tools.pinyin.guide.faq2Q',
  'tools.pinyin.guide.faq3Q',
  'tools.pinyin.guide.faq4Q',
  'tools.pinyin.guide.faq5Q',
];

function getNestedValue(obj, keyPath) {
  const parts = keyPath.split('.');
  let current = obj;
  for (const part of parts) {
    if (typeof current === 'object' && current !== null && part in current) {
      current = current[part];
    } else {
      return null;
    }
  }
  return typeof current === 'string' ? current : null;
}

for (const lang of langs) {
  try {
    let raw = fs.readFileSync('messages/' + lang + '.json', 'utf-8');
    if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
    const data = JSON.parse(raw);
    let missing = [];
    for (const key of keys) {
      if (!getNestedValue(data, key)) missing.push(key);
    }
    if (missing.length === 0) {
      console.log(`✅ ${lang}: All ${keys.length} keys present`);
    } else {
      console.log(`❌ ${lang}: ${missing.length} missing keys:`);
      missing.forEach(k => console.log(`   - ${k}`));
    }
  } catch (e) {
    console.log(`💥 ${lang}: ${e.message}`);
  }
}
