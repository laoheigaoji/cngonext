/**
 * Static visa data - all text inline, no translation key lookups needed.
 * Each record carries its own cn/en text so the components can render
 * directly without any i18n key resolution.
 */

export interface StaticVisaType {
  code: string;
  name: { cn: string; en: string };
  description: { cn: string; en: string };
  sortOrder: number;
}

export interface StaticVisaDocument {
  visaCode: string;
  section: 'general' | 'special';
  icon: string;
  title: { cn: string; en: string };
  description: { cn: string; en: string };
  linkUrl?: string;
  sortOrder: number;
  isRequired: boolean;
}

export interface StaticVisaFee {
  visaCode: string;
  purpose: { cn: string; en: string };
  feeRange: string;
  note: { cn: string; en: string };
  sortOrder: number;
}

export const VISA_TYPES: StaticVisaType[] = [
  { code: 'L',  name: { cn: '旅游', en: 'Tourism' }, description: { cn: '适用于入境旅游人员，包括团队旅游。停留时间通常为30天、60天或90天，可申请单次或多次入境。', en: 'For tourists entering China, including group tours. Stay duration is typically 30, 60, or 90 days. Single or multiple entry available.' }, sortOrder: 1 },
  { code: 'M',  name: { cn: '商务贸易', en: 'Business/Trade' }, description: { cn: '发给入境进行商业贸易活动的人员，首次停留最长90天，可延期。', en: 'For persons entering for commercial trade activities. Initial stay up to 90 days, extendable.' }, sortOrder: 2 },
  { code: 'Q1', name: { cn: '家庭团聚/结婚', en: 'Family Reunion/Marriage (Long-term)' }, description: { cn: '因家庭团聚申请在华长期居留（超过180日）的中国公民或永久居留外国人的家庭成员。', en: 'For family members of Chinese citizens or permanent residents applying for long-term residence (over 180 days) for family reunion.' }, sortOrder: 3 },
  { code: 'Q2', name: { cn: '家庭团聚/结婚', en: 'Family Reunion (Short-term)' }, description: { cn: '短期探亲（不超过180日），适用于亲属短期停留。', en: 'For short-term family visits (up to 180 days). Suitable for relatives on short stays.' }, sortOrder: 4 },
  { code: 'Z',  name: { cn: '工作', en: 'Work' }, description: { cn: '入境工作的外国专家；营业性演出；外国企业常驻中国代表机构的首席代表、代表；海上石油作业；志愿者、义工（超过90日）；其他取得中国政府主管部门颁发的工作许可入境工作的人员', en: 'For foreign experts working in China; commercial performances; chief representatives of foreign enterprises; offshore oil operations; volunteers (over 90 days); and others with work permits issued by Chinese authorities.' }, sortOrder: 5 },
  { code: 'X1', name: { cn: '学习', en: 'Study (Long-term)' }, description: { cn: '长期学习（超过180日），需学校录取通知书及JW201/JW202表。', en: 'For long-term study (over 180 days). Requires admission letter and JW201/JW202 form.' }, sortOrder: 6 },
  { code: 'X2', name: { cn: '学习', en: 'Study (Short-term)' }, description: { cn: '短期学习（不超过180日），适用于短期课程或交流项目。', en: 'For short-term study (up to 180 days). Suitable for short courses or exchange programs.' }, sortOrder: 7 },
  { code: 'G',  name: { cn: '过境', en: 'Transit' }, description: { cn: '经中国过境前往第三国的人员，停留时间通常不超过10天。', en: 'For persons transiting through China to a third country. Stay typically no more than 10 days.' }, sortOrder: 8 },
  { code: 'C',  name: { cn: '乘务/运输', en: 'Crew/Transport' }, description: { cn: '国际列车乘务员；国际航空器机组成员；国际航行船舶的船员及船员随行家属；从事国际道路运输的汽车驾驶员', en: 'For international train crew; aircraft crew members; ship crew and their family members; international road transport drivers.' }, sortOrder: 9 },
  { code: 'D',  name: { cn: '永久居留', en: 'Permanent Residence' }, description: { cn: '需提前获得公安部审批，适用于申请在中国永久居留的人员。', en: 'Requires prior approval from the Ministry of Public Security. For persons applying for permanent residence in China.' }, sortOrder: 10 },
  { code: 'F',  name: { cn: '交流访问/考察', en: 'Exchange/Visit' }, description: { cn: '学术交流活动；文化交流活动（如交流性演出）；宗教交流活动；非政府组织交流活动；志愿者、义工（不超过90日）；持《外国专家来华邀请函》的外国专家；地理测绘活动', en: 'For academic exchanges; cultural exchanges; religious exchanges; NGO exchanges; volunteers (up to 90 days); foreign experts with invitation letters; surveying activities.' }, sortOrder: 11 },
  { code: 'J1', name: { cn: '新闻记者', en: 'Journalist (Long-term)' }, description: { cn: '常驻中国新闻机构的外国记者，需外交部新闻司签发的通知函。', en: 'For resident foreign journalists of news organizations in China. Requires notification letter from the Information Department of MFA.' }, sortOrder: 12 },
  { code: 'J2', name: { cn: '新闻记者', en: 'Journalist (Short-term)' }, description: { cn: '短期采访记者（停留不超过180日），需官方媒体公函。', en: 'For short-term journalists (stay up to 180 days). Requires official media letter.' }, sortOrder: 13 },
  { code: 'R',  name: { cn: '高层次人才', en: 'High-level Talent' }, description: { cn: '针对国家急需的外国高层次人才，提供便利化入境及居留政策。', en: 'For foreign high-level talents urgently needed by the state. Provides facilitated entry and residence policies.' }, sortOrder: 14 },
  { code: 'S1', name: { cn: '私人事务探亲', en: 'Private Affairs (Long-term)' }, description: { cn: '在华居留外国人的长期探亲家属（超过180日）。', en: 'For long-term visiting relatives of foreigners residing in China (over 180 days).' }, sortOrder: 15 },
  { code: 'S2', name: { cn: '私人事务探亲', en: 'Private Affairs (Short-term)' }, description: { cn: '短期探亲（不超过180日）或因其他私人事务需停留的人员。', en: 'For short-term visits (up to 180 days) or other private affairs requiring stay in China.' }, sortOrder: 16 },
];

