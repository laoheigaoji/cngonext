"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Camera, ImageIcon, Languages, Wallet, MessageSquare, ChevronDown, Check, Star, ScanLine, X, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { GoogleGenAI } from '@google/genai';
import { askDeepSeek } from '../../lib/deepseek';

const MenuTranslator = () => {
    const { language, t } = useLanguage();
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any[]>([]);

    const faqs = [
        { q: t('tools.menu.faq.q1'), a: t('tools.menu.faq.a1') },
        { q: t('tools.menu.faq.q2'), a: t('tools.menu.faq.a2') },
        { q: t('tools.menu.faq.q3'), a: t('tools.menu.faq.a3') },
        { q: t('tools.menu.faq.q4'), a: t('tools.menu.faq.a4') },
        { q: t('tools.menu.faq.q5'), a: t('tools.menu.faq.a5') },
        { q: t('tools.menu.faq.q6'), a: t('tools.menu.faq.a6') },
        { q: t('tools.menu.faq.q7'), a: t('tools.menu.faq.a7') },
        { q: t('tools.menu.faq.q8'), a: t('tools.menu.faq.a8') }
    ];

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64Image = event.target?.result as string;
            setUploadedImage(base64Image);
            
            setIsAnalyzing(true);
            try {
                // Step 1: Gemini Vision Extraction
                // Using the @google/genai SDK pattern
                const geminiKey = process.env.GEMINI_API_KEY || "";
                const ai = new GoogleGenAI({ apiKey: geminiKey });

                const visionPrompt = `You are a world-class Chinese food expert and translator. Analyze this menu image. 
                1. Extract EVERY dish with its Chinese name.
                2. Provide a professional, appetizing English name.
                3. Extract the price as a number.
                4. Write a 2-sentence tempting description of the dish and its cultural background in BOTH Chinese (description) and English (enDescription).
                5. List 3-5 main ingredients in BOTH Chinese (ingredients) and English (enIngredients).
                6. Categorize the dish in BOTH Chinese (category) and English (enCategory).

                Return the data as a VALID JSON array of objects with keys: name, enName, price, description, enDescription, ingredients, enIngredients, category, enCategory.`;

                const result = await ai.models.generateContent({
                    model: "gemini-3-flash-preview",
                    contents: {
                        parts: [
                            { text: visionPrompt },
                            {
                                inlineData: {
                                    data: base64Image.split(',')[1],
                                    mimeType: file.type
                                }
                            }
                        ]
                    }
                });
                
                const responseText = result.text || "[]";
                const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
                let menuItems = JSON.parse(cleanedText);

                // Step 2: AI Refinement with DeepSeek
                const refinementPrompt = `As a top Chinese culinary critic, refine these menu items for a world-class food app. Improve descriptions and ensure consistency.
                Input JSON: ${JSON.stringify(menuItems)}
                Return ONLY the refined JSON array with the SAME keys.`;

                const refinedText = await askDeepSeek(refinementPrompt, true);
                menuItems = JSON.parse(refinedText);

                // Add random relevant food images and handle price conversions
                const EXCHANGE_RATE = 0.14; // 1 CNY ≈ 0.14 USD
                menuItems = menuItems.map((item: any, i: number) => {
                    const priceInCny = parseFloat(item.price) || 0;
                    return {
                        ...item,
                        price: priceInCny,
                        usdPrice: (priceInCny * EXCHANGE_RATE).toFixed(2),
                        imageUrl: `https://images.unsplash.com/photo-${1546069901 + i}-ba9599a7e63c?auto=format&fit=crop&q=80&w=600&h=600`
                    };
                });

                setAnalysisResult(menuItems);
            } catch (error) {
                console.error("Deep Analysis failed:", error);
                alert("识别失败，请确保图片清晰并重试。");
            } finally {
                setIsAnalyzing(false);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <>
<div className="bg-[#f8f9fa] min-h-screen font-sans text-gray-900 overflow-x-hidden pt-20">
            {/* Minimalist Header Area - Already handled by main layout Navbar */}
            
            <div className="max-w-[1400px] mx-auto px-6">
                {!uploadedImage && !isAnalyzing && (
                    <section className="relative pt-24 pb-32 overflow-hidden bg-white rounded-[3rem] shadow-sm border border-gray-100 mb-12">
                        <div className="absolute inset-0 pointer-events-none opacity-[0.2]" style={{ 
                            backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', 
                            backgroundSize: '24px 24px' 
                        }}></div>
                        
                        <div className="relative z-10 max-w-4xl mx-auto text-center">
                            <motion.h1 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl md:text-6xl font-black tracking-tight mb-8 text-gray-900"
                            >
                                {t('tools.menu.hero.title')}
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-lg md:text-xl text-gray-500 mb-16 max-w-2xl mx-auto leading-relaxed"
                            >
                                {t('tools.menu.hero.desc')}
                            </motion.p>

                            <motion.div 
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="max-w-xl mx-auto"
                            >
                                <label className="cursor-pointer block group">
                                    <div className="relative bg-white border-2 border-dashed border-purple-200 rounded-[40px] p-16 flex flex-col items-center justify-center transition-all hover:border-purple-400 shadow-sm">
                                        <div className="w-24 h-24 bg-purple-50 rounded-[2.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                                            <Upload className="w-12 h-12 text-purple-600" />
                                        </div>
                                        <p className="text-gray-900 font-black text-2xl mb-3">{t('tools.menu.upload.title')}</p>
                                        <p className="text-sm text-gray-400 mb-10 font-bold">{t('tools.menu.upload.subtitle')}</p>
                                        <div className="bg-purple-600 text-white px-12 py-5 rounded-3xl font-black transition-all shadow-xl shadow-purple-100 text-xl flex items-center justify-center hover:bg-purple-700">
                                            {t('tools.menu.upload.button')}
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                    </div>
                                </label>
                            </motion.div>
                        </div>
                    </section>
                )}

                {(isAnalyzing || uploadedImage) && (
                    <section className="py-12">
                        <div className="flex justify-between items-center mb-10">
                            <button 
                                onClick={() => { setUploadedImage(null); setAnalysisResult([]); }}
                                className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors font-black px-6 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm"
                            >
                                <X className="w-5 h-5" /> {t('tools.menu.status.reset')}
                            </button>
                            {isAnalyzing && (
                                <div className="flex items-center gap-3 text-purple-600 font-black bg-purple-50 px-6 py-3 rounded-2xl border border-purple-100">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span>{t('tools.menu.status.analyzing')}</span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                            {/* Left: Original */}
                            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                                <h3 className="text-xs font-black text-gray-300 uppercase tracking-widest mb-8">{t('tools.menu.label.raw')}</h3>
                                <div className="rounded-3xl overflow-hidden border border-gray-50 aspect-[3/4] bg-gray-50 flex items-center justify-center relative">
                                    {uploadedImage && (
                                        <img src={uploadedImage} alt="Menu" className="w-full h-full object-contain" />
                                    )}
                                    {isAnalyzing && (
                                        <div className="absolute inset-0 bg-white/40 backdrop-blur-md flex flex-col items-center justify-center z-10">
                                            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Refined Results */}
                            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm min-h-[600px]">
                                <h3 className="text-xs font-black text-purple-300 uppercase tracking-widest mb-8">{t('tools.menu.label.refined')}</h3>
                                
                                {isAnalyzing ? (
                                    <div className="space-y-12">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="animate-pulse flex gap-8">
                                                <div className="w-40 h-40 bg-gray-100 rounded-[2rem]"></div>
                                                <div className="flex-1 space-y-4 py-2">
                                                    <div className="h-8 bg-gray-100 rounded-lg w-1/2"></div>
                                                    <div className="h-4 bg-gray-100 rounded-lg w-full"></div>
                                                    <div className="h-4 bg-gray-100 rounded-lg w-3/4"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : analysisResult.length > 0 ? (
                                    <div className="space-y-16">
                                        {analysisResult.map((item, idx) => (
                                            <motion.div 
                                                key={idx}
                                                initial={{ opacity: 0, x: 30 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="flex flex-col md:flex-row gap-8 group"
                                            >
                                                <div className="w-40 h-40 flex-shrink-0 bg-gray-100 rounded-[2rem] overflow-hidden group-hover:scale-105 transition-transform duration-500 border border-gray-50">
                                                    <img 
                                                        src={item.imageUrl || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400&h=400`} 
                                                        alt={item.name} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex flex-col">
                                                            <h4 className="text-2xl font-black text-[#e11d48] tracking-tight">
                                                                {language === 'zh' ? item.name : (item.enName || item.name)}
                                                            </h4>
                                                            <span className="text-sm font-bold text-gray-400 mt-1">
                                                                {language === 'zh' ? item.enName : item.name}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1">
                                                            <div className="px-4 py-2 bg-purple-50 text-purple-700 rounded-xl font-black text-xl">
                                                                ¥{item.price}
                                                            </div>
                                                            <div className="text-sm font-bold text-gray-400">
                                                                ≈ ${item.usdPrice}
                                                            </div>
                                                        </div>
                                                    </div>
                                                     <p className="text-gray-500 text-[15px] leading-relaxed mb-5 font-medium">
                                                         {language === 'zh' ? (item.description || item.enDescription) : (item.enDescription || item.description)}
                                                     </p>
                                                     <div className="flex flex-wrap gap-2">
                                                         {((Array.isArray(language === 'zh' ? item.ingredients : item.enIngredients) 
                                                             ? (language === 'zh' ? item.ingredients : item.enIngredients) 
                                                             : [(language === 'zh' ? item.ingredients : item.enIngredients)]) || []).map((ing: string, i: number) => (
                                                             <span key={i} className="text-xs font-bold text-gray-600 bg-gray-100 px-4 py-2 rounded-xl">
                                                                 {ing}
                                                             </span>
                                                         ))}
                                                     </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4 py-40">
                                        <MessageSquare className="w-16 h-16 opacity-30" />
                                        <p className="font-black text-xl">{t('tools.menu.placeholder')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* Features and FAQ Section - Same as before but styled more consistently */}
                {!uploadedImage && (
                    <>
                        <section className="py-24 grid grid-cols-1 md:grid-cols-4 gap-8">
                            {[
                                { icon: ScanLine, title: t('tools.menu.feature.1.title'), desc: t('tools.menu.feature.1.desc') },
                                { icon: ImageIcon, title: t('tools.menu.feature.2.title'), desc: t('tools.menu.feature.2.desc') },
                                { icon: Wallet, title: t('tools.menu.feature.3.title'), desc: t('tools.menu.feature.3.desc') },
                                { icon: Star, title: t('tools.menu.feature.4.title'), desc: t('tools.menu.feature.4.desc') }
                            ].map((f, i) => (
                                <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 hover:shadow-xl transition-all group">
                                    <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-8 text-purple-600 group-hover:scale-110 transition-transform">
                                        <f.icon className="w-7 h-7" />
                                    </div>
                                    <h5 className="font-black text-xl mb-4">{f.title}</h5>
                                    <p className="text-gray-400 text-sm font-medium leading-relaxed">{f.desc}</p>
                                </div>
                            ))}
                        </section>

                        <section className="py-24 border-t border-gray-100">
                            <div className="max-w-3xl mx-auto">
                                <h2 className="text-3xl font-black text-center mb-16 uppercase tracking-widest text-gray-400">FAQS</h2>
                                <div className="space-y-6">
                                    {faqs.map((f, i) => (
                                        <div key={i} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                                            <button 
                                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-all"
                                            >
                                                <span className="font-bold text-lg text-gray-800">{f.q}</span>
                                                <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform ${openFaq === i ? 'rotate-180 text-purple-600' : ''}`} />
                                            </button>
                                            <AnimatePresence>
                                                {openFaq === i && (
                                                    <motion.div 
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="px-8 pb-8 text-gray-500 font-medium leading-relaxed border-t border-gray-50 pt-4"
                                                    >
                                                        {f.a}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
        </>
    );
};

export default MenuTranslator;
