"use client";

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from '@/lib/router-compat';
import { Globe, ChevronDown, Menu, X, CheckSquare, Compass, PlayCircle, BookOpen, Shield, ScanLine, Type, Calculator, Languages, Check, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage, Language } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { user, signInWithGoogle } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [mobileExpandedMenu, setMobileExpandedMenu] = useState<string | null>(null);
  const [showLangBanner, setShowLangBanner] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMenuTranslatorPage = /\/tools\/menu-translator/.test(location.pathname || '');
  const langToPrefix: Record<string, string> = {
    zh: 'cn',
    tw: 'tw',
    en: 'en',
    ja: 'ja',
    ko: 'ko',
    ru: 'ru',
    fr: 'fr',
    es: 'es',
    de: 'de',
    it: 'it'
  };
  const langPrefix = langToPrefix[language] || 'en';

  const languages = [
    { code: 'zh', name: '简体中文', flag: 'https://pub-bfcc5034e6b14811955a8bed50650469.r2.dev/ing/%E4%B8%AD%E5%9B%BD%E5%9B%BD%E6%97%97.png' },
    { code: 'en', name: 'English', flag: 'https://pub-bfcc5034e6b14811955a8bed50650469.r2.dev/ing/USA.png' },
    { code: 'ja', name: '日本語', flag: 'https://pub-bfcc5034e6b14811955a8bed50650469.r2.dev/ing/%E6%97%A5%E6%9C%AC%E5%9B%BD%E6%97%97.png' },
    { code: 'ko', name: '한국어', flag: 'https://pub-bfcc5034e6b14811955a8bed50650469.r2.dev/ing/%E9%9F%A9%E5%9B%BD%E5%9B%BD%E6%97%97.png' },
    { code: 'ru', name: 'Русский', flag: 'https://static.tripcngo.com/%E4%BF%84%E7%BD%97%E6%96%AF%E5%9B%BD%E6%97%97.png' },
    { code: 'fr', name: 'Français', flag: 'https://pub-bfcc5034e6b14811955a8bed50650469.r2.dev/ing/%E6%B3%95%E5%9B%BD%E5%9B%BD%E6%97%97.png' },
    { code: 'es', name: 'Español', flag: 'https://static.tripcngo.com/%E8%A5%BF%E7%8F%AD%E7%89%99%E5%9B%BD%E6%97%97-%E6%96%B9.png' },
    { code: 'de', name: 'Deutsch', flag: 'https://pub-bfcc5034e6b14811955a8bed50650469.r2.dev/ing/%E5%BE%B7%E5%9B%BD%E5%9B%BD%E6%97%97.png' },
    { code: 'tw', name: '繁體中文', flag: 'https://pub-bfcc5034e6b14811955a8bed50650469.r2.dev/ing/%E7%B9%81%E4%BD%93%E4%B8%AD%E6%96%87.png' },
    { code: 'it', name: 'Italiano', flag: 'https://static.tripcngo.com/%E6%84%8F%E5%A4%A7%E5%88%A9%E5%9B%BD%E6%97%97.png' }
  ];

  const [detectedLang, setDetectedLang] = useState<Language | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const browserLang = navigator.language.toLowerCase();
    const dismissed = localStorage.getItem('hideLangBanner');
    
    // Find matching language code
    const matchedLang = languages.find(l => 
      browserLang.startsWith(l.code) || 
      (l.code === 'tw' && (browserLang === 'zh-tw' || browserLang === 'zh-hk'))
    );

    if (matchedLang && matchedLang.code !== language && !dismissed) {
      setDetectedLang(matchedLang.code as Language);
      setShowLangBanner(true);
    } else {
      setShowLangBanner(false);
    }
  }, [language]);

  const handleSwitchLanguage = (targetLang: Language) => {
    localStorage.setItem('hideLangBanner', 'true');
    setShowLangBanner(false);
    
    setLanguage(targetLang);
    const newLangPrefix = langToPrefix[targetLang] || 'en';
    
    // Build new path with the target language prefix
    let newPath = location.pathname || '';
    const pathParts = newPath.split('/');
    const validPrefixes = ['cn', 'tw', 'en', 'ja', 'ko', 'ru', 'fr', 'es', 'de', 'it'];
    if (validPrefixes.includes(pathParts[1])) {
      pathParts[1] = newLangPrefix;
    } else {
      pathParts.splice(1, 0, newLangPrefix);
    }
    newPath = pathParts.join('/') || '/';
    
    // Use Next.js router.replace to trigger proper navigation and metadata update
    navigate(newPath + (location.search || ''), { replace: true });
  };

  const handleDismissBanner = () => {
    localStorage.setItem('hideLangBanner', 'true');
    setShowLangBanner(false);
  };

  const navLinks = [
    { name: t('nav.home'), path: `/${langPrefix}` },
    { name: t('nav.visa'), path: `/${langPrefix}/visa`, hasDropdown: true },
    { name: t('nav.discover'), path: `/${langPrefix}/cities`, hasDropdown: true },
    { name: t('nav.tools'), path: `/${langPrefix}/apps`, hasDropdown: true },
    { name: t('nav.catalog'), path: `/${langPrefix}/apps` }
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 flex flex-col pt-[env(safe-area-inset-top)] ${
        isScrolled ? 'bg-white/40 backdrop-blur-xl shadow-sm text-gray-800' : 'bg-transparent shadow-none text-white'
      }`}
    >
      <AnimatePresence>
        {showLangBanner && detectedLang && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#179B4D] w-full overflow-hidden"
          >
            <div className="py-2.5 px-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-[12px] sm:text-[14px] relative">
              <div className="flex items-center gap-2 text-white">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="text-center sm:text-left leading-tight">
                  {language === 'en' 
                    ? `Your browser language is ${languages.find(l => l.code === detectedLang)?.name}. Switch?`
                    : language === 'zh'
                    ? `检测到浏览器语言为 ${languages.find(l => l.code === detectedLang)?.name}，是否切换？`
                    : `Browser language: ${languages.find(l => l.code === detectedLang)?.name}. Switch?`}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleSwitchLanguage(detectedLang)}
                  className="bg-white text-[#179B4D] px-4 py-1.5 rounded-full hover:bg-white/90 font-bold transition-colors whitespace-nowrap"
                >
                  {language === 'en' 
                    ? `Switch`
                    : language === 'zh'
                    ? `立即切换`
                    : `Switch`}
                </button>
                <button 
                  onClick={handleDismissBanner}
                  className="bg-transparent border border-white/30 text-white px-4 py-1.5 rounded-full hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  {language === 'en' ? 'Keep' : language === 'zh' ? '保持当前' : 'Keep'}
                </button>
              </div>
              <button 
                onClick={handleDismissBanner}
                className="absolute right-2 top-2 p-1 text-white/60 hover:text-white sm:static sm:p-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`w-full max-w-[1400px] mx-auto px-6 flex justify-between items-center transition-all duration-300 ${isScrolled ? 'py-3' : 'py-6'}`}>
        {/* Logo */}
        <Link to={`/${langPrefix}`} className="flex items-center">
          <img src="/logo.png" alt="tripcngo.com" className="h-10 object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10 font-medium relative">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            const isDiscover = item.name === t('nav.discover');
            const isVisa = item.name === t('nav.visa');
            const isTools = item.name === t('nav.tools');

            return (
              <div key={item.name} className="relative group/nav">
                {isTools ? (
                  <button 
                    className={`flex items-center gap-1 text-[15px] transition-colors hover:text-gray-400 py-2 cursor-pointer ${isActive ? 'text-green-400' : (isScrolled ? 'text-gray-800' : 'text-white')}`}
                  >
                    {item.name}
                    {item.hasDropdown && <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                ) : (
                  <Link 
                    to={item.path}
                    className={`flex items-center gap-1 text-[15px] transition-colors hover:text-gray-400 py-2 ${isActive ? 'text-green-400' : (isScrolled ? 'text-gray-800' : 'text-white')}`}
                  >
                    {item.name}
                    {item.hasDropdown && <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
                  </Link>
                )}

                {/* Visa Mega Menu */}
                {isVisa && (
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[650px] bg-white rounded-lg shadow-xl border border-gray-100 text-gray-800 transition-all duration-200 transform origin-top z-50
                    opacity-0 invisible -translate-y-2 group-hover/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0
                  `}>
                    {/* Arrow pointing up */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-100 transform rotate-45 z-[-1]" />
                    
                    <div className="flex p-5 h-[320px]">
                      {/* Left Column: Teal Card */}
                      <div className="w-[300px] bg-[#1b887a] rounded-lg p-6 text-white flex flex-col justify-between flex-shrink-0">
                        <div>
                          <h3 className="text-lg font-medium mb-3">{t('visa.mega.title')}</h3>
                          <p className="text-[13px] leading-relaxed text-teal-50/90">
                            {t('visa.mega.desc')}
                          </p>
                        </div>
                        <div className="text-right mt-4">
                          <Link to={`/${langPrefix}/visa`} className="text-[13px] hover:text-white/80 transition-colors inline-flex items-center">
                            {t('visa.mega.view')} <span className="ml-1">→</span>
                          </Link>
                        </div>
                      </div>
                      
                      {/* Right Column: Links */}
                      <div className="flex-1 pl-10 py-2 flex flex-col justify-between">
                        <Link to={`/${langPrefix}/visa/types`} className="text-[14px] font-medium text-gray-800 hover:text-[#1b887a] block">{t('visa.types')}</Link>
                        <Link to={`/${langPrefix}/visa/photo`} className="text-[14px] font-medium text-gray-800 hover:text-[#1b887a] block">{t('visa.photo')}</Link>
                        <Link to={`/${langPrefix}/visa/fees`} className="text-[14px] font-medium text-gray-800 hover:text-[#1b887a] block">{t('visa.fee')}</Link>
                        <Link to={`/${langPrefix}/visa/form`} className="text-[14px] font-medium text-gray-800 hover:text-[#1b887a] block">{t('visa.form')}</Link>
                        <Link to={`/${langPrefix}/visa/arrival-card`} className="text-[14px] font-medium text-gray-800 hover:text-[#1b887a] block">{t('visa.card')}</Link>
                        <Link to={`/${langPrefix}/visa/downloads`} className="text-[14px] font-medium text-gray-800 hover:text-[#1b887a] block">{t('visa.menu.download')}</Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Discover Mega Menu */}
                {isDiscover && (
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[800px] bg-white rounded-lg shadow-xl border border-gray-100 text-gray-800 transition-all duration-200 transform origin-top z-50
                    opacity-0 invisible -translate-y-2 group-hover/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0
                  `}>
                    {/* Arrow pointing up */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-100 transform rotate-45 z-[-1]" />
                    
                    <div className="flex p-6">
                      {/* Left Column: Cities */}
                      <div className="w-1/2 pr-6 border-r border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-green-600 font-bold text-[15px]">{t('discover.hotCities')}</h3>
                          <Link to={`/${langPrefix}/cities`} className="text-green-600 text-[13px] hover:underline">{t('discover.moreCities')} &gt;&gt;</Link>
                        </div>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[13px]">
                          <Link to={`/${langPrefix}/cities/beijing`} className="hover:text-green-600 truncate">{t('city.beijing')}(Beijing)</Link>
                          <Link to={`/${langPrefix}/cities/shanghai`} className="hover:text-green-600 truncate">{t('city.shanghai')}(Shanghai)</Link>
                          <Link to={`/${langPrefix}/cities/LZ1r5Fsq3bOUHUeKVgIv`} className="hover:text-green-600 truncate">{t('city.guangzhou')}(Guangzhou)</Link>
                          <Link to={`/${langPrefix}/cities/oNIvYqn2fcHSUN6mpv7G`} className="hover:text-green-600 truncate">{t('city.shenzhen')}(Shenzhen)</Link>
                          <Link to={`/${langPrefix}/cities/XxxHqxEftFPTAfw09w37`} className="hover:text-green-600 truncate">{t('city.hangzhou')}(Hangzhou)</Link>
                          <Link to={`/${langPrefix}/cities/eVvE8j6wkETbi3jgn2Kc`} className="hover:text-green-600 truncate">{t('city.chongqing')}(Chongqing)</Link>
                          <Link to={`/${langPrefix}/cities/lOvgtPfMDTaEi3jIre9D`} className="hover:text-green-600 truncate">{t('city.chengdu')}(Chengdu)</Link>
                          <Link to={`/${langPrefix}/cities/AM4LKEQcsclFhG1LuSKn`} className="hover:text-green-600 truncate">{t('city.xian')}(Xi'an)</Link>
                          <Link to={`/${langPrefix}/cities/YF8WzVigZrymgqJJLanF`} className="hover:text-green-600 truncate">{t('city.changsha')}(Changsha)</Link>
                          <Link to={`/${langPrefix}/cities/KI6GE4ovZK6fmWTqUx5q`} className="hover:text-green-600 truncate">{t('city.xiamen')}(Xiamen)</Link>
                        </div>
                      </div>
                      
                      {/* Right Column: Guides */}
                      <div className="w-1/2 pl-6 space-y-6">
                        <Link to={`/${langPrefix}/articles`} className="flex items-start gap-3 group">
                          <BookOpen className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-bold text-[14px] text-gray-900 group-hover:text-green-600 transition-colors">{t('discover.guides')}</div>
                            <div className="text-[12px] text-gray-500 mt-1 leading-relaxed">{t('discover.guides.desc')}</div>
                          </div>
                        </Link>
                        <Link to={`/${langPrefix}/guide`} className="flex items-start gap-3 group">
                          <Compass className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-bold text-[14px] text-gray-900 group-hover:text-green-600 transition-colors">{t('discover.pocket')}</div>
                            <div className="text-[12px] text-gray-500 mt-1 leading-relaxed">{t('discover.pocket.desc')}</div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Tools Mega Menu */}
                {isTools && (
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[600px] bg-white rounded-lg shadow-xl border border-gray-100 text-gray-800 transition-all duration-200 transform origin-top z-50
                      opacity-0 invisible -translate-y-2 group-hover/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0
                    `}>
                        {/* Arrow pointing up */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-100 transform rotate-45 z-[-1]" />
                        
                        <div className="grid grid-cols-2 gap-6 p-6">
                            {[
                                { icon: ScanLine, title: t('tools.menu'), desc: t('tools.menu.desc'), path: `/${langPrefix}/tools/menu-translator` },
                                { icon: Shield, title: t('tools.name'), desc: t('tools.name.desc'), path: `/${langPrefix}/tools/name-generator` },
                                { icon: Languages, title: t('tools.pinyin'), desc: t('tools.pinyin.desc'), path: `/${langPrefix}/tools/pinyin-segmentation` },
                                { icon: Type, title: t('tools.counter'), desc: t('tools.counter.desc'), path: `/${langPrefix}/tools/character-counter` },
                                { icon: Calculator, title: t('tools.zodiac'), desc: t('tools.zodiac.desc'), path: `/${langPrefix}/tools/zodiac-calculator` }
                            ].map((tool, idx) => (
                                <Link key={idx} to={tool.path} className="flex gap-3 group" onClick={() => {}}>
                                    <tool.icon className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-bold text-[14px] text-gray-900 group-hover:text-green-600 transition-colors">{tool.title}</div>
                                        <div className="text-[12px] text-gray-500 mt-1 leading-relaxed">{tool.desc}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Tools and Lang */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Google Avatar - only on menu translator page */}
          {isMenuTranslatorPage && (
            <div className="relative">
              {user ? (
                <>
                  <button
                    className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/30 hover:border-white/60 transition-all"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <img
                      src={user.user_metadata?.avatar_url || user.user_metadata?.picture || '/logo.png'}
                      alt={user.user_metadata?.full_name || user.email || 'User'}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-[-1]" onClick={() => setShowUserMenu(false)} />
                      <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 text-gray-800 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium truncate">{user.user_metadata?.full_name || user.email}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <button
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                          onClick={async () => {
                            setShowUserMenu(false);
                            const { supabase } = await import('../lib/supabase');
                            await supabase.auth.signOut();
                          }}
                        >
                          <LogOut className="w-4 h-4" />
                          {language === 'zh' || language === 'cn' ? '退出登录' : 'Sign out'}
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-all text-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="font-medium text-xs">{language === 'zh' || language === 'cn' ? '登录' : 'Sign in'}</span>
                </button>
              )}
            </div>
          )}
          <div className="relative group/lang">
            <button 
              className={`flex items-center gap-2 cursor-pointer hover:bg-black/10 transition-all ${isScrolled ? 'bg-black/5 border-black/10' : 'bg-white/10 border-white/20'} px-4 py-2 rounded-full border backdrop-blur-sm text-sm`}
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            >
              <Globe className="w-4 h-4" />
              <span className="font-medium tracking-wide uppercase">{t('nav.lang.code')} {t('nav.lang')}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Language Dropdown */}
            <div className={`absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 text-gray-800 transition-all duration-200 transform origin-top-right z-50
              ${isLangDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}
            `}>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-left"
                  onClick={() => {
                    const newLangPrefix = langToPrefix[lang.code] || 'en';
                    let newPath = location.pathname || '';
                    const pathParts = newPath.split('/');
                    const validPrefixes = ['cn', 'tw', 'en', 'ja', 'ko', 'ru', 'fr', 'es', 'de', 'it'];
                    if (validPrefixes.includes(pathParts[1])) {
                      pathParts[1] = newLangPrefix;
                    } else {
                      pathParts.splice(1, 0, newLangPrefix);
                    }
                    newPath = pathParts.join('/') || '/';
                    setIsLangDropdownOpen(false);
                    setLanguage(lang.code as Language);
                    navigate(newPath + (location.search || ''), { replace: true });
                  }}
                >
                  <div className="flex items-center gap-3">
                    <img src={lang.flag} alt={lang.name} className="w-5 h-4 object-cover rounded-sm" />
                    <span className="font-medium">{lang.name}</span>
                  </div>
                  {language === lang.code && <Check className="w-4 h-4 text-green-600" />}
                </button>
              ))}
            </div>

            {/* Click outside to close */}
            {isLangDropdownOpen && (
              <div 
                className="fixed inset-0 z-[-1]" 
                onClick={() => setIsLangDropdownOpen(false)}
              />
            )}
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="lg:hidden flex items-center gap-2">
          {/* Google Avatar - only on menu translator page */}
          {isMenuTranslatorPage && (
            user ? (
              <button
                className="w-7 h-7 rounded-full overflow-hidden border border-white/30"
                onClick={signInWithGoogle}
              >
                <img
                  src={user.user_metadata?.avatar_url || user.user_metadata?.picture || '/logo.png'}
                  alt=""
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="w-7 h-7 rounded-full flex items-center justify-center border border-white/30 bg-white/10"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
            )
          )}
          <div className="relative">
            <button 
              className={`p-2 rounded-full ${isScrolled ? 'bg-black/5 border border-black/10' : 'bg-white/10 border border-white/20'} flex items-center justify-center mr-1`}
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            >
              <Globe className="w-5 h-5" />
            </button>

            {/* Mobile Language Dropdown */}
            <div className={`absolute top-full right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-gray-700 py-1 text-white transition-all duration-200 transform origin-top-right z-50
              ${isLangDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}
            `}>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-800 transition-colors text-left"
                  onClick={() => {
                    const newLangPrefix = langToPrefix[lang.code] || 'en';
                    let newPath = location.pathname || '';
                    const pathParts = newPath.split('/');
                    const validPrefixes = ['cn', 'tw', 'en', 'ja', 'ko', 'ru', 'fr', 'es', 'de', 'it'];
                    if (validPrefixes.includes(pathParts[1])) {
                      pathParts[1] = newLangPrefix;
                    } else {
                      pathParts.splice(1, 0, newLangPrefix);
                    }
                    newPath = pathParts.join('/') || '/';
                    setIsLangDropdownOpen(false);
                    setLanguage(lang.code as Language);
                    window.location.replace(newPath + (location.search || ''));
                  }}
                >
                  <div className="flex items-center gap-3">
                    <img src={lang.flag} alt={lang.name} className="w-5 h-4 object-cover rounded-sm" />
                    <span className="font-medium">{lang.name}</span>
                  </div>
                  {language === lang.code && <Check className="w-4 h-4 text-green-400" />}
                </button>
              ))}
            </div>

            {/* Click outside to close */}
            {isLangDropdownOpen && (
              <div 
                className="fixed inset-0 z-[-1]" 
                onClick={() => setIsLangDropdownOpen(false)}
              />
            )}
          </div>
          
          <button 
            className="p-2 rounded-md"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6 z-50" />
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }}
            />
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 bottom-0 right-0 w-[60%] bg-white z-50 p-5 flex flex-col text-gray-900 h-screen overflow-y-auto shadow-2xl"
            >
            <div className="flex justify-between items-center mb-8">
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight">tripcngo.com</span>
                <span className="text-[10px] text-gray-400 tracking-wider -mt-1">{t('nav.slogan')}</span>
              </div>
              <button 
                className="p-2 hover:bg-gray-100 rounded-md text-gray-900"
                onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="flex flex-col gap-1">
              {/* 首页 */}
              <Link 
                to={`/${langPrefix}`}
                className="text-xl font-medium hover:text-green-400 transition-colors"
                onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }}
              >
                <div className="flex items-center justify-between border-b border-gray-200 py-4">
                  {t('nav.home')}
                </div>
              </Link>

              {/* 签证 - 可展开 */}
              <div className="border-b border-gray-200">
                <button 
                  onClick={() => setMobileExpandedMenu(mobileExpandedMenu === 'visa' ? null : 'visa')}
                  className="w-full flex items-center justify-between py-4 text-xl font-medium hover:text-green-600 transition-colors"
                >
                  <span>{t('nav.visa')}</span>
                  {mobileExpandedMenu === 'visa' ? <ChevronDown className="w-5 h-5 text-green-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
                </button>
                <AnimatePresence>
                  {mobileExpandedMenu === 'visa' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pb-4 space-y-3">
                        <Link to={`/${langPrefix}/visa`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-gray-700 hover:text-green-600 text-base py-1">{t('visa.mega.title')}</Link>
                        <Link to={`/${langPrefix}/visa/types`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-gray-700 hover:text-green-600 text-base py-1">{t('visa.types')}</Link>
                        <Link to={`/${langPrefix}/visa/photo`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-gray-700 hover:text-green-600 text-base py-1">{t('visa.photo')}</Link>
                        <Link to={`/${langPrefix}/visa/fees`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-gray-700 hover:text-green-600 text-base py-1">{t('visa.fee')}</Link>
                        <Link to={`/${langPrefix}/visa/form`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-gray-700 hover:text-green-600 text-base py-1">{t('visa.form')}</Link>
                        <Link to={`/${langPrefix}/visa/arrival-card`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-gray-700 hover:text-green-600 text-base py-1">{t('visa.card')}</Link>
                        <Link to={`/${langPrefix}/visa/downloads`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-gray-700 hover:text-green-600 text-base py-1">{t('visa.menu.download')}</Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 发现 - 可展开 */}
              <div className="border-b border-gray-200">
                <button 
                  onClick={() => setMobileExpandedMenu(mobileExpandedMenu === 'discover' ? null : 'discover')}
                  className="w-full flex items-center justify-between py-4 text-xl font-medium hover:text-green-600 transition-colors"
                >
                  <span>{t('nav.discover')}</span>
                  {mobileExpandedMenu === 'discover' ? <ChevronDown className="w-5 h-5 text-green-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
                </button>
                <AnimatePresence>
                  {mobileExpandedMenu === 'discover' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pb-4 space-y-3">
                        <div className="text-green-600 text-sm font-bold mb-2 mt-2">{t('discover.hotCities')}</div>
                        <div className="grid grid-cols-2 gap-2">
                            <Link to={`/${langPrefix}/cities/beijing`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-gray-700 hover:text-green-600 text-sm py-1 truncate">{t('city.beijing')}</Link>
                            <Link to={`/${langPrefix}/cities/shanghai`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-gray-700 hover:text-green-600 text-sm py-1 truncate">{t('city.shanghai')}</Link>
                            <Link to={`/${langPrefix}/cities/LZ1r5Fsq3bOUHUeKVgIv`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-gray-700 hover:text-green-600 text-sm py-1 truncate">{t('city.guangzhou')}</Link>
                            <Link to={`/${langPrefix}/cities/oNIvYqn2fcHSUN6mpv7G`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-gray-700 hover:text-green-600 text-sm py-1 truncate">{t('city.shenzhen')}</Link>
                            <Link to={`/${langPrefix}/cities/XxxHqxEftFPTAfw09w37`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-gray-700 hover:text-green-600 text-sm py-1 truncate">{t('city.hangzhou')}</Link>
                            <Link to={`/${langPrefix}/cities/eVvE8j6wkETbi3jgn2Kc`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-gray-700 hover:text-green-600 text-sm py-1 truncate">{t('city.chongqing')}</Link>
                            <Link to={`/${langPrefix}/cities/lOvgtPfMDTaEi3jIre9D`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-gray-700 hover:text-green-600 text-sm py-1 truncate">{t('city.chengdu')}</Link>
                            <Link to={`/${langPrefix}/cities/AM4LKEQcsclFhG1LuSKn`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-gray-700 hover:text-green-600 text-sm py-1 truncate">{t('city.xian')}</Link>
                            <Link to={`/${langPrefix}/cities/YF8WzVigZrymgqJJLanF`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-gray-700 hover:text-green-600 text-sm py-1 truncate">{t('city.changsha')}</Link>
                            <Link to={`/${langPrefix}/cities/KI6GE4ovZK6fmWTqUx5q`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-gray-700 hover:text-green-600 text-sm py-1 truncate">{t('city.xiamen')}</Link>
                        </div>
                        <Link to={`/${langPrefix}/cities`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-green-600 hover:text-green-500 text-sm font-medium py-2">{t('discover.moreCities')} &gt;&gt;</Link>
                        <div className="border-t border-gray-100 pt-3 mt-3">
                          <div className="text-green-600 text-sm font-bold mb-2">{t('discover.guides')}</div>
                          <Link to={`/${langPrefix}/articles`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-gray-700 hover:text-green-600 text-base py-1">{t('discover.guides')}</Link>
                          <Link to={`/${langPrefix}/guide`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-gray-700 hover:text-green-600 text-base py-1">{t('discover.pocket')}</Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 工具 - 可展开 */}
              <div className="border-b border-gray-200">
                <button 
                  onClick={() => setMobileExpandedMenu(mobileExpandedMenu === 'tools' ? null : 'tools')}
                  className="w-full flex items-center justify-between py-4 text-xl font-medium hover:text-green-600 transition-colors"
                >
                  <span>{t('nav.tools')}</span>
                  {mobileExpandedMenu === 'tools' ? <ChevronDown className="w-5 h-5 text-green-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
                </button>
                <AnimatePresence>
                  {mobileExpandedMenu === 'tools' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pb-4 space-y-3">
                        <Link to={`/${langPrefix}/tools/menu-translator`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-gray-700 hover:text-green-600 text-base py-1">{t('tools.menu')}</Link>
                        <Link to={`/${langPrefix}/tools/name-generator`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-gray-700 hover:text-green-600 text-base py-1">{t('tools.name')}</Link>
                        <Link to={`/${langPrefix}/tools/pinyin-segmentation`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-gray-700 hover:text-green-600 text-base py-1">{t('tools.pinyin')}</Link>
                        <Link to={`/${langPrefix}/tools/character-counter`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-gray-700 hover:text-green-600 text-base py-1">{t('tools.counter')}</Link>
                        <Link to={`/${langPrefix}/tools/zodiac-calculator`} onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }} className="block text-gray-700 hover:text-green-600 text-base py-1">{t('tools.zodiac')}</Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 目录应用 */}
              <Link 
                to={`/${langPrefix}/apps`}
                className="text-xl font-medium hover:text-green-600 transition-colors border-b border-gray-200"
                onClick={() => { setIsMobileMenuOpen(false); setMobileExpandedMenu(null); }}
              >
                <div className="flex items-center justify-between py-4">
                  {t('nav.catalog')}
                </div>
              </Link>
            </nav>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

