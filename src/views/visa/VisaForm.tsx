"use client";

import React from 'react';
import VisaLayout from '../../components/visa/VisaLayout';
import { useLanguage } from '../../context/LanguageContext';
import { VISA_FORM_TEXT, LangKey } from '../../data/visa-data';

export default function VisaForm() {
  const { language } = useLanguage();
  const langKey = (language === 'zh' ? 'cn' : language) as LangKey;
  const pageTitle = VISA_FORM_TEXT.pageTitle[langKey] || VISA_FORM_TEXT.pageTitle.en;

  return (
    <VisaLayout breadcrumbTitle={pageTitle}>
        <div className="bg-white border border-gray-100 rounded-sm shadow-sm p-6">
        <div className="w-full">
          <img 
            src="https://static.tripcngo.com/ing/shenqingbiao.png" 
            alt={pageTitle} 
            className="w-full h-auto rounded-sm border border-gray-100 shadow-sm"
          />
        </div>
        </div>
      </VisaLayout>
  );
}
