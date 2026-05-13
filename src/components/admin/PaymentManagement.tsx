"use client";

import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Globe, Shield, Bug, ExternalLink } from 'lucide-react';

interface PlanConfig {
  product_id: string;
  url: string;
}

interface PaymentConfig {
  id: string;
  sandbox_mode: boolean;
  sandbox_url: string;
  webhook_secret: string;
  plans: Record<string, PlanConfig>;
  updated_at: string | null;
}

const PLAN_LABELS: Record<string, string> = {
  traveler: 'Traveler（10天）',
  starter_monthly: 'Starter（月付）',
  starter_yearly: 'Starter（年付）',
  pro_monthly: 'Pro（月付）',
  pro_yearly: 'Pro（年付）',
};

const DEFAULT_PLANS: Record<string, PlanConfig> = {
  traveler: { product_id: 'prod_3TVyXsKR8av0l01JAJoBrU', url: 'https://www.creem.io/payment/prod_3TVyXsKR8av0l01JAJoBrU' },
  starter_monthly: { product_id: 'prod_7YpsVCJSFtxQr3Fqhk0uHZ', url: 'https://www.creem.io/payment/prod_7YpsVCJSFtxQr3Fqhk0uHZ' },
  starter_yearly: { product_id: 'prod_2Jw6Tigcj1ydA2JxbiNLpN', url: 'https://www.creem.io/payment/prod_2Jw6Tigcj1ydA2JxbiNLpN' },
  pro_monthly: { product_id: 'prod_5O65NauyqMWA0ZtiroA9XG', url: 'https://www.creem.io/payment/prod_5O65NauyqMWA0ZtiroA9XG' },
  pro_yearly: { product_id: 'prod_268yTiuPPqD5QbnW18jo2x', url: 'https://www.creem.io/payment/prod_268yTiuPPqD5QbnW18jo2x' },
};

export default function PaymentManagement() {
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payment-config');
      const data = await res.json();
      setConfig(data.config);
    } catch (e) {
      console.error('Fetch payment config error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConfig(); }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/payment-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sandbox_mode: config.sandbox_mode,
          sandbox_url: config.sandbox_url,
          webhook_secret: config.webhook_secret,
          plans: config.plans,
        }),
      });
      const data = await res.json();
      if (data.config) {
        setConfig(data.config);
        setMessage('保存成功 ✅');
      } else {
        setMessage('保存失败: ' + (data.error || '未知错误'));
      }
    } catch (e: any) {
      setMessage('保存异常: ' + e.message);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const updatePlan = (key: string, field: 'product_id' | 'url', value: string) => {
    if (!config) return;
    setConfig({
      ...config,
      plans: {
        ...config.plans,
        [key]: { ...config.plans[key], [field]: value },
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-600" />
            支付配置
          </h2>
          <p className="text-sm text-gray-400 mt-1">管理 Creem 支付链接、沙盒模式和 Webhook</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchConfig} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            保存配置
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      {/* 沙盒模式开关 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bug className="w-5 h-5 text-yellow-600" />
            <div>
              <h3 className="font-bold text-gray-900">沙盒/测试模式</h3>
              <p className="text-xs text-gray-400">开启后前端支付按钮统一使用沙盒链接</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config?.sandbox_mode ?? true}
              onChange={e => setConfig(prev => prev ? { ...prev, sandbox_mode: e.target.checked } : prev)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            <span className="ml-3 text-sm font-medium">{config?.sandbox_mode ? '🟢 沙盒模式' : '🔴 生产模式'}</span>
          </label>
        </div>
        {config?.sandbox_mode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">沙盒统一链接</label>
            <input
              type="text"
              value={config?.sandbox_url || ''}
              onChange={e => setConfig(prev => prev ? { ...prev, sandbox_url: e.target.value } : prev)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none transition-all text-sm"
              placeholder="https://www.creem.io/test/payment/..."
            />
          </div>
        )}
      </div>

      {/* Webhook Secret */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-green-600" />
          <div>
            <h3 className="font-bold text-gray-900">Webhook Secret</h3>
            <p className="text-xs text-gray-400">Creem Dashboard → Developers → Webhook 获取</p>
          </div>
        </div>
        <input
          type="text"
          value={config?.webhook_secret || ''}
          onChange={e => setConfig(prev => prev ? { ...prev, webhook_secret: e.target.value } : prev)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none transition-all text-sm font-mono"
          placeholder="whsec_..."
        />
      </div>

      {/* 各套餐支付链接 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-bold text-gray-900">套餐支付链接</h3>
            <p className="text-xs text-gray-400">各套餐对应的 Creem 产品支付链接</p>
          </div>
        </div>
        <div className="space-y-4">
          {Object.entries(PLAN_LABELS).map(([key, label]) => (
            <div key={key} className="border border-gray-100 rounded-xl p-4">
              <h4 className="font-bold text-gray-800 mb-3 text-sm">{label}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Product ID</label>
                  <input
                    type="text"
                    value={config?.plans[key]?.product_id || ''}
                    onChange={e => updatePlan(key, 'product_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">支付链接 URL</label>
                  <input
                    type="text"
                    value={config?.plans[key]?.url || ''}
                    onChange={e => updatePlan(key, 'url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 提示 */}
      <div className="mt-6 bg-gray-50 rounded-2xl p-4 text-sm text-gray-500 leading-relaxed">
        <p className="font-bold text-gray-700 mb-1">💡 使用说明</p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>沙盒模式</strong>开启后，前端所有付费按钮统一跳转到沙盒链接（测试支付）</li>
          <li><strong>沙盒模式</strong>关闭后，使用各套餐独立的支付链接（真实支付）</li>
          <li>修改后点击"保存配置"，前端下次加载时会自动获取最新配置</li>
          <li>Product ID 需要与 webhook 路由中的 <code className="bg-gray-200 px-1 rounded">PRODUCT_PLAN_MAP</code> 保持一致</li>
        </ul>
      </div>
    </div>
  );
}
