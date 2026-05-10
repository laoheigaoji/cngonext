"use client";

import React from 'react';
import VisaLayout from '../../components/visa/VisaLayout';
import { Download, FileText } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { VISA_DOWNLOAD_TEXT, LangKey, MultiLang } from '../../data/visa-data';

export default function VisaDownloads() {
  const { language } = useLanguage();
  const langKey = (language === 'zh' ? 'cn' : language) as LangKey;
  const get = (ml: MultiLang) => ml[langKey] || ml.en;

  const tr = VISA_DOWNLOAD_TEXT;
  const downloads = tr.docs.map(doc => ({
    name: get(doc.title),
    url: doc.url,
  }));

  return (
    <VisaLayout breadcrumbTitle={get(tr.pageTitle)}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
          <thead className="bg-[#1b887a] text-white">
            <tr>
              <th className="px-6 py-4 font-semibold">{get(tr.fileName)}</th>
              <th className="px-6 py-4 font-semibold w-32">{get(tr.action)}</th>
            </tr>
          </thead>
          <tbody>
            {downloads.map((file, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{file.name}</span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => window.open(file.url, '_blank')}
                    className="flex items-center gap-2 text-[#1b887a] hover:text-[#166d63] font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    {get(tr.view)}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </VisaLayout>
  );
}
