"use client";

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ChevronDown, ChevronUp, Sparkles, Copy, Check, Star, Flame, Droplets, TreePine, Mountain, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CharAnalysis {
  char: string;
  pinyin: string;
  meaning: string;
  wuxing: string;
  source: string;
}

interface NameResult {
  chinese: string;
  surname: string;
  givenName: string;
  pinyin: string;
  wuxing: {
    element: string;
    explanation: string;
  };
  zodiac: string;
  luckyNumber: string;
  meaning: string;
  charAnalysis: CharAnalysis[];
  whyFit: string;
}

interface NameResponse {
  names: NameResult[];
}

const WUXING_CONFIG: Record<string, { icon: typeof Flame; color: string; bg: string; border: string; label: string }> = {
  '金': { icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Metal' },
  '木': { icon: TreePine, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Wood' },
  '水': { icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Water' },
  '火': { icon: Flame, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Fire' },
  '土': { icon: Mountain, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Earth' },
};

export default function NameGenerator({ skipHero }: { skipHero?: boolean }) {
  const { t, language } = useLanguage();
  const isZh = language === 'zh';
  const [formData, setFormData] = useState({ name: '', sex: '男', dob: '', info: '' });
  const [results, setResults] = useState<NameResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);
    try {
      const response = await fetch('/api/name-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          sex: formData.sex,
          dob: formData.dob,
          info: formData.info,
          lang: language,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${response.status}`);
      }

      const data: NameResponse = await response.json();
      if (data.names && data.names.length > 0) {
        setResults(data.names);
      } else {
        throw new Error(isZh ? '未生成名字' : 'No names generated');
      }
    } catch (error: any) {
      console.error(error);
      alert(isZh ? `生成失败: ${error.message}` : `Generation failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {}
  };

  const getWuxingConfig = (element: string) => {
    const key = element.replace(/[金木水火土]/g, m => m);
    return WUXING_CONFIG[key] || WUXING_CONFIG['金'];
  };

  return (
    <>
      <div className="bg-[#f7f7f7] min-h-screen">

        {/* Hero Section */}
        {!skipHero && (
          <div
            className="relative h-[300px] w-full flex items-center pt-16"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1543097692-fa13c6cd8595?q=80&w=2670&auto=format&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('tools.name.title')}</h1>
              <p className="text-lg text-white/90">{t('tools.name.subtitle')}</p>
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-12 mt-10 relative z-20">

          {/* Generator Form */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">{t('tools.name.formTitle')}</h2>
              <p className="text-gray-500 text-sm mt-1">{t('tools.name.formSubtitle')}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                    <svg className="w-4 h-4 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {t('tools.name.label.name')}
                  </label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1b887a] focus:border-transparent outline-none transition" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder={t('tools.name.label.namePlaceholder')} required />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                    <svg className="w-4 h-4 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4a4 4 0 100 8 4 4 0 000-8z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7m-3-3h6" />
                    </svg>
                    {t('tools.name.label.gender')}
                  </label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1b887a] focus:border-transparent outline-none transition bg-white" value={formData.sex} onChange={e => setFormData({ ...formData, sex: e.target.value })}>
                    <option value="">{t('tools.name.label.genderSelect')}</option>
                    <option value="男">{t('tools.name.label.genderMale')}</option>
                    <option value="女">{t('tools.name.label.genderFemale')}</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                    <svg className="w-4 h-4 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {t('tools.name.label.dob')}
                  </label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1b887a] focus:border-transparent outline-none transition" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
                </div>
              </div>
              <div className="mb-4">
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <svg className="w-4 h-4 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t('tools.name.label.info')}
                </label>
                <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1b887a] focus:border-transparent outline-none transition resize-none" rows={3} value={formData.info} onChange={e => setFormData({ ...formData, info: e.target.value })} placeholder={t('tools.name.label.infoPlaceholder')}></textarea>
              </div>
              <button type="submit" className="w-full bg-[#1b887a] hover:bg-[#167a6a] text-white rounded-lg py-3.5 font-bold text-base transition flex items-center justify-center gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('tools.name.buttonLoading')}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {t('tools.name.button')}
                  </>
                )}
              </button>
            </form>

            {/* AI Results */}
            <AnimatePresence>
              {results && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-8 space-y-4"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-[#1b887a]" />
                    <h3 className="text-lg font-bold text-gray-900">
                      {isZh ? 'AI 为您推荐的名字' : 'AI Recommended Names for You'}
                    </h3>
                  </div>

                  {results.map((nameResult, idx) => {
                    const wuxingCfg = getWuxingConfig(nameResult.wuxing?.element || '金');
                    const WuxingIcon = wuxingCfg.icon;
                    const isExpanded = expandedCard === idx;

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.15 }}
                        className={`rounded-2xl border-2 overflow-hidden transition-all ${idx === 0 ? 'border-[#1b887a]/30 bg-gradient-to-br from-[#1b887a]/5 to-white' : 'border-gray-100 bg-white'}`}
                      >
                        {/* Header - Name Display */}
                        <div
                          className="p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                          onClick={() => setExpandedCard(isExpanded ? null : idx)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                              {/* Rank Badge */}
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${idx === 0 ? 'bg-gradient-to-br from-[#1b887a] to-[#0d6b5e]' : idx === 1 ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-purple-500 to-purple-600'}`}>
                                {idx === 0 ? '★' : idx + 1}
                              </div>
                              {/* Chinese Name */}
                              <div>
                                <div className="flex items-center gap-3">
                                  <span className="text-3xl font-black text-gray-900 tracking-wider">{nameResult.chinese}</span>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleCopy(nameResult.chinese, idx); }}
                                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-[#1b887a]"
                                    title={isZh ? '复制' : 'Copy'}
                                  >
                                    {copiedIdx === idx ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                  </button>
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-sm text-gray-500 font-medium">{nameResult.pinyin}</span>
                                  {nameResult.zodiac && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100 font-medium">
                                      {isZh ? '生肖' : 'Zodiac'}: {nameResult.zodiac}
                                    </span>
                                  )}
                                  {nameResult.luckyNumber && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 font-medium">
                                      {isZh ? '幸运数字' : 'Lucky'}: {nameResult.luckyNumber}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* Wu Xing Badge */}
                            {nameResult.wuxing?.element && (
                              <div className={`${wuxingCfg.bg} ${wuxingCfg.border} border rounded-xl px-3 py-2 flex items-center gap-2 flex-shrink-0`}>
                                <WuxingIcon className={`w-5 h-5 ${wuxingCfg.color}`} />
                                <span className={`font-bold text-sm ${wuxingCfg.color}`}>{nameResult.wuxing.element}</span>
                              </div>
                            )}
                          </div>

                          {/* Brief Meaning */}
                          <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-2">{nameResult.meaning}</p>

                          {/* Expand Toggle */}
                          <div className="flex items-center justify-center mt-3">
                            <span className="text-xs text-[#1b887a] font-medium flex items-center gap-1">
                              {isExpanded ? (isZh ? '收起详情' : 'Hide details') : (isZh ? '查看详情' : 'View details')}
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </span>
                          </div>
                        </div>

                        {/* Expanded Detail */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
                                {/* Character Analysis */}
                                {nameResult.charAnalysis && nameResult.charAnalysis.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                                      <Zap className="w-4 h-4 text-[#1b887a]" />
                                      {isZh ? '逐字解析' : 'Character Analysis'}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {nameResult.charAnalysis.map((char, cIdx) => {
                                        const charWuxing = getWuxingConfig(char.wuxing || '金');
                                        const CharIcon = charWuxing.icon;
                                        return (
                                          <div key={cIdx} className={`${charWuxing.bg} border ${charWuxing.border} rounded-xl p-4`}>
                                            <div className="flex items-center gap-3 mb-2">
                                              <span className="text-2xl font-black text-gray-900">{char.char}</span>
                                              <div>
                                                <span className="text-sm font-medium text-gray-700">{char.pinyin}</span>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                  <CharIcon className={`w-3 h-3 ${charWuxing.color}`} />
                                                  <span className={`text-xs font-medium ${charWuxing.color}`}>{char.wuxing}</span>
                                                </div>
                                              </div>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-1">{char.meaning}</p>
                                            {char.source && char.source !== '无特定出处' && char.source !== 'No specific source' && (
                                              <p className="text-xs text-gray-400 italic">{isZh ? '出处' : 'Source'}: {char.source}</p>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* Wu Xing Explanation */}
                                {nameResult.wuxing?.explanation && (
                                  <div className={`${wuxingCfg.bg} border ${wuxingCfg.border} rounded-xl p-4`}>
                                    <div className="flex items-center gap-2 mb-2">
                                      <WuxingIcon className={`w-5 h-5 ${wuxingCfg.color}`} />
                                      <span className="font-bold text-gray-700">
                                        {isZh ? '五行解析' : 'Five Elements Analysis'} · {nameResult.wuxing.element}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">{nameResult.wuxing.explanation}</p>
                                  </div>
                                )}

                                {/* Why Fit */}
                                {nameResult.whyFit && (
                                  <div className="bg-gradient-to-r from-[#1b887a]/5 to-[#1b887a]/10 border border-[#1b887a]/20 rounded-xl p-4">
                                    <h4 className="font-bold text-[#1b887a] mb-2 flex items-center gap-1.5">
                                      <Star className="w-4 h-4" />
                                      {isZh ? '为什么适合您' : 'Why This Name Fits You'}
                                    </h4>
                                    <p className="text-sm text-gray-700 leading-relaxed">{nameResult.whyFit}</p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}

                  {/* Regenerate Hint */}
                  <p className="text-center text-xs text-gray-400 pt-2">
                    {isZh ? '💡 不满意？修改信息后重新生成，AI 会为您推荐不同的名字' : '💡 Not satisfied? Modify your info and generate again for different suggestions'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Why */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t('tools.name.whyTitle')}</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-4">
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2">{t('tools.name.whyBasicTitle')}</h3>
                  <p className="text-sm text-gray-600 mb-3">{t('tools.name.whyBasicDesc')}</p>
                  <ul className="space-y-2">
                    {[
                      t('tools.name.whyBasic1'),
                      t('tools.name.whyBasic2'),
                      t('tools.name.whyBasic3')
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-[#1b887a] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2">{t('tools.name.whyBeyondTitle')}</h3>
                  <p className="text-sm text-gray-600 mb-3">{t('tools.name.whyBeyondDesc')}</p>
                  <ul className="space-y-2">
                    {[
                      t('tools.name.whyBeyond1'),
                      t('tools.name.whyBeyond2'),
                      t('tools.name.whyBeyond3')
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-[#1b887a] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">{t('tools.name.structureTitle')}</h3>
                <p className="text-sm text-gray-600 mb-4">{t('tools.name.structureDesc')}</p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#1b887a]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{t('tools.name.structure.surname')}</p>
                      <p className="text-xs text-gray-500">{t('tools.name.structure.surnameDesc')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#1b887a]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{t('tools.name.structure.givenName')}</p>
                      <p className="text-xs text-gray-500">{t('tools.name.structure.givenNameDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">{t('tools.name.howTitle')}</h2>
            <p className="text-gray-500 text-center mb-8">{t('tools.name.howSubtitle')}</p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-100 text-center">
                <div className="w-12 h-12 bg-[#1b887a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t('tools.name.howStep1Title')}</h3>
                <p className="text-sm text-gray-500">{t('tools.name.howStep1Desc')}</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100 text-center">
                <div className="w-12 h-12 bg-[#1b887a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t('tools.name.howStep2Title')}</h3>
                <p className="text-sm text-gray-500">{t('tools.name.howStep2Desc')}</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100 text-center">
                <div className="w-12 h-12 bg-[#1b887a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t('tools.name.howStep3Title')}</h3>
                <p className="text-sm text-gray-500">{t('tools.name.howStep3Desc')}</p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-center">{t('tools.name.faqTitle')}</h2>
            <div className="bg-white p-6 rounded shadow-sm border space-y-4">
              {[0, 1, 2, 3, 4].map((faqIdx) => (
                <div key={faqIdx}>
                  {expandedFaq === faqIdx && <p className="text-gray-600 text-sm mb-2">{t(`tools.name.faq.a${faqIdx + 1}`)}</p>}
                  <button className="w-full text-left flex justify-between items-center border-b pb-2" onClick={() => setExpandedFaq(expandedFaq === faqIdx ? null : faqIdx)}>
                    {t(`tools.name.faq.q${faqIdx + 1}`)} {expandedFaq === faqIdx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Case Studies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">{t('tools.name.caseTitle')}</h2>
            <p className="text-gray-500 text-center mb-8">{t('tools.name.caseSubtitle')}</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: "진나래", cn: "金芮琳", py: "Jīn Ruì Lín" },
                { name: "Мубарак Диана", cn: "穆迪娅", py: "Mù Dí Yà" },
                { name: "Мейрамбекова Балжан", cn: "梅兰珍", py: "Méi Lán Zhēn" },
                { name: "박시호 siho park", cn: "朴诗涵", py: "Pǔ Shī Hán" },
                { name: "민은율", cn: "闵恩律", py: "Mǐn Ēn Lǜ" },
                { name: "송의담", cn: "宋奕丹", py: "Sòng Yì Dān" },
                { name: "Abdul Kader. BAYNES", cn: "白凯哲", py: "Bái Kǎi Zhé" },
                { name: "Mulberry Rain", cn: "祁雨盈", py: "Qí Yǔ Yíng" },
                { name: "Mulberry Rain", cn: "祁雨琳", py: "Qí Yǔ Lín" },
                { name: "Aurora Klesh E. Barrios", cn: "柏若曦", py: "Bǎi Ruò Xī" }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-400 truncate mb-1">{item.name}</p>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 bg-[#1b887a] rounded-full"></span>
                    <p className="font-bold text-lg text-gray-900">{item.cn}</p>
                  </div>
                  <p className="text-xs text-gray-400">{item.py}</p>
                </div>
              ))}
            </div>
          </section>

          {/* More Tools */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('tools.name.moreTitle')}</h2>
            <p className="text-gray-500 mb-8">{t('tools.name.moreSubtitle')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-10 h-10 bg-[#1b887a]/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{isZh ? '中文转拼音' : 'Pinyin Converter'}</h3>
                <p className="text-sm text-gray-500">{isZh ? '可将任何中文转换为标准拼音，查看每个字的笔画和分词。' : 'Convert any Chinese to standard pinyin, view strokes and segmentation.'}</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-10 h-10 bg-[#1b887a]/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{isZh ? '中文字符计数器' : 'Chinese Character Counter'}</h3>
                <p className="text-sm text-gray-500">{isZh ? '精确统计汉字、英文、数字、标点、行数与总字符数。' : 'Accurately count Chinese characters, English, numbers, punctuation, lines and total characters.'}</p>
              </div>
            </div>
          </section>

          {/* Articles */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{t('tools.name.articleTitle')}</h2>
              <a href="#" className="text-[#1b887a] text-sm hover:underline">{t('tools.name.articleMore')}</a>
            </div>
            <p className="text-gray-500 mb-8">{t('tools.name.articleDesc')}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: isZh ? '中国复姓大盘点：探秘十大顶级复姓的起源和故事' : 'Top 10 Chinese Compound Surnames', desc: isZh ? '深度解读欧阳、诸葛、上官、司马等十大顶级复姓的起源故事。' : 'Explore the profound compound surname culture of China.' },
                { title: isZh ? '中国孩子取名趋势大盘点：男孩名霸气，女孩名温柔？' : 'Chinese Baby Naming Trends', desc: isZh ? '揭秘中国名字的时代变迁：从60年代的"建国"到20年代的"瑞泽""沐瑶"。' : 'Discover the evolution of Chinese names from the 1960s to 2020s.' },
                { title: isZh ? '有趣的中文名：揭秘欧美明星在中国的外号从何而来？' : 'How Western Celebrities Got Their Chinese Nicknames', desc: isZh ? '探索中国网民如何用谐音、直译和幕后故事为国际明星创造中文昵称。' : 'Explore how Chinese netizens create Chinese nicknames for international stars.' }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <div className="h-40 bg-gradient-to-br from-[#1b887a] to-[#2a9d8f]"></div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-3 mb-3">{item.desc}</p>
                    <a href="#" className="text-[#1b887a] text-xs hover:underline">{t('tools.name.articleMoreLink')}</a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
