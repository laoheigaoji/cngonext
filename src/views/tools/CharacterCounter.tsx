"use client";

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Hash, Languages, CaseSensitive, Dice5, Type, AlignLeft, Copy, Trash2, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface CharacterCounterProps {
    translations?: Record<string, string>;
}

const CharacterCounter = ({ translations }: CharacterCounterProps) => {
    const { language, t } = useLanguage();

    // Prefer SSR translations from messages/xx.json, fallback to LanguageContext
    const tt = (key: string): string => {
        if (translations && translations[key] && translations[key] !== key) {
            return translations[key];
        }
        return t(key);
    };

    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);

    const countStats = (str: string) => {
        const char = str.length;
        const chinese = (str.match(/[\u4e00-\u9fa5]/g) || []).length;
        const english = (str.match(/[a-zA-Z]/g) || []).length;
        const digits = (str.match(/[0-9]/g) || []).length;
        const punctuations = (str.match(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g) || []).length;
        const lines = str ? str.split('\n').length : 0;

        return { char, chinese, english, digits, punctuations, lines };
    };

    const stats = countStats(text);

    const statCards = [
        { icon: Hash, label: tt('tools.char.total'), val: stats.char, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', iconColor: 'text-blue-500' },
        { icon: Languages, label: tt('tools.char.zh'), val: stats.chinese, color: 'from-red-500 to-red-600', bg: 'bg-red-50', iconColor: 'text-red-500' },
        { icon: CaseSensitive, label: tt('tools.char.en'), val: stats.english, color: 'from-green-500 to-green-600', bg: 'bg-green-50', iconColor: 'text-green-500' },
        { icon: Dice5, label: tt('tools.char.digits'), val: stats.digits, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', iconColor: 'text-purple-500' },
        { icon: Type, label: tt('tools.char.punc'), val: stats.punctuations, color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', iconColor: 'text-orange-500' },
        { icon: AlignLeft, label: tt('tools.char.lines'), val: stats.lines, color: 'from-teal-500 to-teal-600', bg: 'bg-teal-50', iconColor: 'text-teal-500' },
    ];

    const handleCopy = async () => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleClear = () => {
        setText('');
    };

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900">
            {/* Hero Section */}
            <div
                className="relative h-[380px] flex items-end justify-center bg-cover bg-center pb-16"
                style={{ backgroundImage: 'url(https://static.tripcngo.com/ing/banner_bg_1.jpg)' }}
            >
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative text-center">
                    <h1 className="text-white text-5xl font-bold mb-4">{tt('tools.char.title')}</h1>
                    <p className="text-white/80 text-xl font-medium">{tt('tools.char.desc')}</p>
                </div>
            </div>

            <main className="pb-12 max-w-4xl mx-auto px-6 mt-12">
                {/* Stats Cards */}
                <section className="mb-8">
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
                        {statCards.map(({ icon: Icon, label, val, bg, iconColor }, i) => (
                            <motion.div
                                key={label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className={`${bg} p-4 rounded-2xl text-center border border-white/60 shadow-sm`}
                            >
                                <div className={`w-8 h-8 mx-auto mb-2 rounded-xl ${bg} flex items-center justify-center`}>
                                    <Icon className={`w-4 h-4 ${iconColor}`} />
                                </div>
                                <div className="text-2xl font-bold tracking-tight">{val}</div>
                                <div className="text-neutral-500 text-xs font-medium mt-1">{label}</div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Text Editor Area */}
                <section className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100">
                        <div className="text-sm text-neutral-400 font-medium">
                            {stats.char > 0 ? `${stats.char} ${tt('tools.char.total').toLowerCase()}` : tt('tools.char.placeholder').slice(0, 20) + '...'}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleCopy}
                                disabled={!text}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                    copied
                                        ? 'bg-green-100 text-green-600'
                                        : text
                                            ? 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                            : 'bg-neutral-50 text-neutral-300 cursor-not-allowed'
                                }`}
                            >
                                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                {copied ? tt('tools.char.copied') : tt('tools.char.copy')}
                            </button>
                            <button
                                onClick={handleClear}
                                disabled={!text}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                    text
                                        ? 'bg-red-50 text-red-500 hover:bg-red-100'
                                        : 'bg-neutral-50 text-neutral-300 cursor-not-allowed'
                                }`}
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                {tt('tools.char.clear')}
                            </button>
                        </div>
                    </div>

                    {/* Textarea */}
                    <textarea
                        className="w-full h-72 p-6 focus:ring-0 outline-none text-lg resize-none bg-transparent"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={tt('tools.char.placeholder')}
                    />
                </section>

                {/* Guide Content */}
                <section className="mt-10 space-y-8">
                    {/* Welcome */}
                    <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8">
                        <h2 className="text-xl font-bold text-neutral-900 mb-4">{tt('tools.char.guide.welcomeTitle')}</h2>
                        <p className="text-neutral-600 leading-relaxed mb-4">{tt('tools.char.guide.welcomeDesc')}</p>
                        <ul className="space-y-2">
                            {[ 
                                tt('tools.char.guide.statTotal'),
                                tt('tools.char.guide.statChinese'),
                                tt('tools.char.guide.statEnglish'),
                                tt('tools.char.guide.statDigits'),
                                tt('tools.char.guide.statPunc'),
                                tt('tools.char.guide.statLines'),
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-neutral-600">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1b887a] flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="text-neutral-600 leading-relaxed mt-4">{tt('tools.char.guide.copyHint')}</p>
                    </div>

                    {/* Hanzi Introduction */}
                    <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8">
                        <h2 className="text-xl font-bold text-neutral-900 mb-4">{tt('tools.char.guide.hanziTitle')}</h2>
                        <p className="text-neutral-600 leading-relaxed">{tt('tools.char.guide.hanziDesc')}</p>
                    </div>

                    {/* Hanzi Structure */}
                    <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8">
                        <h2 className="text-xl font-bold text-neutral-900 mb-4">{tt('tools.char.guide.structureTitle')}</h2>
                        <p className="text-neutral-600 leading-relaxed mb-3">{tt('tools.char.guide.structureDesc')}</p>
                        <p className="text-neutral-600 leading-relaxed">{tt('tools.char.guide.structureDesc2')}</p>
                    </div>

                    {/* Meaning Inference */}
                    <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8">
                        <h2 className="text-xl font-bold text-neutral-900 mb-4">{tt('tools.char.guide.meaningTitle')}</h2>
                        <p className="text-neutral-600 leading-relaxed mb-3">{tt('tools.char.guide.meaningDesc')}</p>
                        <p className="text-neutral-600 leading-relaxed">{tt('tools.char.guide.meaningDesc2')}</p>
                    </div>

                    {/* Pinyin System */}
                    <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8">
                        <h2 className="text-xl font-bold text-neutral-900 mb-4">{tt('tools.char.guide.pinyinTitle')}</h2>
                        <p className="text-neutral-600 leading-relaxed mb-3">{tt('tools.char.guide.pinyinDesc')}</p>
                        <p className="text-neutral-600 leading-relaxed">{tt('tools.char.guide.pinyinDesc2')}</p>
                    </div>

                    {/* Footer */}
                    <div className="bg-gradient-to-r from-[#1b887a]/5 to-[#1b887a]/10 rounded-2xl p-6 text-center">
                        <p className="text-neutral-500 text-sm">{tt('tools.char.guide.footer')}</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default CharacterCounter;
