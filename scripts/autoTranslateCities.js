/**
 * 城市多语言自动翻译脚本 v2
 * 功能：自动翻译已创建城市的所有缺失字段
 * 数据库结构：JSONB数组内的对象使用 enName, jaName 等内嵌属性存储翻译
 */

import { createClient } from '@supabase/supabase-js';

// ========== 配置区域 ==========
const SUPABASE_URL = 'https://cxegaqhwexiidezycbyg.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZWdhcWh3ZXhpaWRlenljYnlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk0MjIyNSwiZXhwIjoyMDkzNTE4MjI1fQ.e-OEm6Gtyp8Dp0_dOorW1FSXYjEpvEdDTt6NjPQQ1W8';
const DEEPSEEK_API_KEY = 'sk-d2b755410b11417490aa2f90ec678ce6';

// 支持的语言
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'ru', label: 'Русский' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
  { code: 'tw', label: '繁體中文' },
  { code: 'it', label: 'Italiano' },
];

// 获取语言后缀
function getLangSuffix(langCode) {
  const suffixMap = { en: 'En', ja: 'Ja', ko: 'Ko', ru: 'Ru', fr: 'Fr', es: 'Es', de: 'De', tw: 'Tw', it: 'It' };
  return suffixMap[langCode] || langCode.charAt(0).toUpperCase() + langCode.slice(1);
}

// DeepSeek API 调用
async function translateText(text, targetLang) {
  if (!text || !text.trim()) return text;
  
  const langName = LANGUAGES.find(l => l.code === targetLang)?.label || targetLang;
  
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{
          role: 'user',
          content: `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${text}`
        }],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });
    
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error(`翻译失败: ${error.message}`);
    return null;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 检查数组项是否需要翻译
function checkItemNeedsTranslation(item, translatableFields, langCode) {
  const suffix = getLangSuffix(langCode);
  const needsTrans = [];
  
  for (const field of translatableFields) {
    const langField = field + suffix;
    if (!item[langField] && item[field]) {
      needsTrans.push({ field, langField });
    }
  }
  
  return needsTrans;
}

// 处理顶层简单字段
function needsTopLevelTranslation(data, fieldPath, langCode) {
  const suffix = getLangSuffix(langCode);
  const parts = fieldPath.split('.');
  let obj = data;
  
  for (let i = 0; i < parts.length - 1; i++) {
    obj = obj?.[parts[i]];
    if (!obj) return false;
  }
  
  const lastKey = parts[parts.length - 1];
  const langField = lastKey + suffix;
  
  // 如果是数组
  if (Array.isArray(obj[lastKey])) {
    const langArray = obj[lastKey + suffix];
    return !langArray || langArray.length < obj[lastKey].length;
  }
  
  // 如果是对象内的字段
  if (typeof obj[lastKey] === 'string') {
    return !obj[langField];
  }
  
  return false;
}

// 翻译简单顶层字段
async function translateTopLevelField(data, fieldPath, langCode) {
  const suffix = getLangSuffix(langCode);
  const parts = fieldPath.split('.');
  let obj = data;
  
  for (let i = 0; i < parts.length - 1; i++) {
    obj = obj[parts[i]];
  }
  
  const lastKey = parts[parts.length - 1];
  const langField = lastKey + suffix;
  
  // 如果是数组
  if (Array.isArray(obj[lastKey])) {
    let langArray = obj[lastKey + suffix] || [];
    
    for (let i = 0; i < obj[lastKey].length; i++) {
      if (!langArray[i]) {
        const translated = await translateText(obj[lastKey][i], langCode);
        if (translated) {
          langArray[i] = translated;
        }
      }
    }
    
    obj[lastKey + suffix] = langArray;
    return langArray.filter(Boolean).length;
  }
  
  // 如果是字符串
  if (typeof obj[lastKey] === 'string' && !obj[langField]) {
    const translated = await translateText(obj[lastKey], langCode);
    if (translated) {
      obj[langField] = translated;
      return 1;
    }
  }
  
  return 0;
}

// 翻译 JSONB 数组字段
async function translateJsonArrayField(data, fieldPath, itemFields, langCode) {
  const suffix = getLangSuffix(langCode);
  const items = data[fieldPath];
  
  if (!Array.isArray(items)) return 0;
  
  let translatedCount = 0;
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    for (const field of itemFields) {
      const langField = field + suffix;
      
      // 不覆盖已存在的翻译
      if (!item[langField] && item[field]) {
        const translated = await translateText(item[field], langCode);
        if (translated) {
          item[langField] = translated;
          translatedCount++;
        }
      }
    }
  }
  
  return translatedCount;
}

