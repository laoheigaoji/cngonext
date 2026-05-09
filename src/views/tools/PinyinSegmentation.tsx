"use client";

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const PinyinSegmentation = () => {
    const { language, t } = useLanguage();
    const [text, setText] = useState('');
    const [result, setResult] = useState('');

    const analyze = () => {
        // Simplified approach
        setResult(`${t('tools.pinyin.result')} ${text.split('').join(' ')}`); 
    };

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900">
{/* Hero Section */}
            <div 
                className="relative h-[300px] flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: 'url(https://static.tripcngo.com/ing/banner_bg_1.jpg)' }}
            >
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative text-center">
                    <h1 className="text-white text-5xl font-bold mb-4">{t('tools.pinyin.title')}</h1>
                    <p className="text-white/80 text-xl font-medium">{t('tools.hero.subtitle')}</p>
                </div>
            </div>

            <main className="pb-12 max-w-2xl mx-auto px-6 mt-12">
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
            </main>
        </div>
    );
};

export default PinyinSegmentation;
