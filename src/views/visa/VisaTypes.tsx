import { useState, useEffect } from 'react';
import VisaLayout from '../../components/visa/VisaLayout';
import { X, FileText, CheckCircle, Upload, Plane, Hotel, Mail, Building2, CreditCard, Heart, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../context/LanguageContext';

interface VisaType {
  id: string;
  code: string;
  purpose: string;
  purpose_en: string;
  description: string;
  description_en: string;
  sort_order: number;
  is_active: boolean;
}

interface VisaDocument {
  id: string;
  visa_code: string;
  section: 'general' | 'special';
  icon: string;
  doc_title: string;
  doc_title_en: string;
  doc_description: string;
  doc_description_en: string;
  link_url?: string;
  sort_order: number;
  is_required: boolean;
}

// Icon mapping
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

export default function VisaTypes({ initialData, initialTranslations }: { initialData?: { visaTypes: any[]; documents: any[] }; initialTranslations?: Record<string, string> }) {
  const { language, t } = useLanguage();
  const [visaTypes, setVisaTypes] = useState<VisaType[]>(() => (initialData?.visaTypes || []) as VisaType[]);
  const [loading, setLoading] = useState(!initialData);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [documents, setDocuments] = useState<{ general: VisaDocument[]; special: VisaDocument[] }>({
    general: [],
    special: []
  });
  const [modalTitle, setModalTitle] = useState('');
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
          .or('category.eq.visa,category.eq.visa_type,category.eq.visa_doc,category.eq.visa.doc,category.eq.type,category.eq.types,category.eq.visaType');
        
        if (data && data.length > 0) {
          const transMap: Record<string, string> = {};
          data.forEach((item: { key: string; value: string }) => {
            transMap[item.key] = item.value;
          });
          setDbTranslations(transMap);
        }
      } catch (e) {
        console.error('Failed to load visa translations:', e);
      }
    };
    loadTranslations();
  }, [language, initialTranslations]);

  useEffect(() => {
    if (initialData) return;
    fetchVisaTypes();
  }, [initialData]);

  const fetchVisaTypes = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('visa_types')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    
    if (data) {
      setVisaTypes(data);
    }
    setLoading(false);
  };

  const fetchDocuments = async (visaCode: string, title: string) => {
    const { data } = await supabase
      .from('visa_documents')
      .select('*')
      .eq('visa_code', visaCode)
      .order('section', { ascending: true })
      .order('sort_order');
    
    if (data) {
      const general = data.filter(d => d.section === 'general');
      const special = data.filter(d => d.section === 'special');
      setDocuments({ general, special });
      setModalTitle(title);
      setActiveModal(visaCode);
    }
  };

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
    // 如果有翻译键，优先从数据库翻译
    if (key && dbTranslations[key]) {
      return dbTranslations[key];
    }
    // 回退到中英文字段
    return language === 'zh' ? zh : (en || zh);
  };

  // 文档标题到翻译键的映射
  const docTitleToKey: Record<string, { title: string; desc: string }> = {
    'Passport': { title: 'visa.doc.passport', desc: 'visa.doc.passport.desc' },
    'Visa Application Form & Photo': { title: 'visa.doc.formAndPhoto', desc: 'visa.doc.formAndPhoto.desc' },
    'Proof of Residence': { title: 'visa.doc.residence', desc: 'visa.doc.residence.desc' },
    'Previous Chinese Passport or Visa': { title: 'visa.doc.previous', desc: 'visa.doc.previous.desc' },
    // L签证专用
    'Invitation Letter': { title: 'visa.doc.L.invitation', desc: 'visa.doc.L.invitation.desc' },
    'Hotel Reservation Confirmation': { title: 'visa.doc.L.hotel', desc: 'visa.doc.L.hotel.desc' },
    'Travel Itinerary': { title: 'visa.doc.L.itinerary', desc: 'visa.doc.L.itinerary.desc' },
    'Family Relationship Proof': { title: 'visa.doc.L.family', desc: 'visa.doc.L.family.desc' },
    'Round-trip Flight Itinerary': { title: 'visa.doc.L.flight', desc: 'visa.doc.L.flight.desc' },
    // M签证专用
    'Company Qualification Documents': { title: 'visa.doc.M.business', desc: 'visa.doc.M.business.desc' },
    'Trade Cooperation Agreement': { title: 'visa.doc.M.trade', desc: 'visa.doc.M.trade.desc' },
    // D签证
    'Residence Confirmation Form': { title: 'visa.doc.D.confirm', desc: 'visa.doc.D.confirm.desc' },
    'Criminal Record Certificate': { title: 'visa.doc.D.criminal', desc: 'visa.doc.D.criminal.desc' },
    'Health Certificate': { title: 'visa.doc.D.health', desc: 'visa.doc.D.health.desc' },
    'Travel Pass': { title: 'visa.doc.D.pass', desc: 'visa.doc.D.pass.desc' },
    // X签证
    'JW201/JW202 Form': { title: 'visa.doc.X1.admission', desc: 'visa.doc.X1.admission.desc' },
    'Admission Notice': { title: 'visa.doc.X1.admission', desc: 'visa.doc.X1.admission.desc' },
    'Scholarship Documents': { title: 'visa.doc.X1.scholarship', desc: 'visa.doc.X1.scholarship.desc' },
    // G签证
    'Connecting Ticket': { title: 'visa.doc.G.ticket', desc: 'visa.doc.G.ticket.desc' },
    // C签证
    'Crew Certificate': { title: 'visa.doc.C.crew', desc: 'visa.doc.C.crew.desc' },
    // J签证
    'Ministry of Foreign Affairs Press Center Notification': { title: 'visa.doc.J1.notification', desc: 'visa.doc.J1.notification.desc' },
    // R签证
    'Talent Certificate': { title: 'visa.doc.R.talent', desc: 'visa.doc.R.talent.desc' },
    // Q签证
    'Family Relation Certificate': { title: 'visa.doc.Q1.relation', desc: 'visa.doc.Q1.relation.desc' },
    'Proof of Residence in China': { title: 'visa.doc.Q1.residence', desc: 'visa.doc.Q1.residence.desc' },
  };

  // 根据文档英文标题获取翻译键
  const getDocTranslationKey = (doc: VisaDocument): { title: string; desc: string } => {
    const docTitleEn = doc.doc_title_en || '';
    const docTitle = doc.doc_title || '';
    
    // 优先使用英文标题匹配
    if (docTitleToKey[docTitleEn]) {
      return docTitleToKey[docTitleEn];
    }
    
    // 使用中文标题匹配
    if (docTitle.includes('护照') || docTitleEn.includes('Passport')) {
      return { title: 'visa.doc.passport', desc: 'visa.doc.passport.desc' };
    }
    if (docTitle.includes('申请表') || docTitleEn.includes('Application Form')) {
      return { title: 'visa.doc.formAndPhoto', desc: 'visa.doc.formAndPhoto.desc' };
    }
    if (docTitle.includes('居住证明') || docTitleEn.includes('Proof of Residence')) {
      return { title: 'visa.doc.residence', desc: 'visa.doc.residence.desc' };
    }
    if (docTitle.includes('邀请函')) {
      return { title: `visa.doc.${doc.visa_code}.invitation`, desc: `visa.doc.${doc.visa_code}.invitation.desc` };
    }
    
    // 回退到数据库的中英文字段
    return { title: '', desc: '' };
  };

  // 签证类型名称和描述的翻译键
  const getVisaTypeName = (item: VisaType) => {
    const translationKey = visaCodeToTranslationKey[item.code];
    return getLocalizedText(item.purpose, item.purpose_en, translationKey ? `type.${translationKey}` : undefined);
  };
  const getVisaTypeDesc = (item: VisaType) => {
    const translationKey = visaCodeToTranslationKey[item.code];
    return getLocalizedText(item.description, item.description_en, translationKey ? `type.${translationKey}.desc` : undefined);
  };
  // 特殊文档链接映射（用于覆盖数据库中的链接）
  const specialDocLinks: Record<string, string> = {
    photo: 'https://static.tripcngo.com/ing/zhphoto.jpg',
    照片要求: 'https://static.tripcngo.com/ing/zhphoto.jpg',
    'photo requirements': 'https://static.tripcngo.com/ing/zhphoto.jpg',
  };

  // 获取文档链接（优先使用特殊映射）
  const getDocLink = (doc: VisaDocument): string | null => {
    const docTitleEn = doc.doc_title_en?.toLowerCase() || '';
    const docTitle = doc.doc_title || '';
    
    // 检查特殊映射
    for (const [key, url] of Object.entries(specialDocLinks)) {
      if (docTitleEn.includes(key) || docTitle.includes(key)) {
        return url;
      }
    }
    
    // 回退到数据库链接
    return doc.link_url || null;
  };

  const getDocTitle = (doc: VisaDocument) => {
    const keys = getDocTranslationKey(doc);
    return getLocalizedText(doc.doc_title, doc.doc_title_en, keys.title || undefined);
  };
  const getDocDesc = (doc: VisaDocument) => {
    const keys = getDocTranslationKey(doc);
    return getLocalizedText(doc.doc_description, doc.doc_description_en, keys.desc || undefined);
  };

  // 翻译键
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
        <div className="overflow-x-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{tr.pageTitle}</h2>
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-[#1b887a] text-white">
              <th className="py-4 px-6 font-medium whitespace-nowrap border-b border-[#1b887a]">
                {tr.visaName}
              </th>
              <th className="py-4 px-6 font-medium whitespace-nowrap border-b border-[#1b887a]">
                {tr.visaCode}
              </th>
              <th className="py-4 px-6 font-medium border-b border-[#1b887a]">
                {tr.description}
              </th>
              <th className="py-4 px-6 font-medium whitespace-nowrap border-b border-[#1b887a]"></th>
            </tr>
          </thead>
          <tbody>
            {visaTypes.map((item, index) => (
              <tr 
                key={item.id} 
                className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
              >
                <td className="py-4 px-6 text-gray-700 whitespace-nowrap">
                  {getVisaTypeName(item)}
                </td>
                <td className="py-4 px-6 font-bold text-gray-900 text-center whitespace-nowrap">{item.code}</td>
                <td className="py-4 px-6 text-gray-600 leading-relaxed min-w-[300px]">
                  {getVisaTypeDesc(item)}
                </td>
                <td className="py-4 px-6 text-center whitespace-nowrap">
                  <button 
                    onClick={() => fetchDocuments(item.code, getVisaTypeName(item))}
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

      {/* Dynamic Documents Modal */}
      {activeModal && (
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
              {/* General Documents */}
              {documents.general.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#1b887a] text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    {tr.generalDocs}
                  </h4>
                  <div className="space-y-2">
                    {documents.general.map((doc) => (
                      <div key={doc.id} className="bg-gray-50 rounded-lg p-3 flex items-start gap-2">
                        <div className="text-[#1b887a] flex-shrink-0">
                          {iconMap[doc.icon] || <FileText className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm flex items-center gap-2">
                            {getDocTitle(doc)}
                            {!doc.is_required && (
                              <span className="text-xs text-gray-400">({tr.optional})</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">
                            {(() => {
                              const docLink = getDocLink(doc);
                              return docLink ? (
                                <>
                                  {getDocDesc(doc)}
                                  <a 
                                    href={docLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-[#1b887a] hover:underline ml-1"
                                  >
                                    {tr.clickToView}
                                  </a>
                                </>
                              ) : (
                                getDocDesc(doc)
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Documents */}
              {documents.special.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#1b887a] text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {documents.general.length > 0 ? '2' : '1'}
                    </span>
                    {tr.specialDocs}
                  </h4>
                  <div className="space-y-2">
                    {documents.special.map((doc) => (
                      <div key={doc.id} className="bg-gray-50 rounded-lg p-3 flex items-start gap-2">
                        <div className="text-[#1b887a] flex-shrink-0">
                          {iconMap[doc.icon] || <FileText className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm flex items-center gap-2">
                            {getDocTitle(doc)}
                            {!doc.is_required && (
                              <span className="text-xs text-gray-400">({tr.optional})</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">
                            {(() => {
                              const docLink = getDocLink(doc);
                              return docLink ? (
                                <>
                                  {getDocDesc(doc)}
                                  <a 
                                    href={docLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-[#1b887a] hover:underline ml-1"
                                  >
                                    {tr.clickToView}
                                  </a>
                                </>
                              ) : (
                                getDocDesc(doc)
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {documents.general.length === 0 && documents.special.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  {tr.noDocs}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </VisaLayout>
    </>
  );
}
