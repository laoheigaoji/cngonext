"use client";

import React from 'react';
import { Twitter, Mail, Youtube, Facebook } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Link } from '@/lib/router-compat';
import { useLanguage } from '../context/LanguageContext';

const LANG_PREFIXES = ['cn', 'en', 'ja', 'ko', 'ru', 'fr', 'es', 'de', 'tw', 'it'];

const LANG_OPTIONS: { label: string; code: string }[] = [
  { label: 'English', code: 'en' },
  { label: '简体中文', code: 'cn' },
  { label: '繁体中文', code: 'tw' },
];

export default function Footer() {
  const { t, setLanguage } = useLanguage();
  const pathname = usePathname();
  
  return (
    <footer className="bg-[#0e7552] text-[#e5f5ef] text-sm">
      <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-x-6 md:gap-x-10 gap-y-12">
          {/* Brand & Social - Always top or left */}
          <div className="col-span-2 md:col-span-2">
            <div className="mb-4">
              <img src="/logo1.png" alt="tripcngo.com" className="h-10 object-contain" />
            </div>
            <p className="mb-6 leading-relaxed text-[#e5f5ef] text-[13px] md:text-[14px] md:pr-10">
              {t('footer.brand.desc')}
            </p>
            <div className="flex flex-col gap-6">
              <div className="flex gap-5">
                <a href="https://x.com/1546912750" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="Follow us on X">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 4.048H5.039z"></path></svg>
                </a>
                <a href="mailto:contact@tripcngo.com" className="hover:text-white transition-colors" title="Email us">
                  <Mail className="w-6 h-6" />
                </a>
                <a href="https://www.youtube.com/@%E5%8D%A1%E8%A7%86%E7%BD%91%E7%BB%9C" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  <Youtube className="w-6 h-6" />
                </a>
                <a href="https://www.facebook.com/profile.php?id=100004264274335" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="https://www.tiktok.com/@tripcngo" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  <svg viewBox="0 0 24 24" className="w-[1.375rem] h-[1.375rem] fill-current"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.38-.02-.53-.02-1.06 0-1.59.18-1.54.77-3.03 1.77-4.18 1.83-2.06 4.67-3.07 7.37-2.67v4.06c-1.3-.23-2.61.12-3.54.91-.71.61-1.16 1.47-1.25 2.41-.05.57.02 1.15.22 1.68.34 1.09 1.25 1.98 2.37 2.22.95.19 1.95.04 2.8-.45.74-.42 1.3-1.1 1.5-1.92.12-.52.12-1.06.12-1.59V.02z"/></svg>
                </a>
              </div>
              <div className="flex items-center gap-2 text-[#e5f5ef]/70">
                <Mail className="w-4 h-4" />
                <a href="mailto:contact@tripcngo.com" className="hover:text-white transition-colors font-medium">contact@tripcngo.com</a>
              </div>
            </div>
          </div>
          
          {/* Link Sections - Grid on mobile */}
          <div className="col-span-1">
            <h4 className="text-white font-bold mb-6 text-[15px]">{t('footer.links.visa')}</h4>
            <ul className="space-y-4">
              <li><Link to="/visa" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef]">{t('footer.links.visa.all')}</Link></li>
              <li><Link to="/cities" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef]">{t('footer.links.visa.dest')}</Link></li>
              <li><a href="#" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef]">{t('footer.links.visa.nav')}</a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-white font-bold mb-6 text-[15px] md:text-[16px]">{t('footer.links.company')}</h4>
            <ul className="space-y-4">
                <li><Link to="/about" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef] font-medium">{t('footer.links.about')}</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef] font-medium">{t('footer.links.terms')}</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef] font-medium">{t('footer.links.privacy')}</Link></li>
                <li><Link to="/feedback" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef] font-medium">{t('footer.links.feedback')}</Link></li>
            </ul>
          </div>
 
          <div className="col-span-1">
            <h4 className="text-white font-bold mb-6 text-[15px]">{t('footer.links.lang')}</h4>
            <ul className="space-y-4">
              {LANG_OPTIONS.map(({ label, code }) => (
                <li key={code}>
                  <button
                    onClick={() => {
                      const segments = pathname.split('/').filter(Boolean);
                      const first = segments[0] || '';
                      const hasLang = LANG_PREFIXES.includes(first);
                      const restPath = hasLang ? '/' + segments.slice(1).join('/') : pathname;
                      const target = `/${code}${restPath}`;
                      window.location.href = target;
                      setLanguage(code as any);
                    }}
                    className={`hover:text-white transition-colors text-[13px] font-medium ${
                      code === (pathname.split('/').filter(Boolean)[0] || 'en') ? 'text-white underline' : 'text-[#e5f5ef]'
                    }`}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-white font-bold mb-6 text-[15px]">{t('footer.links.partners')}</h4>
            <ul className="space-y-4">
              <li>
                <a href="https://tripcngo.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef] font-medium">
                  tripcngo.com
                </a>
              </li>
              <li>
                <a href="https://scriptmind.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef] font-medium">
                  ScriptMind
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="py-8 text-center text-[#e5f5ef]/80 text-[13px] border-t border-white/10 mx-6">
        <p>Copyright © {new Date().getFullYear()} tripcngo.com All Rights Reserved.</p>
      </div>
    </footer>
  );
}
