import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Globe, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

// 支持的语言配置
const SUPPORTED_LANGUAGES = [
  { code: 'zh', label: '中文' },
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

const CATEGORIES = [
  { id: 'apps', label: '旅行必备APP' },
  { id: 'hotels', label: '酒店预定' },
  { id: 'transit', label: '交通出行' },
  { id: 'websites', label: '权威网站' },
  { id: 'youtube', label: 'YouTube达人' },
  { id: 'tiktok', label: 'TikTok达人' },
  { id: 'phones', label: '服务热线' },
];

interface AppItem {
  id?: string;
  category: string;
  sort_order: number;
  name: string;
  name_en?: string;
  name_ja?: string;
  name_ko?: string;
  name_ru?: string;
  name_fr?: string;
  name_es?: string;
  name_de?: string;
  name_tw?: string;
  name_it?: string;
  desc?: string;
  desc_en?: string;
  desc_ja?: string;
  desc_ko?: string;
  desc_ru?: string;
  desc_fr?: string;
  desc_es?: string;
  desc_de?: string;
  desc_tw?: string;
  desc_it?: string;
  logo?: string;
  url?: string;
  is_active?: boolean;
}

export default function AppsManagement() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<AppItem>({
    category: 'apps',
    sort_order: 0,
    name: '',
    name_en: '',
    name_ja: '',
    name_ko: '',
    name_ru: '',
    name_fr: '',
    name_es: '',
    name_de: '',
    name_tw: '',
    name_it: '',
    desc: '',
    desc_en: '',
    desc_ja: '',
    desc_ko: '',
    desc_ru: '',
    desc_fr: '',
    desc_es: '',
    desc_de: '',
    desc_tw: '',
    desc_it: '',
    logo: '',
    url: '',
    is_active: true,
  });

  const fetchApps = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('apps_catalog')
        .select('*')
        .order('category')
        .order('sort_order');
      
      if (error) throw error;
      setApps(data || []);
    } catch (error) {
      console.error('Error fetching apps:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      category: 'apps',
      sort_order: 0,
      name: '',
      name_en: '',
      name_ja: '',
      name_ko: '',
      name_ru: '',
      name_fr: '',
      name_es: '',
      name_de: '',
      name_tw: '',
      name_it: '',
      desc: '',
      desc_en: '',
      desc_ja: '',
      desc_ko: '',
      desc_ru: '',
      desc_fr: '',
      desc_es: '',
      desc_de: '',
      desc_tw: '',
      desc_it: '',
      logo: '',
      url: '',
      is_active: true,
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleSave = async () => {
    try {
      const submitData = {
        category: formData.category,
        sort_order: formData.sort_order || 0,
        name: formData.name,
        name_en: formData.name_en || null,
        name_ja: formData.name_ja || null,
        name_ko: formData.name_ko || null,
        name_ru: formData.name_ru || null,
        name_fr: formData.name_fr || null,
        name_es: formData.name_es || null,
        name_de: formData.name_de || null,
        name_tw: formData.name_tw || null,
        name_it: formData.name_it || null,
        desc: formData.desc || null,
        desc_en: formData.desc_en || null,
        desc_ja: formData.desc_ja || null,
        desc_ko: formData.desc_ko || null,
        desc_ru: formData.desc_ru || null,
        desc_fr: formData.desc_fr || null,
        desc_es: formData.desc_es || null,
        desc_de: formData.desc_de || null,
        desc_tw: formData.desc_tw || null,
        desc_it: formData.desc_it || null,
        logo: formData.logo || null,
        url: formData.url || null,
        is_active: formData.is_active,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        const { error } = await supabaseAdmin
          .from('apps_catalog')
          .update(submitData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabaseAdmin
          .from('apps_catalog')
          .insert(submitData);
        if (error) throw error;
      }

      resetForm();
      fetchApps();
      alert(editingId ? '更新成功' : '添加成功');
    } catch (error) {
      console.error('Error saving app:', error);
      alert('保存失败');
    }
  };

  const handleEdit = (item: AppItem) => {
    setFormData({
      category: item.category,
      sort_order: item.sort_order || 0,
      name: item.name || '',
      name_en: item.name_en || '',
      name_ja: item.name_ja || '',
      name_ko: item.name_ko || '',
      name_ru: item.name_ru || '',
      name_fr: item.name_fr || '',
      name_es: item.name_es || '',
      name_de: item.name_de || '',
      name_tw: item.name_tw || '',
      name_it: item.name_it || '',
      desc: item.desc || '',
      desc_en: item.desc_en || '',
      desc_ja: item.desc_ja || '',
      desc_ko: item.desc_ko || '',
      desc_ru: item.desc_ru || '',
      desc_fr: item.desc_fr || '',
      desc_es: item.desc_es || '',
      desc_de: item.desc_de || '',
      desc_tw: item.desc_tw || '',
      desc_it: item.desc_it || '',
      logo: item.logo || '',
      url: item.url || '',
      is_active: item.is_active !== false,
    });
    setEditingId(item.id || null);
    setIsAdding(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`确定要删除 "${name}" 吗？`)) return;
    try {
      const { error } = await supabaseAdmin
        .from('apps_catalog')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchApps();
      alert('删除成功');
    } catch (error) {
      console.error('Error deleting app:', error);
      alert('删除失败');
    }
  };

  // 翻译功能
  const handleAutoTranslate = async () => {
    if (!formData.name) {
      alert('请先输入中文名称');
      return;
    }

    const targetLangs = ['en', 'ja', 'ko', 'ru', 'fr', 'es', 'de', 'tw', 'it'];
    
    for (const lang of targetLangs) {
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: formData.name,
            targetLang: lang
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          handleInputChange(`name_${lang}`, data.translation);
        }
      } catch (e) {
        console.warn(`Translation failed for ${lang}`);
      }
    }

    // 简单翻译描述
    if (formData.desc) {
      handleInputChange('desc_en', formData.desc);
    }
    alert('翻译完成（如果 API 可用）');
  };

  if (loading) {
    return <div className="p-8 text-center">加载中...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">目录应用管理</h2>
        <button
          onClick={() => { setIsAdding(true); setEditingId(null); resetForm(); }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> 添加应用
        </button>
      </div>

      {/* 添加/编辑表单 */}
      {isAdding && (
        <div className="mb-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">{editingId ? '编辑应用' : '添加新应用'}</h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* 基础信息 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span className="text-sm">启用</span>
                </label>
              </div>
            </div>

            {/* Logo 和 URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={(e) => handleInputChange('logo', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">跳转 URL</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* 名称 - 多语言 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="font-medium">名称（多语言）</span>
                <button
                  onClick={handleAutoTranslate}
                  className="ml-auto text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                >
                  一键翻译
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SUPPORTED_LANGUAGES.map(lang => (
                  <div key={lang.code}>
                    <label className="block text-xs text-gray-500 mb-1">{lang.label}</label>
                    <input
                      type="text"
                      value={(formData as any)[lang.code === 'zh' ? 'name' : `name_${lang.code}`] || ''}
                      onChange={(e) => handleInputChange(lang.code === 'zh' ? 'name' : `name_${lang.code}`, e.target.value)}
                      placeholder={lang.code === 'zh' ? '必填' : ''}
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 描述 - 多语言 */}
            <div className="space-y-3">
              <span className="font-medium">描述（多语言）</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SUPPORTED_LANGUAGES.map(lang => (
                  <div key={lang.code}>
                    <label className="block text-xs text-gray-500 mb-1">{lang.label}</label>
                    <textarea
                      value={(formData as any)[lang.code === 'zh' ? 'desc' : `desc_${lang.code}`] || ''}
                      onChange={(e) => handleInputChange(lang.code === 'zh' ? 'desc' : `desc_${lang.code}`, e.target.value)}
                      rows={2}
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={handleSave}
                disabled={!formData.name}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 disabled:bg-gray-300 transition-colors"
              >
                <Save className="w-4 h-4" /> 保存
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 分类列表 */}
      <div className="space-y-8">
        {CATEGORIES.map(category => {
          const categoryApps = apps.filter(app => app.category === category.id);
          return (
            <div key={category.id} className="bg-white rounded-2xl border border-gray-200 p-4">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                {category.label}
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                  {categoryApps.length} 项
                </span>
              </h3>
              
              {categoryApps.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">暂无数据</p>
              ) : (
                <div className="space-y-3">
                  {categoryApps.map(app => (
                    <div key={app.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      {app.logo ? (
                        <img src={app.logo} alt={app.name} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{app.name}</div>
                        <div className="text-xs text-gray-500 truncate">{app.desc}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!app.is_active && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">已禁用</span>
                        )}
                        <button
                          onClick={() => handleEdit(app)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(app.id!, app.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
