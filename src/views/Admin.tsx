"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, LogOut, ChevronRight, ChevronDown, ChevronUp, Save, Image as ImageIcon, Filter, FileText, Languages, Building2, Globe, FileSignature, Plane, Menu, X, RefreshCw, Rocket } from 'lucide-react';
import Markdown from 'react-markdown';
import MDEditor from '@uiw/react-md-editor';
import TurndownService from 'turndown';
import { supabase } from '../lib/supabase';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import { User } from '@supabase/supabase-js';
import { CityData } from '../types/city';
import { citiesData } from '../data/citiesData';
import CityForm from '../components/CityForm';
import { generateCityData, askDeepSeek } from '../lib/deepseek';
import VisaManagement from '../components/admin/VisaManagement';
import TranslationManagement from '../components/admin/TranslationManagement';
import AppsManagement from '../components/admin/AppsManagement';
import PageSectionsManagement from '../components/admin/PageSectionsManagement';
import DataBackupManagement from '../components/admin/DataBackupManagement';
import { triggerRevalidate } from '../lib/revalidate';

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
// Keep handleFirestoreError for backward compatibility if needed, but we'll use Supabase

const categoryMap: Record<string, string> = {
  'National Policy': '国家政策',
  'Payment Methods': '支付方式',
  'Transportation': '交通出行',
  'Practical Tools': '实用工具',
  'City Guide': '城市指南',
  'Tradition': '民俗传统',
  'Food Culture': '饮食文化'
};

const filterCategoryMap: Record<string, string> = {
  'All': '全部',
  ...categoryMap
};