export const VISA_DOCUMENTS: StaticVisaDocument[] = [
  // ===== L Visa - Tourism =====
  { visaCode: 'L', section: 'general', icon: 'FileText', title: { cn: '护照', en: 'Passport' }, description: { cn: '有效期6个月以上的原件及复印件', en: 'Original and copy, valid for at least 6 months' }, sortOrder: 1, isRequired: true },
  { visaCode: 'L', section: 'general', icon: 'Upload',   title: { cn: '签证申请表及照片', en: 'Visa Application Form & Photo' }, description: { cn: '完整填写并签名，附一张近期白底证件照', en: 'Complete and signed, with one recent white-background photo' }, sortOrder: 2, isRequired: true, linkUrl: '/visa/photo' },
  { visaCode: 'L', section: 'general', icon: 'CreditCard', title: { cn: '合法居留证明', en: 'Legal Residence Permit' }, description: { cn: '在所在国合法居留、工作、学习的有效证明', en: 'Valid proof of legal residence, work, or study in the host country' }, sortOrder: 3, isRequired: true },
  { visaCode: 'L', section: 'general', icon: 'User',     title: { cn: '原中国护照或签证', en: 'Former Chinese Passport or Visa' }, description: { cn: '原中国护照或原中国签证（如有）', en: 'Former Chinese passport or visa (if applicable)' }, sortOrder: 4, isRequired: true },
  { visaCode: 'L', section: 'special', icon: 'Plane',    title: { cn: '往返机票订单', en: 'Round-trip Flight Itinerary' }, description: { cn: '往返机票预订单或行程单', en: 'Round-trip flight booking or itinerary' }, sortOrder: 1, isRequired: true },
  { visaCode: 'L', section: 'special', icon: 'Mail',     title: { cn: '邀请函', en: 'Invitation Letter' }, description: { cn: '中国境内个人或单位出具的邀请函（可选）', en: 'Invitation letter from a Chinese individual or entity (optional)' }, sortOrder: 2, isRequired: false },

  // ===== M Visa - Business =====
  { visaCode: 'M', section: 'general', icon: 'FileText', title: { cn: '护照', en: 'Passport' }, description: { cn: '有效期6个月以上的原件及复印件', en: 'Original and copy, valid for at least 6 months' }, sortOrder: 1, isRequired: true },
  { visaCode: 'M', section: 'general', icon: 'Upload',   title: { cn: '签证申请表及照片', en: 'Visa Application Form & Photo' }, description: { cn: '完整填写并签名，附一张近期白底证件照', en: 'Complete and signed, with one recent white-background photo' }, sortOrder: 2, isRequired: true, linkUrl: '/visa/photo' },
  { visaCode: 'M', section: 'general', icon: 'CreditCard', title: { cn: '合法居留证明', en: 'Legal Residence Permit' }, description: { cn: '在所在国合法居留、工作、学习的有效证明', en: 'Valid proof of legal residence, work, or study in the host country' }, sortOrder: 3, isRequired: true },
  { visaCode: 'M', section: 'general', icon: 'User',     title: { cn: '原中国护照或签证', en: 'Former Chinese Passport or Visa' }, description: { cn: '原中国护照或原中国签证（如有）', en: 'Former Chinese passport or visa (if applicable)' }, sortOrder: 4, isRequired: true },
  { visaCode: 'M', section: 'special', icon: 'Mail',     title: { cn: '邀请函', en: 'Invitation Letter' }, description: { cn: '中国境内商业合作伙伴出具的邀请函', en: 'Invitation letter from a Chinese business partner' }, sortOrder: 1, isRequired: true },
  { visaCode: 'M', section: 'special', icon: 'Building2', title: { cn: '商业证明文件', en: 'Business Certification' }, description: { cn: '在中国注册的商业企业的证明信', en: 'Certification letter from a registered Chinese business' }, sortOrder: 2, isRequired: true },
  { visaCode: 'M', section: 'special', icon: 'CreditCard', title: { cn: '银行流水', en: 'Bank Statement' }, description: { cn: '近6个月银行流水，证明经济能力', en: 'Bank statements from the past 6 months proving financial capacity' }, sortOrder: 3, isRequired: true },

  // ===== Q1 Visa - Family Long-term =====
  { visaCode: 'Q1', section: 'general', icon: 'FileText', title: { cn: '护照', en: 'Passport' }, description: { cn: '有效期6个月以上的原件及复印件', en: 'Original and copy, valid for at least 6 months' }, sortOrder: 1, isRequired: true },
  { visaCode: 'Q1', section: 'general', icon: 'Upload',   title: { cn: '签证申请表及照片', en: 'Visa Application Form & Photo' }, description: { cn: '完整填写并签名，附一张近期白底证件照', en: 'Complete and signed, with one recent white-background photo' }, sortOrder: 2, isRequired: true, linkUrl: '/visa/photo' },
  { visaCode: 'Q1', section: 'general', icon: 'CreditCard', title: { cn: '合法居留证明', en: 'Legal Residence Permit' }, description: { cn: '在所在国合法居留、工作、学习的有效证明', en: 'Valid proof of legal residence, work, or study in the host country' }, sortOrder: 3, isRequired: true },
  { visaCode: 'Q1', section: 'general', icon: 'User',     title: { cn: '原中国护照或签证', en: 'Former Chinese Passport or Visa' }, description: { cn: '原中国护照或原中国签证（如有）', en: 'Former Chinese passport or visa (if applicable)' }, sortOrder: 4, isRequired: true },
  { visaCode: 'Q1', section: 'special', icon: 'Heart',    title: { cn: '亲属关系证明', en: 'Relationship Proof' }, description: { cn: '结婚证、出生证等亲属关系证明文件', en: 'Marriage certificate, birth certificate, or other proof of family relationship' }, sortOrder: 1, isRequired: true },
  { visaCode: 'Q1', section: 'special', icon: 'Mail',     title: { cn: '邀请函', en: 'Invitation Letter' }, description: { cn: '中国公民或永久居留外国人出具的邀请函', en: 'Invitation letter from a Chinese citizen or permanent resident' }, sortOrder: 2, isRequired: true },
  { visaCode: 'Q1', section: 'special', icon: 'User',     title: { cn: '邀请人身份证明', en: 'Inviter ID' }, description: { cn: '邀请人中国身份证或永久居留证复印件', en: 'Copy of inviter\'s Chinese ID card or permanent residence permit' }, sortOrder: 3, isRequired: true },

  // ===== Q2 Visa - Family Short-term =====
  { visaCode: 'Q2', section: 'general', icon: 'FileText', title: { cn: '护照', en: 'Passport' }, description: { cn: '有效期6个月以上的原件及复印件', en: 'Original and copy, valid for at least 6 months' }, sortOrder: 1, isRequired: true },
  { visaCode: 'Q2', section: 'general', icon: 'Upload',   title: { cn: '签证申请表及照片', en: 'Visa Application Form & Photo' }, description: { cn: '完整填写并签名，附一张近期白底证件照', en: 'Complete and signed, with one recent white-background photo' }, sortOrder: 2, isRequired: true, linkUrl: '/visa/photo' },
  { visaCode: 'Q2', section: 'general', icon: 'CreditCard', title: { cn: '合法居留证明', en: 'Legal Residence Permit' }, description: { cn: '在所在国合法居留、工作、学习的有效证明', en: 'Valid proof of legal residence, work, or study in the host country' }, sortOrder: 3, isRequired: true },
  { visaCode: 'Q2', section: 'general', icon: 'User',     title: { cn: '原中国护照或签证', en: 'Former Chinese Passport or Visa' }, description: { cn: '原中国护照或原中国签证（如有）', en: 'Former Chinese passport or visa (if applicable)' }, sortOrder: 4, isRequired: true },
  { visaCode: 'Q2', section: 'special', icon: 'Heart',    title: { cn: '亲属关系证明', en: 'Relationship Proof' }, description: { cn: '结婚证、出生证等亲属关系证明文件', en: 'Marriage certificate, birth certificate, or other proof of family relationship' }, sortOrder: 1, isRequired: true },
  { visaCode: 'Q2', section: 'special', icon: 'Mail',     title: { cn: '邀请函', en: 'Invitation Letter' }, description: { cn: '中国公民出具的邀请函', en: 'Invitation letter from a Chinese citizen' }, sortOrder: 2, isRequired: true },

  // ===== Z Visa - Work =====
  { visaCode: 'Z', section: 'general', icon: 'FileText', title: { cn: '护照', en: 'Passport' }, description: { cn: '有效期6个月以上的原件及复印件', en: 'Original and copy, valid for at least 6 months' }, sortOrder: 1, isRequired: true },
  { visaCode: 'Z', section: 'general', icon: 'Upload',   title: { cn: '签证申请表及照片', en: 'Visa Application Form & Photo' }, description: { cn: '完整填写并签名，附一张近期白底证件照', en: 'Complete and signed, with one recent white-background photo' }, sortOrder: 2, isRequired: true, linkUrl: '/visa/photo' },
  { visaCode: 'Z', section: 'general', icon: 'FileText', title: { cn: '工作许可', en: 'Work Permit' }, description: { cn: '《外国人工作许可通知》', en: 'Foreigner Work Permit Notice' }, sortOrder: 3, isRequired: true },
  { visaCode: 'Z', section: 'general', icon: 'FileText', title: { cn: '劳动合同', en: 'Employment Contract' }, description: { cn: '与用人单位签订的劳动合同或任职证明', en: 'Employment contract or appointment letter from the employer' }, sortOrder: 4, isRequired: true },
  { visaCode: 'Z', section: 'special', icon: 'CheckCircle', title: { cn: '无犯罪记录证明', en: 'No Criminal Record Certificate' }, description: { cn: '由所在国公安机关出具的无犯罪记录证明', en: 'No criminal record certificate issued by authorities of home country' }, sortOrder: 1, isRequired: true },
  { visaCode: 'Z', section: 'special', icon: 'Heart',    title: { cn: '体检证明', en: 'Health Certificate' }, description: { cn: '出入境检验检疫机构出具的健康证明', en: 'Health certificate issued by entry-exit inspection and quarantine authorities' }, sortOrder: 2, isRequired: true },
  { visaCode: 'Z', section: 'special', icon: 'Building2', title: { cn: '学历证明', en: 'Education Certificate' }, description: { cn: '最高学历证书及认证', en: 'Highest education diploma and authentication' }, sortOrder: 3, isRequired: true },

  // ===== X1 Visa - Study Long-term =====
  { visaCode: 'X1', section: 'general', icon: 'FileText', title: { cn: '护照', en: 'Passport' }, description: { cn: '有效期6个月以上的原件及复印件', en: 'Original and copy, valid for at least 6 months' }, sortOrder: 1, isRequired: true },
  { visaCode: 'X1', section: 'general', icon: 'Upload',   title: { cn: '签证申请表及照片', en: 'Visa Application Form & Photo' }, description: { cn: '完整填写并签名，附一张近期白底证件照', en: 'Complete and signed, with one recent white-background photo' }, sortOrder: 2, isRequired: true, linkUrl: '/visa/photo' },
  { visaCode: 'X1', section: 'general', icon: 'FileText', title: { cn: '录取通知书', en: 'Admission Letter' }, description: { cn: '中国学校发出的录取通知书', en: 'Admission letter from a Chinese school' }, sortOrder: 3, isRequired: true },
  { visaCode: 'X1', section: 'general', icon: 'FileText', title: { cn: 'JW201/JW202表', en: 'JW201/JW202 Form' }, description: { cn: '《外国留学人员来华签证申请表》', en: 'Visa Application Form for Study in China (JW201/JW202)' }, sortOrder: 4, isRequired: true },
  { visaCode: 'X1', section: 'special', icon: 'CheckCircle', title: { cn: '无犯罪记录证明', en: 'No Criminal Record Certificate' }, description: { cn: '由所在国公安机关出具的无犯罪记录证明', en: 'No criminal record certificate issued by authorities of home country' }, sortOrder: 1, isRequired: true },
  { visaCode: 'X1', section: 'special', icon: 'Heart',    title: { cn: '体检证明', en: 'Health Certificate' }, description: { cn: '出入境检验检疫机构出具的健康证明', en: 'Health certificate issued by entry-exit inspection and quarantine authorities' }, sortOrder: 2, isRequired: true },
  { visaCode: 'X1', section: 'special', icon: 'Building2', title: { cn: '学历证明', en: 'Education Certificate' }, description: { cn: '最高学历证书', en: 'Highest education diploma' }, sortOrder: 3, isRequired: true },

  // ===== X2 Visa - Study Short-term =====
  { visaCode: 'X2', section: 'general', icon: 'FileText', title: { cn: '护照', en: 'Passport' }, description: { cn: '有效期6个月以上的原件及复印件', en: 'Original and copy, valid for at least 6 months' }, sortOrder: 1, isRequired: true },
  { visaCode: 'X2', section: 'general', icon: 'Upload',   title: { cn: '签证申请表及照片', en: 'Visa Application Form & Photo' }, description: { cn: '完整填写并签名，附一张近期白底证件照', en: 'Complete and signed, with one recent white-background photo' }, sortOrder: 2, isRequired: true, linkUrl: '/visa/photo' },
  { visaCode: 'X2', section: 'general', icon: 'FileText', title: { cn: '录取通知书', en: 'Admission Letter' }, description: { cn: '中国学校发出的录取通知书', en: 'Admission letter from a Chinese school' }, sortOrder: 3, isRequired: true },
  { visaCode: 'X2', section: 'general', icon: 'FileText', title: { cn: 'JW201/JW202表', en: 'JW201/JW202 Form' }, description: { cn: '《外国留学人员来华签证申请表》', en: 'Visa Application Form for Study in China (JW201/JW202)' }, sortOrder: 4, isRequired: true },

  // ===== G Visa - Transit =====
  { visaCode: 'G', section: 'general', icon: 'FileText', title: { cn: '护照', en: 'Passport' }, description: { cn: '有效期6个月以上的原件及复印件', en: 'Original and copy, valid for at least 6 months' }, sortOrder: 1, isRequired: true },
  { visaCode: 'G', section: 'general', icon: 'Upload',   title: { cn: '签证申请表及照片', en: 'Visa Application Form & Photo' }, description: { cn: '完整填写并签名，附一张近期白底证件照', en: 'Complete and signed, with one recent white-background photo' }, sortOrder: 2, isRequired: true, linkUrl: '/visa/photo' },
  { visaCode: 'G', section: 'general', icon: 'Plane',    title: { cn: '联程机票', en: 'Connecting Flight Ticket' }, description: { cn: '前往第三国的已确认日期的联程机票', en: 'Confirmed connecting flight ticket to a third country' }, sortOrder: 3, isRequired: true },
  { visaCode: 'G', section: 'general', icon: 'FileText', title: { cn: '目的地国签证', en: 'Destination Country Visa' }, description: { cn: '目的地国家的有效签证或居留证明', en: 'Valid visa or residence permit for the destination country' }, sortOrder: 4, isRequired: true },

  // ===== C Visa - Crew =====
  { visaCode: 'C', section: 'general', icon: 'FileText', title: { cn: '护照', en: 'Passport' }, description: { cn: '有效期6个月以上的原件及复印件', en: 'Original and copy, valid for at least 6 months' }, sortOrder: 1, isRequired: true },
  { visaCode: 'C', section: 'general', icon: 'Upload',   title: { cn: '签证申请表及照片', en: 'Visa Application Form & Photo' }, description: { cn: '完整填写并签名，附一张近期白底证件照', en: 'Complete and signed, with one recent white-background photo' }, sortOrder: 2, isRequired: true, linkUrl: '/visa/photo' },
  { visaCode: 'C', section: 'general', icon: 'FileText', title: { cn: '乘务证件', en: 'Crew Certificate' }, description: { cn: '国际列车/航空器/船舶的乘务证件', en: 'Crew certificate for international train/aircraft/ship' }, sortOrder: 3, isRequired: true },
  { visaCode: 'C', section: 'general', icon: 'Building2', title: { cn: '担保函', en: 'Guarantee Letter' }, description: { cn: '外国运输公司出具的担保函', en: 'Guarantee letter from the foreign transport company' }, sortOrder: 4, isRequired: true },

  // ===== D Visa - Permanent Residence =====
  { visaCode: 'D', section: 'general', icon: 'FileText', title: { cn: '护照', en: 'Passport' }, description: { cn: '有效期6个月以上的原件及复印件', en: 'Original and copy, valid for at least 6 months' }, sortOrder: 1, isRequired: true },
  { visaCode: 'D', section: 'general', icon: 'Upload',   title: { cn: '签证申请表及照片', en: 'Visa Application Form & Photo' }, description: { cn: '完整填写并签名，附一张近期白底证件照', en: 'Complete and signed, with one recent white-background photo' }, sortOrder: 2, isRequired: true, linkUrl: '/visa/photo' },
  { visaCode: 'D', section: 'general', icon: 'CheckCircle', title: { cn: '合法居留证明', en: 'Legal Residence Permit' }, description: { cn: '在所在国合法居留、工作、学习的有效证明', en: 'Valid proof of legal residence, work, or study in the host country' }, sortOrder: 3, isRequired: true },
  { visaCode: 'D', section: 'general', icon: 'FileText', title: { cn: '往返机票订单', en: 'Round-trip Flight Itinerary' }, description: { cn: '往返机票预订单或行程单', en: 'Round-trip flight booking or itinerary' }, sortOrder: 4, isRequired: true },
  { visaCode: 'D', section: 'special', icon: 'FileText', title: { cn: '永久居留确认表', en: 'Permanent Residence Confirmation Form' }, description: { cn: '公安部签发的《外国人永久居留身份确认表》', en: 'Permanent Residence Confirmation Form issued by the Ministry of Public Security' }, sortOrder: 5, isRequired: true },
  { visaCode: 'D', section: 'special', icon: 'CheckCircle', title: { cn: '无犯罪记录证明', en: 'No Criminal Record Certificate' }, description: { cn: '由所在国公安机关出具的无犯罪记录证明', en: 'No criminal record certificate issued by authorities of home country' }, sortOrder: 6, isRequired: true },
  { visaCode: 'D', section: 'special', icon: 'Heart',    title: { cn: '体检证明', en: 'Health Certificate' }, description: { cn: '出入境检验检疫机构出具的健康证明', en: 'Health certificate issued by entry-exit inspection and quarantine authorities' }, sortOrder: 7, isRequired: true },

  // ===== F Visa - Exchange/Visit =====
  { visaCode: 'F', section: 'general', icon: 'FileText', title: { cn: '护照', en: 'Passport' }, description: { cn: '有效期6个月以上的原件及复印件', en: 'Original and copy, valid for at least 6 months' }, sortOrder: 1, isRequired: true },
  { visaCode: 'F', section: 'general', icon: 'Upload',   title: { cn: '签证申请表及照片', en: 'Visa Application Form & Photo' }, description: { cn: '完整填写并签名，附一张近期白底证件照', en: 'Complete and signed, with one recent white-background photo' }, sortOrder: 2, isRequired: true, linkUrl: '/visa/photo' },
  { visaCode: 'F', section: 'general', icon: 'CheckCircle', title: { cn: '合法居留证明', en: 'Legal Residence Permit' }, description: { cn: '在所在国合法居留、工作、学习的有效证明', en: 'Valid proof of legal residence, work, or study in the host country' }, sortOrder: 3, isRequired: true },
  { visaCode: 'F', section: 'general', icon: 'FileText', title: { cn: '往返机票订单', en: 'Round-trip Flight Itinerary' }, description: { cn: '往返机票预订单或行程单', en: 'Round-trip flight booking or itinerary' }, sortOrder: 4, isRequired: true },
  { visaCode: 'F', section: 'special', icon: 'Mail',     title: { cn: '邀请函', en: 'Invitation Letter' }, description: { cn: '中国境内单位出具的邀请函', en: 'Invitation letter from a Chinese entity' }, sortOrder: 5, isRequired: true },
  { visaCode: 'F', section: 'special', icon: 'FileText', title: { cn: '活动计划', en: 'Activity Plan' }, description: { cn: '在中国期间的详细活动计划', en: 'Detailed activity plan during stay in China' }, sortOrder: 6, isRequired: true },
  { visaCode: 'F', section: 'special', icon: 'Building2', title: { cn: '资质证明', en: 'Qualification Certificate' }, description: { cn: '相关资质或执业证明（可选）', en: 'Relevant qualification or professional certificate (optional)' }, sortOrder: 7, isRequired: false },

  // ===== J1 Visa - Journalist Long-term =====
  { visaCode: 'J1', section: 'general', icon: 'FileText', title: { cn: '护照', en: 'Passport' }, description: { cn: '有效期6个月以上的原件及复印件', en: 'Original and copy, valid for at least 6 months' }, sortOrder: 1, isRequired: true },
  { visaCode: 'J1', section: 'general', icon: 'Upload',   title: { cn: '签证申请表及照片', en: 'Visa Application Form & Photo' }, description: { cn: '完整填写并签名，附一张近期白底证件照', en: 'Complete and signed, with one recent white-background photo' }, sortOrder: 2, isRequired: true, linkUrl: '/visa/photo' },
  { visaCode: 'J1', section: 'general', icon: 'CheckCircle', title: { cn: '合法居留证明', en: 'Legal Residence Permit' }, description: { cn: '在所在国合法居留、工作、学习的有效证明', en: 'Valid proof of legal residence, work, or study in the host country' }, sortOrder: 3, isRequired: true },
  { visaCode: 'J1', section: 'general', icon: 'FileText', title: { cn: '往返机票订单', en: 'Round-trip Flight Itinerary' }, description: { cn: '往返机票预订单或行程单', en: 'Round-trip flight booking or itinerary' }, sortOrder: 4, isRequired: true },
  { visaCode: 'J1', section: 'special', icon: 'Mail',     title: { cn: '外交部新闻司通知函', en: 'MFA Information Dept. Notification' }, description: { cn: '外交部新闻司签发的通知函', en: 'Notification letter from the Information Department of MFA' }, sortOrder: 5, isRequired: true },
  { visaCode: 'J1', section: 'special', icon: 'Building2', title: { cn: '记者证', en: 'Journalist ID' }, description: { cn: '所在新闻机构的记者证明', en: 'Journalist credentials from the news organization' }, sortOrder: 6, isRequired: true },

  // ===== J2 Visa - Journalist Short-term =====
  { visaCode: 'J2', section: 'general', icon: 'FileText', title: { cn: '护照', en: 'Passport' }, description: { cn: '有效期6个月以上的原件及复印件', en: 'Original and copy, valid for at least 6 months' }, sortOrder: 1, isRequired: true },
  { visaCode: 'J2', section: 'general', icon: 'Upload',   title: { cn: '签证申请表及照片', en: 'Visa Application Form & Photo' }, description: { cn: '完整填写并签名，附一张近期白底证件照', en: 'Complete and signed, with one recent white-background photo' }, sortOrder: 2, isRequired: true, linkUrl: '/visa/photo' },
  { visaCode: 'J2', section: 'general', icon: 'CheckCircle', title: { cn: '合法居留证明', en: 'Legal Residence Permit' }, description: { cn: '在所在国合法居留、工作、学习的有效证明', en: 'Valid proof of legal residence, work, or study in the host country' }, sortOrder: 3, isRequired: true },
  { visaCode: 'J2', section: 'general', icon: 'FileText', title: { cn: '往返机票订单', en: 'Round-trip Flight Itinerary' }, description: { cn: '往返机票预订单或行程单', en: 'Round-trip flight booking or itinerary' }, sortOrder: 4, isRequired: true },
  { visaCode: 'J2', section: 'special', icon: 'FileText', title: { cn: '采访计划', en: 'Interview Plan' }, description: { cn: '在中国期间的采访报道计划', en: 'Interview and reporting plan during stay in China' }, sortOrder: 5, isRequired: true },
  { visaCode: 'J2', section: 'special', icon: 'Building2', title: { cn: '记者证', en: 'Journalist ID' }, description: { cn: '所在新闻机构的记者证明', en: 'Journalist credentials from the news organization' }, sortOrder: 6, isRequired: true },

  // ===== R Visa - Talent =====
  { visaCode: 'R', section: 'general', icon: 'FileText', title: { cn: '护照', en: 'Passport' }, description: { cn: '有效期6个月以上的原件及复印件', en: 'Original and copy, valid for at least 6 months' }, sortOrder: 1, isRequired: true },
  { visaCode: 'R', section: 'general', icon: 'Upload',   title: { cn: '签证申请表及照片', en: 'Visa Application Form & Photo' }, description: { cn: '完整填写并签名，附一张近期白底证件照', en: 'Complete and signed, with one recent white-background photo' }, sortOrder: 2, isRequired: true, linkUrl: '/visa/photo' },
  { visaCode: 'R', section: 'general', icon: 'CheckCircle', title: { cn: '合法居留证明', en: 'Legal Residence Permit' }, description: { cn: '在所在国合法居留、工作、学习的有效证明', en: 'Valid proof of legal residence, work, or study in the host country' }, sortOrder: 3, isRequired: true },
  { visaCode: 'R', section: 'general', icon: 'FileText', title: { cn: '往返机票订单', en: 'Round-trip Flight Itinerary' }, description: { cn: '往返机票预订单或行程单', en: 'Round-trip flight booking or itinerary' }, sortOrder: 4, isRequired: true },
  { visaCode: 'R', section: 'special', icon: 'FileText', title: { cn: '人才认定证明', en: 'Talent Recognition Certificate' }, description: { cn: '符合高层次人才认定标准的证明材料', en: 'Documentation proving high-level talent status' }, sortOrder: 5, isRequired: true },
  { visaCode: 'R', section: 'special', icon: 'Mail',     title: { cn: '邀请函或合同', en: 'Invitation Letter or Contract' }, description: { cn: '中国用人单位的邀请函或聘用合同', en: 'Invitation letter or employment contract from a Chinese entity' }, sortOrder: 6, isRequired: true },
  { visaCode: 'R', section: 'special', icon: 'CheckCircle', title: { cn: '资质证明', en: 'Qualification Certificate' }, description: { cn: '相关领域的成就或资质证明', en: 'Achievement or qualification documentation in relevant field' }, sortOrder: 7, isRequired: true },

  // ===== S1 Visa - Private Affairs Long-term =====
  { visaCode: 'S1', section: 'general', icon: 'FileText', title: { cn: '护照', en: 'Passport' }, description: { cn: '有效期6个月以上的原件及复印件', en: 'Original and copy, valid for at least 6 months' }, sortOrder: 1, isRequired: true },
  { visaCode: 'S1', section: 'general', icon: 'Upload',   title: { cn: '签证申请表及照片', en: 'Visa Application Form & Photo' }, description: { cn: '完整填写并签名，附一张近期白底证件照', en: 'Complete and signed, with one recent white-background photo' }, sortOrder: 2, isRequired: true, linkUrl: '/visa/photo' },
  { visaCode: 'S1', section: 'general', icon: 'CheckCircle', title: { cn: '合法居留证明', en: 'Legal Residence Permit' }, description: { cn: '在所在国合法居留、工作、学习的有效证明', en: 'Valid proof of legal residence, work, or study in the host country' }, sortOrder: 3, isRequired: true },
  { visaCode: 'S1', section: 'general', icon: 'FileText', title: { cn: '往返机票订单', en: 'Round-trip Flight Itinerary' }, description: { cn: '往返机票预订单或行程单', en: 'Round-trip flight booking or itinerary' }, sortOrder: 4, isRequired: true },
  { visaCode: 'S1', section: 'special', icon: 'Heart',    title: { cn: '亲属关系证明', en: 'Family Relationship Proof' }, description: { cn: '与在华居留外国人的亲属关系证明', en: 'Proof of family relationship with the foreigner residing in China' }, sortOrder: 5, isRequired: true },
  { visaCode: 'S1', section: 'special', icon: 'FileText', title: { cn: '居留人证件', en: 'Resident\'s Permit' }, description: { cn: '在华居留外国人的居留证件复印件', en: 'Copy of the foreign resident\'s residence permit in China' }, sortOrder: 6, isRequired: true },
  { visaCode: 'S1', section: 'special', icon: 'Mail',     title: { cn: '邀请函', en: 'Invitation Letter' }, description: { cn: '在华居留外国人出具的邀请函', en: 'Invitation letter from the foreigner residing in China' }, sortOrder: 7, isRequired: true },

  // ===== S2 Visa - Private Affairs Short-term =====
  { visaCode: 'S2', section: 'general', icon: 'FileText', title: { cn: '护照', en: 'Passport' }, description: { cn: '有效期6个月以上的原件及复印件', en: 'Original and copy, valid for at least 6 months' }, sortOrder: 1, isRequired: true },
  { visaCode: 'S2', section: 'general', icon: 'Upload',   title: { cn: '签证申请表及照片', en: 'Visa Application Form & Photo' }, description: { cn: '完整填写并签名，附一张近期白底证件照', en: 'Complete and signed, with one recent white-background photo' }, sortOrder: 2, isRequired: true, linkUrl: '/visa/photo' },
  { visaCode: 'S2', section: 'general', icon: 'CheckCircle', title: { cn: '合法居留证明', en: 'Legal Residence Permit' }, description: { cn: '在所在国合法居留、工作、学习的有效证明', en: 'Valid proof of legal residence, work, or study in the host country' }, sortOrder: 3, isRequired: true },
  { visaCode: 'S2', section: 'general', icon: 'FileText', title: { cn: '往返机票订单', en: 'Round-trip Flight Itinerary' }, description: { cn: '往返机票预订单或行程单', en: 'Round-trip flight booking or itinerary' }, sortOrder: 4, isRequired: true },
  { visaCode: 'S2', section: 'special', icon: 'Heart',    title: { cn: '亲属关系证明', en: 'Family Relationship Proof' }, description: { cn: '与在华居留外国人的亲属关系证明（可选）', en: 'Proof of family relationship with the foreigner residing in China (optional)' }, sortOrder: 5, isRequired: false },
  { visaCode: 'S2', section: 'special', icon: 'FileText', title: { cn: '私人事务证明', en: 'Private Affairs Proof' }, description: { cn: '处理私人事务的相关证明材料（可选）', en: 'Relevant documentation for private affairs (optional)' }, sortOrder: 6, isRequired: false },
  { visaCode: 'S2', section: 'special', icon: 'Mail',     title: { cn: '邀请函', en: 'Invitation Letter' }, description: { cn: '在华居留外国人出具的邀请函（可选）', en: 'Invitation letter from the foreigner residing in China (optional)' }, sortOrder: 7, isRequired: false },
];

