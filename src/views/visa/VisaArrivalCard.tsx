"use client";

import React from 'react';
import VisaLayout from '../../components/visa/VisaLayout';
import { useLanguage } from '../../context/LanguageContext';
import { VISA_CARD_TEXT, LangKey, MultiLang } from '../../data/visa-data';

export default function VisaArrivalCard() {
  const { language } = useLanguage();
  const langKey = (language === 'zh' ? 'cn' : language) as LangKey;
  const get = (ml: MultiLang) => ml[langKey] || ml.en;

  const tr = VISA_CARD_TEXT;
  const steps = tr.steps.map((step, i) => ({
    num: i + 1,
    title: get(step.title),
    desc: get(step.desc),
    links: step.links?.map(l => ({ name: get(l.name), url: l.url })),
    image: step.image,
  }));

  return (
    <VisaLayout breadcrumbTitle={get(tr.pageTitle)}>
        <div className="bg-white border border-gray-100 rounded-sm shadow-sm p-6">
        <h2 className="text-2xl font-bold text-center mb-10 text-gray-900">{get(tr.pageTitle)}</h2>
      <div className="space-y-12">
        {steps.map((step) => (
          <div key={step.num} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pb-10 border-b border-gray-100 last:border-0 last:pb-0">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-[#1b887a] text-white flex items-center justify-center font-bold">{step.num}</span>
                <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{step.desc}</p>
              {step.links && (
                <div className="space-y-2">
                  {step.links.map((link) => (
                    <div key={link.name} className="flex gap-2 text-sm">
                      <span className="text-gray-900 font-medium">{link.name}:</span>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[#1b887a] hover:underline break-all">{link.url}</a>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
               <img src={step.image} alt={step.title} className="rounded-lg w-full h-auto object-contain" />
            </div>
          </div>
        ))}
      </div>
      </div>
    </VisaLayout>
  );
}
