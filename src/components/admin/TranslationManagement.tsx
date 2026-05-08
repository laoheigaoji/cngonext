import React, { useState, useEffect } from 'react';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { Plus, Edit2, Trash2, Save, X, Search, Download, Upload } from 'lucide-react';

const LANGUAGES = [
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
  { value: 'general', label: '通用' },
  { value: 'visa', label: '签证' },
  { value: 'city', label: '城市' },
  { value: 'article', label: '文章' },
  { value: 'common', label: '公共' },
];

interface Translation {
  id?: string;
  lang: string;
  category: string;
  key: string;
  value: string;
}

export default function TranslationManagement() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [editingItem, setEditingItem] = useState<Translation | null>(null);
  const [filterLang, setFilterLang] = useState('zh');
  const [filterCategory, setFilterCategory] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'edit'>('table');

  useEffect(() => {
    fetchTranslations();
  }, [filterLang, filterCategory]);

  const fetchTranslations = async () => {
    setLoading(true);
    try {
      let query = supabaseAdmin.from('translations').select('*').eq('lang', filterLang);
      if (filterCategory) {
        query = query.eq('category', filterCategory);
      }
      const { data, error } = await query.order('key');
      if (error) throw error;
      setTranslations(data || []);
    } catch (e) {
      console.error('Failed to fetch translations:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingItem) return;
    setLoading(true);
    try {
      const { error } = editingItem.id
        ? await supabaseAdmin.from('translations').update({
            value: editingItem.value,
            updated_at: new Date().toISOString()
          }).eq('id', editingItem.id)
        : await supabaseAdmin.from('translations').insert([editingItem]);
      
      if (error) throw error;
      await fetchTranslations();
      setEditingItem(null);
      alert('保存成功');
    } catch (e: any) {
      alert('保存失败: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除吗？')) return;
    setLoading(true);
    try {
      const { error } = await supabaseAdmin.from('translations').delete().eq('id', id);
      if (error) throw error;
      await fetchTranslations();
      alert('删除成功');
    } catch (e: any) {
      alert('删除失败: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingItem({
      lang: filterLang,
      category: filterCategory || 'general',
      key: '',
      value: ''
    });
  };

  const handleExport = async () => {
    const { data } = await supabaseAdmin.from('translations').select('*');
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'translations.json';
      a.click();
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const items = JSON.parse(text);
      
      for (const item of items) {
        await supabaseAdmin.from('translations').upsert([item], { 
          onConflict: 'lang,category,key' 
        });
      }
      
      await fetchTranslations();
      alert('导入成功');
    } catch (e: any) {
      alert('导入失败: ' + e.message);
    }
    event.target.value = '';
  };

  const filteredTranslations = translations.filter(t => 
    !searchKey || t.key.toLowerCase().includes(searchKey.toLowerCase()) ||
    t.value.toLowerCase().includes(searchKey.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">翻译管理</h2>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm font-medium mb-1">语言</label>
          <select
            value={filterLang}
            onChange={(e) => setFilterLang(e.target.value)}
            className="px-3 py-2 border rounded-lg min-w-[120px]"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">分类</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border rounded-lg min-w-[120px]"
          >
            <option value="">全部</option>
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">搜索</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="搜索 key 或内容..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
        </div>
        
        <div className="flex gap-2 mt-5">
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-[#1b887a] text-white rounded-lg hover:bg-[#158276]"
          >
            <Plus className="w-4 h-4" /> 添加
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" /> 导出
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 cursor-pointer">
            <Upload className="w-4 h-4" /> 导入
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>

      {/* Edit Form */}
      {editingItem && !editingItem.id && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h3 className="font-semibold">新增翻译</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">语言</label>
              <select
                value={editingItem.lang}
                onChange={(e) => setEditingItem({ ...editingItem, lang: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">分类</label>
              <select
                value={editingItem.category}
                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Key</label>
              <input
                type="text"
                value={editingItem.key}
                onChange={(e) => setEditingItem({ ...editingItem, key: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="如: visa.title"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-medium mb-1">内容</label>
              <textarea
                value={editingItem.value}
                onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg h-20"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[#1b887a] text-white rounded-lg hover:bg-[#158276] disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> 保存
            </button>
            <button
              onClick={() => setEditingItem(null)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              <X className="w-4 h-4" /> 取消
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Key</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">分类</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">内容</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">加载中...</td>
              </tr>
            ) : filteredTranslations.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">暂无数据</td>
              </tr>
            ) : filteredTranslations.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-sm">{item.key}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs bg-gray-100 rounded">{item.category}</span>
                </td>
                <td className="px-4 py-3">
                  {editingItem?.id === item.id ? (
                    <textarea
                      value={editingItem.value}
                      onChange={(e) => setEditingItem({ ...editingItem!, value: e.target.value })}
                      className="w-full px-2 py-1 border rounded"
                      rows={2}
                    />
                  ) : (
                    <span className="line-clamp-2">{item.value}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {editingItem?.id === item.id ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingItem(null)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id!)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
