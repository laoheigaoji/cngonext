import React from 'react';
import VisaLayout from '../../components/visa/VisaLayout';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/SEO';

export default function VisaArrivalCard() {
  const { language, t } = useLanguage();

  const isZh = language === 'zh';
  const getLocalizedText = (zh: string, en: string) => isZh ? zh : en;

  // 翻译键
  const tr = {
    pageTitle: t('visa.menu.entryCard', 'Entry Card Guide'),
    step1Title: t('visa.page.card.step1Title', 'Step 1 - Visit Website'),
    step1Desc: t('visa.page.card.step1Desc', 'Search for "Foreigner Arrival Card" and access the website. Links vary by city; please select the corresponding link for your port of entry.'),
    step2Title: t('visa.page.card.step2Title', 'Step 2 - Select Arrival Card'),
    step2Desc: t('visa.page.card.step2Desc', 'Click on "Foreigner Arrival Card" or "24/240-hour visa-free transit".'),
    step3Title: t('visa.page.card.step3Title', 'Step 3 - Select Language'),
    step3Desc: t('visa.page.card.step3Desc', 'Select language (English, Japanese, Korean, etc.), and fill in basic information such as name, gender, nationality, and document number.'),
    step4Title: t('visa.page.card.step4Title', 'Step 4 - Fill Information'),
    step4Desc: t('visa.page.card.step4Desc', 'Fill in relevant information such as flight number, contact phone number, purpose of entry, and address.'),
    step5Title: t('visa.page.card.step5Title', 'Step 5 - Submit & Save QR Code'),
    step5Desc: t('visa.page.card.step5Desc', 'After completion, save the QR code to your phone for convenience during entry.'),
    step6Title: t('visa.page.card.step6Title', 'Final Step - Print Arrival Card'),
    step6Desc: t('visa.page.card.step6Desc', 'Scan the QR code at the self-service machine to print the arrival card, submit it to immigration, complete entry procedures, and you can enter after fingerprint scanning!'),
    shanghai: t('visa.page.card.shanghai', 'Shanghai'),
    zhejiang: t('visa.page.card.zhejiang', 'Zhejiang'),
  };

  const steps = [
    {
      num: 1,
      title: tr.step1Title,
      desc: tr.step1Desc,
      links: [
        { name: tr.shanghai, url: 'https://www.singlewindow.sh.cn/hj/' },
        { name: tr.zhejiang, url: 'https://zj.singlewindow.cn/nia/' },
      ],
      image: 'https://static.tripcngo.com/ing/buzhou1.png'
    },
    {
      num: 2,
      title: tr.step2Title,
      desc: tr.step2Desc,
      image: 'https://static.tripcngo.com/ing/buzhou2.png'
    },
    {
      num: 3,
      title: tr.step3Title,
      desc: tr.step3Desc,
      image: 'https://static.tripcngo.com/ing/buzhou3.png'
    },
    {
      num: 4,
      title: tr.step4Title,
      desc: tr.step4Desc,
      image: 'https://static.tripcngo.com/ing/buzhou4.png'
    },
    {
      num: 5,
      title: tr.step5Title,
      desc: tr.step5Desc,
      image: 'https://static.tripcngo.com/ing/buzhou5.png'
    },
    {
      num: 6,
      title: tr.step6Title,
      desc: tr.step6Desc,
      image: 'https://static.tripcngo.com/ing/buzhou6.png'
    }
  ];

  return (
    <>
      <SEO 
        title="China Arrival Card Guide"
        titleZh="中国入境卡填写指南"
        description="Step-by-step guide to filling out the China arrival card (entry declaration form) for foreigners. Learn what to declare and common questions."
        descriptionZh="外国人填写中国入境卡（入境申报表）的分步指南。了解需要申报什么和常见问题。"
        keywordsZh="入境卡, 中国入境卡, 入境申报表, 外国人入境, 海关申报"
        keywords="China arrival card, entry card, arrival declaration, foreigner entry China, customs declaration"
        url="https://tripcngo.com/visa/arrival-card"
      />
      <VisaLayout breadcrumbTitle={tr.pageTitle}>
        <h2 className="text-2xl font-bold text-center mb-10 text-gray-900">{tr.pageTitle}</h2>
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
    </VisaLayout>
    </>
  );
}
