"use client";

import React from 'react';
import VisaLayout from '../../components/visa/VisaLayout';
import { useLanguage } from '../../context/LanguageContext';

export default function VisaForm() {
  const { t } = useLanguage();
  return (
    <VisaLayout breadcrumbTitle={t('visa.menu.form')}>
        <div className="bg-white border border-gray-100 rounded-sm shadow-sm p-6">
        <div className="w-full">
          <img 
            src="https://static.tripcngo.com/ing/shenqingbiao.png" 
            alt={t('visa.menu.form')} 
            className="w-full h-auto rounded-sm border border-gray-100 shadow-sm"
          />
        </div>
        </div>
      </VisaLayout>
  );
}

