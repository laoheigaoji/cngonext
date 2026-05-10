import React from 'react';
import VisaLayout from '../../components/visa/VisaLayout';
import { useLanguage } from '../../context/LanguageContext';
import { VISA_FEES } from '../../data/visa-data';

export default function VisaFees() {
  const { language, t } = useLanguage();
  const langKey = (language === 'zh' || language === 'cn') ? 'cn' : 'en';

  const tr = {
    pageTitle: t('visa.menu.fee', 'Fee Schedule'),
    visaType: t('visa.page.fee.visaType', 'Visa Type'),
    mainPurpose: t('visa.page.fee.mainPurpose', 'Main Purpose'),
    costRange: t('visa.page.fee.costRange', 'Cost Range'),
    notes: t('visa.page.fee.notes', 'Notes'),
    visaSuffix: t('visa.page.fee.visaSuffix', 'Visa'),
    additionalInfo: t('visa.page.fee.additionalInfo', 'Additional Info'),
    reciprocal: t('visa.page.fee.reciprocal', 'Reciprocal vs Non-Reciprocal'),
    reciprocalDesc: t('visa.page.fee.reciprocalDesc', 'Some countries have reciprocal visa agreements with China (e.g., USA, UK, Canada), which may result in higher fees than for non-reciprocal countries.'),
    additionalFees: t('visa.page.fee.additionalFees', 'Additional Fees'),
    expedited: t('visa.page.fee.expedited', 'Expedited service: Usually an additional 300-500 RMB.'),
    mailing: t('visa.page.fee.mailing', 'Mailing fee: Approx. 50-100 RMB (if mailing documents).'),
    medical: t('visa.page.fee.medical', 'Medical exam fee: Approx. 500-800 RMB (required for some visa types).'),
    residencePermit: t('visa.page.fee.residencePermit', 'Residence Permit Fees'),
    permit1: t('visa.page.fee.permit1', 'Residence permit < 1 year: Approx. 800 RMB.'),
    permit2: t('visa.page.fee.permit2', '1-3 years residence permit: Approx. 1000 RMB.'),
    permit3: t('visa.page.fee.permit3', '3-5 years residence permit: Approx. 1500 RMB.'),
    note: t('visa.page.fee.note', 'Note:'),
    feeNote1: t('visa.page.fee.feeNote1', 'The above fees are for reference only; exact amounts are subject to the latest announcements from Chinese embassies, consulates, or visa centers.'),
    feeNote2: t('visa.page.fee.feeNote2', 'It is recommended to check the specific fee standards for your country on the embassy website or consult a local visa agency in advance.'),
  };

  return (
    <VisaLayout breadcrumbTitle={tr.pageTitle}>
      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-sm border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#1b887a] text-white">
              <th className="text-left px-6 py-4 font-semibold">{tr.visaType}</th>
              <th className="text-left px-6 py-4 font-semibold">{tr.mainPurpose}</th>
              <th className="text-left px-6 py-4 font-semibold">{tr.costRange}</th>
              <th className="text-left px-6 py-4 font-semibold">{tr.notes}</th>
            </tr>
          </thead>
          <tbody>
            {VISA_FEES.map((v, i) => (
              <tr key={v.visaCode} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">{v.visaCode} {tr.visaSuffix}</td>
                <td className="px-6 py-4 text-gray-600">{v.purpose[langKey] || v.purpose.en}</td>
                <td className="px-6 py-4 text-[#1b887a] font-semibold whitespace-nowrap">{v.feeRange}</td>
                <td className="px-6 py-4 text-gray-500 text-xs">{v.note[langKey] || v.note.en}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {VISA_FEES.map((v, i) => (
          <div key={v.visaCode} className={`rounded-lg border border-gray-200 overflow-hidden ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-[#1b887a]/5">
              <span className="font-bold text-gray-900">{v.visaCode} {tr.visaSuffix}</span>
              <span className="text-[#1b887a] font-bold">{v.feeRange}</span>
            </div>
            <div className="px-4 py-3 space-y-1.5">
              <div className="flex items-start gap-2">
                <span className="text-xs text-gray-400 whitespace-nowrap mt-0.5">{tr.mainPurpose}</span>
                <span className="text-sm text-gray-700">{v.purpose[langKey] || v.purpose.en}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs text-gray-400 whitespace-nowrap mt-0.5">{tr.notes}</span>
                <span className="text-xs text-gray-500">{v.note[langKey] || v.note.en}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-6 text-sm text-gray-700">
        <h3 className="font-bold text-lg text-gray-900">{tr.additionalInfo}</h3>
        <div>
          <h4 className="font-semibold text-gray-900">{tr.reciprocal}</h4>
          <ul className="list-disc pl-5 mt-2 space-y-1"><li>{tr.reciprocalDesc}</li></ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{tr.additionalFees}</h4>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>{tr.expedited}</li>
            <li>{tr.mailing}</li>
            <li>{tr.medical}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{tr.residencePermit}</h4>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>{tr.permit1}</li>
            <li>{tr.permit2}</li>
            <li>{tr.permit3}</li>
          </ul>
        </div>
        <div className="p-4 bg-gray-50 rounded border border-gray-200 text-xs text-gray-500">
          <p className="font-semibold text-gray-700 mb-1">{tr.note}</p>
          <p>{tr.feeNote1}</p>
          <p>{tr.feeNote2}</p>
        </div>
      </div>
    </VisaLayout>
  );
}
