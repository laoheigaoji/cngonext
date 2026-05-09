"use client";

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const CharacterCounter = () => {
    const { language, t } = useLanguage();
    const [text, setText] = useState('');
    
    const countStats = (str: string) => {
        const char = str.length;
        const chinese = (str.match(/[\u4e00-\u9fa5]/g) || []).length;
        const english = (str.match(/[a-zA-Z]/g) || []).length;
        const digits = (str.match(/[0-9]/g) || []).length;
        const punctuations = (str.match(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g) || []).length;
        
        return { char, chinese, english, digits, punctuations };
    };

    const stats = countStats(text);

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900">
{/* Hero Section */}
            <div 
                className="relative h-[300px] flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: 'url(https://static.tripcngo.com/ing/banner_bg_1.jpg)' }}
            >
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative text-center">
                    <h1 className="text-white text-5xl font-bold mb-4">{t('tools.char.title')}</h1>
                    <p className="text-white/80 text-xl font-medium">{t('tools.char.desc')}</p>
                </div>
            </div>

            <main className="pb-12 max-w-4xl mx-auto px-6 mt-12">
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 mb-8">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        {[
                            { label: t('tools.char.total'), val: stats.char },
                            { label: t('tools.char.zh'), val: stats.chinese },
                            { label: t('tools.char.en'), val: stats.english },
                            { label: t('tools.char.digits'), val: stats.digits },
                            { label: t('tools.char.punc'), val: stats.punctuations }
                        ].map(({ label, val }) => (
                            <div key={label} className="bg-neutral-50 p-6 rounded-2xl text-center border border-neutral-100">
                                <div className="text-neutral-500 text-sm font-semibold uppercase tracking-wider mb-2">{label}</div>
                                <div className="text-3xl font-bold tracking-tight">{val}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <textarea 
                    className="w-full h-80 p-8 border border-neutral-200 rounded-3xl focus:ring-2 focus:ring-neutral-900 outline-none transition text-lg"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={t('tools.char.placeholder')}
                />
            </main>
            <Footer />
        </div>
    );
};

export default CharacterCounter;
