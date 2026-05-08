import React from 'react';
import VisaLayout from '../../components/visa/VisaLayout';
import { Download, FileText } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/SEO';

export default function VisaDownloads() {
  const { language, t } = useLanguage();

  const isZh = language === 'zh';

  // 翻译键
  const tr = {
    pageTitle: t('visa.menu.download', 'Downloads'),
    fileName: t('visa.page.download.fileName', 'File Name'),
    action: t('visa.page.download.action', 'Action'),
    view: t('visa.page.download.view', 'View'),
    doc1Title: t('visa.page.download.doc1Title', 'Entry/Exit Document Photo Guidelines'),
    doc2Title: t('visa.page.download.doc2Title', 'Foreigner Visa/Residence Permit Application Form'),
    doc3Title: t('visa.page.download.doc3Title', 'Application Form for Taiwan Residents Settling in Mainland'),
  };

  const downloads = [
    { name: tr.doc1Title, url: 'https://www.nia.gov.cn/n741445/n741619/n894511/c896346/content.html' },
    { name: tr.doc2Title, url: 'https://www.nia.gov.cn/n741445/n741619/n894511/c1748608/content.html' },
    { name: tr.doc3Title, url: 'https://www.nia.gov.cn/n741445/n741619/n894511/c1748522/content.html' },
  ];

  return (
    <>
      <SEO 
        title="China Visa Downloads"
        titleZh="中国签证资料下载"
        description="Download essential China visa documents including application forms, invitation letter templates, and official government forms."
        descriptionZh="下载必需的中国签证文件，包括申请表、邀请函模板和政府官方表格。"
        keywordsZh="签证下载, 中国签证表格下载, 邀请函模板, 签证申请表格下载"
        keywords="China visa downloads, visa form download, invitation letter template, Chinese visa documents"
        url="https://tripcngo.com/visa/downloads"
      />
      <VisaLayout breadcrumbTitle={tr.pageTitle}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="w-full text-left">
          <thead className="bg-[#1b887a] text-white">
            <tr>
              <th className="px-6 py-4 font-semibold">{tr.fileName}</th>
              <th className="px-6 py-4 font-semibold w-32">{tr.action}</th>
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
                    {tr.view}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </VisaLayout>
    </>
  );
}
