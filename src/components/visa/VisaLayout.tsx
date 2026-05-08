import React from 'react';
import { Link, useLocation } from '@/lib/router-compat';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

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
  const langPrefix = language === 'zh' ? 'cn' : language;
  const links = sidebarLinks(t, langPrefix);

  return (
    <div className="w-full flex-grow flex flex-col bg-[#fcfcfc]">
      {/* Hero Section */}
      <div 
        className="relative h-[300px] w-full flex items-center pt-16"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1543097692-fa13c6cd8595?q=80&w=2670&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('visa.hero.title')}</h1>
          <p className="text-lg text-white/90">{t('visa.hero.desc')}</p>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col flex-grow">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
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

        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row gap-8 items-start flex-grow">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0 bg-white border border-gray-100 rounded-sm shadow-sm p-4">
            <div className="text-center font-bold text-gray-800 py-3 mb-2 border-b border-gray-100">
              {t('visa.nav.title')}
            </div>
            <nav className="grid grid-cols-2 md:flex md:flex-col gap-2 md:gap-0">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-3 px-4 text-[14px] transition-colors rounded-sm text-center md:text-left ${
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
          <div className="flex-1 w-full bg-white border border-gray-100 rounded-sm shadow-sm p-6 lg:p-8 min-h-[500px]">
            {children}
          </div>

        </div>

        {/* Discover more */}
        <div className="mt-12 w-full max-w-3xl border border-gray-100 rounded-lg bg-white overflow-hidden shadow-sm mx-auto mb-10">
           <div className="bg-gray-50 px-6 py-4 font-bold text-gray-800 border-b border-gray-100">
             Discover more
           </div>
           <div>
             <Link to="#" className="flex items-center justify-between px-6 py-4 border-b border-gray-100 hover:bg-gray-50 text-gray-600">
               <span>Travel</span>
               <ChevronRight className="w-4 h-4 text-gray-400" />
             </Link>
             <Link to="#" className="flex items-center justify-between px-6 py-4 border-b border-gray-100 hover:bg-gray-50 text-gray-600">
               <span>Tourist Destinations</span>
               <ChevronRight className="w-4 h-4 text-gray-400" />
             </Link>
             <Link to="#" className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 text-gray-600">
               <span>travel</span>
               <ChevronRight className="w-4 h-4 text-gray-400" />
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
