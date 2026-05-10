"use client";


"use client";

import React, { useState } from 'react';
import { askDeepSeek } from '../../lib/deepseek';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function NameGenerator({ skipHero }: { skipHero?: boolean }) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({ name: '', sex: '男', dob: '', info: '' });
  const [generatedName, setGeneratedName] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const prompt = `You are a professional Chinese name generator. Generate a meaningful Chinese name based on: Name: ${formData.name}, Sex: ${formData.sex}, DOB: ${formData.dob}, Extra Info: ${formData.info}. Return just the Chinese name, nothing else.`;
      const response = await askDeepSeek(prompt);
      setGeneratedName(response?.trim() || '');
    } catch (error) {
      console.error(error);
      alert(language === 'zh' ? '生成失败' : 'Failed to generate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
<div className="bg-[#f7f7f7] min-h-screen">
      
      {/* Hero Section - skipped when rendered by SSR NameGenHero component */}
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
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1b887a] focus:border-transparent outline-none transition" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder={t('tools.name.label.namePlaceholder')} required />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                    <svg className="w-4 h-4 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4a4 4 0 100 8 4 4 0 000-8z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7m-3-3h6" />
                    </svg>
                    {t('tools.name.label.gender')}
                  </label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1b887a] focus:border-transparent outline-none transition bg-white" value={formData.sex} onChange={e => setFormData({...formData, sex: e.target.value})}>
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
                  <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1b887a] focus:border-transparent outline-none transition" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                </div>
            </div>
            <div className="mb-4">
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                <svg className="w-4 h-4 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('tools.name.label.info')}
              </label>
              <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1b887a] focus:border-transparent outline-none transition resize-none" rows={3} value={formData.info} onChange={e => setFormData({...formData, info: e.target.value})} placeholder={t('tools.name.label.infoPlaceholder')}></textarea>
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  {t('tools.name.button')}
                </>
              )}
            </button>
          </form>
            {generatedName && (
                <div className="mt-6 p-4 bg-green-50 rounded text-xl text-[#1b887a] font-bold border border-green-200">
                    <p>{t('tools.name.resultPrefix')}</p>
                    <p className="text-2xl mt-2">{generatedName}</p>
                </div>
            )}
        </div>
        
        {/* Why */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t('tools.name.whyTitle')}</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            {/* Left Column: Basic Principles + Beyond Translation */}
            <div className="md:col-span-2 space-y-4">
              {/* Basic Principles */}
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
              
              {/* Beyond Translation */}
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
            
            {/* Right Column: Structure of Chinese Names */}
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
                {expandedFaq === 0 && <p className="text-gray-600 text-sm mb-2">{t('tools.name.faq.a1')}</p>}
                <button className="w-full text-left flex justify-between items-center border-b pb-2" onClick={() => setExpandedFaq(expandedFaq === 0 ? null : 0)}>
                    {t('tools.name.faq.q1')} {expandedFaq === 0 ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>
                
                {expandedFaq === 1 && <p className="text-gray-600 text-sm mb-2">{t('tools.name.faq.a2')}</p>}
                <button className="w-full text-left flex justify-between items-center border-b pb-2" onClick={() => setExpandedFaq(expandedFaq === 1 ? null : 1)}>
                   {t('tools.name.faq.q2')} {expandedFaq === 1 ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>

                {expandedFaq === 2 && <p className="text-gray-600 text-sm mb-2">{t('tools.name.faq.a3')}</p>}
                <button className="w-full text-left flex justify-between items-center border-b pb-2" onClick={() => setExpandedFaq(expandedFaq === 2 ? null : 2)}>
                   {t('tools.name.faq.q3')} {expandedFaq === 2 ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>

                {expandedFaq === 3 && <p className="text-gray-600 text-sm mb-2">{t('tools.name.faq.a4')}</p>}
                <button className="w-full text-left flex justify-between items-center border-b pb-2" onClick={() => setExpandedFaq(expandedFaq === 3 ? null : 3)}>
                   {t('tools.name.faq.q4')} {expandedFaq === 3 ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>
                
                {expandedFaq === 4 && <p className="text-gray-600 text-sm mb-2">{t('tools.name.faq.a5')}</p>}
                <button className="w-full text-left flex justify-between items-center border-b pb-2" onClick={() => setExpandedFaq(expandedFaq === 4 ? null : 4)}>
                   {t('tools.name.faq.q5')} {expandedFaq === 4 ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>
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
              <h3 className="font-bold text-gray-900 mb-1">{language === 'zh' ? '中文转拼音' : 'Pinyin Converter'}</h3>
              <p className="text-sm text-gray-500">{language === 'zh' ? '可将任何中文转换为标准拼音，查看每个字的笔画和分词。' : 'Convert any Chinese to standard pinyin, view strokes and segmentation.'}</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-10 h-10 bg-[#1b887a]/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{language === 'zh' ? '中文字符计数器' : 'Chinese Character Counter'}</h3>
              <p className="text-sm text-gray-500">{language === 'zh' ? '精确统计汉字、英文、数字、标点、行数与总字符数。' : 'Accurately count Chinese characters, English, numbers, punctuation, lines and total characters.'}</p>
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
              { title: language === 'zh' ? '中国复姓大盘点：探秘十大顶级复姓的起源和故事，深度解读中国复姓文化' : 'Top 10 Chinese Compound Surnames', desc: language === 'zh' ? '中国不仅有百家姓，更有底蕴深厚的复姓文化。本文深度解读欧阳、诸葛、上官、司马等十大顶级复姓的起源故事、历史名人及文化内涵。文中不仅涵盖了按官职、封地分类的复姓演变，还提供了现存复姓省份分布，是您了...' : 'Explore the profound compound surname culture of China, including the origins of Ouyang, Zhuge, Shangguan, Sima and more.' },
              { title: language === 'zh' ? '中国孩子取名趋势大盘点：男孩名霸气，女孩名温柔？当代父母如何给自己的孩子取名？' : 'Chinese Baby Naming Trends', desc: language === 'zh' ? '揭秘中国名字的时代变迁：从60年代的"建国"到20年代的"瑞泽""沐瑶"。了解中国父母的命名趋势，如何从《诗经》、古籍中为孩子取一个既有文化底蕴、又不过时、不重名的好中文名字（含10个男孩名和10个女孩名推荐）。' : 'Discover the evolution of Chinese names from the 1960s to 2020s, and learn naming trends from the Book of Songs.' },
              { title: language === 'zh' ? '有趣的中文名：揭秘欧美明星在中国的外号从何而来？' : 'Interesting Chinese Names: How Western Celebrities Got Their Chinese Nicknames', desc: language === 'zh' ? '探索中国网民如何用谐音、直译和幕后故事为国际明星创造幽默且亲昵的中文昵称。了解Taylor Swift、Ed Sheeran等名字背后的语言学和文化趣事。' : 'Explore how Chinese netizens create humorous and affectionate Chinese nicknames for international stars.' }
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
