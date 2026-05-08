"use client";

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const ZodiacCalculator = () => {
    const { language, t } = useLanguage();
    const [year, setYear] = useState<string>('2026');
    const [month, setMonth] = useState<string>('2');
    const [day, setDay] = useState<string>('17');
    const [result, setResult] = useState<string | null>(null);

    const calculateZodiac = () => {
        const y = parseInt(year);
        // Simplified mapping for demonstration
        const zodiacsZh = ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊'];
        const zodiacsEn = ['Monkey', 'Rooster', 'Dog', 'Pig', 'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat'];
        const zodiacs = language === 'zh' ? zodiacsZh : zodiacsEn;
        const index = (y - 4) % 12;
        setResult(zodiacs[index < 0 ? index + 12 : index]);
    };

    return (
        <div className="bg-neutral-50 text-neutral-900 w-full">
{/* Hero Section */}
            <div 
                className="relative h-[400px] flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: 'url(https://static.tripcngo.com/ing/banner_bg_1.jpg)' }}
            >
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative text-center">
                    <h1 className="text-white text-5xl font-bold mb-4">{t('zodiac.title')}</h1>
                    <p className="text-white/80 text-xl font-medium max-w-2xl px-6">{t('zodiac.subtitle')}</p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Header Subtitle or Badge */}
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <span>📅</span>
                        <span>{t('tools.zodiac.search')}</span>
                    </div>
                </div>

                {/* Calculator Widget */}
                <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-neutral-100 max-w-4xl mx-auto mb-16">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">{t('tools.zodiac.year')}</label>
                            <select value={year} onChange={e => setYear(e.target.value)} className="appearance-none border border-neutral-200 p-4 rounded-xl w-full bg-white pr-10">
                                {[...Array(126)].map((_, i) => <option key={i} value={1900 + i}>{1900 + i}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">{t('tools.zodiac.month')}</label>
                            <select value={month} onChange={e => setMonth(e.target.value)} className="appearance-none border border-neutral-200 p-4 rounded-xl w-full bg-white pr-10">
                                {[...Array(12)].map((_, i) => <option key={i} value={i + 1}>{i + 1}{t('tools.zodiac.monthUnit')}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">{t('tools.zodiac.day')}</label>
                            <select value={day} onChange={e => setDay(e.target.value)} className="appearance-none border border-neutral-200 p-4 rounded-xl w-full bg-white pr-10">
                                {[...Array(31)].map((_, i) => <option key={i} value={i + 1}>{i + 1}{t('tools.zodiac.dayUnit')}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <button onClick={calculateZodiac} className="w-full mt-8 bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-colors">
                        <span>✨</span> {t('tools.zodiac.button')}
                    </button>
                    {result && (
                        <div className="mt-8 text-center bg-green-50 p-6 rounded-2xl border border-green-200">
                            <h3 className="text-2xl font-bold text-green-900">
                                {t('tools.zodiac.result').replace('{year}', year)} {result}
                            </h3>
                        </div>
                    )}
                </section>

                <div className="space-y-12 max-w-4xl mx-auto">
                   <div className="bg-white p-8 rounded-3xl border border-neutral-100">
                        <h2 className="text-2xl font-bold mb-6">{t('tools.zodiac.faq1.title')}</h2>
                        <p className="text-neutral-600 leading-relaxed">{t('tools.zodiac.faq1.desc')}</p>
                   </div>
                   
                   <div className="bg-white p-8 rounded-3xl border border-neutral-100">
                        <h2 className="text-2xl font-bold mb-6">{t('tools.zodiac.faq2.title')}</h2>
                        <p className="text-neutral-600 leading-relaxed">{t('tools.zodiac.faq2.desc')}</p>
                   </div>
                </div>
            </main>
        </div>
    );
};

export default ZodiacCalculator;
