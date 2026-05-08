"use client";

import React, { useState, useEffect } from 'react';
import { Wifi, CreditCard, Globe, Compass, BookOpen, MessageCircle, Sparkles, ArrowRight, AlertTriangle, CheckCircle2, XCircle, Clock, Gift, Users, ThumbsUp, Volume2, Lock, LogIn, Shield, CreditCard as CardIcon } from 'lucide-react';
import { Link } from '@/lib/router-compat';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTravelGuide } from '../hooks/useTravelGuide';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'motion/react';

// 备用翻译映射 - 当数据库无数据时使用
const fallbackTranslations: Record<string, Record<string, string>> = {
  hero: {
    title: '旅行锦囊',
    subtitle: '中国旅行必备生存工具',
    description: '从网络连接到文化礼仪，一站式解决你的中国之行',
    badge: '旅行必备指南',
    scrollHint: '向下滚动了解更多',
    title_en: 'Travel Guide',
    subtitle_en: 'China Travel Survival Kit',
    description_en: 'From internet to etiquette, everything you need for China',
    badge_en: 'Essential Travel Guide',
    scrollHint_en: 'Scroll for more',
  },
  digital: {
    sectionTitle: '数字生存工具包',
    sectionSubtitle: '网络连接与移动支付的必备指南',
  }
};

