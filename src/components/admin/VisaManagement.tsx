import React, { useState, useEffect } from 'react';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { Plus, Edit2, Trash2, Save, X, ChevronDown, ChevronUp } from 'lucide-react';

interface VisaType {
  id?: string;
  code: string;
  purpose: string;
  purpose_en: string;
  description: string;
  description_en: string;
  sort_order: number;
  is_active: boolean;
}

interface SignaturePage {
  id?: string;
  page_key: string;
  title: string;
  title_en: string;
  content: string;
  content_en: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
}

interface VisaDocument {
  id?: string;
  visa_code: string;
  section: 'general' | 'special';
  icon: string;
  doc_title: string;
  doc_title_en: string;
  doc_description: string;
  doc_description_en: string;
  link_url: string;
  sort_order: number;
  is_required: boolean;
}

interface VisaFee {
  id?: string;
  visa_code: string;
  purpose: string;
  purpose_en: string;
  fee_range: string;
  note: string;
  note_en: string;
  sort_order: number;
  is_active: boolean;
}

export default function VisaManagement() {
  const [activeTab, setActiveTab] = useState<'types' | 'signatures' | 'documents' | 'fees'>('types');
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([]);
  const [signatures, setSignatures] = useState<SignaturePage[]>([]);
  const [documents, setDocuments] = useState<VisaDocument[]>([]);
  const [visaFees, setVisaFees] = useState<VisaFee[]>([]);
  const [editingType, setEditingType] = useState<VisaType | null>(null);
  const [editingSignature, setEditingSignature] = useState<SignaturePage | null>(null);
  const [editingDocument, setEditingDocument] = useState<VisaDocument | null>(null);
  const [editingFee, setEditingFee] = useState<VisaFee | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVisaTypes();
    fetchSignatures();
    fetchDocuments();
    fetchVisaFees();
  }, []);

  const fetchVisaTypes = async () => {
    const { data } = await supabaseAdmin.from('visa_types').select('*').order('sort_order');
    if (data) setVisaTypes(data);
  };

  const fetchSignatures = async () => {
    const { data } = await supabaseAdmin.from('signature_pages').select('*').order('sort_order');
    if (data) setSignatures(data);
  };

  const fetchDocuments = async () => {
    const { data } = await supabaseAdmin.from('visa_documents').select('*').order('visa_code').order('sort_order');
    if (data) setDocuments(data);
  };

  const fetchVisaFees = async () => {
    const { data } = await supabaseAdmin.from('visa_fees').select('*').order('sort_order');
    if (data) setVisaFees(data);
  };

  const handleSaveVisaType = async () => {
    if (!editingType) return;
    setLoading(true);
    try {
      const { error } = editingType.id
        ? await supabaseAdmin.from('visa_types').update({
            purpose: editingType.purpose,
            purpose_en: editingType.purpose_en,
            description: editingType.description,
            description_en: editingType.description_en,
            sort_order: editingType.sort_order,
            is_active: editingType.is_active,
            updated_at: new Date().toISOString()
          }).eq('id', editingType.id)
        : await supabaseAdmin.from('visa_types').insert([editingType]);
      
      if (error) throw error;
      await fetchVisaTypes();
      setEditingType(null);
      alert('保存成功');
    } catch (e: any) {
      alert('保存失败: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVisaType = async (id: string) => {
    if (!confirm('确定删除吗？')) return;
    setLoading(true);
    try {
      const { error } = await supabaseAdmin.from('visa_types').delete().eq('id', id);
      if (error) throw error;
      await fetchVisaTypes();
      alert('删除成功');
    } catch (e: any) {
      alert('删除失败: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSignature = async () => {
    if (!editingSignature) return;
    setLoading(true);
    try {
      const { error } = editingSignature.id
        ? await supabaseAdmin.from('signature_pages').update({
            title: editingSignature.title,
            title_en: editingSignature.title_en,
            content: editingSignature.content,
            content_en: editingSignature.content_en,
            image_url: editingSignature.image_url,
            is_active: editingSignature.is_active,
            sort_order: editingSignature.sort_order,
            updated_at: new Date().toISOString()
          }).eq('id', editingSignature.id)
        : await supabaseAdmin.from('signature_pages').insert([editingSignature]);
      
      if (error) throw error;
      await fetchSignatures();
      setEditingSignature(null);
      alert('保存成功');
    } catch (e: any) {
      alert('保存失败: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSignature = async (id: string) => {
    if (!confirm('确定删除吗？')) return;
    setLoading(true);
    try {
      const { error } = await supabaseAdmin.from('signature_pages').delete().eq('id', id);
      if (error) throw error;
      await fetchSignatures();
      alert('删除成功');
    } catch (e: any) {
      alert('删除失败: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDocument = async () => {
    if (!editingDocument) return;
    setLoading(true);
    try {
      const docData = {
        visa_code: editingDocument.visa_code,
        section: editingDocument.section,
        icon: editingDocument.icon,
        doc_title: editingDocument.doc_title,
        doc_title_en: editingDocument.doc_title_en,
        doc_description: editingDocument.doc_description,
        doc_description_en: editingDocument.doc_description_en,
        link_url: editingDocument.link_url,
        sort_order: editingDocument.sort_order,
        is_required: editingDocument.is_required
      };
      
      const { error } = editingDocument.id
        ? await supabaseAdmin.from('visa_documents').update(docData).eq('id', editingDocument.id)
        : await supabaseAdmin.from('visa_documents').insert([docData]);
      
      if (error) throw error;
      await fetchDocuments();
      setEditingDocument(null);
      alert('保存成功');
    } catch (e: any) {
      alert('保存失败: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm('确定删除吗？')) return;
    setLoading(true);
    try {
      const { error } = await supabaseAdmin.from('visa_documents').delete().eq('id', id);
      if (error) throw error;
      await fetchDocuments();
      alert('删除成功');
    } catch (e: any) {
      alert('删除失败: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFee = async () => {
    if (!editingFee) return;
    setLoading(true);
    try {
      const feeData = {
        visa_code: editingFee.visa_code,
        purpose: editingFee.purpose,
        purpose_en: editingFee.purpose_en,
        fee_range: editingFee.fee_range,
        note: editingFee.note,
        note_en: editingFee.note_en,
        sort_order: editingFee.sort_order,
        is_active: editingFee.is_active
      };
      
      const { error } = editingFee.id
        ? await supabaseAdmin.from('visa_fees').update(feeData).eq('id', editingFee.id)
        : await supabaseAdmin.from('visa_fees').insert([feeData]);
      
      if (error) throw error;
      await fetchVisaFees();
      setEditingFee(null);
      alert('保存成功');
    } catch (e: any) {
      alert('保存失败: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFee = async (id: string) => {
    if (!confirm('确定删除吗？')) return;
    setLoading(true);
    try {
      const { error } = await supabaseAdmin.from('visa_fees').delete().eq('id', id);
      if (error) throw error;
      await fetchVisaFees();
      alert('删除成功');
    } catch (e: any) {
      alert('删除失败: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">签证与签名管理</h2>
      
      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('types')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'types'
              ? 'text-[#1b887a] border-b-2 border-[#1b887a]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          签证类型管理
        </button>
        <button
          onClick={() => setActiveTab('signatures')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'signatures'
              ? 'text-[#1b887a] border-b-2 border-[#1b887a]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          签名页管理
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'documents'
              ? 'text-[#1b887a] border-b-2 border-[#1b887a]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          材料清单管理
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'fees'
              ? 'text-[#1b887a] border-b-2 border-[#1b887a]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          签证费用管理
        </button>
      </div>

      {/* Visa Types Tab */}
      {activeTab === 'types' && (
        <div className="space-y-4">
          <button
            onClick={() => setEditingType({
              code: '', purpose: '', purpose_en: '', description: '',
              description_en: '', sort_order: visaTypes.length + 1, is_active: true
            })}
            className="flex items-center gap-2 px-4 py-2 bg-[#1b887a] text-white rounded-lg hover:bg-[#158276]"
          >
            <Plus className="w-4 h-4" /> 添加签证类型
          </button>

          {/* Edit Form */}
          {editingType && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold">{editingType.id ? '编辑' : '新增'}签证类型</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">签证代码</label>
                  <input
                    type="text"
                    value={editingType.code}
                    onChange={(e) => setEditingType({ ...editingType, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="如: L, M, Z"
                    disabled={!!editingType.id}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">排序</label>
                  <input
                    type="number"
                    value={editingType.sort_order}
                    onChange={(e) => setEditingType({ ...editingType, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">中文名称</label>
                  <input
                    type="text"
                    value={editingType.purpose}
                    onChange={(e) => setEditingType({ ...editingType, purpose: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">英文名称</label>
                  <input
                    type="text"
                    value={editingType.purpose_en}
                    onChange={(e) => setEditingType({ ...editingType, purpose_en: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">中文描述</label>
                  <textarea
                    value={editingType.description}
                    onChange={(e) => setEditingType({ ...editingType, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg h-20"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">英文描述</label>
                  <textarea
                    value={editingType.description_en}
                    onChange={(e) => setEditingType({ ...editingType, description_en: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg h-20"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingType.is_active}
                      onChange={(e) => setEditingType({ ...editingType, is_active: e.target.checked })}
                      className="w-4 h-4"
                    />
                    启用
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveVisaType}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1b887a] text-white rounded-lg hover:bg-[#158276] disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> 保存
                </button>
                <button
                  onClick={() => setEditingType(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  <X className="w-4 h-4" /> 取消
                </button>
              </div>
            </div>
          )}

          {/* List */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">代码</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">中文名称</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">英文名称</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {visaTypes.map((type) => (
                  <tr key={type.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{type.code}</td>
                    <td className="px-4 py-3">{type.purpose}</td>
                    <td className="px-4 py-3 text-gray-600">{type.purpose_en}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded ${type.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {type.is_active ? '启用' : '禁用'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setEditingType(type)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteVisaType(type.id!)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Signatures Tab */}
      {activeTab === 'signatures' && (
        <div className="space-y-4">
          <button
            onClick={() => setEditingSignature({
              page_key: '', title: '', title_en: '', content: '',
              content_en: '', image_url: '', is_active: true, sort_order: signatures.length + 1
            })}
            className="flex items-center gap-2 px-4 py-2 bg-[#1b887a] text-white rounded-lg hover:bg-[#158276]"
          >
            <Plus className="w-4 h-4" /> 添加签名页
          </button>

          {/* Edit Form */}
          {editingSignature && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold">{editingSignature.id ? '编辑' : '新增'}签名页</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">页面标识</label>
                  <input
                    type="text"
                    value={editingSignature.page_key}
                    onChange={(e) => setEditingSignature({ ...editingSignature, page_key: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="如: about, contact"
                    disabled={!!editingSignature.id}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">排序</label>
                  <input
                    type="number"
                    value={editingSignature.sort_order}
                    onChange={(e) => setEditingSignature({ ...editingSignature, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">中文标题</label>
                  <input
                    type="text"
                    value={editingSignature.title}
                    onChange={(e) => setEditingSignature({ ...editingSignature, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">英文标题</label>
                  <input
                    type="text"
                    value={editingSignature.title_en}
                    onChange={(e) => setEditingSignature({ ...editingSignature, title_en: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">中文内容</label>
                  <textarea
                    value={editingSignature.content}
                    onChange={(e) => setEditingSignature({ ...editingSignature, content: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg h-32"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">英文内容</label>
                  <textarea
                    value={editingSignature.content_en}
                    onChange={(e) => setEditingSignature({ ...editingSignature, content_en: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg h-32"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">图片URL</label>
                  <input
                    type="text"
                    value={editingSignature.image_url}
                    onChange={(e) => setEditingSignature({ ...editingSignature, image_url: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingSignature.is_active}
                      onChange={(e) => setEditingSignature({ ...editingSignature, is_active: e.target.checked })}
                      className="w-4 h-4"
                    />
                    启用
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveSignature}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1b887a] text-white rounded-lg hover:bg-[#158276] disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> 保存
                </button>
                <button
                  onClick={() => setEditingSignature(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  <X className="w-4 h-4" /> 取消
                </button>
              </div>
            </div>
          )}

          {/* List */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">标识</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">中文标题</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">英文标题</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {signatures.map((sig) => (
                  <tr key={sig.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{sig.page_key}</td>
                    <td className="px-4 py-3">{sig.title}</td>
                    <td className="px-4 py-3 text-gray-600">{sig.title_en}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded ${sig.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {sig.is_active ? '启用' : '禁用'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setEditingSignature(sig)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSignature(sig.id!)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <button
            onClick={() => setEditingDocument({
              visa_code: visaTypes[0]?.code || 'L',
              section: 'general',
              icon: 'FileText',
              doc_title: '',
              doc_title_en: '',
              doc_description: '',
              doc_description_en: '',
              link_url: '',
              sort_order: documents.filter(d => d.visa_code === (visaTypes[0]?.code || 'L')).length + 1,
              is_required: true
            })}
            className="flex items-center gap-2 px-4 py-2 bg-[#1b887a] text-white rounded-lg hover:bg-[#158276]"
          >
            <Plus className="w-4 h-4" /> 添加材料
          </button>

          {/* Edit Form */}
          {editingDocument && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold">{editingDocument.id ? '编辑' : '新增'}材料</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">签证类型</label>
                  <select
                    value={editingDocument.visa_code}
                    onChange={(e) => setEditingDocument({ ...editingDocument, visa_code: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {visaTypes.map(t => (
                      <option key={t.id} value={t.code}>{t.code} - {t.purpose}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">类别</label>
                  <select
                    value={editingDocument.section}
                    onChange={(e) => setEditingDocument({ ...editingDocument, section: e.target.value as 'general' | 'special' })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="general">通用材料</option>
                    <option value="special">特殊材料</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">图标</label>
                  <select
                    value={editingDocument.icon}
                    onChange={(e) => setEditingDocument({ ...editingDocument, icon: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="FileText">FileText</option>
                    <option value="Upload">Upload</option>
                    <option value="CheckCircle">CheckCircle</option>
                    <option value="Plane">Plane</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Mail">Mail</option>
                    <option value="Building2">Building2</option>
                    <option value="CreditCard">CreditCard</option>
                    <option value="Heart">Heart</option>
                    <option value="User">User</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">排序</label>
                  <input
                    type="number"
                    value={editingDocument.sort_order}
                    onChange={(e) => setEditingDocument({ ...editingDocument, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">中文标题</label>
                  <input
                    type="text"
                    value={editingDocument.doc_title}
                    onChange={(e) => setEditingDocument({ ...editingDocument, doc_title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">英文标题</label>
                  <input
                    type="text"
                    value={editingDocument.doc_title_en}
                    onChange={(e) => setEditingDocument({ ...editingDocument, doc_title_en: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">中文说明</label>
                  <textarea
                    value={editingDocument.doc_description}
                    onChange={(e) => setEditingDocument({ ...editingDocument, doc_description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg h-20"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">英文说明</label>
                  <textarea
                    value={editingDocument.doc_description_en}
                    onChange={(e) => setEditingDocument({ ...editingDocument, doc_description_en: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg h-20"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">链接URL</label>
                  <input
                    type="text"
                    value={editingDocument.link_url}
                    onChange={(e) => setEditingDocument({ ...editingDocument, link_url: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="可选"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingDocument.is_required}
                      onChange={(e) => setEditingDocument({ ...editingDocument, is_required: e.target.checked })}
                      className="w-4 h-4"
                    />
                    必填
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveDocument}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1b887a] text-white rounded-lg hover:bg-[#158276] disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> 保存
                </button>
                <button
                  onClick={() => setEditingDocument(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  <X className="w-4 h-4" /> 取消
                </button>
              </div>
            </div>
          )}

          {/* Documents List by Visa Type */}
          <div className="space-y-6">
            {visaTypes.map(visaType => {
              const typeDocs = documents.filter(d => d.visa_code === visaType.code);
              if (typeDocs.length === 0) return null;
              
              return (
                <div key={visaType.id} className="bg-white border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h4 className="font-semibold text-gray-800">{visaType.code} - {visaType.purpose}</h4>
                  </div>
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">类别</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">中文标题</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">英文标题</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">必填</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {typeDocs.sort((a, b) => {
                        if (a.section !== b.section) return a.section === 'general' ? -1 : 1;
                        return a.sort_order - b.sort_order;
                      }).map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 text-xs rounded ${doc.section === 'general' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                              {doc.section === 'general' ? '通用' : '特殊'}
                            </span>
                          </td>
                          <td className="px-4 py-2">{doc.doc_title}</td>
                          <td className="px-4 py-2 text-gray-600">{doc.doc_title_en}</td>
                          <td className="px-4 py-2">
                            {doc.is_required ? '是' : '否'}
                          </td>
                          <td className="px-4 py-2 text-right">
                            <button
                              onClick={() => setEditingDocument(doc as VisaDocument)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDocument(doc.id!)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fees Tab */}
      {activeTab === 'fees' && (
        <div className="space-y-4">
          <button
            onClick={() => setEditingFee({
              visa_code: 'L',
              purpose: '',
              purpose_en: '',
              fee_range: '',
              note: '',
              note_en: '',
              sort_order: visaFees.length + 1,
              is_active: true
            })}
            className="flex items-center gap-2 px-4 py-2 bg-[#1b887a] text-white rounded-lg hover:bg-[#158276]"
          >
            <Plus className="w-4 h-4" /> 添加费用
          </button>

          {/* Edit Form */}
          {editingFee && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold">{editingFee.id ? '编辑' : '新增'}签证费用</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">签证代码</label>
                  <select
                    value={editingFee.visa_code}
                    onChange={(e) => setEditingFee({ ...editingFee, visa_code: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {visaTypes.map(t => (
                      <option key={t.id} value={t.code}>{t.code} - {t.purpose}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">排序</label>
                  <input
                    type="number"
                    value={editingFee.sort_order}
                    onChange={(e) => setEditingFee({ ...editingFee, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">中文用途</label>
                  <input
                    type="text"
                    value={editingFee.purpose}
                    onChange={(e) => setEditingFee({ ...editingFee, purpose: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">英文用途</label>
                  <input
                    type="text"
                    value={editingFee.purpose_en}
                    onChange={(e) => setEditingFee({ ...editingFee, purpose_en: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">费用范围</label>
                  <input
                    type="text"
                    value={editingFee.fee_range}
                    onChange={(e) => setEditingFee({ ...editingFee, fee_range: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="如: 约 2000-3000 元"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 mt-6">
                    <input
                      type="checkbox"
                      checked={editingFee.is_active}
                      onChange={(e) => setEditingFee({ ...editingFee, is_active: e.target.checked })}
                      className="w-4 h-4"
                    />
                    启用
                  </label>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">中文说明</label>
                  <textarea
                    value={editingFee.note}
                    onChange={(e) => setEditingFee({ ...editingFee, note: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg h-20"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">英文说明</label>
                  <textarea
                    value={editingFee.note_en}
                    onChange={(e) => setEditingFee({ ...editingFee, note_en: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg h-20"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveFee}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1b887a] text-white rounded-lg hover:bg-[#158276] disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> 保存
                </button>
                <button
                  onClick={() => setEditingFee(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  <X className="w-4 h-4" /> 取消
                </button>
              </div>
            </div>
          )}

          {/* List */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">代码</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">中文用途</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">英文用途</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">费用范围</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {visaFees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{fee.visa_code}</td>
                    <td className="px-4 py-3">{fee.purpose}</td>
                    <td className="px-4 py-3 text-gray-600">{fee.purpose_en}</td>
                    <td className="px-4 py-3">{fee.fee_range}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded ${fee.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {fee.is_active ? '启用' : '禁用'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setEditingFee(fee as VisaFee)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFee(fee.id!)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
