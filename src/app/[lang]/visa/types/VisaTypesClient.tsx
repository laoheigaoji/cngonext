"use client";

import { useState } from "react";
import { X, FileText, Upload, CheckCircle, Plane, Hotel, Mail, Building2, CreditCard, Heart, User } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-4 h-4" />,
  Upload: <Upload className="w-4 h-4" />,
  CheckCircle: <CheckCircle className="w-4 h-4" />,
  Plane: <Plane className="w-4 h-4" />,
  Hotel: <Hotel className="w-4 h-4" />,
  Mail: <Mail className="w-4 h-4" />,
  Building2: <Building2 className="w-4 h-4" />,
  CreditCard: <CreditCard className="w-4 h-4" />,
  Heart: <Heart className="w-4 h-4" />,
  User: <User className="w-4 h-4" />
};

interface DocData {
  icon: string;
  title: string;
  description: string;
  linkUrl: string | null;
  isRequired: boolean;
}

interface VisaTypesClientProps {
  langPrefix: string;
  t: Record<string, string>;
  sidebarLinks: { text: string; path: string }[];
  visaTypesData: { code: string; name: string; description: string }[];
  documentsByCode: Record<string, { general: DocData[]; special: DocData[] }>;
}

export default function VisaTypesClient({ langPrefix, t, sidebarLinks, visaTypesData, documentsByCode }: VisaTypesClientProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState('');

  const tr = {
    pageTitle: t['visa.page.types.title'] || 'Visa Types',
    visaName: t['visa.page.types.visaName'] || 'Visa Name',
    visaCode: t['visa.page.types.code'] || 'Code',
    description: t['visa.page.types.description'] || 'Description',
    viewDocs: t['visa.page.types.viewDocs'] || 'View Documents',
    requiredDocs: t['visa.page.types.requiredDocs'] || 'Required Documents',
    generalDocs: t['visa.page.types.generalDocs'] || 'General Documents',
    specialDocs: t['visa.page.types.specialDocs'] || 'Special Documents',
    optional: t['visa.page.types.optional'] || 'Optional',
    clickToView: t['visa.page.types.clickToView'] || 'Click to view',
    noDocs: t['visa.page.types.noDocs'] || 'No document information available',
  };

  const openDocModal = (code: string, name: string) => {
    setModalTitle(name);
    setActiveModal(code);
  };

  const currentDocs = activeModal ? documentsByCode[activeModal] : null;

  return (
    <div className="w-full flex-grow flex flex-col bg-[#fcfcfc]">
      {/* Hero */}
      <div
        className="relative h-[180px] sm:h-[300px] w-full flex items-end sm:items-center pt-8 sm:pt-16 pb-6 sm:pb-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1543097692-fa13c6cd8595?q=80&w=2670&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-6">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4">{t['visa.hero.title']}</h1>
          <p className="text-sm sm:text-lg text-white/90">{t['visa.hero.desc']}</p>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 flex flex-col flex-grow">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-4 sm:mb-8">
          <a href={`/${langPrefix}`} className="hover:text-[#1b887a] flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" /></svg>
            {t['nav.home']}
          </a>
          <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <a href={`/${langPrefix}/visa`} className="hover:text-[#1b887a]">{t['visa.mega.title']}</a>
          <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-gray-900">{tr.pageTitle}</span>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden -mx-3 sm:-mx-6 px-3 sm:px-6 mb-4 overflow-x-auto scrollbar-hide">
          <nav className="flex gap-2 pb-2 min-w-max">
            {sidebarLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  link.path === `/${langPrefix}/visa/types`
                    ? 'bg-[#1b887a] text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1b887a] hover:text-[#1b887a]'
                }`}
              >
                {link.text}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col md:flex-row gap-4 sm:gap-8 items-start flex-grow">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-full md:w-64 flex-shrink-0 bg-white border border-gray-100 rounded-sm shadow-sm p-4">
            <div className="text-center font-bold text-gray-800 py-3 mb-2 border-b border-gray-100">
              {t['visa.nav.title']}
            </div>
            <nav className="flex flex-col">
              {sidebarLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  className={`block py-3 px-4 text-[14px] transition-colors rounded-sm text-left ${
                    link.path === `/${langPrefix}/visa/types`
                      ? 'bg-[#1b887a] text-white font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#1b887a]'
                  }`}
                >
                  {link.text}
                </a>
              ))}
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 w-full min-h-[500px]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{tr.pageTitle}</h2>

            {/* Desktop table */}
            <div className="hidden md:block bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-[#1b887a] text-white">
                    <th className="py-4 px-6 font-medium whitespace-nowrap border-b border-[#1b887a]">{tr.visaName}</th>
                    <th className="py-4 px-6 font-medium whitespace-nowrap border-b border-[#1b887a]">{tr.visaCode}</th>
                    <th className="py-4 px-6 font-medium border-b border-[#1b887a]">{tr.description}</th>
                    <th className="py-4 px-6 font-medium whitespace-nowrap border-b border-[#1b887a]"></th>
                  </tr>
                </thead>
                <tbody>
                  {visaTypesData.map((item, index) => (
                    <tr key={item.code} className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="py-4 px-6 text-gray-700 whitespace-nowrap">{item.name}</td>
                      <td className="py-4 px-6 font-bold text-gray-900 text-center whitespace-nowrap">{item.code}</td>
                      <td className="py-4 px-6 text-gray-600 leading-relaxed min-w-[300px]">{item.description}</td>
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <button
                          onClick={() => openDocModal(item.code, item.name)}
                          className="text-[#1b887a] hover:underline text-[13px]"
                        >
                          {tr.viewDocs}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {visaTypesData.map((item, index) => (
                <div key={item.code} className={`rounded-lg border border-gray-200 overflow-hidden ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-[#1b887a]/5">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#1b887a] text-white text-xs font-bold px-2 py-0.5 rounded">{item.code}</span>
                      <span className="font-bold text-gray-900">{item.name}</span>
                    </div>
                    <button
                      onClick={() => openDocModal(item.code, item.name)}
                      className="text-[#1b887a] hover:underline text-xs font-medium"
                    >
                      {tr.viewDocs}
                    </button>
                  </div>
                  <div className="px-4 py-3">
                    <span className="text-xs text-gray-400">{tr.description}</span>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Documents Modal */}
      {activeModal && currentDocs && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">
                {modalTitle} - {tr.requiredDocs}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {currentDocs.general.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#1b887a] text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    {tr.generalDocs}
                  </h4>
                  <div className="space-y-2">
                    {currentDocs.general.map((doc, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3 flex items-start gap-2">
                        <div className="text-[#1b887a] flex-shrink-0">
                          {iconMap[doc.icon] || <FileText className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm flex items-center gap-2">
                            {doc.title}
                            {!doc.isRequired && <span className="text-xs text-gray-400">({tr.optional})</span>}
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">
                            {doc.linkUrl ? (
                              <>
                                {doc.description}
                                <a href={doc.linkUrl} target="_blank" rel="noopener noreferrer" className="text-[#1b887a] hover:underline ml-1">
                                  {tr.clickToView}
                                </a>
                              </>
                            ) : doc.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentDocs.special.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#1b887a] text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {currentDocs.general.length > 0 ? '2' : '1'}
                    </span>
                    {tr.specialDocs}
                  </h4>
                  <div className="space-y-2">
                    {currentDocs.special.map((doc, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3 flex items-start gap-2">
                        <div className="text-[#1b887a] flex-shrink-0">
                          {iconMap[doc.icon] || <FileText className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm flex items-center gap-2">
                            {doc.title}
                            {!doc.isRequired && <span className="text-xs text-gray-400">({tr.optional})</span>}
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">
                            {doc.linkUrl ? (
                              <>
                                {doc.description}
                                <a href={doc.linkUrl} target="_blank" rel="noopener noreferrer" className="text-[#1b887a] hover:underline ml-1">
                                  {tr.clickToView}
                                </a>
                              </>
                            ) : doc.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentDocs.general.length === 0 && currentDocs.special.length === 0 && (
                <div className="text-center text-gray-500 py-8">{tr.noDocs}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