// 语音播放组件
const SpeakerButton = ({ text, isPlaying, onClick }: { text: string; isPlaying: boolean; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
      isPlaying 
        ? 'text-green-500 bg-green-50' 
        : 'text-gray-400 hover:text-green-500 hover:bg-green-50'
    }`}
  >
    {isPlaying ? (
      <div className="relative">
        <Volume2 className="w-5 h-5 animate-pulse" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
        </span>
      </div>
    ) : (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    )}
  </button>
);

export default function Guide({ initialData, initialTranslations }: { initialData?: any; initialTranslations?: Record<string, string> }) {
  const { language, t } = useLanguage();
  const { data: guideDataFromHook, loading: dataLoading } = useTravelGuide(language);
  const { user, loading: authLoading, hasPurchased, signInWithGoogle, initiateCheckout, completePayment } = useAuth();
  const isZh = language === 'zh';
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingUnlock, setPendingUnlock] = useState(false);

  // Use initialData from SSR if available, otherwise use hook data
  const guideData = initialData || guideDataFromHook;
  const loading = initialData ? (authLoading && !user) : (dataLoading || (authLoading && !user));

  // 从数据库获取翻译文本的辅助函数
  const getText = (section: string, key: string, fallback: string = ''): string => {
    if (!guideData) return fallback;
    
    const sectionData = (guideData as any)[section];
    if (sectionData && typeof sectionData === 'object') {
      const subsectionData = sectionData[key];
      if (subsectionData && typeof subsectionData === 'object') {
        const value = subsectionData[language] || subsectionData['zh'] || subsectionData['en'];
        if (value) return value;
      }
      if (key === 'vpn' || key === 'payment') {
        const subsection = subsectionData;
        return subsection?.sectionTitle || fallback;
      }
      const value = subsectionData;
      return typeof value === 'string' ? value : fallback;
    }
    return fallback;
  };

  // 语音合成函数
  const speak = (text: string, id: string) => {
    if (playingId === id) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8;
    utterance.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find(v => v.lang.includes('zh') || v.lang.includes('CN'));
    if (zhVoice) {
      utterance.voice = zhVoice;
    }
    utterance.onstart = () => setPlayingId(id);
    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);
    window.speechSynthesis.speak(utterance);
  };

  // 生命周期管理
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, []);

  // 自动处理登录后的解锁
  useEffect(() => {
    if (user && pendingUnlock && !hasPurchased) {
      handlePayment();
      setPendingUnlock(false);
    }
  }, [user, pendingUnlock, hasPurchased]);

  // 处理从登录页返回时自动解锁
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('unlock') === 'true' && user && !hasPurchased) {
      // Handle the return from Creem payment
      const verifyPayment = async () => {
        setIsProcessing(true);
        await completePayment();
        setIsProcessing(false);
      };
      verifyPayment();
      // 清除 URL 参数
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [user, hasPurchased]);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      await initiateCheckout();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnlockAction = async () => {
    handlePayment();
  };

  const PaywallOverlay = () => {
    // 从数据库获取翻译，或使用 fallback
    const paywallTitle = guideData?.paywall?.title || (isZh ? '支付 $1，解锁完整内容' : 'Pay $1, unlock full content');
    const paywallButton = guideData?.paywall?.buttonText || (isZh ? '支付 $1 解锁全部' : 'Pay $1 Unlock All');
    const paywallLoading = guideData?.paywall?.loadingText || (isZh ? '正在解锁...' : 'Unlocking...');
    
    return (
      <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-slate-900/10 backdrop-blur-md rounded-2xl overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#1b887a]/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-[#1b887a]/5 rounded-full blur-[100px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="max-w-md w-full bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/50 p-10 text-center relative z-30"
        >
          {/* Lock Icon with Glow */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-[#1b887a]/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-full h-full bg-gradient-to-br from-[#1b887a] to-[#25ad9b] rounded-full flex items-center justify-center shadow-lg shadow-[#1b887a]/30">
              <Lock className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <p className="text-slate-600 mb-10 leading-relaxed font-medium">
            {paywallTitle}
          </p>

          <div className="space-y-6">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUnlockAction}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 px-6 rounded-2xl transition-all shadow-xl shadow-slate-200 disabled:opacity-50 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {!user && <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 flex-shrink-0" />}
              {user && <CardIcon className="w-5 h-5 text-[#25ad9b]" />}
              <span>
                {isProcessing ? paywallLoading : paywallButton}
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title={isZh ? '旅行锦囊' : 'Travel Guide'}
        description={isZh ? '中国旅行必备锦囊' : 'Essential China Travel Guide'}
      />
      
      {/* Hero Section */}
      <div className="relative h-[450px] flex items-center justify-center overflow-hidden">
        <img 
          src="https://static.tripcngo.com/ing/jingnangbg.jpg" 
          alt="China Travel" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="relative text-center text-white px-6 max-w-3xl pt-24">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">{guideData?.hero?.badge || (isZh ? '旅行必备指南' : 'Essential Travel Guide')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{guideData?.hero?.title || (isZh ? '旅行锦囊' : 'Travel Guide')}</h1>
          <p className="text-lg md:text-xl text-gray-200 mb-2">{guideData?.hero?.subtitle || (isZh ? '中国旅行必备生存工具' : 'China Travel Survival Kit')}</p>
          <p className="text-gray-300 max-w-xl mx-auto">{guideData?.hero?.description || (isZh ? '从网络连接到文化礼仪，一站式解决你的中国之行' : 'From internet to etiquette, everything you need for China')}</p>
          <div className="mt-8 flex flex-col items-center animate-bounce">
            <svg className="w-6 h-6 text-white/70 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-4 4m4-4l4 4" />
              <rect x="7" y="3" width="10" height="14" rx="5" strokeWidth={2} stroke="currentColor" fill="none" />
              <line x1="12" y1="7" x2="12" y2="11" strokeLinecap="round" strokeWidth={2} />
            </svg>
            <span className="text-white/60 text-sm">{guideData?.hero?.scrollHint || (isZh ? '向下滚动了解更多' : 'Scroll for more')}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 space-y-6">
        
        {/* 数字生存工具包 */}
        <div className="relative">
          {/* 标题区域 */}
          <div className="text-center py-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{guideData?.digital?.sectionTitle || (isZh ? '数字生存工具包' : 'Digital Survival Kit')}</h2>
            <p className="text-gray-500">{guideData?.digital?.sectionSubtitle || (isZh ? '网络连接与移动支付的必备指南' : 'Essential guide for internet and mobile payments')}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 transition-all duration-700">
            {/* 左侧：互联网连接VPN */}
            <div className="space-y-5">
              {/* 标题 */}
              <div className="text-center">
                <h3 className="font-bold text-lg text-gray-900">{guideData?.digital?.vpn?.title || (isZh ? '互联网连接：VPN' : 'Internet Connectivity: VPN')}</h3>
                <p className="text-sm text-gray-500 mt-1">{guideData?.digital?.vpn?.subtitle || (isZh ? '访问国际互联网服务的必备工具' : 'Essential tools to stay connected with the world')}</p>
              </div>
              
              {/* 重要提醒 */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-amber-800 text-sm">{guideData?.digital?.vpn?.importantTitle || (isZh ? '重要提醒' : 'CRITICAL SETUP')}</div>
                    <div className="text-amber-700 text-sm mt-1">{guideData?.digital?.vpn?.importantDesc || (isZh ? '必须在入华前下载并安装VPN！在中国境内无法下载。' : 'You MUST install a VPN before arriving in China. App stores and VPN sites are blocked locally.')}</div>
                  </div>
                </div>
              </div>
              
              {/* 为什么需要VPN */}
              <div>
                <h4 className="font-bold text-gray-800 mb-2 text-sm">{guideData?.digital?.vpn?.whyNeedTitle || (isZh ? '为什么需要VPN?' : 'Why you need a VPN?')}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{guideData?.digital?.vpn?.whyNeedDesc || (isZh ? '中国对互联网内容进行严格审查，许多国外社交媒体、新闻网站、搜索引擎等在中国无法直接访问，如谷歌、YouTube、WhatsApp、Facebook和Instagram。' : 'WhatsApp, Google, Instagram, and Facebook are all blocked. A reputable VPN is your only way to use these services and stay in touch.')}</p>
              </div>
              
              {/* 手机网络选择 */}
              <div>
                <h4 className="font-bold text-gray-800 mb-3 text-sm">{guideData?.digital?.vpn?.mobileTitle || '手机网络选择'}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                    <div className="flex items-center gap-1 mb-2">
                      <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">{guideData?.digital?.vpn?.recommended || '推荐'}</span>
                      <span className="font-bold text-green-700 text-sm">{guideData?.digital?.vpn?.esim || 'eSIM'}</span>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• {guideData?.digital?.vpn?.esimDesc1 || '出发前在线购买'}</li>
                      <li>• {guideData?.digital?.vpn?.esimDesc2 || '部分可直接访问国际网络'}</li>
                      <li>• {guideData?.digital?.vpn?.esimDesc3 || '推荐：Trip.com eSIM'}</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="font-bold text-gray-700 text-sm mb-2">{guideData?.digital?.vpn?.simCard || '本地SIM卡'}</div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• {guideData?.digital?.vpn?.simCardDesc1 || '需要护照实名登记'}</li>
                      <li>• {guideData?.digital?.vpn?.simCardDesc2 || '适合长期停留'}</li>
                      <li>• {guideData?.digital?.vpn?.simCardDesc3 || '运营商：中国联通'}</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* 旅行必备APP */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-800 text-sm">{guideData?.digital?.vpn?.appsTitle || '旅行必备APP'}</h4>
                  <Link to="/apps" className="text-green-600 text-xs hover:underline">{guideData?.digital?.vpn?.appsMoreLink || '更多工具 >>'}</Link>
                </div>
                <div className="flex gap-4">
                  {[
                    { name: guideData?.digital?.vpn?.appWechat || 'WeChat(微信)', icon: 'https://static.tripcngo.com/ing/weixin.webp' },
                    { name: guideData?.digital?.vpn?.appAlipay || 'Alipay(支付宝)', icon: 'https://static.tripcngo.com/ing/zhifubao.webp' },
                    { name: guideData?.digital?.vpn?.appMeituan || 'MeiTuan(美团)', icon: 'https://static.tripcngo.com/ing/meituan.webp' },
                    { name: guideData?.digital?.vpn?.appXiaohongshu || 'Xiaohongshu(小红书)', icon: 'https://static.tripcngo.com/ing/xiaohongshu.webp' },
                  ].map(app => (
                    <Link to="/apps" key={app.name} className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity">
                      <img src={app.icon} alt={app.name} className="w-12 h-12" />
                      <span className="text-xs text-gray-600 text-center leading-tight">{app.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 右侧：掌握移动支付 */}
            <div className="space-y-5">
              {/* 标题 */}
              <div className="text-center">
                <h3 className="font-bold text-lg text-gray-900">{guideData?.digital?.payment?.title || (isZh ? '移动支付' : 'Mobile Payments')}</h3>
                <p className="text-sm text-gray-500 mt-1">{guideData?.digital?.payment?.subtitle || (isZh ? '中国移动支付生态详解' : 'Mastering the local payment ecosystem')}</p>
              </div>
              
              {/* 绿色提示框 */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="font-bold text-green-800 text-sm mb-1">{guideData?.digital?.payment?.international || (isZh ? '国际版支付宝/微信' : 'International Card Support')}</div>
                <div className="text-green-700 text-sm">{guideData?.digital?.payment?.internationalDesc || (isZh ? '支持绑定外国银行卡，适合短期游客' : 'You can now bind Visa/Mastercard directly to local apps. Highly recommended.')}</div>
              </div>
              
              {/* 首选支付宝 */}
              <div>
                <h4 className="font-bold text-gray-800 mb-3 text-sm">{guideData?.digital?.payment?.alipay || (isZh ? '支付宝' : 'Alipay (Top Choice)')}</h4>
                
                <div className="mb-4">
                  <div className="font-semibold text-sm text-gray-700 mb-3">{guideData?.digital?.payment?.alipayDesc || (isZh ? '中国最大的第三方支付平台' : 'The most traveler-friendly payment platform in China.')}</div>
                  <div className="space-y-2">
                    {(guideData?.digital?.payment?.tips || (isZh ? '下载官方APP|完成身份认证|进行支付测试' : 'Download the App|Verify your identity|Link your international card')).split('|').map((tip, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="w-5 h-5 bg-gray-200 text-gray-600 rounded text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                        <span className="text-sm text-gray-700">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* 支付操作手册 */}
              <div>
                <h4 className="font-bold text-gray-800 mb-3 text-sm">{guideData?.digital?.payment?.tipsTitle || '使用提示'}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <a href={`/${language === 'zh' ? 'cn' : language}/articles/URfBdxNg910nkgS3ewAh`} className="block border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-blue-500 aspect-video flex items-center justify-center">
                      <img src="https://cxegaqhwexiidezycbyg.supabase.co/storage/v1/object/public/images/thumbnails/1778045638834-xu03em.png" alt="WeChat Pay" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2 text-xs text-gray-600 text-center">{guideData?.digital?.payment?.wechatPay || '微信支付'}</div>
                  </a>
                   <a href={`/${language === 'zh' ? 'cn' : language}/articles/article-1778045526248-1dehf0`} className="block border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-green-500 aspect-video flex items-center justify-center">
                      <img src="https://cxegaqhwexiidezycbyg.supabase.co/storage/v1/object/public/images/thumbnails/1777948467869-874ac90d740edd3636caab26168edba7_image_url_https_3A_2F_2Fassets.wanderchina.guide_2Fupload_2Fguide_2Fcover-4.jpg_w_3840_q_75.jpg" alt="Alipay" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2 text-xs text-gray-600 text-center">{guideData?.digital?.payment?.alipay || '支付宝'}</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 语言工具箱 */}
        <div className="relative pt-12 border-t border-gray-200">
          {/* 标题区域 */}
          <div className="text-center py-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{guideData?.language?.vocabulary?.sectionTitle || (isZh ? '语言工具箱' : 'Language Toolkit')}</h2>
            <p className="text-gray-500">{guideData?.language?.vocabulary?.sectionSubtitle || (isZh ? '高频词汇与实用短语' : 'High-frequency vocabulary and common phrases')}</p>
          </div>
          
          <div className={`space-y-12 transition-all duration-700 ${!hasPurchased ? 'blur-md select-none pointer-events-none opacity-50' : ''}`}>
            {/* 高频核心词汇 */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4 text-lg">{guideData?.language?.vocabulary?.vocabularyTitle || (isZh ? '高频核心词汇' : 'High-Frequency Core Vocabulary')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { key: 'hello', cn: '你好', pinyin: 'Nǐ hǎo', en: 'Hello' },
                  { key: 'thank', cn: '谢谢', pinyin: 'Xièxiè', en: 'Thank you' },
                  { key: 'sorry', cn: '对不起', pinyin: 'Duìbùqǐ', en: 'Sorry' },
                  { key: 'yes', cn: '是', pinyin: 'Shì', en: 'Yes' },
                  { key: 'no', cn: '不是', pinyin: 'Bú shì', en: 'No' },
                  { key: 'please', cn: '请', pinyin: 'Qǐng', en: 'Please' },
                  { key: 'toilet', cn: '厕所', pinyin: 'Cè suǒ', en: 'Restroom' },
                  { key: 'howMuch', cn: '多少钱?', pinyin: 'Duōshǎo qián?', en: 'How much?' },
                  { key: 'expensive', cn: '太贵了', pinyin: 'Tài guì le', en: 'Too expensive' },
                  { key: 'help', cn: '救命', pinyin: 'Jiù mìng', en: 'Help!' },
                ].map((v) => {
                  const displayText = guideData?.language?.vocabulary?.[v.key] || v.cn;
                  const displayPinyin = guideData?.language?.vocabulary?.[`${v.key}Pinyin`] || v.pinyin;
                  const displayEn = guideData?.language?.vocabulary?.[`${v.key}Meaning`] || v.en;
                  return (
                    <div key={v.key} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-100/50">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-gray-900">{displayText}</span>
                          <span className="text-sm text-gray-500">({displayPinyin})</span>
                        </div>
                        <div className="text-sm text-gray-400 mt-0.5">{displayEn}</div>
                      </div>
                      <SpeakerButton 
                        text={v.cn} 
                        isPlaying={playingId === `vocab-${v.key}`}
                        onClick={() => speak(v.cn, `vocab-${v.key}`)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 情景对话手册 */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4 text-lg">{guideData?.language?.vocabulary?.phraseTitle || (isZh ? '实用短语' : 'Practical Phrases')}</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* 用餐与点菜 */}
                <div className="p-0">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">🍽️</span>
                    <span className="font-bold text-gray-800">{isZh ? '用餐与点菜' : 'Dining & Ordering'}</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { key: 'phrase1', cn: '你好，你叫什么名字？', en: 'Hello, what is your name?' },
                      { key: 'phrase2', cn: '请问，厕所在哪里？', en: 'Excuse me, where is the toilet?' },
                      { key: 'phrase3', cn: '这个多少钱？', en: 'How much is this?' },
                      { key: 'phrase4', cn: '可以便宜一点吗？', en: 'Can you make it cheaper?' },
                      { key: 'phrase5', cn: '我不明白，请再说一遍', en: "I don't understand, please say it again" },
                    ].map((p, i) => {
                      const displayText = guideData?.language?.vocabulary?.[p.key] || p.cn;
                      const displayEn = guideData?.language?.vocabulary?.[`${p.key}Meaning`] || p.en;
                      return (
                        <div key={p.key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="font-medium text-gray-900">{displayText}</span>
                            </div>
                            <div className="text-sm text-gray-400">{displayEn}</div>
                          </div>
                          <SpeakerButton 
                            text={p.cn} 
                            isPlaying={playingId === `dining-${p.key}`}
                            onClick={() => speak(p.cn, `dining-${p.key}`)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 问路与交通 */}
                <div className="p-0">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">🧭</span>
                    <span className="font-bold text-gray-800">{isZh ? '问路与交通' : 'Directions & Transit'}</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { key: 'phrase6', cn: '请问，去...怎么走？', en: 'Excuse me, how do I get to...?' },
                      { key: 'phrase7', cn: '请问，...在哪里？', en: 'Excuse me, where is...?' },
                      { key: 'phrase8', cn: '请问，有...吗？', en: 'Excuse me, do you have...?' },
                      { key: 'phrase9', cn: '请问，能...吗？', en: 'Excuse me, can you...?' },
                      { key: 'phrase10', cn: '请问，...在哪里？', en: 'Excuse me, where is...?' },
                    ].map((p, i) => {
                      const displayText = guideData?.language?.vocabulary?.[p.key] || p.cn;
                      const displayEn = guideData?.language?.vocabulary?.[`${p.key}Meaning`] || p.en;
                      return (
                        <div key={p.key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="font-medium text-gray-900">{displayText}</span>
                            </div>
                            <div className="text-sm text-gray-400">{displayEn}</div>
                          </div>
                          <SpeakerButton 
                            text={p.cn} 
                            isPlaying={playingId === `direction-${p.key}`}
                            onClick={() => speak(p.cn, `direction-${p.key}`)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!hasPurchased && <PaywallOverlay />}
        </div>

        {/* 核心汉字快速识别 */}
        <div className="relative pt-12 border-t border-gray-200">
          <div className={`transition-all duration-700 ${!hasPurchased ? 'blur-md select-none pointer-events-none opacity-50' : ''}`}>
            <h2 className="font-bold text-gray-800 mb-6 text-xl text-center">{guideData?.character?.sectionTitle || (isZh ? '核心汉字快速识别' : 'Essential Chinese Characters')}</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { key: '男', pinyin: 'nán', img: 'https://static.tripcngo.com/ing/男.jpg' },
                { key: '女', pinyin: 'nǚ', img: 'https://static.tripcngo.com/ing/女.jpg' },
                { key: '入口', pinyin: 'rùkǒu', img: 'https://static.tripcngo.com/ing/入口.jpg' },
                { key: '出口', pinyin: 'chūkǒu', img: 'https://static.tripcngo.com/ing/出口.jpg' },
                { key: '推', pinyin: 'tuī', img: 'https://static.tripcngo.com/ing/推.jpg' },
                { key: '拉', pinyin: 'lā', img: 'https://static.tripcngo.com/ing/拉.jpg' },
                { key: '地铁', pinyin: 'dìtiě', img: 'https://static.tripcngo.com/ing/地铁.jpg' },
                { key: '辣', pinyin: 'là', img: 'https://static.tripcngo.com/ing/辣.jpg' },
                { key: '卫生间', pinyin: 'wèishēngjiān', img: 'https://static.tripcngo.com/ing/卫生间.jpg' },
              ].map((char) => {
                const displayChar = guideData?.character?.[char.key] || char.key;
                const displayPinyin = guideData?.character?.[`${char.key}Pinyin`] || char.pinyin;
                const displayMeaning = guideData?.character?.[`${char.key}Meaning`] || char.pinyin;
                return (
                  <div key={char.key} className="p-4 text-center border-b border-gray-100 sm:border-0">
                    <div className="mb-2">
                      <span className="text-xl font-bold text-gray-900">{displayChar}</span>
                      <span className="text-sm text-gray-500 ml-1">({displayPinyin})</span>
                    </div>
                    <div className="text-sm text-gray-400 mb-3">{displayMeaning}</div>
                    <img src={char.img} alt={char.key} className="w-full aspect-square object-contain rounded-lg" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 文化指南针 */}
        <div className="relative pt-12 border-t border-gray-200">
          {/* 标题区域 */}
          <div className="text-center py-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{guideData?.culture?.dining?.sectionTitle || (isZh ? '文化指南针' : 'Culture Compass')}</h2>
            <p className="text-gray-500">{guideData?.culture?.dining?.sectionSubtitle || (isZh ? '了解中国礼仪文化，让旅行更顺畅' : 'Understanding Chinese etiquette makes travel smoother')}</p>
          </div>
          
          <div className={`space-y-12 transition-all duration-700 ${!hasPurchased ? 'blur-md select-none pointer-events-none opacity-50' : ''}`}>
            {/* 餐饮礼仪 */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4 text-lg">{isZh ? '餐饮礼仪' : 'Dining Etiquette'}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {/* 筷子禁忌 */}
                <div className="bg-red-50 rounded-xl border border-red-100 overflow-hidden">
                  <div className="bg-red-100 px-4 py-3 flex items-center gap-2">
                    <span className="text-red-500">✕</span>
                    <span className="font-semibold text-red-700">{guideData?.culture?.dining?.chopsticksTitle || (isZh ? '筷子禁忌' : 'Chopstick Taboos')}</span>
                  </div>
                  <ul className="p-4 space-y-2 text-sm text-red-800">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>{guideData?.culture?.dining?.chopstickTip1 || (isZh ? '禁止将筷子竖插在米饭中，因为这象征着祭奠' : 'Never stick chopsticks vertically in rice, as it symbolizes funeral offerings')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>{guideData?.culture?.dining?.chopstickTip2 || (isZh ? '禁止用筷子敲碗，因为这象征着乞丐' : 'Never tap your bowl with chopsticks, as it symbolizes begging')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>{guideData?.culture?.dining?.chopstickTip3 || (isZh ? '禁止用筷子指人，因为这很不礼貌' : 'Never point chopsticks at people, as it is very impolite')}</span>
                    </li>
                  </ul>
                </div>
                
                {/* 敬酒规则 */}
                <div className="bg-green-50 rounded-xl border border-green-100 overflow-hidden">
                  <div className="bg-green-100 px-4 py-3 flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="font-semibold text-green-700">{guideData?.culture?.dining?.toastingTitle || (isZh ? '敬酒规则' : 'Toasting Rules')}</span>
                  </div>
                  <ul className="p-4 space-y-2 text-sm text-green-800">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>{guideData?.culture?.dining?.toastingTip1 || (isZh ? '碰杯时杯沿低于长辈或上级' : 'Keep your glass rim lower than elders or superiors when clinking')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>{guideData?.culture?.dining?.toastingTip2 || (isZh ? '听到"干杯(gānbēi)"时应喝光' : 'Drink up when you hear "Ganbei" (Cheers)')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>{guideData?.culture?.dining?.toastingTip3 || (isZh ? '听到"随意(suíyì)"时可以随意喝' : 'Drink as you like when you hear "Suiyi" (As you wish)')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* 赠礼的艺术 */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4 text-lg">{guideData?.culture?.gift?.title || (isZh ? '赠礼的艺术' : 'The Art of Gift Giving')}</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {/* 合适的礼物 */}
                <div className="overflow-hidden">
                  <div className="py-3 text-center border-b border-gray-200">
                    <span className="font-semibold text-gray-700">{guideData?.culture?.gift?.goodTitle || (isZh ? '合适的礼物' : 'Appropriate Gifts')}</span>
                  </div>
                  <ul className="py-4 space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{guideData?.culture?.gift?.goodTip1 || (isZh ? '茶叶（龙井、普洱等）' : 'Tea (Longjing, Pu-erh, etc.)')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{guideData?.culture?.gift?.goodTip2 || (isZh ? '丝绸制品（丝巾、领带）' : 'Silk products (scarves, ties)')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{guideData?.culture?.gift?.goodTip3 || (isZh ? '工艺品（瓷器、景泰蓝）' : 'Crafts (porcelain, cloisonné)')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{guideData?.culture?.gift?.goodTip4 || (isZh ? '水果（苹果、橙子）' : 'Fruit (apples, oranges)')}</span>
                    </li>
                  </ul>
                </div>
                
                {/* 禁忌的礼物 */}
                <div className="overflow-hidden">
                  <div className="py-3 text-center border-b border-gray-200">
                    <span className="font-semibold text-gray-700">{guideData?.culture?.gift?.avoidTitle || (isZh ? '禁忌的礼物' : 'Taboo Gifts')}</span>
                  </div>
                  <ul className="py-4 space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{guideData?.culture?.gift?.avoidTip1 || (isZh ? '钟（与「终」同音）' : 'Clocks — sounds like "end"')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{guideData?.culture?.gift?.avoidTip2 || (isZh ? '梨（与「离」同音）' : 'Pears — sounds like "separation"')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{guideData?.culture?.gift?.avoidTip3 || (isZh ? '伞（与「散」同音）' : 'Umbrellas — sounds like "separate"')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{guideData?.culture?.gift?.avoidTip4 || (isZh ? '白色或黑色包装（不吉利）' : 'White/black wrapping (inauspicious)')}</span>
                    </li>
                  </ul>
                </div>
                
                {/* 赠礼仪式 */}
                <div className="overflow-hidden">
                  <div className="py-3 text-center border-b border-gray-200">
                    <span className="font-semibold text-gray-700">{guideData?.culture?.gift?.ritualTitle || (isZh ? '赠礼仪式' : 'Gift Giving Etiquette')}</span>
                  </div>
                  <ul className="py-4 space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{guideData?.culture?.gift?.ritualTip1 || (isZh ? '双手递送礼物表示尊重' : 'Give gifts with both hands as respect')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{guideData?.culture?.gift?.ritualTip2 || (isZh ? '收到礼物后不应立即打开' : 'Do not open gifts immediately')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 通用社交意识 */}
        <div className="relative pt-12 border-t border-gray-200">
          <div className={`transition-all duration-700 ${!hasPurchased ? 'blur-md select-none pointer-events-none opacity-50' : ''}`}>
            <h2 className="font-bold text-gray-800 mb-8 text-xl text-center">{guideData?.culture?.social?.title || (isZh ? '通用社交意识' : 'General Social Awareness')}</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* 敏感话题 */}
              <div className="py-5 border-b border-gray-100 last:border-0 md:border-b-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                  <span className="font-semibold text-gray-800">{guideData?.culture?.social?.topicTitle || (isZh ? '敏感话题' : 'Sensitive Topics')}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {guideData?.culture?.social?.topicTip1 || (isZh ? '避免讨论政治、宗教、性等敏感话题' : 'Avoid discussing sensitive topics like politics, religion, and sex')}
                </p>
              </div>
              
              {/* 好客 */}
              <div className="py-5 border-b border-gray-100 last:border-0 md:border-b-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                  <span className="font-semibold text-gray-800">{guideData?.culture?.social?.hospitalityTitle || (isZh ? '好客' : 'Hospitality')}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {guideData?.culture?.social?.hospitalityTip1 || (isZh ? '中国人会反复邀请以示热情' : 'Chinese people will invite multiple times to show enthusiasm')}
                </p>
              </div>
              
              {/* 面子 */}
              <div className="py-5 border-b border-gray-100 last:border-0 md:border-b-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                  <span className="font-semibold text-gray-800">{guideData?.culture?.social?.faceTitle || (isZh ? '面子' : 'Face (Mianzi)')}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {guideData?.culture?.social?.faceTip1 || (isZh ? '公开场合避免让人丢脸' : 'Avoid embarrassing others in public')}
                </p>
              </div>
              
              {/* 问候 */}
              <div className="py-5 border-b border-gray-100 last:border-0 md:border-b-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                  <span className="font-semibold text-gray-800">{guideData?.culture?.social?.greetingTitle || (isZh ? '问候' : 'Greetings')}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {guideData?.culture?.social?.greetingTip1 || (isZh ? '点头微笑是最安全的问候方式' : 'A nod and smile is the safest way to greet')}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