interface Article {
  _id?: string;
  title: string;
  subtitle: string;
  content: string;
  category: string;
  createdAt?: string;
  thumbnail?: string;
  // 多语言字段
  titleEn?: string;
  subtitleEn?: string;
  contentEn?: string;
  titleJa?: string;
  subtitleJa?: string;
  contentJa?: string;
  titleKo?: string;
  subtitleKo?: string;
  contentKo?: string;
  titleRu?: string;
  subtitleRu?: string;
  contentRu?: string;
  titleFr?: string;
  subtitleFr?: string;
  contentFr?: string;
  titleEs?: string;
  subtitleEs?: string;
  contentEs?: string;
  titleDe?: string;
  subtitleDe?: string;
  contentDe?: string;
  titleTw?: string;
  subtitleTw?: string;
  contentTw?: string;
  titleIt?: string;
  subtitleIt?: string;
  contentIt?: string;
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [cities, setCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(0);
  const [formData, setFormData] = useState<Article>({
    title: '',
    subtitle: '',
    content: '',
    thumbnail: '',
    category: 'National Policy',
    // 多语言字段初始化
    titleEn: '', subtitleEn: '', contentEn: '',
    titleJa: '', subtitleJa: '', contentJa: '',
    titleKo: '', subtitleKo: '', contentKo: '',
    titleRu: '', subtitleRu: '', contentRu: '',
    titleFr: '', subtitleFr: '', contentFr: '',
    titleEs: '', subtitleEs: '', contentEs: '',
    titleDe: '', subtitleDe: '', contentDe: '',
    titleTw: '', subtitleTw: '', contentTw: '',
    titleIt: '', subtitleIt: '', contentIt: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [showCityForm, setShowCityForm] = useState(false);
  const [editingCity, setEditingCity] = useState<CityData | null>(null);
  const [activeAdminView, setActiveAdminView] = useState<'articles' | 'cities' | 'visa' | 'translations' | 'apps' | 'pages' | 'backup'>('articles');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<LanguageCode>('zh');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [articleSearchTerm, setArticleSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [cityBatchInput, setCityBatchInput] = useState('');
  const [cityBatchStatus, setCityBatchStatus] = useState('');
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuExpanded, setMobileMenuExpanded] = useState<string | null>(null);

  const cleanJSON = (text: string) => {
    let jsonString = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    const start = jsonString.indexOf('{');
    const end = jsonString.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      jsonString = jsonString.substring(start, end + 1);
    }
    return jsonString;
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

  const handleBatchGenerate = async () => {
    const citiesToGen = cityBatchInput.split('\n').map(c => c.trim()).filter(c => c);
    if(citiesToGen.length === 0) return;

    setIsBatchGenerating(true);
    setCityBatchStatus(`正在启动: 0/${citiesToGen.length}`);

    for (let i = 0; i < citiesToGen.length; i++) {
        const cityName = citiesToGen[i];
        setCityBatchStatus(`AI 正在智能生成深度内容: ${cityName} (${i+1}/${citiesToGen.length})`);
        
        try {
            const prompt = `You are a world-class travel curator. Generates a deep, high-value city guide for '${cityName}' in China.
                Output requirements:
                - Comprehensive introduction (paragraphs & enParagraphs), MUST be exactly 4 distinct paragraphs:
                    1. Geographical location and climate (approx 100 words).
                    2. Historical significance and unique city charm (approx 100 words).
                    3. Cultural atmosphere, food specialties, and local lifestyle (approx 100 words).
                    4. Modern development, international standing, and future vision (approx 100 words).
                - Best Travel Time (bestTravelTime.paragraphs & enParagraphs), MUST be exactly 3 distinct paragraphs:
                    1. Detailed description of the best months and why they are recommended.
                    2. Comprehensive guide for visiting in Spring (specific weather, recommended parks/scenes).
                    3. Comprehensive guide for visiting in Autumn (weather conditions, key activities/festivals).
                - Comprehensiveness Requirements:
                    - Attractions: Provide 10-12 major attractions, covering historical, cultural, and modern sites.
                    - Food: Provide 10-12 local specialties, including main dishes, street foods, and traditional desserts.
                    - Transportation: Provide a highly detailed guide for Plane, Train, and Bus/Local Metro.
                    - History: Provide 5-6 key historical milestones.
                    - Highlights: Include 2-3 World Heritage sites (if any) and 2-3 Intangible Cultural Heritages.
                - Every field must have its corresponding 'en' field filled.
                - CRITICAL: Primary fields (without 'en' prefix, e.g., 'paragraphs') MUST contain ONLY Chinese content.
                - 'en' prefixed fields (e.g., 'enParagraphs') MUST contain ONLY English content.
                - DO NOT mix both languages in a single field.
                - DO NOT provide any image URLs. Leave heroImage, listCover, and all imageUrl fields as empty strings.
                - Realistic tourism statistics.

                Format: {
                  name: string,
                  enName: string,
                  paragraphs: string[],
                  enParagraphs: string[],
                  tags: [{text: string, enText: string, color: string}],
                  info: {area: string, population: string},
                  stats: {wantToVisit: number, recommended: number},
                  bestTravelTime: {strongText: string, enStrongText: string, paragraphs: string[], enParagraphs: string[]},
                  history: [{year: string, enYear: string, title: string, enTitle: string, desc: string, enDesc: string}],
                  attractions: [{name: string, enName: string, desc: string, enDesc: string, price: string, enPrice: string, season: string, enSeason: string, time: string, enTime: string}],
                  worldHeritage: [{name: string, enName: string, year: string, enYear: string, desc: string, enDesc: string}],
                  intangibleHeritage: [{name: string, enName: string, year: string, enYear: string, desc: string, enDesc: string, imageUrl: string}],
                  transportation: [{iconName: "Plane"|"Train"|"Bus", title: string, enTitle: string, desc: string, enDesc: string, price: string, enPrice: string}],
                  food: [{name: string, enName: string, pinyin: string, price: string, desc: string, enDesc: string, ingredients: string, enIngredients: string}]
                }`;
            
            const responseText = await generateCityData(prompt);
            const data = JSON.parse(cleanJSON(responseText || '{}'));

            // Using Supabase instead of Firebase
            const { error: upsertError } = await supabaseAdmin.from('cities').upsert({ 
              ...data, 
              // If data has no id, it will be generated by Supabase if id is primary key or we can use a slug
              id: data.id || data.name.toLowerCase().replace(/\s+/g, '-'), 
              createdAt: new Date().toISOString() 
            });
            if (upsertError) throw upsertError;
        } catch (err) {
            console.error(`Batch failed for ${cityName}:`, err);
        }
    }
    setCityBatchStatus('批量生成完成！');
    fetchCities();
    
    setCityBatchStatus("全部生成并转存完成！");
    setIsBatchGenerating(false);
    setCityBatchInput('');
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const turndownService = new TurndownService();

  const handleHtmlPaste = () => {
    const html = prompt('请粘贴文章HTML内容：');
    if (html) {
      const markdown = turndownService.turndown(html);
      setFormData({ ...formData, content: markdown });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      console.log("[Upload] Starting image upload:", file.name, file.type, file.size);
      const path = `articles/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
      const result = await supabase.storage.from('images').upload(path, file);
      console.log("[Upload] Result:", result);
      if (result.error) throw result.error;
      const url = supabase.storage.from('images').getPublicUrl(path).data.publicUrl;
      console.log("[Upload] Public URL:", url);
      
      const markdownImage = `\n![图片描述](${url})\n`;
      const targetField = activeTab === 'zh' ? 'content' : 'contentEn';
      setFormData(prev => ({ ...prev, [targetField]: prev[targetField as keyof typeof formData] + markdownImage }));
    } catch (err) {
      console.error("[Upload] Error uploading image:", err);
      alert(`上传图片失败: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
      setLoading(false);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>, field: 'content' | 'contentEn') => {
    const items = e.clipboardData?.items;
    const isHtml = e.clipboardData?.types.includes('text/html');
    const html = e.clipboardData?.getData('text/html');
    const plainText = e.clipboardData?.getData('text/plain');

    const imageFiles: File[] = [];
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) imageFiles.push(file);
        }
      }
    }

    if (imageFiles.length === 0 && !isHtml) {
      return; // Fallback to default textarea handling for plain text
    }

    e.preventDefault();

    const target = e.target as HTMLTextAreaElement;
    const startPos = target.selectionStart !== undefined ? target.selectionStart : formData[field].length;
    const endPos = target.selectionEnd !== undefined ? target.selectionEnd : formData[field].length;

    const insertText = (textToInsert: string) => {
      setFormData(prev => {
        const currentText = (prev[field] as string) || '';
        const newText = currentText.substring(0, startPos) + textToInsert + currentText.substring(endPos);
        
        setTimeout(() => {
          target.focus();
          target.setSelectionRange(startPos + textToInsert.length, startPos + textToInsert.length);
        }, 10);
        
        return { ...prev, [field]: newText };
      });
    };

    if (imageFiles.length > 0) {
      const placeholders = [];
      const tasks = [];
      
      for (const file of imageFiles) {
        const id = `![⏳ 正在上传图片中... (Uploading...)](${Math.random().toString(36).substring(7)})\n`;
        placeholders.push(id);
        tasks.push({ file, id });
      }
      
      insertText(placeholders.join(''));
      
      (async () => {
        setUploadingImages(prev => prev + 1);
        for (const task of tasks) {
          try {
            const path = `articles/${Date.now()}-${task.file.name || 'image.png'}`;
            const { error } = await supabase.storage.from('images').upload(path, task.file);
            if (error) throw error;
            const url = supabase.storage.from('images').getPublicUrl(path).data.publicUrl;
            setFormData(prev => ({
               ...prev,
               [field]: ((prev[field] as string) || '').split(task.id).join(`![图片](${url})\n`)
            }));
          } catch (err) {
            console.error("Error uploading image:", err);
            setFormData(prev => ({
               ...prev,
               [field]: ((prev[field] as string) || '').split(task.id).join(`![图片上传失败]()\n`)
            }));
          }
        }
        setUploadingImages(prev => prev - 1);
      })();
      return;
    }

    if (html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const images = Array.from(doc.querySelectorAll('img')).filter(img => img.src);
      
      const imageTasks: { uuid: string; src: string; actualSrc: string }[] = [];
      
      images.forEach(img => {
        const src = img.src;
        let actualSrc = src;
        if (src.includes('_next/image?url=')) {
          const urlMatch = src.match(/url=([^&]+)/);
          if (urlMatch && urlMatch[1]) {
            actualSrc = decodeURIComponent(urlMatch[1]);
          }
        }
        
        if (actualSrc.includes('firebasestorage.googleapis.com') || actualSrc.includes('supabase.co/storage')) {
           return; // skip already uploaded
        }

        const uuid = `__UPLOADING_${Math.random().toString(36).substring(7)}__`;
        imageTasks.push({ uuid, src, actualSrc });
        // Set placeholder image for the visual before upload completes
        img.src = `https://placehold.co/600x400/1b887a/FFFFFF?text=Uploading...`;
        img.alt = uuid;
      });

      try {
        const initialMarkdown = turndownService.turndown(doc.body.innerHTML);
        insertText(initialMarkdown);
      } catch (err) {
        console.error("Turndown error", err);
        if (plainText) insertText(plainText);
        return;
      }

      if (imageTasks.length > 0) {
        (async () => {
          setUploadingImages(prev => prev + 1);
          for (const task of imageTasks) {
            try {
              let blob: Blob;
              
              if (task.actualSrc.startsWith('data:')) {
                const res = await fetch(task.actualSrc);
                blob = await res.blob();
              } else {
                // Multi-layered fetch strategy to bypass CORS
                try {
                  const res = await fetch(task.actualSrc);
                  if (!res.ok) throw new Error("Direct fetch failed");
                  blob = await res.blob();
                } catch (err) {
                  console.log("Direct fetch failed, trying proxy for:", task.actualSrc);
                  try {
                    // Try wsrv.nl proxy (reliable for images)
                    const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(task.actualSrc)}&default=404`;
                    const res = await fetch(proxyUrl);
                    if (!res.ok) throw new Error("Proxy 1 failed");
                    blob = await res.blob();
                  } catch (err2) {
                    // Fallback to corsproxy.io
                    const proxyUrl2 = `https://corsproxy.io/?${encodeURIComponent(task.actualSrc)}`;
                    const res = await fetch(proxyUrl2);
                    if (!res.ok) throw new Error("Proxy 2 failed");
                    blob = await res.blob();
                  }
                }
              }

              const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
              const path = `articles/${fileName}`;
              
              const { error } = await supabase.storage.from('images').upload(path, blob, { 
                contentType: blob.type || 'image/png',
                upsert: true 
              });
              if (error) throw error;
              
              const url = supabase.storage.from('images').getPublicUrl(path).data.publicUrl;
              
              setFormData(prev => {
                const currentText = prev[field] as string;
                return {
                  ...prev,
                  [field]: currentText.replace(`https://placehold.co/600x400/1b887a/FFFFFF?text=Uploading...`, url).replace(task.uuid, '图片')
                };
              });
            } catch (err) {
              console.warn("无法转存图片", task.src);
              setFormData(prev => {
                const currentText = prev[field] as string;
                return {
                  ...prev,
                  [field]: currentText.replace(`https://placehold.co/600x400/1b887a/FFFFFF?text=Uploading...`, task.actualSrc).replace(task.uuid, '图片')
                };
              });
            }
          }
          setUploadingImages(prev => prev - 1);
        })();
      }
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      console.log("[Upload] Starting thumbnail upload:", file.name, file.type, file.size);
      const path = `thumbnails/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
      const result = await supabase.storage.from('images').upload(path, file, { contentType: file.type });
      console.log("[Upload] Thumbnail result:", result);
      if (result.error) throw result.error;
      const url = supabase.storage.from('images').getPublicUrl(path).data.publicUrl;
      console.log("[Upload] Thumbnail URL:", url);
      
      setFormData(prev => ({ ...prev, thumbnail: url }));
    } catch (err) {
      console.error("[Upload] Error uploading thumbnail:", err);
      alert(`上传封面图失败: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
    } finally {
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
      setLoading(false);
    }
  };

