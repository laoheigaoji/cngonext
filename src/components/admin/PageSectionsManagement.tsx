import React, { useEffect, useState } from 'react';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { triggerRevalidate } from '../../lib/revalidate';

interface PageSection {
  id: string;
  page_key: string;
  section_key: string;
  sort_order: number;
  title_zh: string | null;
  title_en: string | null;
  title_ja: string | null;
  title_ko: string | null;
  title_ru: string | null;
  title_fr: string | null;
  title_es: string | null;
  title_de: string | null;
  title_tw: string | null;
  title_it: string | null;
  content_zh: string | null;
  content_en: string | null;
  content_ja: string | null;
  content_ko: string | null;
  content_ru: string | null;
  content_fr: string | null;
  content_es: string | null;
  content_de: string | null;
  content_tw: string | null;
  content_it: string | null;
  extra_data: Record<string, any> | null;
  is_active: boolean;
}

interface PageConfig {
  key: string;
  label: string;
  icon: string;
}

const LANGUAGES = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: '英文' },
  { code: 'ja', label: '日语' },
  { code: 'ko', label: '韩语' },
  { code: 'ru', label: '俄语' },
  { code: 'fr', label: '法语' },
  { code: 'es', label: '西班牙语' },
  { code: 'de', label: '德语' },
  { code: 'tw', label: '繁体中文' },
  { code: 'it', label: '意大利语' },
];

const PAGES: PageConfig[] = [
  { key: 'about_us', label: '关于我们', icon: 'ℹ️' },
  { key: 'terms_of_service', label: '服务条款', icon: '📄' },
  { key: 'privacy_policy', label: '隐私政策', icon: '🔒' },
];

export default function PageSectionsManagement() {
  const [selectedPage, setSelectedPage] = useState<string>('about_us');
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSections();
  }, [selectedPage]);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseAdmin
        .from('page_sections')
        .select('*')
        .eq('page_key', selectedPage)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section: PageSection) => {
    setEditingSection({ ...section });
  };

  const handleCancel = () => {
    setEditingSection(null);
  };

  const handleSave = async () => {
    if (!editingSection) return;
    
    setSaving(true);
    try {
      const { error } = await supabaseAdmin
        .from('page_sections')
        .update({
          title_zh: editingSection.title_zh,
          title_en: editingSection.title_en,
          title_ja: editingSection.title_ja,
          title_ko: editingSection.title_ko,
          title_ru: editingSection.title_ru,
          title_fr: editingSection.title_fr,
          title_es: editingSection.title_es,
          title_de: editingSection.title_de,
          title_tw: editingSection.title_tw,
          title_it: editingSection.title_it,
          content_zh: editingSection.content_zh,
          content_en: editingSection.content_en,
          content_ja: editingSection.content_ja,
          content_ko: editingSection.content_ko,
          content_ru: editingSection.content_ru,
          content_fr: editingSection.content_fr,
          content_es: editingSection.content_es,
          content_de: editingSection.content_de,
          content_tw: editingSection.content_tw,
          content_it: editingSection.content_it,
          extra_data: editingSection.extra_data,
          is_active: editingSection.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingSection.id);

      if (error) throw error;
      
      setEditingSection(null);
      fetchSections();
      await triggerRevalidate('about');
    } catch (error) {
      console.error('Error saving section:', error);
      alert('保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个板块吗？')) return;
    
    try {
      const { error } = await supabaseAdmin
        .from('page_sections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchSections();
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('删除失败');
    }
  };

  const handleToggleActive = async (section: PageSection) => {
    try {
      const { error } = await supabaseAdmin
        .from('page_sections')
        .update({ 
          is_active: !section.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', section.id);

      if (error) throw error;
      fetchSections();
      await triggerRevalidate('about');
    } catch (error) {
      console.error('Error toggling section:', error);
    }
  };

  const renderField = (
    label: string,
    fieldName: keyof PageSection,
    isTextarea = false
  ) => {
    if (!editingSection) return null;

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {isTextarea ? (
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1b887a] focus:border-transparent"
            rows={4}
            value={(editingSection[fieldName] as string) || ''}
            onChange={(e) => setEditingSection({ ...editingSection, [fieldName]: e.target.value })}
          />
        ) : (
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1b887a] focus:border-transparent"
            value={(editingSection[fieldName] as string) || ''}
            onChange={(e) => setEditingSection({ ...editingSection, [fieldName]: e.target.value })}
          />
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">静态页面管理</h2>

      {/* Page Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {PAGES.map((page) => (
          <button
            key={page.key}
            onClick={() => setSelectedPage(page.key)}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedPage === page.key
                ? 'text-[#1b887a] border-b-2 border-[#1b887a]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {page.icon} {page.label}
          </button>
        ))}
      </div>

      {/* Sections List */}
      {loading ? (
        <div className="text-center py-8">加载中...</div>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`bg-white border rounded-lg p-4 ${
                section.is_active ? 'border-gray-200' : 'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{section.section_key}</span>
                    {!section.is_active && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">已禁用</span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1">
                    {section.title_zh || section.title_en || '(无标题)'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {section.content_zh?.substring(0, 100) || section.content_en?.substring(0, 100) || '(无内容)'}...
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleToggleActive(section)}
                    className={`px-3 py-1 text-sm rounded ${
                      section.is_active
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {section.is_active ? '禁用' : '启用'}
                  </button>
                  <button
                    onClick={() => handleEdit(section)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(section.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingSection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">编辑板块: {editingSection.section_key}</h3>
              <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Title Fields */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-bold mb-4">标题（多语言）</h4>
                <div className="grid grid-cols-2 gap-4">
                  {LANGUAGES.map((lang) => (
                    <div key={lang.code}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {lang.label}
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1b887a] focus:border-transparent"
                        value={(editingSection as any)[`title_${lang.code}`] || ''}
                        onChange={(e) => 
                          setEditingSection({ 
                            ...editingSection, 
                            [`title_${lang.code}`]: e.target.value 
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Fields */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-bold mb-4">内容（多语言）</h4>
                <p className="text-sm text-gray-500 mb-4">提示：使用 | 分隔段落，使用 • 分隔列表项</p>
                {LANGUAGES.map((lang) => (
                  <div key={lang.code} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {lang.label}
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1b887a] focus:border-transparent"
                      rows={4}
                      value={(editingSection as any)[`content_${lang.code}`] || ''}
                      onChange={(e) => 
                        setEditingSection({ 
                          ...editingSection, 
                          [`content_${lang.code}`]: e.target.value 
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              {/* Extra Data */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-bold mb-4">额外配置</h4>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">背景图片URL</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1b887a] focus:border-transparent"
                    value={editingSection.extra_data?.bg_image || ''}
                    onChange={(e) => setEditingSection({
                      ...editingSection,
                      extra_data: { ...editingSection.extra_data, bg_image: e.target.value }
                    })}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">生效日期</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1b887a] focus:border-transparent"
                    value={editingSection.extra_data?.effective_date || ''}
                    onChange={(e) => setEditingSection({
                      ...editingSection,
                      extra_data: { ...editingSection.extra_data, effective_date: e.target.value }
                    })}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-[#1b887a] text-white rounded-md hover:bg-[#166d63] disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? '保存中...' : '保存'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
