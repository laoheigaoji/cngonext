const fs = require('fs');
let raw = fs.readFileSync('messages/cn.json', 'utf-8');
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
const data = JSON.parse(raw);

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

let missing = 0;
let found = 0;
for (const key of keys) {
  const val = getNestedValue(data, key);
  if (val) {
    found++;
    console.log(`✅ ${key}: "${val.substring(0, 40)}"`);
  } else {
    missing++;
    console.log(`❌ ${key}: NOT FOUND in messages/cn.json`);
  }
}
console.log(`\n${found} found, ${missing} missing`);

// Check what's actually under tools.pinyin in the JSON
console.log('\n--- tools.pinyin structure in cn.json ---');
if (data.tools && data.tools.pinyin) {
  console.log(JSON.stringify(data.tools.pinyin, null, 2).substring(0, 500));
} else {
  console.log('tools.pinyin NOT FOUND');
}
