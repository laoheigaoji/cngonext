import { useState } from 'react';
import VisaLayout from '../../components/visa/VisaLayout';
import { X, FileText, CheckCircle, Upload, Plane, Mail, Building2, CreditCard, Heart, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { VISA_TYPES, VISA_DOCUMENTS, LangKey } from '../../data/visa-data';

const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-4 h-4" />,
  Upload: <Upload className="w-4 h-4" />,
  CheckCircle: <CheckCircle className="w-4 h-4" />,
  Plane: <Plane className="w-4 h-4" />,
  Mail: <Mail className="w-4 h-4" />,
  Building2: <Building2 className="w-4 h-4" />,
  CreditCard: <CreditCard className="w-4 h-4" />,
  Heart: <Heart className="w-4 h-4" />,
  User: <User className="w-4 h-4" />
};

export default function VisaTypes() {
  const { language, t } = useLanguage();
  const langKey = (language === 'zh' ? 'cn' : language) as LangKey;
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState('');

  const tr = {
    pageTitle: t('visa.page.types.title', 'Visa Types'),
    visaName: t('visa.page.types.visaName', 'Visa Name'),
    visaCode: t('visa.page.types.code', 'Code'),
    description: t('visa.page.types.description', 'Description'),
    viewDocs: t('visa.page.types.viewDocs', 'View Documents'),
    requiredDocs: t('visa.page.types.requiredDocs', 'Required Documents'),
    generalDocs: t('visa.page.types.generalDocs', 'General Documents'),
    specialDocs: t('visa.page.types.specialDocs', 'Special Documents'),
    optional: t('visa.page.types.optional', 'Optional'),
    clickToView: t('visa.page.types.clickToView', 'Click to view'),
    noDocs: t('visa.page.types.noDocs', 'No document information available'),
  };

  const openDocModal = (code: string, name: string) => {
    setModalTitle(name);
    setActiveModal(code);
  };

  const currentDocs = activeModal
    ? VISA_DOCUMENTS.filter(d => d.visaCode === activeModal)
    : [];

  const generalDocs = currentDocs.filter(d => d.section === 'general');
  const specialDocs = currentDocs.filter(d => d.section === 'special');

  return (
    <VisaLayout breadcrumbTitle={tr.pageTitle}>
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
            {VISA_TYPES.map((item, index) => (
              <tr key={item.code} className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                <td className="py-4 px-6 text-gray-700 whitespace-nowrap">{item.name[langKey] || item.name.en}</td>
                <td className="py-4 px-6 font-bold text-gray-900 text-center whitespace-nowrap">{item.code}</td>
                <td className="py-4 px-6 text-gray-600 leading-relaxed min-w-[300px]">{item.description[langKey] || item.description.en}</td>
                <td className="py-4 px-6 text-center whitespace-nowrap">
                  <button onClick={() => openDocModal(item.code, item.name[langKey] || item.name.en)} className="text-[#1b887a] hover:underline text-[13px]">
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
        {VISA_TYPES.map((item, index) => (
          <div key={item.code} className={`rounded-lg border border-gray-200 overflow-hidden ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-[#1b887a]/5">
              <div className="flex items-center gap-2">
                <span className="bg-[#1b887a] text-white text-xs font-bold px-2 py-0.5 rounded">{item.code}</span>
                <span className="font-bold text-gray-900">{item.name[langKey] || item.name.en}</span>
              </div>
              <button onClick={() => openDocModal(item.code, item.name[langKey] || item.name.en)} className="text-[#1b887a] hover:underline text-xs font-medium">
                {tr.viewDocs}
              </button>
            </div>
            <div className="px-4 py-3">
              <span className="text-xs text-gray-400">{tr.description}</span>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">{item.description[langKey] || item.description.en}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Documents Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">{modalTitle} - {tr.requiredDocs}</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              {generalDocs.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#1b887a] text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    {tr.generalDocs}
                  </h4>
                  <div className="space-y-2">
                    {generalDocs.map((doc, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3 flex items-start gap-2">
                        <div className="text-[#1b887a] flex-shrink-0">{iconMap[doc.icon] || <FileText className="w-4 h-4" />}</div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm flex items-center gap-2">
                            {doc.title[langKey] || doc.title.en}
                            {!doc.isRequired && <span className="text-xs text-gray-400">({tr.optional})</span>}
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">
                            {doc.linkUrl ? (
                              <>{doc.description[langKey] || doc.description.en} <a href={doc.linkUrl} target="_blank" rel="noopener noreferrer" className="text-[#1b887a] hover:underline ml-1">{tr.clickToView}</a></>
                            ) : (doc.description[langKey] || doc.description.en)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {specialDocs.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#1b887a] text-white rounded-full flex items-center justify-center text-xs font-bold">{generalDocs.length > 0 ? '2' : '1'}</span>
                    {tr.specialDocs}
                  </h4>
                  <div className="space-y-2">
                    {specialDocs.map((doc, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3 flex items-start gap-2">
                        <div className="text-[#1b887a] flex-shrink-0">{iconMap[doc.icon] || <FileText className="w-4 h-4" />}</div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm flex items-center gap-2">
                            {doc.title[langKey] || doc.title.en}
                            {!doc.isRequired && <span className="text-xs text-gray-400">({tr.optional})</span>}
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">
                            {doc.linkUrl ? (
                              <>{doc.description[langKey] || doc.description.en} <a href={doc.linkUrl} target="_blank" rel="noopener noreferrer" className="text-[#1b887a] hover:underline ml-1">{tr.clickToView}</a></>
                            ) : (doc.description[langKey] || doc.description.en)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {generalDocs.length === 0 && specialDocs.length === 0 && (
                <div className="text-center text-gray-500 py-8">{tr.noDocs}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </VisaLayout>
  );
}