// ========== 主逻辑 ==========

async function processCity(supabase, city) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`处理城市: ${city.name} (ID: ${city.id})`);
  console.log('='.repeat(60));
  
  const cityData = { ...city };
  let hasChanges = false;
  let totalTranslated = 0;
  
  // 定义需要翻译的顶层字段
  const topLevelFields = [
    { path: 'enName', isArray: false },
    { path: 'info.area', isArray: false },
    { path: 'info.population', isArray: false },
    { path: 'bestTravelTime.strongText', isArray: false },
    { path: 'bestTravelTime.paragraphs', isArray: true },
    { path: 'paragraphs', isArray: true },
  ];
  
  // 定义 JSONB 数组字段及其可翻译属性
  const jsonArrayFields = [
    { path: 'tags', itemFields: ['text', 'color'] },
    { path: 'attractions', itemFields: ['name', 'desc', 'price', 'season', 'time'] },
    { path: 'history', itemFields: ['year', 'title', 'desc'] },
    { path: 'worldHeritage', itemFields: ['name', 'year', 'desc'] },
    { path: 'intangibleHeritage', itemFields: ['name', 'year', 'desc'] },
    { path: 'transportation', itemFields: ['title', 'desc', 'price'] },
    { path: 'food', itemFields: ['name', 'desc', 'price', 'ingredients'] },
  ];
  
  for (const lang of LANGUAGES) {
    console.log(`\n>>> 翻译语言: ${lang.label} (${lang.code})`);
    
    // 处理顶层字段
    for (const field of topLevelFields) {
      const value = field.path.split('.').reduce((obj, key) => obj?.[key], cityData);
      if (!value || (Array.isArray(value) && value.length === 0)) continue;
      
      const translated = await translateTopLevelField(cityData, field.path, lang.code);
      if (translated > 0) {
        console.log(`  ✓ 翻译 ${field.path}: ${translated} 项`);
        totalTranslated += translated;
        hasChanges = true;
        await delay(300);
      } else {
        console.log(`  - ${field.path} 无需翻译`);
      }
    }
    
    // 处理 JSONB 数组字段
    for (const field of jsonArrayFields) {
      const items = cityData[field.path];
      if (!Array.isArray(items) || items.length === 0) continue;
      
      const translated = await translateJsonArrayField(cityData, field.path, field.itemFields, lang.code);
      if (translated > 0) {
        console.log(`  ✓ 翻译 ${field.path}: ${translated} 个字段`);
        totalTranslated += translated;
        hasChanges = true;
        await delay(300);
      } else {
        console.log(`  - ${field.path} 无需翻译`);
      }
    }
  }
  
  // 保存更新
  if (hasChanges) {
    console.log(`\n💾 保存城市: ${cityData.name}`);
    
    const { error } = await supabase
      .from('cities')
      .update(cityData)
      .eq('id', city.id);
    
    if (error) {
      console.error(`❌ 保存失败: ${error.message}`);
      return { success: false, totalTranslated: 0 };
    }
    console.log(`✅ 保存成功！共翻译 ${totalTranslated} 个字段`);
  } else {
    console.log(`\n✓ 城市 ${cityData.name} 所有字段已翻译完成`);
  }
  
  return { success: true, totalTranslated };
}

async function main() {
  console.log('🚀 城市多语言自动翻译脚本 v2 启动');
  console.log(`📅 时间: ${new Date().toLocaleString('zh-CN')}`);
  console.log(`🌐 将翻译 ${LANGUAGES.length} 种语言`);
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  // 获取所有城市
  console.log('\n📡 获取城市列表...');
  const { data: cities, error } = await supabase
    .from('cities')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('❌ 获取城市列表失败:', error.message);
    process.exit(1);
  }
  
  console.log(`📊 共找到 ${cities.length} 个城市\n`);
  
  let totalCities = 0;
  let totalTranslated = 0;
  
  for (const city of cities) {
    totalCities++;
    const result = await processCity(supabase, city);
    totalTranslated += result.totalTranslated;
    await delay(500);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 翻译完成报告');
  console.log('='.repeat(60));
  console.log(`处理城市数: ${totalCities}`);
  console.log(`翻译字段数: ${totalTranslated}`);
  console.log(`完成时间: ${new Date().toLocaleString('zh-CN')}`);
  console.log('='.repeat(60));
}

main().catch(console.error);
