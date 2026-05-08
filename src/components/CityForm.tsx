import React, { useState, useRef } from 'react';
import { CityData } from '../types/city';
import { X, Loader2, Sparkles, Save, ChevronDown, ChevronUp, Image as ImageIcon, Languages } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generateCityData, askDeepSeek } from '../lib/deepseek';

// 支持的语言配置
const SUPPORTED_LANGUAGES = [
  { code: 'zh', label: '中文', nativeLabel: '中文内容' },
  { code: 'en', label: 'English', nativeLabel: 'English Content' },
  { code: 'ja', label: '日本語', nativeLabel: '日本語コンテンツ' },
  { code: 'ko', label: '한국어', nativeLabel: '한국어 콘텐츠' },
  { code: 'ru', label: 'Русский', nativeLabel: 'Русский контент' },
  { code: 'fr', label: 'Français', nativeLabel: 'Contenu français' },
  { code: 'es', label: 'Español', nativeLabel: 'Contenido español' },
  { code: 'de', label: 'Deutsch', nativeLabel: 'Deutsch Inhalt' },
  { code: 'tw', label: '繁體中文', nativeLabel: '繁體中文內容' },
  { code: 'it', label: 'Italiano', nativeLabel: 'Contenuto italiano' },
] as const;

type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

interface CityFormProps {
  city?: CityData | null;
  onClose: () => void;
  onSave: (city: CityData) => void;
}

