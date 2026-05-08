import React from 'react';
import VisaLayout from '../../components/visa/VisaLayout';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/SEO';

export default function VisaForm() {
  const { t } = useLanguage();
  return (
    <>
      <SEO 
        title="China Visa Application Form"
        titleZh="中国签证申请表"
        description="Download and view the official China visa application form (Form V.2013). Learn how to fill it out correctly."
        descriptionZh="下载并查看官方中国签证申请表（V.2013表格）。了解如何正确填写。"
        keywordsZh="签证申请表, 中国签证表, V.2013表格, 签证申请"
        keywords="China visa application form, visa form V.2013, Chinese visa form download"
        url="https://tripcngo.com/visa/form"
      />
      <VisaLayout breadcrumbTitle={t('visa.menu.form')}>
        <div className="w-full">
          <img 
            src="https://static.tripcngo.com/ing/shenqingbiao.png" 
            alt={t('visa.menu.form')} 
            className="w-full h-auto rounded-sm border border-gray-100 shadow-sm"
          />
        </div>
      </VisaLayout>
    </>
  );
}

