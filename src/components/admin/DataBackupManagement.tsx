import React, { useState } from 'react';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { Download, Upload, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

// 按照依赖关系排序：基础数据 -> 关联数据
const TABLES = [
  { id: 'cities', label: '城市数据' },
  { id: 'articles', label: '文章数据' },
  { id: 'visa_types', label: '签证类型' },
  { id: 'signature_pages', label: '签名页面' },
  { id: 'visa_documents', label: '签证材料' },
  { id: 'visa_fees', label: '签证费用' },
  { id: 'apps_catalog', label: '目录应用' },
  { id: 'page_sections', label: '静态页板块' },
  { id: 'home_faqs', label: '首页 FAQ' },
  { id: 'article_comments', label: '文章评论' },
  { id: 'travel_guide', label: '旅游指南' },
  { id: 'purchases', label: '购买记录' },
  { id: 'feedback', label: '用户反馈' },
  { id: 'translations', label: '翻译数据' },
];

export default function DataBackupManagement() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [progress, setProgress] = useState(0);

  const handleExportTable = async (tableId: string, label: string) => {
    setLoading(true);
    setStatus(null);
    try {
      const { data, error } = await supabaseAdmin.from(tableId).select('*');
      if (error) throw error;

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `china_travel_guide_${tableId}_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setStatus({ type: 'success', message: `表 "${label}" 已成功导出！` });
    } catch (err: any) {
      console.error('Export failed:', err);
      setStatus({ type: 'error', message: `导出表 "${label}" 失败: ` + err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleImportTable = async (event: React.ChangeEvent<HTMLInputElement>, tableId: string, label: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!confirm(`警告：还原操作可能会覆盖或更新表 "${label}" 中的现有数据。建议操作前先备份。是否继续？`)) {
      event.target.value = '';
      return;
    }

    setLoading(true);
    setStatus(null);
    setProgress(0);
    try {
      const text = await file.text();
      const rows = JSON.parse(text);
      
      if (!Array.isArray(rows)) {
        throw new Error('导入的文件格式不正确，应为 JSON 数组。');
      }

      if (rows.length > 0) {
        const batchSize = 50;
        for (let i = 0; i < rows.length; i += batchSize) {
          const batch = rows.slice(i, i + batchSize);
          const { error } = await supabaseAdmin.from(tableId).upsert(batch);
          if (error) throw error;
          setProgress(Math.round(((i + batch.length) / rows.length) * 100));
        }
      }

      setStatus({ type: 'success', message: `表 "${label}" 数据已成功恢复！` });
    } catch (err: any) {
      console.error('Import failed:', err);
      setStatus({ type: 'error', message: `恢复表 "${label}" 失败: ` + err.message });
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  const handleExportAll = async () => {
    if (!confirm('确认要导出全站备份吗？这可能需要一点时间。')) return;
    
    setLoading(true);
    setStatus(null);
    setProgress(0);
    try {
      const allData: Record<string, any> = {};
      
      for (let i = 0; i < TABLES.length; i++) {
        const table = TABLES[i];
        const { data, error } = await supabaseAdmin.from(table.id).select('*');
        if (error) throw error;
        allData[table.id] = data;
        setProgress(Math.round(((i + 1) / TABLES.length) * 100));
      }

      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `china_travel_guide_FULL_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setStatus({ type: 'success', message: '所有核心数据库表已成功全量导出！' });
    } catch (err: any) {
      console.error('Export failed:', err);
      setStatus({ type: 'error', message: '全量备份失败: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!confirm('高风险操作：此举将尝试使用备份文件覆盖全站数据。务必确保您选择的是正确的一键备份文件。是否继续？')) {
      event.target.value = '';
      return;
    }

    setLoading(true);
    setStatus(null);
    setProgress(0);
    try {
      const text = await file.text();
      const backupData = JSON.parse(text);
      
      // 按照 TABLES 定义的顺序恢复，以满足外键依赖
      const availableTablesInBackup = Object.keys(backupData);
      const tablesToProcess = TABLES.filter(t => availableTablesInBackup.includes(t.id));
      
      if (tablesToProcess.length === 0) {
        throw new Error('备份文件中未发现有效的数据表。');
      }

      let processedTables = 0;

      for (const table of tablesToProcess) {
        const rows = backupData[table.id];
        if (Array.isArray(rows) && rows.length > 0) {
          const batchSize = 50;
          for (let i = 0; i < rows.length; i += batchSize) {
            const batch = rows.slice(i, i + batchSize);
            const { error } = await supabaseAdmin.from(table.id).upsert(batch);
            if (error) throw error;
          }
        }
        processedTables++;
        setProgress(Math.round((processedTables / tablesToProcess.length) * 100));
      }

      setStatus({ type: 'success', message: `一键恢复完成！已成功同步 ${processedTables} 张表的数据。` });
    } catch (err: any) {
      console.error('Import failed:', err);
      setStatus({ type: 'error', message: '全量恢复失败: ' + err.message });
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };


  return (
    <div className="max-w-2xl mx-auto space-y-8 p-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">数据备份与恢复</h2>
        <p className="text-gray-500 mb-8">管理整个应用的核心数据，支持一键备份为 JSON 文件并在需要时恢复。</p>

        <div className="space-y-6">
          {/* Status Messages */}
          {status && (
            <div className={`p-4 rounded-xl flex items-start gap-3 ${
              status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {status.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 mt-0.5" />
              )}
              <span className="text-sm font-medium">{status.message}</span>
            </div>
          )}

          {/* Progress Bar */}
          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>处理进度</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-[#1b887a] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export Section */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">备份全部数据</h3>
              <p className="text-xs text-gray-500 mb-6">获取包含所有文章、城市、签证和设置数据的 JSON 文件。</p>
              <button
                onClick={handleExportAll}
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                开始备份
              </button>
            </div>

            {/* Import Section */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">恢复备份数据</h3>
              <p className="text-xs text-gray-500 mb-6">上传之前备份的 JSON 文件来恢复数据（小心覆盖）。</p>
              <label className="w-full py-2.5 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                选择文件恢复
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  disabled={loading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Info List */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h4 className="font-bold text-gray-800 mb-6 text-sm uppercase tracking-wider">数据表备份管理 ({TABLES.length})</h4>
        <div className="space-y-3">
          {TABLES.map(table => (
            <div key={table.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border border-gray-50 bg-gray-50/50 gap-3 group">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                <div>
                  <span className="font-bold text-gray-800 text-sm">{table.label}</span>
                  <div className="text-[10px] text-gray-400 font-mono">{table.id}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportTable(table.id, table.label)}
                  disabled={loading}
                  className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:border-blue-500 hover:text-blue-600 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  备份
                </button>
                <label className={`px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:border-orange-500 hover:text-orange-600 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <Upload className="w-3.5 h-3.5" />
                  恢复
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => handleImportTable(e, table.id, table.label)}
                    disabled={loading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
