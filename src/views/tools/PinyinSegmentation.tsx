"use client";

import React, { useState, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ChevronDown, BookOpen, Mic, Type, PenTool, Languages, Sparkles, HelpCircle, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import dynamic from 'next/dynamic';

const CharDetailModal = dynamic(() => import('./CharDetailModal'), { ssr: false });

interface PinyinSegmentationProps {
    skipHero?: boolean;
    translations?: Record<string, string>;
}

interface WordSegment {
    text: string;
    pinyin: string;
    charDetails?: { char: string; pinyin: string; definition: string; tone: number }[];
}

interface SelectedChar {
    char: string;
    pinyin: string;
    definition: string;
    tone: number;
}

const PinyinSegmentation = ({ skipHero, translations }: PinyinSegmentationProps) => {
    const { language, t } = useLanguage();

    // Prefer SSR translations from messages/xx.json, fallback to LanguageContext
    const tt = (key: string): string => {
        if (translations && translations[key] && translations[key] !== key) {
            return translations[key];
        }
        return t(key);
    };

    const [text, setText] = useState('');
    const [translation, setTranslation] = useState('');
    const [fullPinyin, setFullPinyin] = useState('');
    const [segments, setSegments] = useState<WordSegment[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [openSection, setOpenSection] = useState<string | null>('whatIsPinyin');
    const [selectedChar, setSelectedChar] = useState<SelectedChar | null>(null);

    // Preload speech synthesis voices
    React.useEffect(() => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) return;
        };
        loadVoices();
        window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
        return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    }, []);

    const analyze = async () => {
        if (!text.trim()) return;
        
        setIsAnalyzing(true);
        setErrorMsg('');
        setSegments([]);
        setTranslation('');
        setFullPinyin('');

        try {
            const res = await fetch('/api/pinyin-analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text.trim(), lang: language }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMsg(data.error || 'Analysis failed');
                return;
            }

            if (data.segments && Array.isArray(data.segments)) {
                setSegments(data.segments);
            }
            if (data.translation) {
                setTranslation(data.translation);
            }
            if (data.fullPinyin) {
                setFullPinyin(data.fullPinyin);
            }
        } catch (err: any) {
            setErrorMsg(err.message || 'Network error');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const speakText = (textToSpeak: string, lang?: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            const hasChinese = /[\u4e00-\u9fa5]/.test(textToSpeak);
            utterance.lang = lang || (hasChinese ? 'zh-CN' : 'en-US');
            utterance.rate = 0.9;
            const voices = window.speechSynthesis.getVoices();
            const matchedVoice = voices.find(v => v.lang.startsWith(utterance.lang));
            if (matchedVoice) utterance.voice = matchedVoice;
            window.speechSynthesis.speak(utterance);
        }
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
            {/* Hero Section - skipped when rendered by SSR PinyinHero component */}
            {!skipHero && (
            <div 
                className="relative h-[340px] flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: 'url(https://static.tripcngo.com/ing/banner_bg_1.jpg)' }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/40" />
                <div className="relative text-center px-6 max-w-3xl mx-auto">
                    <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">{tt('tools.pinyin.guide.heroTitle')}</h1>
                    <p className="text-white/80 text-lg font-medium leading-relaxed">{tt('tools.pinyin.guide.heroDesc')}</p>
                </div>
            </div>
            )}

            <main className="pb-16 max-w-4xl mx-auto px-6 mt-12 space-y-12">
                {/* Tool Section - New Card Style */}
                <section className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                    {/* Input Area */}
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-bold text-gray-900">{tt('tools.pinyin.inputPlaceholder').replace('...', '')}</h3>
                            <span className="text-sm text-gray-400">{text.length}/120</span>
                        </div>
                        <textarea 
                            className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-[#1b887a] focus:border-transparent outline-none transition text-base resize-none"
                            value={text}
                            onChange={(e) => setText(e.target.value.slice(0, 120))}
                            placeholder={tt('tools.pinyin.inputPlaceholder')}
                        />
                        <button 
                            className="w-full bg-[#1b887a] text-white py-3.5 rounded-xl font-bold hover:bg-[#167a6a] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={analyze}
                            disabled={isAnalyzing || !text.trim()}
                        >
                            {isAnalyzing ? (
                                <>
                                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    {tt('tools.pinyin.button')}...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    {tt('tools.pinyin.button')}
                                </>
                            )}
                        </button>
                    </div>

                    {/* Error Message */}
                    {errorMsg && (
                        <div className="mx-6 mb-4 p-4 bg-red-50 rounded-xl border border-red-200 text-red-700 text-sm">
                            {errorMsg}
                        </div>
                    )}

                    {/* Full Pinyin */}
                    {fullPinyin && (
                        <div className="mx-6 mb-4 p-4 bg-[#e8f5f2] rounded-xl border border-[#c8e8e0]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-[#1b887a] font-semibold mb-1 uppercase tracking-wide">Pinyin</div>
                                    <div className="text-gray-900 font-medium text-lg">{fullPinyin}</div>
                                </div>
                                <button 
                                    onClick={() => speakText(text, 'zh-CN')}
                                    className="w-10 h-10 bg-[#1b887a] rounded-full flex items-center justify-center hover:bg-[#167a6a] transition flex-shrink-0 ml-3"
                                    title="Play Chinese"
                                >
                                    <Volume2 className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Translation Area */}
                    {translation && (
                        <div className="mx-6 mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wide">Translation</div>
                                    <div className="text-gray-900 font-medium text-lg">{translation}</div>
                                </div>
                                <button 
                                    onClick={() => speakText(translation, 'en-US')}
                                    className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition flex-shrink-0 ml-3"
                                    title="Play English"
                                >
                                    <Volume2 className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Segmentation Result - Word Cards */}
                    {segments.length > 0 && (
                        <div className="px-6 pb-6">
                            <div className="text-sm font-bold text-gray-900 mb-3">{tt('tools.pinyin.result')}</div>
                            <div className="flex flex-wrap gap-3">
                                {segments.map((seg, i) => {
                                    const chars = seg.text.split('');
                                    const pinyinParts = seg.pinyin.split(/\s+/);
                                    const details = seg.charDetails;

                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: i * 0.05 }}
                                            className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            {chars.map((c, ci) => {
                                                const isChinese = /[\u4e00-\u9fa5]/.test(c);
                                                const charPinyin = details?.[ci]?.pinyin || pinyinParts[ci] || '';
                                                const charDef = details?.[ci]?.definition || '';
                                                const charTone = details?.[ci]?.tone || 0;

                                                return (
                                                    <button
                                                        key={ci}
                                                        className={`flex flex-col items-center px-3 py-2.5 min-w-[44px] transition-colors ${
                                                            isChinese ? 'hover:bg-[#e8f5f2] cursor-pointer' : 'cursor-default'
                                                        }`}
                                                        onClick={() => {
                                                            if (isChinese) {
                                                                setSelectedChar({
                                                                    char: c,
                                                                    pinyin: charPinyin,
                                                                    definition: charDef,
                                                                    tone: charTone,
                                                                });
                                                            }
                                                        }}
                                                        title={isChinese ? `View stroke order for ${c}` : undefined}
                                                    >
                                                        <span className="text-[#1b887a] text-xs font-semibold mb-1">{charPinyin}</span>
                                                        <span className="text-gray-900 text-xl font-bold">{c}</span>
                                                    </button>
                                                );
                                            })}
                                        </motion.div>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-gray-400 mt-3">{tt('tools.pinyin.clickCharHint')}</p>
                        </div>
                    )}
                </section>

                {/* Features Grid */}
                <section>
                    <h2 className="text-2xl font-bold mb-8 text-center">{tt('tools.pinyin.guide.featuresTitle')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((f, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center mb-4">
                                    <f.icon className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-bold mb-2">{tt(f.titleKey)}</h3>
                                <p className="text-sm text-neutral-500 leading-relaxed">{tt(f.descKey)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Guide Sections - Accordion */}
                <section>
                    <h2 className="text-2xl font-bold mb-8 text-center">{tt('tools.pinyin.guide.guideTitle')}</h2>
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
                                        <span className="font-bold text-base">{tt(`tools.pinyin.guide.${section.id}`)}</span>
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
                                                        <p>{tt('tools.pinyin.guide.whatIsPinyinDesc')}</p>
                                                    </>
                                                )}
                                                {section.id === 'toneMarks' && (
                                                    <>
                                                        <p className="mb-4">{tt('tools.pinyin.guide.toneIntro')}</p>
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full text-sm">
                                                                <thead>
                                                                    <tr className="border-b border-neutral-100">
                                                                        <th className="py-3 px-4 text-left font-bold">{tt('tools.pinyin.guide.toneCol')}</th>
                                                                        <th className="py-3 px-4 text-left font-bold">{tt('tools.pinyin.guide.symbolCol')}</th>
                                                                        <th className="py-3 px-4 text-left font-bold">{tt('tools.pinyin.guide.descCol')}</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {toneRows.map((row, i) => (
                                                                        <tr key={i} className="border-b border-neutral-50">
                                                                            <td className="py-3 px-4 font-medium">{tt(row.tone)}</td>
                                                                            <td className="py-3 px-4 text-2xl text-neutral-900 font-mono">{row.example}</td>
                                                                            <td className="py-3 px-4 text-neutral-500">{tt(row.desc)}</td>
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
                                                                <p>{tt(`tools.pinyin.guide.step${n}`)}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {section.id === 'segmentation' && (
                                                    <>
                                                        <p>{tt('tools.pinyin.guide.segmentDesc')}</p>
                                                        <div className="bg-neutral-50 p-4 rounded-xl mt-3">
                                                            <p className="text-sm"><span className="font-bold text-neutral-900">{tt('tools.pinyin.guide.segmentExample')}</span> {tt('tools.pinyin.guide.segmentExampleDesc')}</p>
                                                        </div>
                                                    </>
                                                )}
                                                {section.id === 'strokeOrder' && (
                                                    <>
                                                        <p>{tt('tools.pinyin.guide.strokeDesc')}</p>
                                                        <div className="space-y-2 mt-3">
                                                            {[1,2,3].map(n => (
                                                                <div key={n} className="flex gap-2 items-center">
                                                                    <span className="w-2 h-2 bg-neutral-400 rounded-full flex-shrink-0"></span>
                                                                    <span className="text-sm">{tt(`tools.pinyin.guide.strokeRule${n}`)}</span>
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
                        <h2 className="text-2xl font-bold">{tt('tools.pinyin.guide.faqTitle')}</h2>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((f, i) => (
                            <div key={i} className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm">
                                <button 
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-neutral-50 transition-all"
                                >
                                    <span className="font-bold text-base text-neutral-800">{tt(f.q)}</span>
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
                                                {tt(f.a)}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Character Detail Modal */}
            {selectedChar && (
                <CharDetailModal
                    char={selectedChar.char}
                    pinyin={selectedChar.pinyin}
                    definition={selectedChar.definition}
                    tone={selectedChar.tone}
                    onClose={() => setSelectedChar(null)}
                    onSpeak={speakText}
                    t={tt}
                />
            )}
        </div>
    );
};

export default PinyinSegmentation;
