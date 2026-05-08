import React, { useState, useEffect } from 'react';
import VisaLayout from '../../components/visa/VisaLayout';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabase';

interface VisaFee {
  id: string;
  visa_code: string;
  purpose: string;
  purpose_en: string;
  fee_range: string;
  note: string;
  note_en: string;
  sort_order: number;
}

export default function VisaFees({ initialData, initialTranslations }: { initialData?: any[]; initialTranslations?: Record<string, string> }) {
  const { language, t } = useLanguage();
  const [visaFees, setVisaFees] = useState<VisaFee[]>(() => (initialData || []) as VisaFee[]);
  const [loading, setLoading] = useState(!initialData);
  const [dbTranslations, setDbTranslations] = useState<Record<string, string>>(() => initialTranslations || {});

  // 从数据库加载签证相关翻译（包括所有类型分类）
  useEffect(() => {
    if (initialTranslations) return;
    const loadTranslations = async () => {
      try {
        const { data } = await supabase
          .from('translations')
          .select('key, value')
          .eq('lang', language)
          .or('category.eq.visa,category.eq.visa_fee,category.eq.type,category.eq.types,category.eq.visaType');
        
        if (data && data.length > 0) {
          const transMap: Record<string, string> = {};
          data.forEach((item: { key: string; value: string }) => {
            transMap[item.key] = item.value;
          });
          setDbTranslations(transMap);
        }
      } catch (e) {
        console.error('Failed to load visa fee translations:', e);
      }
    };
    loadTranslations();
  }, [language, initialTranslations]);

  // 签证代码到翻译键code的映射
  const visaCodeToTranslationKey: Record<string, string> = {
    L: 'tourism',
    M: 'business',
    Q1: 'familyQ1',
    Q2: 'familyQ2',
    Z: 'work',
    X1: 'studyX1',
    X2: 'studyX2',
    G: 'transit',
    C: 'crew',
    D: 'permanent',
    F: 'exchange',
    J1: 'journalistJ1',
    J2: 'journalistJ2',
    R: 'talent',
    S1: 'privateS1',
    S2: 'privateS2',
  };

  // 多语言支持：优先使用数据库翻译，否则使用中英文字段
  const getLocalizedText = (zh: string, en: string | null, key?: string) => {
    if (key && dbTranslations[key]) {
      return dbTranslations[key];
    }
    return language === 'zh' ? zh : (en || zh);
  };

  // 获取签证类型的翻译名称
  const getVisaTypeName = (visaCode: string) => {
    const translationKey = visaCodeToTranslationKey[visaCode];
    return translationKey ? `type.${translationKey}` : undefined;
  };

  useEffect(() => {
    fetchVisaFees();
  }, [language]);

  const fetchVisaFees = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('visa_fees')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    
    if (data) {
      setVisaFees(data);
    }
    setLoading(false);
  };

  // 翻译键
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

  if (loading) {
    return (
      <>
<VisaLayout breadcrumbTitle={tr.pageTitle}>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1b887a]"></div>
          </div>
        </VisaLayout>
      </>
    );
  }

  return (
    <>
<VisaLayout breadcrumbTitle={tr.pageTitle}>
      <div className="p-6">
        <div className="bg-[#1b887a] text-white p-6 rounded-t-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1b887a]/50">
                <th className="text-left py-2">{tr.visaType}</th>
                <th className="text-left py-2">{tr.mainPurpose}</th>
                <th className="text-left py-2">{tr.costRange}</th>
                <th className="text-left py-2">{tr.notes}</th>
              </tr>
            </thead>
            <tbody>
              {visaFees.map((v, i) => (
                <tr key={v.id} className="border-b border-[#1b887a]/50 last:border-none">
                  <td className="py-3 font-semibold">{v.visa_code} {tr.visaSuffix}</td>
                  <td className="py-3">{getLocalizedText(v.purpose, v.purpose_en, getVisaTypeName(v.visa_code))}</td>
                  <td className="py-3 text-[#e0f2f1] font-medium">{v.fee_range}</td>
                  <td className="py-3 text-xs opacity-90">{getLocalizedText(v.note, v.note_en, `visa.fee.${v.visa_code}.note`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-8 rounded-b-lg border-x border-b border-gray-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4">{tr.additionalInfo}</h3>
          
          <div className="space-y-6 text-sm text-gray-700">
            <div>
              <h4 className="font-semibold text-gray-900">{tr.reciprocal}</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>{tr.reciprocalDesc}</li>
              </ul>
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

            <div className="p-4 bg-gray-50 rounded border border-gray-100 text-xs text-gray-500">
              <p className="font-semibold text-gray-700 mb-1">{tr.note}</p>
              <p>{tr.feeNote1}</p>
              <p>{tr.feeNote2}</p>
            </div>
          </div>
        </div>
      </div>
    </VisaLayout>
    </>
  );
}