export const VISA_FEES: StaticVisaFee[] = [
  { visaCode: 'L',  purpose: { cn: '旅游签证', en: 'Tourism Visa' }, feeRange: '¥630-2,500', note: { cn: '根据入境次数和国籍不同，费用有所差异', en: 'Fees vary based on number of entries and nationality' }, sortOrder: 1 },
  { visaCode: 'M',  purpose: { cn: '商务签证', en: 'Business Visa' }, feeRange: '¥630-2,500', note: { cn: '根据入境次数和国籍不同，费用有所差异', en: 'Fees vary based on number of entries and nationality' }, sortOrder: 2 },
  { visaCode: 'Z',  purpose: { cn: '工作签证', en: 'Work Visa' }, feeRange: '¥630-2,500', note: { cn: '首次申请费用，延期费用另计', en: 'Initial application fee; extension fees are extra' }, sortOrder: 3 },
  { visaCode: 'X1', purpose: { cn: '学习签证（长期）', en: 'Study Visa (Long-term)' }, feeRange: '¥630-2,500', note: { cn: '长期学习签证费用', en: 'Long-term study visa fee' }, sortOrder: 4 },
  { visaCode: 'X2', purpose: { cn: '学习签证（短期）', en: 'Study Visa (Short-term)' }, feeRange: '¥420-1,500', note: { cn: '短期学习签证费用', en: 'Short-term study visa fee' }, sortOrder: 5 },
  { visaCode: 'Q1', purpose: { cn: '家庭团聚签证（长期）', en: 'Family Reunion Visa (Long-term)' }, feeRange: '¥630-2,500', note: { cn: '长期居留签证费用', en: 'Long-term residence visa fee' }, sortOrder: 6 },
  { visaCode: 'Q2', purpose: { cn: '探亲签证（短期）', en: 'Family Visit Visa (Short-term)' }, feeRange: '¥420-1,500', note: { cn: '短期探亲签证费用', en: 'Short-term family visit visa fee' }, sortOrder: 7 },
  { visaCode: 'S1', purpose: { cn: '私人事务签证（长期）', en: 'Private Affairs Visa (Long-term)' }, feeRange: '¥630-2,500', note: { cn: '长期私人事务签证费用', en: 'Long-term private affairs visa fee' }, sortOrder: 8 },
  { visaCode: 'S2', purpose: { cn: '私人事务签证（短期）', en: 'Private Affairs Visa (Short-term)' }, feeRange: '¥420-1,500', note: { cn: '短期私人事务签证费用', en: 'Short-term private affairs visa fee' }, sortOrder: 9 },
  { visaCode: 'F',  purpose: { cn: '交流访问签证', en: 'Exchange/Visit Visa' }, feeRange: '¥630-2,500', note: { cn: '根据入境次数和国籍不同', en: 'Fees vary based on number of entries and nationality' }, sortOrder: 10 },
  { visaCode: 'G',  purpose: { cn: '过境签证', en: 'Transit Visa' }, feeRange: '¥420-1,500', note: { cn: '过境签证费用', en: 'Transit visa fee' }, sortOrder: 11 },
  { visaCode: 'C',  purpose: { cn: '乘务签证', en: 'Crew Visa' }, feeRange: '¥420-1,500', note: { cn: '乘务签证费用', en: 'Crew visa fee' }, sortOrder: 12 },
  { visaCode: 'J1', purpose: { cn: '记者签证（长期）', en: 'Journalist Visa (Long-term)' }, feeRange: '¥630-2,500', note: { cn: '常驻记者签证费用', en: 'Resident journalist visa fee' }, sortOrder: 13 },
  { visaCode: 'J2', purpose: { cn: '记者签证（短期）', en: 'Journalist Visa (Short-term)' }, feeRange: '¥420-1,500', note: { cn: '短期采访签证费用', en: 'Short-term journalist visa fee' }, sortOrder: 14 },
  { visaCode: 'R',  purpose: { cn: '人才签证', en: 'Talent Visa' }, feeRange: '¥630-2,500', note: { cn: '高层次人才签证费用', en: 'High-level talent visa fee' }, sortOrder: 15 },
  { visaCode: 'D',  purpose: { cn: '永久居留签证', en: 'Permanent Residence Visa' }, feeRange: '¥1,500-3,000', note: { cn: '永久居留签证费用较高', en: 'Permanent residence visa fees are higher' }, sortOrder: 16 },
];
