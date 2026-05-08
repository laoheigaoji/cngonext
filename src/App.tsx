import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate, useLocation, useParams } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './views/Home';
import Visa from './views/Visa';
import Cities from './views/Cities';
import Apps from './views/Apps';
import CityDetail from './views/city/CityDetail';
import VisaTypes from './views/visa/VisaTypes';
import VisaPhoto from './views/visa/VisaPhoto';
import VisaFees from './views/visa/VisaFees';
import VisaArrivalCard from './views/visa/VisaArrivalCard';
import VisaDownloads from './views/visa/VisaDownloads';
import VisaForm from './views/visa/VisaForm';
import AboutUs from './views/AboutUs';
import PrivacyPolicy from './views/PrivacyPolicy';
import TermsOfService from './views/TermsOfService';
import Guide from './views/Guide';
import Feedback from './views/Feedback';
import GuideList from './views/guide/GuideList';
import GuideDetail from './views/guide/GuideDetail';
import Admin from './views/Admin';
import Migration from './views/Migration';
import AuthCallback from './views/AuthCallback';
import ZodiacCalculator from './views/tools/ZodiacCalculator';
import CharacterCounter from './views/tools/CharacterCounter';
import PinyinSegmentation from './views/tools/PinyinSegmentation';
import NameGenerator from './views/tools/NameGenerator';
import MenuTranslator from './views/tools/MenuTranslator';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f7f7f7] text-gray-800">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function RootRedirect() {
  const { language } = useLanguage();
  const location = useLocation();
  const langPrefixMap: Record<string, string> = {
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
  const langPrefix = langPrefixMap[language] || 'en';
  
  // Prevent redirect loop if mounted on root
  const targetPath = location.pathname === '/' ? `/${langPrefix}` : `/${langPrefix}${location.pathname}`;
  return <Navigate to={targetPath + location.search} replace />;
}

function LangRoute() {
  const { langParam } = useParams();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    const langMap: Record<string, string> = {
      cn: 'zh',
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
    const targetLang = langMap[langParam || ''] || 'en';
    // 只从 URL 同步到 Context，不依赖 Context 状态以避免竞态
    setLanguage(targetLang as any);
  }, [langParam, setLanguage]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="visa" element={<Visa />} />
        <Route path="visa/types" element={<VisaTypes />} />
        <Route path="visa/photo" element={<VisaPhoto />} />
        <Route path="visa/fees" element={<VisaFees />} />
        <Route path="visa/arrival-card" element={<VisaArrivalCard />} />
        <Route path="visa/downloads" element={<VisaDownloads />} />
        <Route path="visa/form" element={<VisaForm />} />
        <Route path="guide" element={<Guide />} />
        <Route path="articles" element={<GuideList />} />
        <Route path="articles/:id" element={<GuideDetail />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<TermsOfService />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="tools/zodiac" element={<ZodiacCalculator />} />
        <Route path="tools/counter" element={<CharacterCounter />} />
        <Route path="tools/pinyin" element={<PinyinSegmentation />} />
        <Route path="tools/name" element={<NameGenerator />} />
        <Route path="tools/menu" element={<MenuTranslator />} />
        <Route path="cities" element={<Cities />} />
        <Route path="cities/:id" element={<CityDetail />} />
        <Route path="apps" element={<Apps />} />
      </Route>
    </Routes>
  );
}

function LangRouteWrapper() {
  const { langParam } = useParams();
  const validPrefixes = ['cn', 'tw', 'en', 'ja', 'ko', 'ru', 'fr', 'es', 'de', 'it'];
  if (!langParam || !validPrefixes.includes(langParam)) {
      return <RootRedirect />;
  }
  return <LangRoute />;
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="/migration" element={<Migration />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/:langParam/*" element={<LangRouteWrapper />} />
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}


