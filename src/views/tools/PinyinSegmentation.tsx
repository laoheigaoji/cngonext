"use client";

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ChevronDown, BookOpen, Mic, Type, PenTool, Languages, Sparkles, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PinyinSegmentation = () => {
    const { language, t } = useLanguage();
    const [text, setText] = useState('');
    const [result, setResult] = useState('');
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [openSection, setOpenSection] = useState<string | null>('whatIsPinyin');

    const analyze = () => {
        setResult(`${t('tools.pinyin.result')} ${text.split('').join(' ')}`);
    };

    const guideSections = [
        { id: 'whatIsPinyin', icon: BookOpen },
        { id: 'toneMarks', icon: Mic },
        { id: 'howToUse', icon: Type },
        { id: 'segmentation', icon: Sparkles },
        { id: 'strokeOrder', icon: PenTool },
    ];

    const features = [
        { icon: Type, titleKey: 'tools.pinyin.guide.featurePinyin', descKey: 'tools.pinyin.guide.featurePinyinDesc' },
        { icon: Sparkles, titleKey: 'tools.pinyin.guide.featureSegment', descKey: 'tools.pinyin.guide.featureSegmentDesc' },
        { icon: PenTool, titleKey: 'tools.pinyin.guide.featureStroke', descKey: 'tools.pinyin.guide.featureStrokeDesc' },
        { icon: Languages, titleKey: 'tools.pinyin.guide.featureTranslate', descKey: 'tools.pinyin.guide.featureTranslateDesc' },
        { icon: Mic, titleKey: 'tools.pinyin.guide.featureVoice', descKey: 'tools.pinyin.guide.featureVoiceDesc' },
    ];

    const toneRows = [
        { tone: 'tools.pinyin.guide.tone1', example: 'ā', desc: 'tools.pinyin.guide.tone1Desc' },
        { tone: 'tools.pinyin.guide.tone2', example: 'á', desc: 'tools.pinyin.guide.tone2Desc' },
        { tone: 'tools.pinyin.guide.tone3', example: 'ǎ', desc: 'tools.pinyin.guide.tone3Desc' },
        { tone: 'tools.pinyin.guide.tone4', example: 'à', desc: 'tools.pinyin.guide.tone4Desc' },
        { tone: 'tools.pinyin.guide.toneNeutral', example: 'a', desc: 'tools.pinyin.guide.toneNeutralDesc' },
    ];

    const faqs = [
        { q: 'tools.pinyin.guide.faq1Q', a: 'tools.pinyin.guide.faq1A' },
        { q: 'tools.pinyin.guide.faq2Q', a: 'tools.pinyin.guide.faq2A' },
        { q: 'tools.pinyin.guide.faq3Q', a: 'tools.pinyin.guide.faq3A' },
        { q: 'tools.pinyin.guide.faq4Q', a: 'tools.pinyin.guide.faq4A' },
        { q: 'tools.pinyin.guide.faq5Q', a: 'tools.pinyin.guide.faq5A' },
    ];

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900">
            {/* Hero Section */}
            <div 
                className="relative h-[340px] flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: 'url(https://static.tripcngo.com/ing/banner_bg_1.jpg)' }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/40" />
                <div className="relative text-center px-6 max-w-3xl mx-auto">
                    <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">{t('tools.pinyin.guide.heroTitle')}</h1>
                    <p className="text-white/80 text-lg font-medium leading-relaxed">{t('tools.pinyin.guide.heroDesc')}</p>
                </div>
            </div>

            <main className="pb-16 max-w-4xl mx-auto px-6 mt-12 space-y-12">
                {/* Tool Section */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
                    <textarea 
                        className="w-full h-40 p-6 border border-neutral-200 rounded-xl mb-6 focus:ring-2 focus:ring-neutral-900 outline-none transition text-lg"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={t('tools.pinyin.inputPlaceholder')}
                    />
                    <button 
                        className="w-full bg-neutral-900 text-white py-4 rounded-xl font-bold hover:bg-neutral-800 transition"
                        onClick={analyze}
                    >
                        {t('tools.pinyin.button')}
                    </button>
                    
                    {result && (
                        <div className="mt-8 p-6 bg-neutral-100 rounded-2xl">
                            <p className="text-neutral-900 font-medium">{result}</p>
                        </div>
                    )}
                </section>

                {/* Features Grid */}
                <section>
                    <h2 className="text-2xl font-bold mb-8 text-center">{t('tools.pinyin.guide.featuresTitle')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((f, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center mb-4">
                                    <f.icon className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-bold mb-2">{t(f.titleKey)}</h3>
                                <p className="text-sm text-neutral-500 leading-relaxed">{t(f.descKey)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Guide Sections - Accordion */}
                <section>
                    <h2 className="text-2xl font-bold mb-8 text-center">{t('tools.pinyin.guide.guideTitle')}</h2>
                    <div className="space-y-3">
                        {guideSections.map((section) => (
                            <div key={section.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                                <button
                                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-neutral-50 transition-all"
                                    onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center">
                                            <section.icon className="w-4 h-4 text-neutral-700" />
                                        </div>
                                        <span className="font-bold text-base">{t(`tools.pinyin.guide.${section.id}`)}</span>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-neutral-300 transition-transform ${openSection === section.id ? 'rotate-180 text-neutral-700' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {openSection === section.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 text-neutral-600 leading-relaxed space-y-4">
                                                {section.id === 'whatIsPinyin' && (
                                                    <>
                                                        <p>{t('tools.pinyin.guide.whatIsPinyinDesc')}</p>
                                                    </>
                                                )}
                                                {section.id === 'toneMarks' && (
                                                    <>
                                                        <p className="mb-4">{t('tools.pinyin.guide.toneIntro')}</p>
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full text-sm">
                                                                <thead>
                                                                    <tr className="border-b border-neutral-100">
                                                                        <th className="py-3 px-4 text-left font-bold">{t('tools.pinyin.guide.toneCol')}</th>
                                                                        <th className="py-3 px-4 text-left font-bold">{t('tools.pinyin.guide.symbolCol')}</th>
                                                                        <th className="py-3 px-4 text-left font-bold">{t('tools.pinyin.guide.descCol')}</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {toneRows.map((row, i) => (
                                                                        <tr key={i} className="border-b border-neutral-50">
                                                                            <td className="py-3 px-4 font-medium">{t(row.tone)}</td>
                                                                            <td className="py-3 px-4 text-2xl text-neutral-900 font-mono">{row.example}</td>
                                                                            <td className="py-3 px-4 text-neutral-500">{t(row.desc)}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </>
                                                )}
                                                {section.id === 'howToUse' && (
                                                    <div className="space-y-3">
                                                        {[1,2,3,4,5].map(n => (
                                                            <div key={n} className="flex gap-3 items-start">
                                                                <span className="flex-shrink-0 w-6 h-6 bg-neutral-900 text-white rounded-full flex items-center justify-center text-xs font-bold">{n}</span>
                                                                <p>{t(`tools.pinyin.guide.step${n}`)}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {section.id === 'segmentation' && (
                                                    <>
                                                        <p>{t('tools.pinyin.guide.segmentDesc')}</p>
                                                        <div className="bg-neutral-50 p-4 rounded-xl mt-3">
                                                            <p className="text-sm"><span className="font-bold text-neutral-900">{t('tools.pinyin.guide.segmentExample')}</span> {t('tools.pinyin.guide.segmentExampleDesc')}</p>
                                                        </div>
                                                    </>
                                                )}
                                                {section.id === 'strokeOrder' && (
                                                    <>
                                                        <p>{t('tools.pinyin.guide.strokeDesc')}</p>
                                                        <div className="space-y-2 mt-3">
                                                            {[1,2,3].map(n => (
                                                                <div key={n} className="flex gap-2 items-center">
                                                                    <span className="w-2 h-2 bg-neutral-400 rounded-full flex-shrink-0"></span>
                                                                    <span className="text-sm">{t(`tools.pinyin.guide.strokeRule${n}`)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQ Section */}
                <section>
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <HelpCircle className="w-6 h-6 text-neutral-400" />
                        <h2 className="text-2xl font-bold">{t('tools.pinyin.guide.faqTitle')}</h2>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((f, i) => (
                            <div key={i} className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm">
                                <button 
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-neutral-50 transition-all"
                                >
                                    <span className="font-bold text-base text-neutral-800">{t(f.q)}</span>
                                    <ChevronDown className={`w-5 h-5 text-neutral-300 transition-transform flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-180 text-neutral-700' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-5 text-neutral-600 leading-relaxed text-sm">
                                                {t(f.a)}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default PinyinSegmentation;
