"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Camera, ImageIcon, Languages, Wallet, MessageSquare, ChevronDown, Check, Star, ScanLine, X, Loader2, Volume2, AlertTriangle, Leaf, CameraOff, Brain, Utensils } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

interface MenuTranslatorProps {
  translations?: Record<string, string>;
}

const MenuTranslator = ({ translations }: MenuTranslatorProps) => {
    const { language, t } = useLanguage();
    const { user, loading: authLoading } = useAuth();

    // tt: prefer server-side JSON translations, fallback to client-side t()
    const tt = (key: string): string => {
        if (translations && translations[key] && translations[key] !== key) {
            return translations[key];
        }
        return t(key);
    };
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisStep, setAnalysisStep] = useState(0); // 0=idle, 1=uploading, 2=detecting, 3=analyzing, 4=rendering
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any[]>([]);
    const [streamingText, setStreamingText] = useState('');
    const [paymentConfig, setPaymentConfig] = useState<any>(null);

    // 从后台获取支付配置
    useEffect(() => {
        fetch('/api/payment-config').then(r => r.json()).then(d => {
            if (d.config) setPaymentConfig(d.config);
        }).catch(() => {});
    }, []);

    const getPaymentUrl = (planKey: string, billingCycle?: 'monthly' | 'yearly') => {
        if (!paymentConfig) {
            // 无配置时的默认降级
            const fallbacks: Record<string, string> = {
                traveler: 'https://www.creem.io/payment/prod_3TVyXsKR8av0l01JAJoBrU',
                starter_monthly: 'https://www.creem.io/payment/prod_7YpsVCJSFtxQr3Fqhk0uHZ',
                starter_yearly: 'https://www.creem.io/payment/prod_2Jw6Tigcj1ydA2JxbiNLpN',
                pro_monthly: 'https://www.creem.io/payment/prod_5O65NauyqMWA0ZtiroA9XG',
                pro_yearly: 'https://www.creem.io/payment/prod_268yTiuPPqD5QbnW18jo2x',
            };
            return fallbacks[planKey] || fallbacks.traveler;
        }

        if (paymentConfig.sandbox_mode && paymentConfig.sandbox_url) {
            return paymentConfig.sandbox_url;
        }

        // 生产模式：使用各套餐独立的支付链接
        const plan = paymentConfig.plans?.[planKey];
        return plan?.url || paymentConfig.sandbox_url || 'https://www.creem.io/payment/prod_3TVyXsKR8av0l01JAJoBrU';
    };

    // planKey -> productId 映射（用于 webhook 模拟）
    const PLAN_PRODUCT_IDS: Record<string, string> = {
        traveler: 'prod_3TVyXsKR8av0l01JAJoBrU',
        starter_monthly: 'prod_7YpsVCJSFtxQr3Fqhk0uHZ',
        starter_yearly: 'prod_2Jw6Tigcj1ydA2JxbiNLpN',
        pro_monthly: 'prod_5O65NauyqMWA0ZtiroA9XG',
        pro_yearly: 'prod_268yTiuPPqD5QbnW18jo2x',
    };

    const openPayment = (url: string, planKey?: string) => {
        const popup = window.open(url, 'creem_pay', window.innerWidth < 768 ? '_blank' : 'width=480,height=700,left=' + ((screen.width - 480) / 2) + ',top=' + ((screen.height - 700) / 2) + ',menubar=no,toolbar=no,location=no,status=no');

        if (!popup) return;

        // 轮询检测弹窗关闭
        const timer = setInterval(async () => {
            if (popup.closed) {
                clearInterval(timer);
                // 弹窗关闭后：自动触发 webhook + 刷新套餐
                if (user?.email && planKey && PLAN_PRODUCT_IDS[planKey]) {
                    try {
                        await fetch('/api/webhooks/creem', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                eventType: 'checkout.completed',
                                object: {
                                    customer: { email: user.email },
                                    product: { id: PLAN_PRODUCT_IDS[planKey] },
                                },
                            }),
                        });
                    } catch {}
                }
                // 刷新套餐
                try {
                    const headers: Record<string, string> = {};
                    if (user?.access_token) {
                        headers['Authorization'] = `Bearer ${user.access_token}`;
                    } else if (user?.email) {
                        headers['x-dev-user-email'] = user.email;
                    }
                    const res = await fetch('/api/save-plan', { headers });
                    const data = await res.json();
                    if (data.hasAccess && data.plan) {
                        const planData = {
                            plan: data.plan.plan,
                            name: data.plan.name,
                            cycle: data.plan.cycle,
                            credits: data.plan.credits,
                            creditsUsed: data.plan.creditsUsed,
                            creditsRemaining: data.plan.creditsRemaining,
                        };
                        localStorage.setItem('user_plan', JSON.stringify(planData));
                        window.dispatchEvent(new CustomEvent('plan-updated', { detail: planData }));
                    }
                } catch {}
            }
        }, 500);
    };
    // Chinese pronunciation using Web Speech API
    const speakChinese = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-CN';
            utterance.rate = 0.8;
            window.speechSynthesis.speak(utterance);
        }
    };

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

    // Compress image before upload to reduce payload size
    const compressImage = (file: File, maxWidth = 1600, quality = 0.8): Promise<string> => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const img = new Image();
            img.onload = () => {
                let { width, height } = img;
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0, width, height);
                const compressed = canvas.toDataURL(file.type === 'image/png' ? 'image/jpeg' : file.type, quality);
                resolve(compressed);
            };
            img.src = URL.createObjectURL(file);
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        setAnalysisStep(1);
        setStreamingText('');
        try {
            // Compress image to reduce payload
            const base64Image = await compressImage(file);
            setUploadedImage(base64Image);
            setAnalysisStep(2);
            
            const imageBase64 = base64Image.split(',')[1];
            
            // Retry logic for network errors
            let lastError: any;
            for (let attempt = 0; attempt < 2; attempt++) {
                try {
                    setAnalysisStep(2); // Detecting photos
                    const response = await fetch('/api/menu-translate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            image: imageBase64,
                            mimeType: 'image/jpeg',
                            lang: language
                        })
                    });

                    if (!response.ok) {
                        const errData = await response.json().catch(() => ({}));
                        throw new Error(errData.error || `API error: ${response.status}`);
                    }

                    setAnalysisStep(3); // AI analyzing

                    // Check if response is SSE stream or regular JSON
                    const contentType = response.headers.get('content-type') || '';
                    if (contentType.includes('text/event-stream') && response.body) {
                        // SSE streaming mode
                        const reader = response.body.getReader();
                        const decoder = new TextDecoder();
                        let accumulatedText = '';

                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;

                            const chunk = decoder.decode(value, { stream: true });
                            const lines = chunk.split('\n');
                            for (const line of lines) {
                                if (line.startsWith('data: ')) {
                                    const jsonStr = line.slice(6).trim();
                                    if (!jsonStr) continue;
                                    try {
                                        const parsed = JSON.parse(jsonStr);
                                        if (parsed.type === 'token') {
                                            accumulatedText += parsed.content;
                                            setStreamingText(accumulatedText);
                                        } else if (parsed.type === 'result') {
                                            setAnalysisStep(4); // Rendering results
                                            setAnalysisResult(parsed.items || []);
                                            setStreamingText('');
                                        } else if (parsed.type === 'error') {
                                            throw new Error(parsed.error);
                                        }
                                    } catch (parseErr: any) {
                                        if (parseErr.message && !parseErr.message.includes('JSON')) throw parseErr;
                                    }
                                }
                            }
                        }
                    } else {
                        // Regular JSON response
                        const data = await response.json();
                        setAnalysisStep(4); // Rendering results
                        setAnalysisResult(data.items || []);
                    }

                    lastError = null;
                    break;
                } catch (fetchErr: any) {
                    lastError = fetchErr;
                    if (attempt === 0 && (fetchErr.message?.includes('SSL') || fetchErr.message?.includes('network') || fetchErr.name === 'TypeError')) {
                        // Wait 1s before retry
                        await new Promise(r => setTimeout(r, 1000));
                        continue;
                    }
                    break;
                }
            }
            
            if (lastError) throw lastError;
        } catch (error) {
            console.error("Menu Analysis failed:", error);
            alert("识别失败，请确保图片清晰并重试。" + (error instanceof Error ? `\n${error.message}` : ''));
        } finally {
            setIsAnalyzing(false);
            setAnalysisStep(0);
        }
    };

    return (
        <>
        <style>{`
            @keyframes scanLine {
                0% { transform: translateY(-100%); }
                50% { transform: translateY(400%); }
                100% { transform: translateY(-100%); }
            }
        `}</style><div className="bg-[#f8f9fa] min-h-screen font-sans text-gray-900 overflow-x-hidden">
            {/* Hero Section with Background Image */}
            <div 
                className="relative h-[360px] w-full flex items-center pt-16"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2670&auto=format&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 text-white">
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black tracking-tight mb-4"
                    >
                        {t('tools.menu.hero.title')}
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-base md:text-lg text-white/90 max-w-2xl leading-relaxed"
                    >
                        {t('tools.menu.hero.desc')}
                    </motion.p>
                </div>
            </div>
            
            <div className="max-w-[1400px] mx-auto px-6">
                {!uploadedImage && !isAnalyzing && (
                    <section className="pt-12 pb-8 mb-6">
                        <div className="max-w-xl mx-auto">
                            <motion.div 
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="cursor-pointer block group" onClick={() => { if (!user) { window.dispatchEvent(new Event('open-login-modal')); return; } document.getElementById('menu-file-input')?.click(); }}>
                                    <div className="relative border-2 border-dashed border-purple-200 rounded-3xl p-10 flex flex-col items-center justify-center transition-all hover:border-purple-400 bg-white shadow-xl">
                                        <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                                            <Upload className="w-8 h-8 text-purple-600" />
                                        </div>
                                        <p className="text-gray-900 font-black text-xl mb-2">{t('tools.menu.upload.title')}</p>
                                        <p className="text-sm text-gray-400 mb-6 font-bold">{t('tools.menu.upload.subtitle')}</p>
                                        <div className="bg-purple-600 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-lg shadow-purple-100 text-base flex items-center justify-center hover:bg-purple-700">
                                            {t('tools.menu.upload.button')}
                                        </div>
                                        <input id="menu-file-input" type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>
                )}

                {(isAnalyzing || uploadedImage) && (
                    <section className="py-12">
                        <div className="flex justify-between items-center mb-10">
                            <button 
                                onClick={() => { setUploadedImage(null); setAnalysisResult([]); setStreamingText(''); setAnalysisStep(0); }}
                                className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors font-black px-6 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm"
                            >
                                <X className="w-5 h-5" /> {t('tools.menu.status.reset')}
                            </button>
                            {isAnalyzing && (
                                <div className="flex items-center gap-3 text-purple-600 font-black bg-purple-50 px-6 py-3 rounded-2xl border border-purple-100">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <div className="flex items-center gap-2">
                                        {[
                                            { step: 1, label: t('tools.menu.status.step.upload') },
                                            { step: 2, label: t('tools.menu.status.step.detect') },
                                            { step: 3, label: t('tools.menu.status.step.analyze') },
                                            { step: 4, label: t('tools.menu.status.step.render') },
                                        ].map((s, i) => (
                                            <React.Fragment key={s.step}>
                                                <span className={`text-xs px-2 py-0.5 rounded-full transition-all ${
                                                    analysisStep > s.step ? 'bg-green-100 text-green-600' :
                                                    analysisStep === s.step ? 'bg-purple-200 text-purple-700 animate-pulse' :
                                                    'bg-gray-100 text-gray-400'
                                                }`}>
                                                    {analysisStep > s.step ? '✓' : s.label}
                                                </span>
                                                {i < 3 && <span className="text-gray-300">›</span>}
                                            </React.Fragment>
                                        ))}
                                    </div>
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
                                        <div className="absolute inset-0 z-10 overflow-hidden">
                                            {/* Scan line effect */}
                                            <div className="absolute inset-0" style={{
                                                background: 'linear-gradient(180deg, transparent 0%, rgba(139,92,246,0.15) 48%, rgba(139,92,246,0.5) 50%, rgba(139,92,246,0.15) 52%, transparent 100%)',
                                                animation: 'scanLine 2s ease-in-out infinite',
                                                boxShadow: '0 0 40px 10px rgba(139,92,246,0.3) inset',
                                            }} />
                                            {/* Scan glow */}
                                            <div className="absolute left-0 right-0 h-16" style={{
                                                background: 'linear-gradient(180deg, transparent, rgba(139,92,246,0.25), transparent)',
                                                animation: 'scanLine 2s ease-in-out infinite',
                                                filter: 'blur(8px)',
                                            }} />
                                            {/* Top/bottom fade overlay */}
                                            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/60 to-transparent" />
                                            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white/60 to-transparent" />
                                            {/* Status text */}
                                            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2">
                                                <div className="bg-purple-600/90 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg shadow-purple-500/30">
                                                    <ScanLine className="w-4 h-4 animate-pulse" />
                                                    <span>AI 扫描识别中...</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Refined Results */}
                            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm min-h-[600px]">
                                <h3 className="text-xs font-black text-purple-300 uppercase tracking-widest mb-8">{t('tools.menu.label.refined')}</h3>
                                
                                {isAnalyzing ? (
                                    <div className="space-y-12">
                                        {streamingText ? (
                                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Brain className="w-5 h-5 text-purple-500 animate-pulse" />
                                                    <span className="text-xs font-black text-purple-500 uppercase tracking-widest">AI 正在分析...</span>
                                                </div>
                                                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed max-h-[500px] overflow-y-auto">{streamingText}</pre>
                                            </div>
                                        ) : (
                                            [1, 2, 3].map(i => (
                                                <div key={i} className="animate-pulse flex gap-8">
                                                    <div className="w-40 h-40 bg-gray-100 rounded-[2rem]"></div>
                                                    <div className="flex-1 space-y-4 py-2">
                                                        <div className="h-8 bg-gray-100 rounded-lg w-1/2"></div>
                                                        <div className="h-4 bg-gray-100 rounded-lg w-full"></div>
                                                        <div className="h-4 bg-gray-100 rounded-lg w-3/4"></div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
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
                                                <div className="w-40 h-40 flex-shrink-0 bg-gray-100 rounded-[2rem] overflow-hidden group-hover:scale-105 transition-transform duration-500 border border-gray-50 relative">
                                                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
                                                        <Utensils className="w-8 h-8" />
                                                        <span className="text-xs font-bold">{item.name?.slice(0, 2) || '菜'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="text-2xl font-black text-[#e11d48] tracking-tight">
                                                                    {language === 'zh' ? item.name : (item.localName || item.enName || item.name)}
                                                                </h4>
                                                                <button 
                                                                    onClick={() => speakChinese(item.name)}
                                                                    className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-500 transition-colors"
                                                                    title="播放中文发音"
                                                                >
                                                                    <Volume2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                            <span className="text-sm font-bold text-gray-400 mt-1">
                                                                {language === 'zh' ? (item.enName || item.localName) : item.name}
                                                            </span>
                                                        </div>
                                                        {item.hasPrice && item.price > 0 && (
                                                            <div className="flex flex-col items-end gap-1">
                                                                <div className="px-4 py-2 bg-purple-50 text-purple-700 rounded-xl font-black text-xl">
                                                                    ¥{item.price}
                                                                </div>
                                                                {item.currencyCode && item.currencyCode !== 'CNY' && (
                                                                    <div className="text-sm font-bold text-gray-400">
                                                                        ≈ {item.currencySymbol}{item.convertedPrice}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                     <p className="text-gray-500 text-[15px] leading-relaxed mb-4 font-medium">
                                                         {language === 'zh' ? (item.description || item.enDescription) : (item.localDescription || item.enDescription || item.description)}
                                                     </p>
                                                     <div className="flex flex-wrap gap-2 mb-3">
                                                         {((Array.isArray(language === 'zh' ? item.ingredients : (item.localIngredients || item.enIngredients)) 
                                                             ? (language === 'zh' ? item.ingredients : (item.localIngredients || item.enIngredients)) 
                                                             : [(language === 'zh' ? item.ingredients : (item.localIngredients || item.enIngredients))]) || []).map((ing: string, i: number) => (
                                                             <span key={i} className="text-xs font-bold text-gray-600 bg-gray-100 px-4 py-2 rounded-xl">
                                                                 {ing}
                                                             </span>
                                                         ))}
                                                     </div>
                                                     {/* Allergen & Dietary Info */}
                                                     {(item.allergens?.length > 0 || item.dietary?.length > 0) && (
                                                         <div className="flex flex-wrap gap-2">
                                                             {(item.allergens || []).map((a: string, i: number) => (
                                                                 <span key={`a${i}`} className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                                                                     <AlertTriangle className="w-3 h-3" /> {a}
                                                                 </span>
                                                             ))}
                                                             {(item.dietary || []).map((d: string, i: number) => (
                                                                 <span key={`d${i}`} className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                                                                     <Leaf className="w-3 h-3" /> {d}
                                                                 </span>
                                                             ))}
                                                         </div>
                                                     )}
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

                {/* How It Works Section */}
                {!uploadedImage && (
                    <>
                        <section className="py-10 mb-6">
                            <div className="max-w-5xl mx-auto px-4">
                                {/* Title */}
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-black text-gray-900 mb-2">{t('tools.menu.howitworks.title') || '工作原理'}</h2>
                                    <p className="text-gray-500 text-base">{t('tools.menu.howitworks.subtitle') || '简单三步，即可轻松享受中国美食'}</p>
                                </div>

                                {/* Three Steps */}
                                <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 mb-10">
                                    {[
                                        { 
                                            icon: Upload, 
                                            title: t('tools.menu.howitworks.step1.title') || '上传中文菜单', 
                                            desc: t('tools.menu.howitworks.step1.desc') || '支持 JPG、PNG、GIF 格式，不超过10MB'
                                        },
                                        { 
                                            icon: Brain, 
                                            title: t('tools.menu.howitworks.step2.title') || 'AI分析', 
                                            desc: t('tools.menu.howitworks.step2.desc') || '智能分析菜单，生成高清图片'
                                        },
                                        { 
                                            icon: Utensils, 
                                            title: t('tools.menu.howitworks.step3.title') || '查看下单', 
                                            desc: t('tools.menu.howitworks.step3.desc') || '查看图片、价格，点餐发音下单'
                                        }
                                    ].map((step, i) => (
                                        <React.Fragment key={i}>
                                            <div className="flex flex-col items-center text-center max-w-[200px]">
                                                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 text-purple-600">
                                                    <step.icon className="w-8 h-8" />
                                                </div>
                                                <h3 className="font-black text-lg text-gray-900 mb-2">{step.title}</h3>
                                                <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                                            </div>
                                            {i < 2 && (
                                                <div className="hidden md:block w-24 h-px bg-gradient-to-r from-purple-200 to-purple-300"></div>
                                            )}
                                            {i < 2 && (
                                                <div className="md:hidden w-px h-8 bg-gradient-to-b from-purple-200 to-purple-300 my-2"></div>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>

                                {/* Demo Comparison */}
                                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-0">
                                    {/* Left: Original Menu */}
                                    <div className="bg-gray-50 rounded-[2rem] p-6">
                                        <h3 className="text-center font-black text-gray-700 mb-4">{t('tools.menu.howitworks.original') || '原始中文菜单'}</h3>
                                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 aspect-[3/4] flex items-center justify-center">
                                            <img src="https://static.tripcngo.com/ing/caidan.jpg" alt="Chinese Menu" className="w-full h-full object-contain" />
                                        </div>
                                    </div>

                                    {/* Center: Arrow */}
                                    <div className="hidden lg:flex flex-col items-center justify-center px-6">
                                        <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                                            <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-bold text-purple-400 mt-2">AI</span>
                                    </div>
                                    {/* Mobile: Down Arrow */}
                                    <div className="flex lg:hidden items-center justify-center py-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Right: AI Result */}
                                    <div className="bg-gray-50 rounded-[2rem] p-6">
                                        <h3 className="text-center font-black text-gray-700 mb-4">{t('tools.menu.howitworks.result')}</h3>
                                        <div className="space-y-3">
                                            {[
                                                { 
                                                    name: t('tools.menu.howitworks.dish1.name'), 
                                                    enName: t('tools.menu.howitworks.dish1.enName'),
                                                    price: '¥30', currency: 'CNY', 
                                                    desc: t('tools.menu.howitworks.dish1.desc'), 
                                                    ingredients: t('tools.menu.howitworks.dish1.ingredients'),
                                                    allergens: t('tools.menu.howitworks.dish1.allergens'),
                                                    img: 'https://static.tripcngo.com/ing/%E7%BA%A2%E7%83%A7%E9%B8%A1%E5%9D%97.jpg'
                                                },
                                                { 
                                                    name: t('tools.menu.howitworks.dish2.name'), 
                                                    enName: t('tools.menu.howitworks.dish2.enName'),
                                                    price: '¥15', currency: 'CNY', 
                                                    desc: t('tools.menu.howitworks.dish2.desc'), 
                                                    ingredients: t('tools.menu.howitworks.dish2.ingredients'),
                                                    allergens: t('tools.menu.howitworks.dish2.allergens'),
                                                    img: 'https://static.tripcngo.com/ing/%E5%AE%B6%E5%B8%B8%E8%B1%86%E8%85%90.jpg'
                                                },
                                                { 
                                                    name: t('tools.menu.howitworks.dish3.name'), 
                                                    enName: t('tools.menu.howitworks.dish3.enName'),
                                                    price: '¥35', currency: 'CNY', 
                                                    desc: t('tools.menu.howitworks.dish3.desc'), 
                                                    ingredients: t('tools.menu.howitworks.dish3.ingredients'),
                                                    allergens: t('tools.menu.howitworks.dish3.allergens'),
                                                    img: 'https://static.tripcngo.com/ing/%E8%BE%A3%E5%AD%90%E9%B8%A1.jpg'
                                                }
                                            ].map((dish, i) => (
                                                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4">
                                                    <div className="w-20 h-20 bg-orange-100 rounded-xl flex-shrink-0 overflow-hidden">
                                                        <img src={dish.img} alt={dish.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <div>
                                                                <h4 className="font-black text-gray-900 text-sm">{language === 'zh' || language === 'tw' ? dish.name : dish.enName}</h4>
                                                                {(language !== 'zh' && language !== 'tw') && (
                                                                    <span className="text-xs text-gray-400 font-bold">{dish.name}</span>
                                                                )}
                                                            </div>
                                                            <span className="text-purple-600 font-black text-sm">{dish.price}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 leading-relaxed mb-1 line-clamp-2">{dish.desc}</p>
                                                        <p className="text-xs text-gray-400 mb-1">{dish.ingredients}</p>
                                                        {dish.allergens && (
                                                            <div className="bg-amber-50 border border-amber-200 rounded-lg px-2 py-1 mt-1">
                                                                <p className="text-xs text-amber-700 font-medium leading-relaxed">{dish.allergens}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Pricing Section */}
                        <section className="py-10 border-t border-gray-100">
                            <div className="max-w-6xl mx-auto">
                                {/* Title */}
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-black text-gray-900 mb-2">{tt('tools.menu.pricing.title')}</h2>
                                    <p className="text-gray-500 text-base">{tt('tools.menu.pricing.subtitle')}</p>
                                </div>

                                {/* Billing Toggle */}
                                <div className="flex items-center justify-center gap-3 mb-10">
                                    <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}>{tt('tools.menu.pricing.monthly')}</span>
                                    <button
                                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                                        className="relative w-14 h-7 bg-purple-600 rounded-full transition-colors"
                                    >
                                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${billingCycle === 'yearly' ? 'left-8' : 'left-1'}`} />
                                    </button>
                                    <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-400'}`}>{tt('tools.menu.pricing.yearly')}</span>
                                    {billingCycle === 'yearly' && (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">{tt('tools.menu.pricing.save')}</span>
                                    )}
                                </div>

                                {/* Pricing Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {/* Free Plan */}
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                                        <div className="text-center mb-6">
                                            <h3 className="font-black text-xl text-gray-900 mb-1">{tt('tools.menu.pricing.free.name')}</h3>
                                            <p className="text-sm text-gray-400">{tt('tools.menu.pricing.free.desc')}</p>
                                            <div className="mt-4">
                                                <span className="text-4xl font-black text-gray-900">$0</span>
                                            </div>
                                        </div>
                                        <button className="w-full py-3 rounded-xl bg-gray-100 text-gray-400 font-bold cursor-not-allowed mb-6">
                                            {tt('tools.menu.pricing.current')}
                                        </button>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {tt('tools.menu.pricing.free.feature1')}
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {tt('tools.menu.pricing.free.feature2')}
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {tt('tools.menu.pricing.free.feature3')}
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {tt('tools.menu.pricing.free.feature4')}
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {tt('tools.menu.pricing.free.feature5')}
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Traveler Plan */}
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                                        <div className="text-center mb-6">
                                            <h3 className="font-black text-xl text-gray-900 mb-1">{tt('tools.menu.pricing.traveler.name')}</h3>
                                            <p className="text-sm text-gray-400">{tt('tools.menu.pricing.traveler.desc')}</p>
                                            <div className="mt-4">
                                                <span className="text-4xl font-black text-gray-900">$4.99</span>
                                                <span className="text-gray-400 text-sm">/10天</span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">$0.1/100积分</p>
                                        </div>
                                        <button onClick={() => openPayment(getPaymentUrl('traveler'), 'traveler')} className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors mb-6">
                                            {tt('tools.menu.pricing.select')}
                                        </button>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {tt('tools.menu.pricing.traveler.feature1')}
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {tt('tools.menu.pricing.traveler.feature2')}
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {tt('tools.menu.pricing.traveler.feature3')}
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {tt('tools.menu.pricing.traveler.feature4')}
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {tt('tools.menu.pricing.traveler.feature5')}
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {tt('tools.menu.pricing.traveler.feature6')}
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {tt('tools.menu.pricing.traveler.feature7')}
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Starter Plan - Popular */}
                                    <div className="bg-white rounded-2xl border-2 border-purple-600 p-6 hover:shadow-lg transition-shadow relative">
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                            {tt('tools.menu.pricing.popular')}
                                        </div>
                                        <div className="text-center mb-6">
                                            <h3 className="font-black text-xl text-gray-900 mb-1">{tt('tools.menu.pricing.starter.name')}</h3>
                                            <p className="text-sm text-gray-400">{tt('tools.menu.pricing.starter.desc')}</p>
                                            <div className="mt-4">
                                                <span className="text-4xl font-black text-gray-900">
                                                    {billingCycle === 'monthly' ? '$9.99' : '$99'}
                                                </span>
                                                <span className="text-gray-400 text-sm">/{billingCycle === 'monthly' ? tt('tools.menu.pricing.perMonth') : tt('tools.menu.pricing.perYear')}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {billingCycle === 'monthly' ? '$0.09/100积分' : '$0.075/100积分'}
                                            </p>
                                        </div>
                                        <button onClick={() => openPayment(getPaymentUrl(billingCycle === 'monthly' ? 'starter_monthly' : 'starter_yearly'), billingCycle === 'monthly' ? 'starter_monthly' : 'starter_yearly')} className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors mb-6">
                                            {tt('tools.menu.pricing.select')}
                                        </button>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {billingCycle === 'monthly' ? tt('tools.menu.pricing.starter.feature1') : tt('tools.menu.pricing.starter.feature1Yearly')}
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {tt('tools.menu.pricing.starter.feature2')}
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {tt('tools.menu.pricing.starter.feature3')}
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {tt('tools.menu.pricing.starter.feature4')}
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {tt('tools.menu.pricing.starter.feature5')}
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {tt('tools.menu.pricing.starter.feature6')}
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {tt('tools.menu.pricing.starter.feature7')}
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Pro Plan */}
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                                        <div className="text-center mb-6">
                                            <h3 className="font-black text-xl text-gray-900 mb-1">{tt('tools.menu.pricing.pro.name')}</h3>
                                            <p className="text-sm text-gray-400">{tt('tools.menu.pricing.pro.desc')}</p>
                                            <div className="mt-4">
                                                <span className="text-4xl font-black text-gray-900">
                                                    {billingCycle === 'monthly' ? '$19.99' : '$199'}
                                                </span>
                                                <span className="text-gray-400 text-sm">/{billingCycle === 'monthly' ? tt('tools.menu.pricing.perMonth') : tt('tools.menu.pricing.perYear')}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {billingCycle === 'monthly' ? '$0.08/100积分' : '$0.066/100积分'}
                                            </p>
                                        </div>
                                        <button onClick={() => openPayment(getPaymentUrl(billingCycle === 'monthly' ? 'pro_monthly' : 'pro_yearly'), billingCycle === 'monthly' ? 'pro_monthly' : 'pro_yearly')} className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors mb-6">
                                            {tt('tools.menu.pricing.select')}
                                        </button>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {billingCycle === 'monthly' ? tt('tools.menu.pricing.pro.feature1') : tt('tools.menu.pricing.pro.feature1Yearly')}
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {tt('tools.menu.pricing.pro.feature2')}
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {tt('tools.menu.pricing.pro.feature3')}
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {tt('tools.menu.pricing.pro.feature4')}
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {tt('tools.menu.pricing.pro.feature5')}
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {tt('tools.menu.pricing.pro.feature6')}
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-600">
                                                <Check className="w-4 h-4 text-purple-600" />
                                                {tt('tools.menu.pricing.pro.feature7')}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Features Section */}
                        <section className="py-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { icon: ScanLine, title: t('tools.menu.feature.1.title'), desc: t('tools.menu.feature.1.desc') },
                                { icon: ImageIcon, title: t('tools.menu.feature.2.title'), desc: t('tools.menu.feature.2.desc') },
                                { icon: Wallet, title: t('tools.menu.feature.3.title'), desc: t('tools.menu.feature.3.desc') },
                                { icon: Star, title: t('tools.menu.feature.4.title'), desc: t('tools.menu.feature.4.desc') }
                            ].map((f, i) => (
                                <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-xl transition-all group">
                                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-3 text-purple-600 group-hover:scale-110 transition-transform">
                                        <f.icon className="w-5 h-5" />
                                    </div>
                                    <h5 className="font-black text-sm mb-1">{f.title}</h5>
                                    <p className="text-gray-400 text-xs font-medium leading-relaxed">{f.desc}</p>
                                </div>
                            ))}
                        </section>

                        <section className="py-10 border-t border-gray-100">
                            <div className="max-w-3xl mx-auto">
                                <h2 className="text-2xl font-black text-center mb-6 uppercase tracking-widest text-gray-400">FAQS</h2>
                                <div className="space-y-3">
                                    {faqs.map((f, i) => (
                                        <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                            <button 
                                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-all"
                                            >
                                                <span className="font-bold text-base text-gray-800">{f.q}</span>
                                                <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform ${openFaq === i ? 'rotate-180 text-purple-600' : ''}`} />
                                            </button>
                                            <AnimatePresence>
                                                {openFaq === i && (
                                                    <motion.div 
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="px-6 pb-6 text-gray-500 font-medium leading-relaxed border-t border-gray-50 pt-3"
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