  const handleThumbnailPaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (!file) continue;

        setLoading(true);
        const path = `thumbnails/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
        
        try {
          const { error } = await supabase.storage.from('images').upload(path, file);
          if (error) throw error;
          const url = supabase.storage.from('images').getPublicUrl(path).data.publicUrl;
          setFormData(prev => ({ ...prev, thumbnail: url }));
        } catch (err) {
          console.error("Error uploading pasted image:", err);
          alert("上传粘贴图片失败");
        } finally {
          setLoading(false);
        }
        return;
      }
    }
  };

  const handleAutoTranslate = async () => {
    if (!formData.title && !formData.subtitle && !formData.content) {
      alert('请先填写中文内容');
      return;
    }
    
    setLoading(true);
    try {
      // 要翻译的目标语言（跳过中文，因为中文是源语言）
      const targetLanguages = SUPPORTED_LANGUAGES.filter(lang => lang.code !== 'zh');
      
      // 翻译结果
      const translations: Partial<Article> = {};

      // 批量翻译所有语言
      for (const lang of targetLanguages) {
        const langCode = lang.code;
        const langName = lang.label;
        
        // 翻译标题
        if (formData.title) {
          try {
            const titleKey = `title${langCode.charAt(0).toUpperCase() + langCode.slice(1)}` as keyof Article;
            translations[titleKey] = await askDeepSeek(
              `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${formData.title}`
            );
          } catch (e) {
            console.warn(`Failed to translate title to ${langCode}:`, e);
          }
        }

        // 翻译副标题
        if (formData.subtitle) {
          try {
            const subtitleKey = `subtitle${langCode.charAt(0).toUpperCase() + langCode.slice(1)}` as keyof Article;
            translations[subtitleKey] = await askDeepSeek(
              `Translate the following Chinese text to ${langName}. Only output the translated text, no explanations:\n\n${formData.subtitle}`
            );
          } catch (e) {
            console.warn(`Failed to translate subtitle to ${langCode}:`, e);
          }
        }

        // 翻译正文内容
        if (formData.content) {
          try {
            const contentKey = `content${langCode.charAt(0).toUpperCase() + langCode.slice(1)}` as keyof Article;
            translations[contentKey] = await askDeepSeek(
              `Translate the following Chinese markdown content to ${langName}. Preserve all markdown formatting, links, and image syntactic structures exactly as they are. Output only the translated markdown:\n\n${formData.content}`
            );
          } catch (e) {
            console.warn(`Failed to translate content to ${langCode}:`, e);
          }
        }
      }

      setFormData(prev => ({
        ...prev,
        ...translations
      }));

      alert('全部翻译完成！');

    } catch (err) {
      console.error("Translation error", err);
      alert('翻译失败：' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchArticles();
        fetchCities();
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchArticles();
        fetchCities();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      console.error(error);
      alert('账号密码登录失败，请检查账号和密码。');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
    } catch (error: any) {
      console.error(error);
      alert('Google登录失败，请重试。');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setArticles([]);
  };

  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = async () => {
    if (!window.confirm('确定要重新部署网站吗？这将触发 Cloudflare Pages 重新构建并发布。')) return;
    setIsDeploying(true);
    try {
      const baseUrl = window.location.origin;
      const res = await fetch(`${baseUrl}/api/deploy`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('✅ 部署已成功触发！请等待约 1-2 分钟完成构建。');
      } else {
        alert('❌ 部署触发失败: ' + (data.message || '未知错误'));
      }
    } catch (e: any) {
      alert('❌ 部署请求失败: ' + e.message);
    } finally {
      setIsDeploying(false);
    }
  };

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('articles')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      
      const mappedData = data?.map(doc => ({
        _id: doc.id,
        ...doc,
        createdAt: doc.createdAt || new Date().toISOString()
      })) as Article[];
      setArticles(mappedData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCities = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('cities')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      setCities(data as CityData[]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 清理article数据，移除不需要的字段
      const { _id, ...articleDataWithoutId } = formData;
      
      // 构建保存数据 - 直接使用与数据库字段名匹配的格式
      // 数据库字段：title(中文), titleEn(英文), title_ja, title_ko 等
      const articleData: Record<string, any> = {
        updated_at: new Date().toISOString()
      };
      
      // 中文字段直接保存
      articleData.title = formData.title || '';
      articleData.subtitle = formData.subtitle || '';
      articleData.content = formData.content || '';
      
      // 英文字段保存到 titleEn (驼峰命名)
      articleData.titleEn = formData.titleEn || '';
      articleData.subtitleEn = formData.subtitleEn || '';
      articleData.contentEn = formData.contentEn || '';
      
      // 其他语言字段保存到蛇形命名
      articleData.title_ja = formData.titleJa || '';
      articleData.subtitle_ja = formData.subtitleJa || '';
      articleData.content_ja = formData.contentJa || '';
      
      articleData.title_ko = formData.titleKo || '';
      articleData.subtitle_ko = formData.subtitleKo || '';
      articleData.content_ko = formData.contentKo || '';
      
      articleData.title_ru = formData.titleRu || '';
      articleData.subtitle_ru = formData.subtitleRu || '';
      articleData.content_ru = formData.contentRu || '';
      
      articleData.title_fr = formData.titleFr || '';
      articleData.subtitle_fr = formData.subtitleFr || '';
      articleData.content_fr = formData.contentFr || '';
      
      articleData.title_es = formData.titleEs || '';
      articleData.subtitle_es = formData.subtitleEs || '';
      articleData.content_es = formData.contentEs || '';
      
      articleData.title_de = formData.titleDe || '';
      articleData.subtitle_de = formData.subtitleDe || '';
      articleData.content_de = formData.contentDe || '';
      
      articleData.title_tw = formData.titleTw || '';
      articleData.subtitle_tw = formData.subtitleTw || '';
      articleData.content_tw = formData.contentTw || '';
      
      articleData.title_it = formData.titleIt || '';
      articleData.subtitle_it = formData.subtitleIt || '';
      articleData.content_it = formData.contentIt || '';

      if (editingId) {
        const { error } = await supabaseAdmin
          .from('articles')
          .update(articleData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        // Generate unique ID for new article
        const newId = `article-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        const { error } = await supabaseAdmin
          .from('articles')
          .insert([{
            id: newId,
            ...articleData,
            createdAt: new Date().toISOString()
          }]);
        if (error) throw error;
      }
      
      // 重置表单为初始状态
      setFormData({
        title: '',
        subtitle: '',
        content: '',
        thumbnail: '',
        category: 'National Policy',
        titleEn: '', subtitleEn: '', contentEn: '',
        titleJa: '', subtitleJa: '', contentJa: '',
        titleKo: '', subtitleKo: '', contentKo: '',
        titleRu: '', subtitleRu: '', contentRu: '',
        titleFr: '', subtitleFr: '', contentFr: '',
        titleEs: '', subtitleEs: '', contentEs: '',
        titleDe: '', subtitleDe: '', contentDe: '',
        titleTw: '', subtitleTw: '', contentTw: '',
        titleIt: '', subtitleIt: '', contentIt: '',
      });
      setShowForm(false);
      setEditingId(null);
      setActiveTab('zh');
      fetchArticles();
      await triggerRevalidate('articles');
      alert('保存成功！');
    } catch (error: any) {
      console.error('Supabase Article Error:', error);
      alert('保存失败: ' + (error.message || String(error)));
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!window.confirm('确定删除吗？')) return;
    try {
      const { error } = await supabaseAdmin
        .from('articles')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchArticles();
      await triggerRevalidate('articles');
    } catch (error: any) {
      console.error(error);
      alert('删除失败: ' + (error.message || String(error)));
    }
  };

  const handleFirestoreError = (error: unknown, operationType: string, path: string | null) => {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: user?.id,
        email: user?.email,
        emailVerified: !!user?.email_confirmed_at,
        isAnonymous: user?.is_anonymous,
      },
      operationType,
      path
    };
    console.error('Firestore Error Detail:', JSON.stringify(errInfo));
    return new Error(JSON.stringify(errInfo));
  };

  const handleSaveCity = async (cityData: CityData) => {
    setLoading(true);
    const targetId = cityData.id || editingCity?.id || cityData.name.toLowerCase().replace(/\s+/g, '-');
    
    try {
      // 只保留数据库中存在的字段
      const dbFields = [
        'id', 'name', 'enName', 'img', 'listCover', 'heroImage',
        'tags', 'paragraphs', 'enParagraphs', 'stats', 'attractions',
        'worldheritage', 'intangibleheritage', 'history', 'food',
        'besttraveltime', 'bestTravelTime', 'transportation', 'info',
        'worldHeritage', 'intangibleHeritage', 'videoUrl',
      ];
      
      const submitData: Record<string, any> = {
        id: targetId,
        updated_at: new Date().toISOString()
      };
      
      // 复制存在的字段
      for (const field of dbFields) {
        if ((cityData as any)[field] !== undefined) {
          submitData[field] = (cityData as any)[field];
        }
      }
      
      // 提取多语言翻译内容到 translations 字段
      const translations: Record<string, any> = {};
      const langCodes = ['en', 'ja', 'ko', 'ru', 'fr', 'es', 'de', 'tw', 'it'];
      
      for (const langCode of langCodes) {
        const langSuffix = langCode.charAt(0).toUpperCase() + langCode.slice(1);
        const langTranslations: Record<string, any> = {};
        
        // 城市名称
        const nameField = `name${langSuffix}`;
        const enNameField = `enName${langSuffix}`;
        if ((cityData as any)[nameField]) langTranslations.name = (cityData as any)[nameField];
        if ((cityData as any)[enNameField]) langTranslations.enName = (cityData as any)[enNameField];
        
        // 简介段落
        const paragraphsField = `paragraphs${langSuffix}`;
        if ((cityData as any)[paragraphsField]?.length > 0) {
          langTranslations.paragraphs = (cityData as any)[paragraphsField];
        }
        
        // 最佳旅行时间 - 翻译保存在 cityData.bestTravelTime.strongTextKo 等
        const bestTimeData = cityData.bestTravelTime as any;
        if (bestTimeData) {
          const strongTextField = `strongText${langSuffix}`;
          const paragraphsField = `paragraphs${langSuffix}`;
          const hasStrongText = bestTimeData[strongTextField] && bestTimeData[strongTextField] !== bestTimeData.strongText;
          const hasParagraphs = bestTimeData[paragraphsField]?.length > 0;
          
          if (hasStrongText || hasParagraphs) {
            langTranslations.bestTravelTime = {
              strongText: hasStrongText ? bestTimeData[strongTextField] : bestTimeData.strongText,
              paragraphs: hasParagraphs ? bestTimeData[paragraphsField] : (bestTimeData.paragraphs || [])
            };
          }
        }
        
        // 景点
        const attractionsWithLang = (cityData.attractions || []).map((attr: any) => {
          const translated: any = {};
          const nameF = `name${langSuffix}`;
          const descF = `desc${langSuffix}`;
          if (attr[nameF]) translated.name = attr[nameF];
          if (attr[descF]) translated.desc = attr[descF];
          if (Object.keys(translated).length > 0) return { ...translated, ...{ price: attr.price, season: attr.season, time: attr.time, imageUrl: attr.imageUrl } };
          return null;
        }).filter(Boolean);
        if (attractionsWithLang.length > 0) {
          langTranslations.attractions = attractionsWithLang;
        }
        
        // 历史
        const historyWithLang = (cityData.history || []).map((h: any) => {
          const translated: any = {};
          const titleF = `title${langSuffix}`;
          const descF = `desc${langSuffix}`;
          if (h[titleF]) translated.title = h[titleF];
          if (h[descF]) translated.desc = h[descF];
          if (Object.keys(translated).length > 0) return { ...translated, year: h.year };
          return null;
        }).filter(Boolean);
        if (historyWithLang.length > 0) {
          langTranslations.history = historyWithLang;
        }
        
        // 世界遗产
        const worldHeritageWithLang = (cityData.worldHeritage || []).map((wh: any) => {
          const translated: any = {};
          const nameF = `name${langSuffix}`;
          const descF = `desc${langSuffix}`;
          const yearF = `year${langSuffix}`;
          if (wh[nameF]) translated.name = wh[nameF];
          if (wh[descF]) translated.desc = wh[descF];
          if (wh[yearF]) translated.year = wh[yearF];
          if (Object.keys(translated).length > 0) return { ...translated, imageUrl: wh.imageUrl };
          return null;
        }).filter(Boolean);
        if (worldHeritageWithLang.length > 0) {
          langTranslations.worldHeritage = worldHeritageWithLang;
        }
        
        // 非物质文化遗产
        const intangibleHeritageWithLang = (cityData.intangibleHeritage || []).map((ih: any) => {
          const translated: any = {};
          const nameF = `name${langSuffix}`;
          const descF = `desc${langSuffix}`;
          const yearF = `year${langSuffix}`;
          if (ih[nameF]) translated.name = ih[nameF];
          if (ih[descF]) translated.desc = ih[descF];
          if (ih[yearF]) translated.year = ih[yearF];
          if (Object.keys(translated).length > 0) return { ...translated, imageUrl: ih.imageUrl };
          return null;
        }).filter(Boolean);
        if (intangibleHeritageWithLang.length > 0) {
          langTranslations.intangibleHeritage = intangibleHeritageWithLang;
        }
        
        // 交通
        const transportationWithLang = (cityData.transportation || []).map((t: any) => {
          const translated: any = {};
          const titleF = `title${langSuffix}`;
          const descF = `desc${langSuffix}`;
          if (t[titleF]) translated.title = t[titleF];
          if (t[descF]) translated.desc = t[descF];
          if (Object.keys(translated).length > 0) return { ...translated, iconName: t.iconName, price: t.price };
          return null;
        }).filter(Boolean);
        if (transportationWithLang.length > 0) {
          langTranslations.transportation = transportationWithLang;
        }
        
        // 美食
        const foodWithLang = (cityData.food || []).map((f: any) => {
          const translated: any = {};
          const nameF = `name${langSuffix}`;
          const descF = `desc${langSuffix}`;
          if (f[nameF]) translated.name = f[nameF];
          if (f[descF]) translated.desc = f[descF];
          if (Object.keys(translated).length > 0) return { ...translated, pinyin: f.pinyin, price: f.price, imageUrl: f.imageUrl };
          return null;
        }).filter(Boolean);
        if (foodWithLang.length > 0) {
          langTranslations.food = foodWithLang;
        }
        
        // 标签
        const tagsWithLang = (cityData.tags || []).map((tag: any) => {
          const textF = `text${langSuffix}`;
          if (tag[textF]) return { text: tag[textF], color: tag.color };
          return null;
        }).filter(Boolean);
        if (tagsWithLang.length > 0) {
          langTranslations.tags = tagsWithLang;
        }
        
        // 如果这个语言有翻译内容，加入 translations
        if (Object.keys(langTranslations).length > 0) {
          translations[langCode] = langTranslations;
        }
      }
      
      // 添加 translations 字段
      submitData.translations = translations;
      
      if (!cityData.id && !editingCity?.id) {
        submitData.created_at = new Date().toISOString();
      }

      const { error } = await supabaseAdmin
        .from('cities')
        .upsert(submitData);
      
      if (error) throw error;
      
      setShowCityForm(false);
      setEditingCity(null);
      await fetchCities();
      alert('保存成功');
    } catch (e: any) {
      console.error("Save city error:", e);
      alert('保存失败: ' + (e.message || String(e)));
    } finally {
      setLoading(false);
    }
  };

  const deleteCity = async (id: string, name: string) => {
    if (!window.confirm(`确定删除城市 "${name}" 吗？此操作不可撤销。`)) return;
    
    setLoading(true);
    try {
      const { error } = await supabaseAdmin
        .from('cities')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      await fetchCities();
      await triggerRevalidate('cities');
      alert('删除成功');
    } catch (e: any) {
      console.error("Delete city error:", e);
      alert('删除失败: ' + (e.message || String(e)));
    } finally {
      setLoading(false);
    }
  };

  const migrateCities = async () => {
    if (!window.confirm('确定将旧数据导入 Supabase？')) return;
    setLoading(true);
    try {
      for (const city of Object.values(citiesData)) {
        const { error } = await supabase.from('cities').upsert(city);
        if (error) throw error;
      }
      alert('迁移完成');
    } catch (e: any) {
      console.error("Migration error:", e);
      alert('迁移失败: ' + (e.message || String(e)));
    } finally {
      setLoading(false);
      fetchCities();
    }
  };

  const handleEdit = (article: Article) => {
    // 读取数据时，同时检查驼峰命名和蛇形命名字段
    // 数据库中英文字段可能是 titleEn 或 title_en，其他语言是 title_ja, title_ko 等
    const getField = (article: any, ...fields: string[]): string => {
      for (const field of fields) {
        if (article[field] !== undefined && article[field] !== null) {
          return article[field];
        }
      }
      return '';
    };

    setFormData({
      _id: article._id,
      title: article.title || '',
      subtitle: article.subtitle || '',
      content: article.content || '',
      thumbnail: article.thumbnail || '',
      category: article.category || 'National Policy',
      // 多语言字段 - 兼容驼峰和蛇形命名
      titleEn: getField(article, 'titleEn', 'title_en'),
      subtitleEn: getField(article, 'subtitleEn', 'subtitle_en'),
      contentEn: getField(article, 'contentEn', 'content_en'),
      titleJa: getField(article, 'titleJa', 'title_ja'),
      subtitleJa: getField(article, 'subtitleJa', 'subtitle_ja'),
      contentJa: getField(article, 'contentJa', 'content_ja'),
      titleKo: getField(article, 'titleKo', 'title_ko'),
      subtitleKo: getField(article, 'subtitleKo', 'subtitle_ko'),
      contentKo: getField(article, 'contentKo', 'content_ko'),
      titleRu: getField(article, 'titleRu', 'title_ru'),
      subtitleRu: getField(article, 'subtitleRu', 'subtitle_ru'),
      contentRu: getField(article, 'contentRu', 'content_ru'),
      titleFr: getField(article, 'titleFr', 'title_fr'),
      subtitleFr: getField(article, 'subtitleFr', 'subtitle_fr'),
      contentFr: getField(article, 'contentFr', 'content_fr'),
      titleEs: getField(article, 'titleEs', 'title_es'),
      subtitleEs: getField(article, 'subtitleEs', 'subtitle_es'),
      contentEs: getField(article, 'contentEs', 'content_es'),
      titleDe: getField(article, 'titleDe', 'title_de'),
      subtitleDe: getField(article, 'subtitleDe', 'subtitle_de'),
      contentDe: getField(article, 'contentDe', 'content_de'),
      titleTw: getField(article, 'titleTw', 'title_tw'),
      subtitleTw: getField(article, 'subtitleTw', 'subtitle_tw'),
      contentTw: getField(article, 'contentTw', 'content_tw'),
      titleIt: getField(article, 'titleIt', 'title_it'),
      subtitleIt: getField(article, 'subtitleIt', 'subtitle_it'),
      contentIt: getField(article, 'contentIt', 'content_it'),
      createdAt: article.createdAt || new Date().toISOString(),
    });
    setEditingId(article._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredArticles = (filterCategory === 'All' 
    ? articles 
    : articles.filter(a => a.category === filterCategory)
  ).filter(article => 
    article.title.toLowerCase().includes(articleSearchTerm.toLowerCase()) || 
    (article.subtitle && article.subtitle.toLowerCase().includes(articleSearchTerm.toLowerCase()))
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1b887a]/10 text-[#1b887a] rounded-2xl mb-6">
            <LogOut className="w-8 h-8 rotate-180" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">管理员登录</h1>
          <p className="text-gray-500 mb-8 text-sm">请输入账号和密码</p>
          
          <div className="space-y-4">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <input 
                  type="email" 
                  placeholder="请输入邮箱账号" 
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#1b887a] outline-none transition-all text-left"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <input 
                  type="password" 
                  placeholder="请输入密码" 
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#1b887a] outline-none transition-all text-left"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-[#1b887a] text-white rounded-xl font-black text-lg shadow-xl hover:bg-[#166d63] transition-all transform active:scale-[0.98] mt-4"
              >
                账号密码登录
              </button>
            </form>
            
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-400 text-sm font-medium">或</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              className="w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-black text-lg shadow-sm hover:bg-gray-50 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              使用 Google 账号登录
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex font-sans">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-black text-gray-900 tracking-tight">Tripcngo</h1>
          <span className="text-[10px] font-bold bg-[#1b887a]/10 text-[#1b887a] px-2 py-0.5 rounded-full">ADMIN</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/50 z-30"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="md:hidden w-72 bg-white flex flex-col fixed h-full z-40 shadow-xl"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <h1 className="text-lg font-black text-gray-900 tracking-tight">Tripcngo</h1>
                  <span className="text-[10px] text-gray-400 truncate max-w-[140px]">{user?.email}</span>
                </div>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {/* 内容管理 - 可折叠 */}
                <div className="space-y-1">
                  <button 
                    onClick={() => setMobileMenuExpanded(mobileMenuExpanded === 'content' ? null : 'content')}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeAdminView === 'articles' && !showForm ? 'bg-[#1b887a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5" /> 内容管理
                    </div>
                    {mobileMenuExpanded === 'content' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <AnimatePresence>
                    {mobileMenuExpanded === 'content' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 space-y-1 py-1">
                          <button 
                            onClick={() => { setActiveAdminView('articles'); setShowForm(false); setSidebarOpen(false); setMobileMenuExpanded(null); }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeAdminView === 'articles' && !showForm ? 'bg-[#1b887a]/10 text-[#1b887a]' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                          >
                            文章列表
                          </button>
                          <button 
                            onClick={() => { setShowForm(true); setSidebarOpen(false); setMobileMenuExpanded(null); }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${showForm ? 'bg-[#1b887a]/10 text-[#1b887a]' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                          >
                            发布文章
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 城市管理 - 可折叠 */}
                <div className="space-y-1">
                  <button 
                    onClick={() => setMobileMenuExpanded(mobileMenuExpanded === 'cities' ? null : 'cities')}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeAdminView === 'cities' && !showForm ? 'bg-[#1b887a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5" /> 城市管理
                    </div>
                    {mobileMenuExpanded === 'cities' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <AnimatePresence>
                    {mobileMenuExpanded === 'cities' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 space-y-1 py-1">
                          <button 
                            onClick={() => { setActiveAdminView('cities'); setShowForm(false); setSidebarOpen(false); setMobileMenuExpanded(null); }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeAdminView === 'cities' && !showForm ? 'bg-[#1b887a]/10 text-[#1b887a]' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                          >
                            城市列表
                          </button>
                          <button 
                            onClick={() => { setEditingCity(null); setShowCityForm(true); setSidebarOpen(false); setMobileMenuExpanded(null); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all"
                          >
                            新增城市
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 签证与签名 - 可折叠 */}
                <div className="space-y-1">
                  <button 
                    onClick={() => setMobileMenuExpanded(mobileMenuExpanded === 'visa' ? null : 'visa')}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeAdminView === 'visa' && !showForm ? 'bg-[#1b887a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5" /> 签证与签名
                    </div>
                    {mobileMenuExpanded === 'visa' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <AnimatePresence>
                    {mobileMenuExpanded === 'visa' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 space-y-1 py-1">
                          <button 
                            onClick={() => { setActiveAdminView('visa'); setShowForm(false); setSidebarOpen(false); setMobileMenuExpanded(null); }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeAdminView === 'visa' && !showForm ? 'bg-[#1b887a]/10 text-[#1b887a]' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                          >
                            签证管理
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 目录应用 - 可折叠 */}
                <div className="space-y-1">
                  <button 
                    onClick={() => setMobileMenuExpanded(mobileMenuExpanded === 'apps' ? null : 'apps')}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeAdminView === 'apps' && !showForm ? 'bg-[#1b887a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Plane className="w-5 h-5" /> 目录应用
                    </div>
                    {mobileMenuExpanded === 'apps' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <AnimatePresence>
                    {mobileMenuExpanded === 'apps' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 space-y-1 py-1">
                          <button 
                            onClick={() => { setActiveAdminView('apps'); setShowForm(false); setSidebarOpen(false); setMobileMenuExpanded(null); }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeAdminView === 'apps' && !showForm ? 'bg-[#1b887a]/10 text-[#1b887a]' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                          >
                            应用管理
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 静态页面 - 可折叠 */}
                <div className="space-y-1">
                  <button 
                    onClick={() => setMobileMenuExpanded(mobileMenuExpanded === 'pages' ? null : 'pages')}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeAdminView === 'pages' && !showForm ? 'bg-[#1b887a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5" /> 静态页面
                    </div>
                    {mobileMenuExpanded === 'pages' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <AnimatePresence>
                    {mobileMenuExpanded === 'pages' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 space-y-1 py-1">
                          <button 
                            onClick={() => { setActiveAdminView('pages'); setShowForm(false); setSidebarOpen(false); setMobileMenuExpanded(null); }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeAdminView === 'pages' && !showForm ? 'bg-[#1b887a]/10 text-[#1b887a]' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                          >
                            页面管理
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 翻译管理 - 可折叠 */}
                <div className="space-y-1">
                  <button 
                    onClick={() => setMobileMenuExpanded(mobileMenuExpanded === 'translations' ? null : 'translations')}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeAdminView === 'translations' && !showForm ? 'bg-[#1b887a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Languages className="w-5 h-5" /> 翻译管理
                    </div>
                    {mobileMenuExpanded === 'translations' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <AnimatePresence>
                    {mobileMenuExpanded === 'translations' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 space-y-1 py-1">
                          <button 
                            onClick={() => { setActiveAdminView('translations'); setShowForm(false); setSidebarOpen(false); setMobileMenuExpanded(null); }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeAdminView === 'translations' && !showForm ? 'bg-[#1b887a]/10 text-[#1b887a]' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                          >
                            翻译管理
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 备份恢复 - 可折叠 */}
                <div className="space-y-1">
                  <button 
                    onClick={() => setMobileMenuExpanded(mobileMenuExpanded === 'backup' ? null : 'backup')}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeAdminView === 'backup' && !showForm ? 'bg-[#1b887a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <RefreshCw className="w-5 h-5" /> 备份恢复
                    </div>
                    {mobileMenuExpanded === 'backup' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <AnimatePresence>
                    {mobileMenuExpanded === 'backup' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 space-y-1 py-1">
                          <button 
                            onClick={() => { setActiveAdminView('backup'); setShowForm(false); setSidebarOpen(false); setMobileMenuExpanded(null); }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeAdminView === 'backup' && !showForm ? 'bg-[#1b887a]/10 text-[#1b887a]' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                          >
                            备份恢复
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="px-4">
                  <button 
                    onClick={() => { handleDeploy(); setSidebarOpen(false); setMobileMenuExpanded(null); }}
                    disabled={isDeploying}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-gray-400 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
                  >
                    <Rocket className={`w-4 h-4 ${isDeploying ? 'animate-pulse' : ''}`} /> {isDeploying ? '部署中...' : '重新部署'}
                  </button>
                </div>
              </nav>
              <div className="p-4 border-t border-gray-100 pb-8">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <LogOut className="w-5 h-5" /> 退出系统
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10 hidden md:flex shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Tripcngo</h1>
            <span className="text-[10px] text-gray-400 truncate max-w-[140px]">{user?.email}</span>
          </div>
          <span className="text-[10px] font-bold bg-[#1b887a]/10 text-[#1b887a] px-2 py-1 rounded-full">ADMIN</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => { setActiveAdminView('articles'); setShowForm(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeAdminView === 'articles' && !showForm ? 'bg-[#1b887a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <FileText className="w-5 h-5" /> 内容管理
          </button>
          <button 
            onClick={() => { setActiveAdminView('cities'); setShowForm(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeAdminView === 'cities' && !showForm ? 'bg-[#1b887a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Building2 className="w-5 h-5" /> 城市管理
          </button>
          <button 
            onClick={() => { setActiveAdminView('visa'); setShowForm(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeAdminView === 'visa' && !showForm ? 'bg-[#1b887a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Globe className="w-5 h-5" /> 签证与签名
          </button>
          <button 
            onClick={() => { setActiveAdminView('apps'); setShowForm(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeAdminView === 'apps' && !showForm ? 'bg-[#1b887a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Plane className="w-5 h-5" /> 目录应用
          </button>
          <button 
            onClick={() => { setActiveAdminView('pages'); setShowForm(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeAdminView === 'pages' && !showForm ? 'bg-[#1b887a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <FileText className="w-5 h-5" /> 静态页面
          </button>
          <button 
            onClick={() => { setActiveAdminView('translations'); setShowForm(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeAdminView === 'translations' && !showForm ? 'bg-[#1b887a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Languages className="w-5 h-5" /> 翻译管理
          </button>
          <button 
            onClick={() => { setActiveAdminView('backup'); setShowForm(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeAdminView === 'backup' && !showForm ? 'bg-[#1b887a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <RefreshCw className="w-5 h-5" /> 备份恢复
          </button>
          <button 
            onClick={handleDeploy}
            disabled={isDeploying}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-gray-500 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
          >
            <Rocket className={`w-5 h-5 ${isDeploying ? 'animate-pulse' : ''}`} /> {isDeploying ? '部署中...' : '重新部署'}
          </button>
        </nav>
        <div className="p-4 border-t border-gray-100 pb-8">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <LogOut className="w-5 h-5" /> 退出系统
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-10 pt-16 md:pt-10">
        <div className="max-w-[1240px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
            <div>
               <h2 className="text-3xl font-black text-gray-900 mb-1">{showForm ? (editingId ? '编辑内容' : '发布新内容') : '内容管理'}</h2>
               <p className="text-gray-500 font-medium">{showForm ? '完善文章信息并发布至前台' : '管理前台展示的文章、指南等内容'}</p>
            </div>
            <div className="flex gap-4">
                <button 
                  onClick={() => {
                    if (showForm) {
                      setEditingId(null);
                      setActiveTab('zh');
                      setFormData({
                        title: '',
                        subtitle: '',
                        content: '',
                        thumbnail: '',
                        category: 'National Policy',
                        titleEn: '', subtitleEn: '', contentEn: '',
                        titleJa: '', subtitleJa: '', contentJa: '',
                        titleKo: '', subtitleKo: '', contentKo: '',
                        titleRu: '', subtitleRu: '', contentRu: '',
                        titleFr: '', subtitleFr: '', contentFr: '',
                        titleEs: '', subtitleEs: '', contentEs: '',
                        titleDe: '', subtitleDe: '', contentDe: '',
                        titleTw: '', subtitleTw: '', contentTw: '',
                        titleIt: '', subtitleIt: '', contentIt: '',
                      });
                    }
                    setShowForm(!showForm);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-[#1b887a] text-white rounded-xl font-bold shadow-lg hover:bg-[#166d63] transition-all"
                >
                  {showForm ? '返回列表' : <><Plus className="w-5 h-5" /> 发布新内容</>}
                </button>
            </div>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            className="hidden" 
            accept="image/*" 
          />
          <input 
            type="file" 
            ref={thumbnailInputRef} 
            onChange={handleThumbnailUpload} 
            className="hidden" 
            accept="image/*" 
          />

          {showForm ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8"
            >
              <div className="flex flex-wrap gap-2 mb-6 p-2 bg-gray-50 rounded-xl items-center">
                 {/* 语言切换Tab */}
                 <div className="flex flex-wrap gap-1">
                   {SUPPORTED_LANGUAGES.map((lang) => (
                     <button 
                       key={lang.code}
                       type="button"
                       onClick={() => setActiveTab(lang.code)}
                       className={`px-4 py-2 rounded-lg font-bold transition-all text-sm ${activeTab === lang.code ? 'bg-white text-[#1b887a] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                     >
                       {lang.nativeLabel}
                     </button>
                   ))}
                 </div>
                 {/* 自动翻译按钮 */}
                 <button
                   type="button"
                   onClick={handleAutoTranslate}
                   disabled={loading}
                   className="px-4 py-2 text-sm font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg flex items-center gap-2 transition-colors ml-auto"
                 >
                   <Languages className="w-4 h-4" />{loading ? '翻译中...' : '自动翻译全部语言'}
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 动态语言表单 */}
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isZh = lang.code === 'zh';
                  const titleKey = isZh ? 'title' : `title${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}` as keyof Article;
                  const subtitleKey = isZh ? 'subtitle' : `subtitle${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}` as keyof Article;
                  const contentKey = isZh ? 'content' : `content${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}` as keyof Article;
                  
                  return (
                    <div key={lang.code} className={`space-y-6 animate-in fade-in duration-300 ${activeTab === lang.code ? 'block' : 'hidden'}`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">{isZh ? '文章标题 (中文)' : `Title (${lang.label})`}</label>
                          <input 
                            type="text" 
                            required={isZh}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b887a] focus:ring-4 focus:ring-[#1b887a]/10 outline-none transition-all"
                            value={(formData[titleKey] as string) || ''}
                            onChange={e => setFormData({...formData, [titleKey]: e.target.value})}
                          />
                        </div>
                        {isZh && (
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">分类</label>
                            <select 
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b887a] focus:ring-4 focus:ring-[#1b887a]/10 outline-none transition-all"
                              value={formData.category}
                              onChange={e => setFormData({...formData, category: e.target.value})}
                            >
                              {Object.entries(categoryMap).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                              ))}
                            </select>
                          </div>
                        )}
                        {!isZh && (
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                            <input 
                              disabled
                              className="w-full px-4 py-3 bg-gray-100 border border-transparent rounded-xl text-gray-400 cursor-not-allowed"
                              value={categoryMap[formData.category] || formData.category}
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{isZh ? '副标题 (简述)' : `Subtitle (${lang.label})`}</label>
                        <textarea 
                          rows={2}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b887a] focus:ring-4 focus:ring-[#1b887a]/10 outline-none transition-all"
                          value={(formData[subtitleKey] as string) || ''}
                          onChange={e => setFormData({...formData, [subtitleKey]: e.target.value})}
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2 px-1">
                          <label className="block text-sm font-bold text-gray-700">{isZh ? '正文内容 (Markdown 支持粘贴图片)' : `Content (${lang.label})`}</label>
                          <div className="flex gap-2">
                            {isZh && (
                              <>
                                <button 
                                  type="button" 
                                  onClick={() => fileInputRef.current?.click()} 
                                  className="text-xs flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-bold text-gray-600 transition-colors"
                                >
                                  <ImageIcon className="w-3.5 h-3.5" /> 插入图片
                                </button>
                                <button 
                                  type="button" 
                                  onClick={handleHtmlPaste} 
                                  className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-bold text-gray-600 transition-colors"
                                >
                                  从 HTML 导入
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        <div data-color-mode="light">
                          <MDEditor
                            value={(formData[contentKey] as string) || ''}
                            onChange={(val) => setFormData({...formData, [contentKey]: val || ''})}
                            height={500}
                            style={{ borderRadius: '1rem', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: 'none' }}
                            textareaProps={{
                              placeholder: isZh ? '请在此输入正文内容...' : `Enter content in ${lang.label}...`,
                              onPaste: isZh ? (e) => handlePaste(e, 'content') : undefined
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-6 border-t border-gray-100">
                    <label className="block text-sm font-bold text-gray-700 mb-2">共享封面图 URL</label>
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b887a] focus:ring-4 focus:ring-[#1b887a]/10 outline-none transition-all"
                        value={formData.thumbnail}
                        onChange={e => setFormData({...formData, thumbnail: e.target.value})}
                        onPaste={handleThumbnailPaste}
                        placeholder="https://example.com/image.jpg (支持粘贴图片自动上传)"
                      />
                      <button
                        type="button"
                        onClick={() => thumbnailInputRef.current?.click()}
                        className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all flex justify-center items-center gap-2 whitespace-nowrap"
                      >
                        <ImageIcon className="w-5 h-5" /> 上传封面
                      </button>
                    </div>
                 </div>

                 <div className="flex justify-end gap-3 pt-6">
                    <button 
                      type="submit" 
                      disabled={loading || uploadingImages > 0}
                      className="flex items-center justify-center gap-2 w-full md:w-auto px-12 py-4 bg-[#1b887a] text-white rounded-xl font-bold shadow-lg hover:bg-[#166d63] disabled:opacity-50 transition-all text-lg"
                    >
                      <Save className="w-5 h-5" /> {loading ? '处理中...' : (uploadingImages > 0 ? `正在转存图片...` : '保存发布')}
                    </button>
                 </div>
              </form>
            </motion.div>
          ) : (
            <>
              {activeAdminView === 'articles' ? (
                <>
                   {/* Filter for articles and search */}
                  <div className="mb-6 flex items-center gap-3">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <div className="flex flex-wrap gap-2 flex-1">
                      {Object.entries(filterCategoryMap).map(([catId, label]) => (
                        <button
                          key={catId}
                          onClick={() => setFilterCategory(catId)}
                          className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${filterCategory === catId ? 'bg-gray-800 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <input 
                      type="text" 
                      placeholder="搜索文章..." 
                      className="px-4 py-2 border border-gray-200 rounded-full text-sm outline-none focus:border-[#1b887a]"
                      value={articleSearchTerm}
                      onChange={e => setArticleSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Grid of articles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map((article) => (
                       <motion.div 
                         key={article._id}
                         layout
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all flex flex-col h-full"
                       >
                          <div className="p-6 flex-1 flex flex-col">
                             <div className="flex justify-between items-start mb-4">
                                <span className="px-3 py-1 bg-gray-50 text-[10px] font-bold text-gray-500 rounded-full uppercase tracking-widest">{categoryMap[article.category] || article.category}</span>
                                <span className="text-[11px] text-gray-400 font-medium">{new Date(article.createdAt).toLocaleDateString()}</span>
                             </div>
                             <h3 className="text-lg font-black text-gray-900 mb-2 group-hover:text-[#1b887a] transition-colors">{article.title}</h3>
                             <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-1">{article.subtitle}</p>
                             <div className="flex justify-between items-center bg-gray-50 p-2 rounded-2xl">
                                <button 
                                  onClick={() => deleteArticle(article._id)}
                                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                                <button 
                                  onClick={() => handleEdit(article)}
                                  className="flex items-center gap-1 text-[#1b887a] font-bold text-sm px-4 py-2 hover:bg-[#1b887a]/10 rounded-xl transition-all"
                                >
                                   编辑 <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                             </div>
                          </div>
                       </motion.div>
                    ))}
                    
                    {filteredArticles.length === 0 && (
                      <div className="col-span-full py-20 text-center text-gray-400 font-medium bg-white rounded-3xl border border-gray-100 border-dashed">
                        当前分类下暂无文章...
                      </div>
                    )}
                  </div>
                </>
              ) : activeAdminView === 'cities' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="col-span-full space-y-4 mb-6">
                    <div className="p-4 bg-white rounded-xl border border-gray-200">
                      <h3 className="font-bold mb-2">批量城市生成控制台</h3>
                      <textarea 
                        className="w-full p-2 border rounded" 
                        rows={3} 
                        placeholder="请输入城市名称，每行一个"
                        value={cityBatchInput}
                        onChange={e => setCityBatchInput(e.target.value)}
                      />
                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={handleBatchGenerate} 
                          disabled={isBatchGenerating}
                          className="px-4 py-2 bg-[#1b887a] text-white rounded-lg font-bold"
                        >
                          {isBatchGenerating ? '生成中...' : '开始批量生成'}
                        </button>
                        <span className="text-sm text-gray-500 self-center">{cityBatchStatus}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-full p-4 bg-white rounded-xl border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                     <div className="flex items-center gap-4 w-full">
                        <input 
                           type="text" 
                           placeholder="搜索城市..." 
                           className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm outline-none focus:border-[#1b887a]"
                           value={citySearchTerm}
                           onChange={e => setCitySearchTerm(e.target.value)}
                        />
                     </div>
                     <button onClick={migrateCities} className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-bold text-sm whitespace-nowrap">迁移旧数据</button>
                  </div>
                  {cities.filter(c => c.name.includes(citySearchTerm) || (c.enName && c.enName.toLowerCase().includes(citySearchTerm.toLowerCase()))).map((city) => (
                     <div key={city.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                          <h3 className="font-bold text-lg">{city.name}</h3>
                          <p className="text-gray-400 text-sm mt-1">{city.enName}</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                           <button onClick={() => { setEditingCity(city); setShowCityForm(true); }} className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-sm transition-colors">编辑</button>
                           <button onClick={() => deleteCity(city.id, city.name)} disabled={loading} className="flex-x-1 px-4 py-2 text-white bg-red-500 hover:bg-red-600 disabled:bg-red-300 rounded-xl font-bold text-sm transition-colors">删除</button>
                        </div>
                     </div>
                  ))}
                  <button 
                    onClick={() => { setEditingCity(null); setShowCityForm(true); }}
                    className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-3xl border border-gray-200 border-dashed text-gray-400 hover:text-[#1b887a] hover:border-[#1b887a] transition-all"
                  >
                     <Plus className="w-8 h-8 mb-2" /> 新增城市
                  </button>
                  {showCityForm && (
                     <CityForm 
                       city={editingCity} 
                       onClose={() => { setShowCityForm(false); setEditingCity(null); }}
                       onSave={handleSaveCity}
                     />
                  )}
                </div>
              ) : activeAdminView === 'visa' ? (
                <VisaManagement />
              ) : activeAdminView === 'apps' ? (
                <AppsManagement />
              ) : activeAdminView === 'pages' ? (
                <PageSectionsManagement />
              ) : activeAdminView === 'translations' ? (
                <TranslationManagement />
              ) : activeAdminView === 'backup' ? (
                <DataBackupManagement />
              ) : null}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