export default function CityForm({ city, onClose, onSave }: CityFormProps) {
  const [formData, setFormData] = useState<CityData>(() => {
    const defaults = {
      id: '',
      name: '',
      enName: '',
      heroImage: '',
      listCover: '',
      tags: [],
      paragraphs: [],
      enParagraphs: [],
      stats: { wantToVisit: 0, recommended: 0 },
      info: { area: '', population: '' },
      bestTravelTime: { strongText: '', enStrongText: '', paragraphs: [], enParagraphs: [] },
      history: [],
      attractions: [],
      transportation: [],
      food: []
    };
    if (!city) return defaults;
    return {
      ...defaults,
      ...city,
      stats: { ...defaults.stats, ...(city.stats || {}) },
      info: { ...defaults.info, ...(city.info || {}) },
      bestTravelTime: { ...defaults.bestTravelTime, ...(city.bestTravelTime || {}) },
      tags: city.tags || [],
      paragraphs: city.paragraphs || [],
      enParagraphs: city.enParagraphs || [],
      history: city.history || [],
      attractions: city.attractions || [],
      transportation: city.transportation || [],
      food: city.food || [],
    };
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateProgress, setTranslateProgress] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [activeLangTab, setActiveLangTab] = useState<LanguageCode>('zh');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const listCoverInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file: File, folder: string) => {
    setUploading(true);
    try {
      const path = `${folder}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('images').upload(path, file);
      if (error) throw error;
      return supabase.storage.from('images').getPublicUrl(path).data.publicUrl;
    } catch (err) {
      console.error(err);
      alert('上传失败');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await handleFileUpload(file, 'city_covers');
    if (url) updateFormData('heroImage', url);
  };

  const handleListCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await handleFileUpload(file, 'city_list_covers');
    if (url) updateFormData('listCover', url);
  };

  const proxyImageToStorage = async (url: string, path: string) => {
    if (!url || !url.startsWith('http')) return url;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const { error } = await supabase.storage.from('images').upload(path, blob, { upsert: true });
      if (error) throw error;
      return supabase.storage.from('images').getPublicUrl(path).data.publicUrl;
    } catch (e) {
      console.warn("Failed to proxy image via direct fetch:", url, e);
      try {
        const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(url)}`;
        const res = await fetch(proxyUrl);
        const blob = await res.blob();
        const { error } = await supabase.storage.from('images').upload(path, blob, { upsert: true });
        if (error) throw error;
        return supabase.storage.from('images').getPublicUrl(path).data.publicUrl;
      } catch (e2) {
        return url; 
      }
    }
  };

  // 获取指定语言的字段名
  const getLangField = (baseField: string, langCode: string) => {
    if (langCode === 'zh') return baseField;
    return `${baseField}${langCode.charAt(0).toUpperCase() + langCode.slice(1)}`;
  };

  // 自动翻译全部语言
  const handleAutoTranslate = async () => {
    if (!formData.name && !formData.paragraphs.length) {
      alert('请先填写中文城市名称或简介');
      return;
    }
    
    setIsTranslating(true);
    setTranslateProgress('准备翻译...');
    try {
      const targetLanguages = SUPPORTED_LANGUAGES.filter(lang => lang.code !== 'zh');
      const newData = { ...formData };
      
      // 计算总任务数
      let totalTasks = 0;
      let completedTasks = 0;
      
      // 统计总任务数
      for (const lang of targetLanguages) {
        const langCode = lang.code;
        if (formData.name) totalTasks++;
        if (formData.paragraphs.length > 0) totalTasks += formData.paragraphs.length;
        if (formData.bestTravelTime.strongText) totalTasks++;
        if (formData.bestTravelTime.paragraphs.length > 0) totalTasks += formData.bestTravelTime.paragraphs.length;
        // 新增：tags翻译任务
        if (formData.tags.length > 0) totalTasks += formData.tags.length;
        // 新增：城市信息翻译任务
        if (formData.info.area) totalTasks++;
        if (formData.info.population) totalTasks++;
        if (formData.attractions.length > 0) totalTasks += formData.attractions.length * 5; // name, desc, price, season, time
        if (formData.history.length > 0) totalTasks += formData.history.length * 2;
        // 新增：世界遗产翻译任务
        if (formData.worldHeritage && formData.worldHeritage.length > 0) totalTasks += formData.worldHeritage.length * 2;
        // 新增：非遗传承翻译任务
        if (formData.intangibleHeritage && formData.intangibleHeritage.length > 0) totalTasks += formData.intangibleHeritage.length * 2;
        // 新增：交通信息翻译任务
        if (formData.transportation.length > 0) totalTasks += formData.transportation.length * 3;
        if (formData.food.length > 0) totalTasks += formData.food.length * 2;
      }
      
      const updateProgress = (langName: string, taskName: string) => {
        completedTasks++;
        const percent = Math.round((completedTasks / totalTasks) * 100);
        setTranslateProgress(`翻译中 ${percent}% - ${langName} - ${taskName}`);
      };
      
      // 翻译基础信息
      for (const lang of targetLanguages) {
        const langCode = lang.code;
        const langName = lang.label;
        
        // 翻译城市名称
        if (formData.name && !newData[getLangField('enName', langCode) as keyof CityData]) {
          try {
            const nameKey = getLangField('enName', langCode);
            (newData as any)[nameKey] = await askDeepSeek(
              `Translate the following Chinese city name to ${langName}. Only output the translated text, no explanations:\n\n${formData.name}`
            );
            updateProgress(langName, '城市名称');
          } catch (e) {
            console.warn(`Failed to translate name to ${langCode}:`, e);
          }
        }
        
        // 翻译简介段落
        if (formData.paragraphs.length > 0) {
          try {
            const paragraphsKey = getLangField('paragraphs', langCode);
            const translatedParagraphs = [];
            for (const para of formData.paragraphs) {
              const translated = await askDeepSeek(
                `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${para}`
              );
              translatedParagraphs.push(translated);
              updateProgress(langName, '简介段落');
            }
            (newData as any)[paragraphsKey] = translatedParagraphs;
          } catch (e) {
            console.warn(`Failed to translate paragraphs to ${langCode}:`, e);
          }
        }
        
        // 翻译最佳旅行时间
        if (formData.bestTravelTime.strongText) {
          try {
            const fieldName = 'strongText' + langCode.charAt(0).toUpperCase() + langCode.slice(1);
            (newData.bestTravelTime as any)[fieldName] = await askDeepSeek(
              `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${formData.bestTravelTime.strongText}`
            );
            updateProgress(langName, '最佳旅行时间');
          } catch (e) {
            console.warn(`Failed to translate strongText to ${langCode}:`, e);
          }
        }
        
        if (formData.bestTravelTime.paragraphs.length > 0) {
          try {
            const fieldName = 'paragraphs' + langCode.charAt(0).toUpperCase() + langCode.slice(1);
            const translatedParagraphs = [];
            for (const para of formData.bestTravelTime.paragraphs) {
              const translated = await askDeepSeek(
                `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${para}`
              );
              translatedParagraphs.push(translated);
              updateProgress(langName, '旅行时间段落');
            }
            (newData.bestTravelTime as any)[fieldName] = translatedParagraphs;
          } catch (e) {
            console.warn(`Failed to translate bestTravelTime paragraphs to ${langCode}:`, e);
          }
        }
        
        // ========== 新增：翻译标签 ==========
        if (formData.tags.length > 0) {
          const newTags = [...newData.tags];
          for (let i = 0; i < formData.tags.length; i++) {
            const tag = formData.tags[i];
            if (tag.text) {
              try {
                const textKey = getLangField('text', langCode);
                (newTags[i] as any)[textKey] = await askDeepSeek(
                  `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${tag.text}`
                );
                updateProgress(langName, `标签 ${i + 1}/${formData.tags.length}`);
              } catch (e) {
                console.warn(`Failed to translate tag to ${langCode}:`, e);
              }
            }
          }
          newData.tags = newTags;
        }
        
        // ========== 新增：翻译城市信息 ==========
        if (formData.info.area) {
          try {
            const fieldName = 'area' + langCode.charAt(0).toUpperCase() + langCode.slice(1);
            (newData.info as any)[fieldName] = await askDeepSeek(
              `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${formData.info.area}`
            );
            updateProgress(langName, '城市面积');
          } catch (e) {
            console.warn(`Failed to translate area to ${langCode}:`, e);
          }
        }
        
        if (formData.info.population) {
          try {
            const fieldName = 'population' + langCode.charAt(0).toUpperCase() + langCode.slice(1);
            (newData.info as any)[fieldName] = await askDeepSeek(
              `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${formData.info.population}`
            );
            updateProgress(langName, '城市人口');
          } catch (e) {
            console.warn(`Failed to translate population to ${langCode}:`, e);
          }
        }
        
        // 翻译景点
        if (formData.attractions.length > 0) {
          const newAttractions = [...newData.attractions];
          for (let i = 0; i < formData.attractions.length; i++) {
            const attr = formData.attractions[i];
            
            if (attr.name) {
              try {
                const nameKey = getLangField('name', langCode);
                (newAttractions[i] as any)[nameKey] = await askDeepSeek(
                  `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${attr.name}`
                );
                updateProgress(langName, `景点名称 ${i + 1}/${formData.attractions.length}`);
              } catch (e) {
                console.warn(`Failed to translate attraction name to ${langCode}:`, e);
              }
            }
            
            if (attr.desc) {
              try {
                const descKey = getLangField('desc', langCode);
                (newAttractions[i] as any)[descKey] = await askDeepSeek(
                  `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${attr.desc}`
                );
                updateProgress(langName, `景点描述 ${i + 1}/${formData.attractions.length}`);
              } catch (e) {
                console.warn(`Failed to translate attraction desc to ${langCode}:`, e);
              }
            }
            
            if (attr.price) {
              try {
                const priceKey = getLangField('price', langCode);
                (newAttractions[i] as any)[priceKey] = await askDeepSeek(
                  `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${attr.price}`
                );
                updateProgress(langName, `景点票价 ${i + 1}/${formData.attractions.length}`);
              } catch (e) {
                console.warn(`Failed to translate attraction price to ${langCode}:`, e);
              }
            }
            
            if (attr.season) {
              try {
                const seasonKey = getLangField('season', langCode);
                (newAttractions[i] as any)[seasonKey] = await askDeepSeek(
                  `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${attr.season}`
                );
                updateProgress(langName, `最佳季节 ${i + 1}/${formData.attractions.length}`);
              } catch (e) {
                console.warn(`Failed to translate attraction season to ${langCode}:`, e);
              }
            }
            
            if (attr.time) {
              try {
                const timeKey = getLangField('time', langCode);
                (newAttractions[i] as any)[timeKey] = await askDeepSeek(
                  `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${attr.time}`
                );
                updateProgress(langName, `建议时长 ${i + 1}/${formData.attractions.length}`);
              } catch (e) {
                console.warn(`Failed to translate attraction time to ${langCode}:`, e);
              }
            }
          }
          newData.attractions = newAttractions;
        }
        
        // 翻译历史
        if (formData.history.length > 0) {
          const newHistory = [...newData.history];
          for (let i = 0; i < formData.history.length; i++) {
            const h = formData.history[i];
            
            if (h.year) {
              try {
                const yearKey = getLangField('year', langCode);
                (newHistory[i] as any)[yearKey] = h.year; // 年份通常保持不变
              } catch (e) {}
            }
            
            if (h.title) {
              try {
                const titleKey = getLangField('title', langCode);
                (newHistory[i] as any)[titleKey] = await askDeepSeek(
                  `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${h.title}`
                );
                updateProgress(langName, `历史标题 ${i + 1}/${formData.history.length}`);
              } catch (e) {}
            }
            
            if (h.desc) {
              try {
                const descKey = getLangField('desc', langCode);
                (newHistory[i] as any)[descKey] = await askDeepSeek(
                  `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${h.desc}`
                );
                updateProgress(langName, `历史描述 ${i + 1}/${formData.history.length}`);
              } catch (e) {}
            }
          }
          newData.history = newHistory;
        }
        
        // ========== 新增：翻译世界遗产 ==========
        if (formData.worldHeritage && formData.worldHeritage.length > 0) {
          const newHeritage = [...(newData.worldHeritage || [])];
          for (let i = 0; i < formData.worldHeritage.length; i++) {
            const wh = formData.worldHeritage[i];
            
            if (wh.name) {
              try {
                const nameKey = getLangField('name', langCode);
                (newHeritage[i] as any)[nameKey] = await askDeepSeek(
                  `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${wh.name}`
                );
                updateProgress(langName, `世界遗产名称 ${i + 1}/${formData.worldHeritage.length}`);
              } catch (e) {
                console.warn(`Failed to translate worldHeritage name to ${langCode}:`, e);
              }
            }
            
            if (wh.desc) {
              try {
                const descKey = getLangField('desc', langCode);
                (newHeritage[i] as any)[descKey] = await askDeepSeek(
                  `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${wh.desc}`
                );
                updateProgress(langName, `世界遗产描述 ${i + 1}/${formData.worldHeritage.length}`);
              } catch (e) {
                console.warn(`Failed to translate worldHeritage desc to ${langCode}:`, e);
              }
            }
          }
          newData.worldHeritage = newHeritage;
        }
        
        // ========== 新增：翻译非遗传承 ==========
        if (formData.intangibleHeritage && formData.intangibleHeritage.length > 0) {
          const newIntangible = [...(newData.intangibleHeritage || [])];
          for (let i = 0; i < formData.intangibleHeritage.length; i++) {
            const ih = formData.intangibleHeritage[i];
            
            if (ih.name) {
              try {
                const nameKey = getLangField('name', langCode);
                (newIntangible[i] as any)[nameKey] = await askDeepSeek(
                  `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${ih.name}`
                );
                updateProgress(langName, `非遗名称 ${i + 1}/${formData.intangibleHeritage.length}`);
              } catch (e) {
                console.warn(`Failed to translate intangibleHeritage name to ${langCode}:`, e);
              }
            }
            
            if (ih.desc) {
              try {
                const descKey = getLangField('desc', langCode);
                (newIntangible[i] as any)[descKey] = await askDeepSeek(
                  `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${ih.desc}`
                );
                updateProgress(langName, `非遗描述 ${i + 1}/${formData.intangibleHeritage.length}`);
              } catch (e) {
                console.warn(`Failed to translate intangibleHeritage desc to ${langCode}:`, e);
              }
            }
          }
          newData.intangibleHeritage = newIntangible;
        }
        
        // ========== 新增：翻译交通信息 ==========
        if (formData.transportation.length > 0) {
          const newTransport = [...newData.transportation];
          for (let i = 0; i < formData.transportation.length; i++) {
            const t = formData.transportation[i];
            
            if (t.title) {
              try {
                const titleKey = getLangField('title', langCode);
                (newTransport[i] as any)[titleKey] = await askDeepSeek(
                  `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${t.title}`
                );
                updateProgress(langName, `交通标题 ${i + 1}/${formData.transportation.length}`);
              } catch (e) {
                console.warn(`Failed to translate transportation title to ${langCode}:`, e);
              }
            }
            
            if (t.desc) {
              try {
                const descKey = getLangField('desc', langCode);
                (newTransport[i] as any)[descKey] = await askDeepSeek(
                  `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${t.desc}`
                );
                updateProgress(langName, `交通描述 ${i + 1}/${formData.transportation.length}`);
              } catch (e) {
                console.warn(`Failed to translate transportation desc to ${langCode}:`, e);
              }
            }
            
            if (t.price) {
              try {
                const priceKey = getLangField('price', langCode);
                (newTransport[i] as any)[priceKey] = await askDeepSeek(
                  `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${t.price}`
                );
                updateProgress(langName, `交通价格 ${i + 1}/${formData.transportation.length}`);
              } catch (e) {
                console.warn(`Failed to translate transportation price to ${langCode}:`, e);
              }
            }
          }
          newData.transportation = newTransport;
        }
        
        // 翻译美食
        if (formData.food.length > 0) {
          const newFood = [...newData.food];
          for (let i = 0; i < formData.food.length; i++) {
            const f = formData.food[i];
            
            if (f.name) {
              try {
                const nameKey = getLangField('name', langCode);
                (newFood[i] as any)[nameKey] = await askDeepSeek(
                  `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${f.name}`
                );
                updateProgress(langName, `美食名称 ${i + 1}/${formData.food.length}`);
              } catch (e) {}
            }
            
            if (f.desc) {
              try {
                const descKey = getLangField('desc', langCode);
                (newFood[i] as any)[descKey] = await askDeepSeek(
                  `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${f.desc}`
                );
                updateProgress(langName, `美食描述 ${i + 1}/${formData.food.length}`);
              } catch (e) {}
            }
          }
          newData.food = newFood;
        }
      }
      
      setFormData(newData);
      setTranslateProgress('翻译完成！');
      alert('全部翻译完成！');
    } catch (err) {
      console.error("Translation error:", err);
      alert('翻译失败：' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsTranslating(false);
    }
  };

  const handleGenerate = async () => {
    if (!formData.name) {
      alert('请输入城市名称');
      return;
    }
    setIsGenerating(true);
    try {
      const prompt = `Generate detailed, comprehensive city information for the city: '${formData.name}'. 
      IMPORTANT: The intro 'paragraphs' and 'bestTravelTime.paragraphs' MUST be divided into multiple distinct paragraphs to provide a rich guide.
      
      Introduction Formatting (paragraphs & enParagraphs):
      - MUST provide 4 distinct paragraphs.
      - Paragraph 1: Geographical location and climate (approx 100 words).
      - Paragraph 2: Historical significance and unique city charm (approx 100 words).
      - Paragraph 3: Cultural atmosphere, food specialties, and local lifestyle (approx 100 words).
      - Paragraph 4: Modern development, international standing, and future vision (approx 100 words).

      Best Travel Time Formatting (bestTravelTime.paragraphs & enParagraphs):
      - MUST provide 3 distinct paragraphs.
      - Paragraph 1: Detailed description of the best months and why they are recommended.
      - Paragraph 2: Comprehensive guide for visiting in Spring (specific weather, recommended parks/scenes).
      - Paragraph 3: Comprehensive guide for visiting in Autumn (weather conditions, key activities/festivals).

      Comprehensiveness Requirements:
      - Attractions: Provide 10-12 major attractions, covering historical, cultural, and modern sites.
      - Food: Provide 10-12 local specialties, including main dishes, street foods, and traditional desserts.
      - Transportation: Provide a highly detailed guide for Plane, Train, and Bus/Local Metro.
      - History: Provide 5-6 key historical milestones.

      - Highlights: Include 2-3 World Heritage sites (if any) and 2-3 Intangible Cultural Heritages that represent the city's traditions.
      
      Return a JSON object that matches the following TypeScript structure exactly. 
      Ensure every field has its corresponding 'en' field filled correctly. 
      CRITICAL: Primary fields (without 'en' prefix, e.g., 'paragraphs') MUST contain ONLY Chinese content. 
      'en' prefixed fields (e.g., 'enParagraphs') MUST contain ONLY English content. 
      DO NOT mix both languages in a single field.
      DO NOT provide any image URLs. Leave them as empty strings.

      Structure: {
        name: string,
        enName: string,
        tags: [{text: string, enText: string, color: string}],
        paragraphs: string[],
        enParagraphs: string[],
        stats: {wantToVisit: number, recommended: number},
        info: {area: string, population: string},
        bestTravelTime: {strongText: string, enStrongText: string, paragraphs: string[], enParagraphs: string[]},
        history: [{year: string, enYear: string, title: string, enTitle: string, desc: string, enDesc: string}],
        attractions: [{name: string, enName: string, desc: string, enDesc: string, price: string, enPrice: string, season: string, enSeason: string, time: string, enTime: string}],
        worldHeritage: [{name: string, enName: string, year: string, enYear: string, desc: string, enDesc: string}],
        intangibleHeritage: [{name: string, enName: string, year: string, enYear: string, desc: string, enDesc: string, imageUrl: string}],
        transportation: [{iconName: "Plane" | "Train" | "Bus", title: string, enTitle: string, desc: string, enDesc: string, price: string, enPrice: string}],
        food: [{name: string, enName: string, pinyin: string, price: string, desc: string, enDesc: string, ingredients: string, enIngredients: string, imageIdx: number}]
      }
      Respond ONLY with the raw JSON object.`;
      
      const responseText = await generateCityData(prompt);
      
      // Clean up response: remove markdown formatting and try to extract JSON object
      const cleanJSON = (text: string) => {
        let jsonString = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
        const start = jsonString.indexOf('{');
        const end = jsonString.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
          jsonString = jsonString.substring(start, end + 1);
        }
        return jsonString;
      };

      const data = JSON.parse(cleanJSON(responseText));
      
      setFormData(prev => ({ ...prev, ...data, id: prev.id }));
    } catch (err) {
      console.error(err);
      alert('生成失败: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsGenerating(false);
    }
  };

  const updateFormData = (key: keyof CityData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // 获取当前语言的字段值
  const getFieldValue = (fieldName: string, defaultValue: any) => {
    if (activeLangTab === 'zh') return defaultValue;
    const langField = `${fieldName}${activeLangTab.charAt(0).toUpperCase() + activeLangTab.slice(1)}`;
    return (formData as any)[langField] || defaultValue;
  };

  // 设置当前语言的字段值
  const setFieldValue = (fieldName: string, value: any) => {
    if (activeLangTab === 'zh') {
      updateFormData(fieldName as keyof CityData, value);
    } else {
      const langField = `${fieldName}${activeLangTab.charAt(0).toUpperCase() + activeLangTab.slice(1)}`;
      setFormData(prev => ({ ...prev, [langField]: value }));
    }
  };

  const renderSection = () => {
    const isZh = activeLangTab === 'zh';
    const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === activeLangTab);
    
    // 获取当前语言的字段名
    const getNameField = () => isZh ? 'name' : `name${activeLangTab.charAt(0).toUpperCase() + activeLangTab.slice(1)}`;
    const getEnNameField = () => isZh ? 'enName' : `enName${activeLangTab.charAt(0).toUpperCase() + activeLangTab.slice(1)}`;
    
    switch (activeTab) {
      case 'basic':
        return (
          <div className="space-y-4">
            <input 
              value={(formData as any)[getNameField()] || ''} 
              onChange={e => setFieldValue(getNameField(), e.target.value)} 
              placeholder={isZh ? "中文名称" : `${currentLang?.label} 名称`} 
              className="w-full p-2 border rounded" 
            />
            <input 
              value={(formData as any)[getEnNameField()] || ''} 
              onChange={e => setFieldValue(getEnNameField(), e.target.value)} 
              placeholder={isZh ? "英文名称" : `${currentLang?.label} 英文名`} 
              className="w-full p-2 border rounded" 
            />
            <div className="flex gap-2">
               <input value={formData.heroImage} onChange={e => updateFormData('heroImage', e.target.value)} placeholder="详情页主图 (所有语言共用)" className="w-full p-2 border rounded" />
               <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 border rounded bg-gray-100">
                 {uploading ? <Loader2 className="animate-spin" /> : <ImageIcon />}
               </button>
               <input type="file" ref={fileInputRef} onChange={handleHeroImageUpload} className="hidden" accept="image/*" />
            </div>
            <div className="flex gap-2">
               <input value={formData.listCover || ''} onChange={e => updateFormData('listCover', e.target.value)} placeholder="列表页封面 (所有语言共用)" className="w-full p-2 border rounded" />
               <button type="button" onClick={() => listCoverInputRef.current?.click()} className="p-2 border rounded bg-gray-100">
                 {uploading ? <Loader2 className="animate-spin" /> : <ImageIcon />}
               </button>
               <input type="file" ref={listCoverInputRef} onChange={handleListCoverUpload} className="hidden" accept="image/*" />
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="space-y-4">
             <textarea 
               value={(() => {
                 if (isZh) return formData.paragraphs.join('\n');
                 const langParagraphs = (formData as any)[`paragraphs${activeLangTab.charAt(0).toUpperCase() + activeLangTab.slice(1)}`];
                 return langParagraphs?.join('\n') || formData.paragraphs.join('\n');
               })()} 
               onChange={e => {
                 const key = isZh ? 'paragraphs' : `paragraphs${activeLangTab.charAt(0).toUpperCase() + activeLangTab.slice(1)}`;
                 setFieldValue(key, e.target.value.split('\n'));
               }} 
               placeholder={isZh ? "简介 (每行一个段落)" : `简介 (${currentLang?.label}, 每行一段)`} 
               className="w-full p-2 border rounded h-32" 
             />
          </div>
        );
      case 'bestTime':
        return (
          <div className="space-y-4">
             <input 
               value={(() => {
                 if (isZh) return formData.bestTravelTime.strongText || '';
                 const langStrongText = (formData.bestTravelTime as any)[`strongText${activeLangTab.charAt(0).toUpperCase() + activeLangTab.slice(1)}`];
                 return langStrongText || formData.bestTravelTime.strongText || '';
               })()} 
               onChange={e => {
                 if (isZh) {
                   setFormData(prev => ({ ...prev, bestTravelTime: { ...prev.bestTravelTime, strongText: e.target.value } }));
                 } else {
                   const key = `strongText${activeLangTab.charAt(0).toUpperCase() + activeLangTab.slice(1)}`;
                   setFormData(prev => ({ ...prev, bestTravelTime: { ...prev.bestTravelTime, [key]: e.target.value } }));
                 }
               }} 
               placeholder={isZh ? "最佳旅行时间重点" : `Best Travel Time (${currentLang?.label})`} 
               className="w-full p-2 border rounded" 
             />
             <textarea 
               value={(() => {
                 if (isZh) return formData.bestTravelTime.paragraphs.join('\n');
                 const langParagraphs = (formData.bestTravelTime as any)[`paragraphs${activeLangTab.charAt(0).toUpperCase() + activeLangTab.slice(1)}`];
                 return langParagraphs?.join('\n') || formData.bestTravelTime.paragraphs.join('\n');
               })()} 
               onChange={e => {
                 if (isZh) {
                   setFormData(prev => ({ ...prev, bestTravelTime: { ...prev.bestTravelTime, paragraphs: e.target.value.split('\n') } }));
                 } else {
                   const key = `paragraphs${activeLangTab.charAt(0).toUpperCase() + activeLangTab.slice(1)}`;
                   setFormData(prev => ({ ...prev, bestTravelTime: { ...prev.bestTravelTime, [key]: e.target.value.split('\n') } }));
                 }
               }} 
               placeholder={isZh ? "最佳时间说明 (每行段落)" : `Travel Tips (${currentLang?.label})`} 
               className="w-full p-2 border rounded h-24" 
             />
          </div>
        );
      case 'attractions':
        return (
           <div className="space-y-4">
             <div className="flex justify-between items-center">
               <h3 className="font-bold">景点 ({formData.attractions.length})</h3>
               <button 
                 type="button"
                 onClick={() => {
                   const newAttr = { name: '', enName: '', desc: '', enDesc: '', price: '免费', enPrice: 'Free', season: '全年', enSeason: 'All Year', time: '1-2小时', enTime: '1-2 Hours', imageUrl: '' };
                   updateFormData('attractions', [...formData.attractions, newAttr]);
                 }}
                 className="text-sm bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors"
               >
                 + 添加景点
               </button>
             </div>
             {formData.attractions.map((attr, idx) => {
               const nameField = isZh ? 'name' : `name${activeLangTab.charAt(0).toUpperCase() + activeLangTab.slice(1)}`;
               const descField = isZh ? 'desc' : `desc${activeLangTab.charAt(0).toUpperCase() + activeLangTab.slice(1)}`;
               return (
                <div key={idx} className="p-4 border rounded space-y-2 relative group-item">
                   <button 
                     type="button"
                     onClick={() => updateFormData('attractions', formData.attractions.filter((_, i) => i !== idx))}
                     className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                   >
                     <X className="w-4 h-4" />
                   </button>
                   <input 
                     value={(attr as any)[nameField] || ''} 
                     onChange={e => {
                       const newAttractions = [...formData.attractions];
                       (newAttractions[idx] as any)[nameField] = e.target.value;
                       updateFormData('attractions', newAttractions);
                     }} 
                     placeholder={`景点名称 ${currentLang?.label}`} 
                     className="w-full p-2 border rounded" 
                   />
                   <textarea 
                     value={(attr as any)[descField] || ''} 
                     onChange={e => {
                       const newAttractions = [...formData.attractions];
                       (newAttractions[idx] as any)[descField] = e.target.value;
                       updateFormData('attractions', newAttractions);
                     }} 
                     placeholder={`景点描述 ${currentLang?.label}`} 
                     className="w-full p-2 border rounded h-20" 
                   />
                   <div className="flex gap-2">
                       <input value={attr.imageUrl || ''} onChange={e => {
                         const newAttractions = [...formData.attractions];
                         newAttractions[idx].imageUrl = e.target.value;
                         updateFormData('attractions', newAttractions);
                       }} placeholder="景点图片链接 (所有语言共用)" className="w-full p-2 border rounded" />
                       <input type="file" onChange={async (e) => {
                           const file = e.target.files?.[0];
                           if(file) {
                             const url = await handleFileUpload(file, 'attractions');
                             if(url) {
                               const newAttractions = [...formData.attractions];
                               newAttractions[idx].imageUrl = url;
                               updateFormData('attractions', newAttractions);
                             }
                           }
                       }} className="hidden" id={`attr-img-${idx}`} accept="image/*" />
                       <label htmlFor={`attr-img-${idx}`} className="p-2 border rounded bg-gray-100 cursor-pointer">
                         {uploading ? <Loader2 className="animate-spin" /> : <ImageIcon />}
                       </label>
                   </div>
                </div>
               );
             })}
           </div>
        );
      case 'history':
         return (
           <div className="space-y-4">
             <div className="flex justify-between items-center">
               <h3 className="font-bold">历史 ({formData.history.length})</h3>
               <button 
                 type="button"
                 onClick={() => {
                   const newHistory = { year: '', enYear: '', title: '', enTitle: '', desc: '', enDesc: '' };
                   updateFormData('history', [...formData.history, newHistory]);
                 }}
                 className="text-sm bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors"
               >
                 + 添加历史节点
               </button>
             </div>
             {formData.history.map((h, idx) => {
               const titleField = isZh ? 'title' : `title${activeLangTab.charAt(0).toUpperCase() + activeLangTab.slice(1)}`;
               const descField = isZh ? 'desc' : `desc${activeLangTab.charAt(0).toUpperCase() + activeLangTab.slice(1)}`;
               return (
                <div key={idx} className="p-4 border rounded space-y-2 relative">
                   <button 
                     type="button"
                     onClick={() => updateFormData('history', formData.history.filter((_, i) => i !== idx))}
                     className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                   >
                     <X className="w-4 h-4" />
                   </button>
                   <div className="grid grid-cols-2 gap-2">
                     <input value={h.year} onChange={e => {
                       const newHistory = [...formData.history];
                       newHistory[idx].year = e.target.value;
                       updateFormData('history', newHistory);
                     }} placeholder="年份" className="w-full p-2 border rounded" />
                     <input value={(h as any)[titleField] || ''} onChange={e => {
                       const newHistory = [...formData.history];
                       (newHistory[idx] as any)[titleField] = e.target.value;
                       updateFormData('history', newHistory);
                     }} placeholder={`标题 (${currentLang?.label})`} className="w-full p-2 border rounded" />
                   </div>
                   <textarea value={(h as any)[descField] || ''} onChange={e => {
                     const newHistory = [...formData.history];
                     (newHistory[idx] as any)[descField] = e.target.value;
                     updateFormData('history', newHistory);
                   }} placeholder={`历史描述 (${currentLang?.label})`} className="w-full p-2 border rounded h-20" />
                </div>
               );
             })}
           </div>
        );
      case 'food':
         return (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">美食 ({formData.food.length})</h3>
                <button 
                  type="button"
                  onClick={() => {
                    const newFood = { name: '', enName: '', pinyin: '', price: '', desc: '', enDesc: '', ingredients: '', enIngredients: '', imageIdx: 0, imageUrl: '' };
                    updateFormData('food', [...formData.food, newFood]);
                  }}
                  className="text-sm bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  + 添加美食
                </button>
              </div>
              {formData.food.map((f, idx) => {
                const nameField = isZh ? 'name' : `name${activeLangTab.charAt(0).toUpperCase() + activeLangTab.slice(1)}`;
                const descField = isZh ? 'desc' : `desc${activeLangTab.charAt(0).toUpperCase() + activeLangTab.slice(1)}`;
                return (
                 <div key={idx} className="p-4 border rounded space-y-2 relative">
                    <button 
                      type="button"
                      onClick={() => updateFormData('food', formData.food.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <input value={(f as any)[nameField] || ''} onChange={e => {
                        const newFood = [...formData.food];
                        (newFood[idx] as any)[nameField] = e.target.value;
                        updateFormData('food', newFood);
                      }} placeholder={`美食名称 (${currentLang?.label})`} className="w-full p-2 border rounded" />
                      <input value={f.pinyin} onChange={e => {
                        const newFood = [...formData.food];
                        newFood[idx].pinyin = e.target.value;
                        updateFormData('food', newFood);
                      }} placeholder="拼音" className="w-full p-2 border rounded" />
                    </div>
                    <textarea value={(f as any)[descField] || ''} onChange={e => {
                      const newFood = [...formData.food];
                      (newFood[idx] as any)[descField] = e.target.value;
                      updateFormData('food', newFood);
                    }} placeholder={`美食介绍 (${currentLang?.label})`} className="w-full p-2 border rounded h-20" />
                    <div className="flex gap-2">
                      <input value={f.imageUrl || ''} onChange={e => {
                        const newFood = [...formData.food];
                        newFood[idx].imageUrl = e.target.value;
                        updateFormData('food', newFood);
                      }} placeholder="美食图片链接 (所有语言共用)" className="w-full p-2 border rounded" />
                      <input type="file" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if(file) {
                            const url = await handleFileUpload(file, 'food');
                            if(url) {
                              const newFood = [...formData.food];
                              newFood[idx].imageUrl = url;
                              updateFormData('food', newFood);
                            }
                          }
                      }} className="hidden" id={`food-img-${idx}`} accept="image/*" />
                      <label htmlFor={`food-img-${idx}`} className="p-2 border rounded bg-gray-100 cursor-pointer">
                        {uploading ? <Loader2 className="animate-spin" /> : <ImageIcon />}
                      </label>
                    </div>
                 </div>
                );
              })}
            </div>
         );
      default:
        return <div className="p-4 text-gray-500">内容待填充...</div>;
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black">{city ? '编辑城市' : '新增城市'}</h2>
          <button onClick={onClose}><X /></button>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-50 rounded-xl items-center">
           {/* 语言切换Tab */}
           <div className="flex flex-wrap gap-1">
             {SUPPORTED_LANGUAGES.map((lang) => (
               <button 
                 key={lang.code}
                 type="button"
                 onClick={() => setActiveLangTab(lang.code)}
                 className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs ${activeLangTab === lang.code ? 'bg-white text-[#1b887a] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 {lang.nativeLabel}
               </button>
             ))}
           </div>
           {/* 自动翻译按钮 */}
           <button
             type="button"
             onClick={handleAutoTranslate}
             disabled={isTranslating}
             className="px-3 py-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg flex items-center gap-1.5 transition-colors ml-auto"
           >
             <Languages className="w-3.5 h-3.5" />
             {isTranslating ? '翻译中...' : '自动翻译全部语言'}
           </button>
        </div>
        {/* 翻译进度显示 */}
        {isTranslating && translateProgress && (
          <div className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 text-xs text-amber-700">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{translateProgress}</span>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
           {[
             { id: 'basic', label: '基础信息' },
             { id: 'text', label: '简介' },
             { id: 'bestTime', label: '最佳旅游时间' },
             { id: 'attractions', label: '景点' },
             { id: 'history', label: '历史' },
             { id: 'food', label: '美食' }
           ].map(tab => (
             <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap ${activeTab === tab.id ? 'bg-[#1b887a] text-white' : 'bg-gray-100'}`}>{tab.label}</button>
           ))}
        </div>

        {renderSection()}
        
        <div className="flex gap-4 mt-8">
            <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 bg-[#1b887a] text-white rounded-xl font-bold"
            >
                {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />} 
                AI智能生成
            </button>
            <button 
            onClick={() => onSave(formData)}
            className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-black"
            >
            <Save className="inline mr-2" /> 保存城市
            </button>
        </div>
      </div>
    </div>
  );
}
