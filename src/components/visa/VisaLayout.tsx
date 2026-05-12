import React, { useMemo } from 'react';
import { Link, useLocation } from '@/lib/router-compat';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getRandomHeroBg } from '@/lib/hero-backgrounds';

interface VisaLayoutProps {
  children: React.ReactNode;
  breadcrumbTitle: string;
}

const sidebarLinks = (t: (key: string) => string, langPrefix: string) => [
  { text: t('visa.menu.types'), path: `/${langPrefix}/visa/types` },
  { text: t('visa.menu.photo'), path: `/${langPrefix}/visa/photo` },
  { text: t('visa.menu.fee'), path: `/${langPrefix}/visa/fees` },
  { text: t('visa.menu.form'), path: `/${langPrefix}/visa/form` },
  { text: t('visa.menu.entryCard'), path: `/${langPrefix}/visa/arrival-card` },
  { text: t('visa.menu.download'), path: `/${langPrefix}/visa/downloads` },
];

export default function VisaLayout({ children, breadcrumbTitle }: VisaLayoutProps) {
  const location = useLocation();
  const { language, t } = useLanguage();
  const langMap: Record<string, string> = { zh: 'cn', tw: 'tw', en: 'en', ja: 'ja', ko: 'ko', ru: 'ru', fr: 'fr', es: 'es', de: 'de', it: 'it' };
  const langPrefix = langMap[language] || 'en';
  const heroBg = useMemo(() => getRandomHeroBg(), []);
  const links = sidebarLinks(t, langPrefix);

  return (
    <div className="w-full flex-grow flex flex-col bg-[#fcfcfc]">
      {/* Hero Section */}
      <div 
        className="relative h-[180px] sm:h-[300px] w-full flex items-end sm:items-center pt-8 sm:pt-16 pb-6 sm:pb-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-6">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4">{t('visa.hero.title')}</h1>
          <p className="text-sm sm:text-lg text-white/90">{t('visa.hero.desc')}</p>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 flex flex-col flex-grow">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-4 sm:mb-8">
          <Link to={`/${langPrefix}`} className="hover:text-[#1b887a] flex items-center">
            <Home className="w-4 h-4 mr-1" />
            {t('nav.home')}
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link to={`/${langPrefix}/visa`} className="hover:text-[#1b887a]">
            {t('visa.mega.title')}
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900">{breadcrumbTitle}</span>
        </div>

        {/* Mobile: Horizontal tab bar */}
        <div className="md:hidden -mx-3 sm:-mx-6 px-3 sm:px-6 mb-4 overflow-x-auto scrollbar-hide">
          <nav className="flex gap-2 pb-2 min-w-max">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    isActive
                      ? 'bg-[#1b887a] text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1b887a] hover:text-[#1b887a]'
                  }`}
                >
                  {link.text}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-8 items-start flex-grow">
          
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-full md:w-64 flex-shrink-0 bg-white border border-gray-100 rounded-sm shadow-sm p-4">
            <div className="text-center font-bold text-gray-800 py-3 mb-2 border-b border-gray-100">
              {t('visa.nav.title')}
            </div>
            <nav className="flex flex-col">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-3 px-4 text-[14px] transition-colors rounded-sm text-left ${
                      isActive 
                        ? 'bg-[#1b887a] text-white font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#1b887a]'
                    }`}
                  >
                    {link.text}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-full min-h-[500px]">
            {children}
          </div>

        </div>

        {/* Discover more */}
        <div className="mt-12 w-full max-w-3xl border border-gray-100 rounded-lg bg-white overflow-hidden shadow-sm mx-auto mb-10 hidden sm:block">
           <div className="bg-gray-50 px-6 py-4 font-bold text-gray-800 border-b border-gray-100">
             {t('nav.home')}
           </div>
           <div>
             <Link to={`/${langPrefix}`} className="flex items-center justify-between px-6 py-4 border-b border-gray-100 hover:bg-gray-50 text-gray-600">
               <span>{t('visa.mega.title')}</span>
               <ChevronRight className="w-4 h-4 text-gray-400" />
             </Link>
             <Link to={`/${langPrefix}/cities`} className="flex items-center justify-between px-6 py-4 border-b border-gray-100 hover:bg-gray-50 text-gray-600">
               <span>{t('visa.menu.types')}</span>
               <ChevronRight className="w-4 h-4 text-gray-400" />
             </Link>
             <Link to={`/${langPrefix}/visa`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 text-gray-600">
               <span>{t('visa.hero.desc')}</span>
               <ChevronRight className="w-4 h-4 text-gray-400" />
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
