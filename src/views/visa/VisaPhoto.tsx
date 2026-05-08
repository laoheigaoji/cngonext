import React from 'react';
import VisaLayout from '../../components/visa/VisaLayout';
import { X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/SEO';

const badExamples = [
  { label: '曝光不足', label_en: 'Underexposed', filter: 'brightness(50%)' },
  { label: '曝光过度', label_en: 'Overexposed', filter: 'brightness(150%)' },
  { label: '对比度过高', label_en: 'High Contrast', filter: 'contrast(200%)' },
  { label: '头部过大', label_en: 'Head Too Large', transform: 'scale(1.2)' },
  { label: '头部过小', label_en: 'Head Too Small', transform: 'scale(0.8)' },
  { label: '未居中', label_en: 'Off Center', transform: 'translate(10px, 10px)' },
  { label: '头部倾斜', label_en: 'Head Tilted', transform: 'rotate(10deg)' },
  { label: '未面向相机', label_en: 'Not Facing Camera', filter: 'grayscale(20%)' },
  { label: '背景不纯色', label_en: 'Non-white Background', bg: 'bg-gray-200' },
  { label: '背景有阴影', label_en: 'Shadow on Background', shadow: 'shadow-inner' },
  { label: '衣服颜色与背景相同', label_en: 'Clothing Same as Background', filter: 'opacity(80%)' },
  { label: '有色镜片', label_en: 'Tinted Lenses', filter: 'sepia(50%)' },
  { label: '镜框遮挡眼睛', label_en: 'Glasses Obstructing Eyes', filter: 'blur(1px)' },
  { label: '颜色不当', label_en: 'Improper Color', filter: 'hue-rotate(90deg)' },
  { label: '面部有阴影', label_en: 'Shadow on Face', filter: 'contrast(150%) brightness(80%)' },
  { label: '模糊', label_en: 'Blurry', filter: 'blur(3px)' },
  { label: '面部被遮挡', label_en: 'Face Obstructed', overlay: 'bg-black/40' },
  { label: '照片损坏', label_en: 'Damaged Photo', filter: 'contrast(120%) drop-shadow(2px 4px 6px black)' },
];

export default function VisaPhoto() {
  const { language, t } = useLanguage();
  const baseImage = 'https://static.tripcngo.com/ing/zhaopian1.jpg';
  const childImage = 'https://static.tripcngo.com/ing/zhaopian2.png';
  const badImage = 'https://static.tripcngo.com/ing/zhaopian3.png';

  const isZh = language === 'zh';
  const getLocalizedText = (zh: string, en: string) => isZh ? zh : en;

  // 翻译键
  const tr = {
    pageTitle: t('visa.menu.photo', 'Photo Requirements'),
    generalReq: t('visa.page.photo.generalReq', 'General Requirements'),
    generalReqDesc: t('visa.page.photo.generalReqDesc', "Submit two photos of the applicant taken within the last 6 months. The background must be white, without shadows on the face or background. Each photo must show a clear, full frontal view of the applicant's face, neck, and upper shoulders. Print on matte or glossy photo paper in color, without any modifications. If photos don't meet requirements, new ones will be requested."),
    photoDimensions: t('visa.page.photo.photoDimensions', 'Photo Dimensions'),
    photoDimensionsDesc: t('visa.page.photo.photoDimensionsDesc', 'Dimensions: 33mm wide X 48mm high. Head width: 15-22mm, head height (from bottom of chin to top of head): 28-33mm. Space from top of head to top of photo: 3-5mm.'),
    faceReq: t('visa.page.photo.faceReq', 'Face Requirements'),
    faceReqDesc: t('visa.page.photo.faceReqDesc', "Facial expression must be neutral, eyes open, all facial features clearly visible. Glasses allowed only if lenses are uncolored and glare-, shadow-, or frame-free. Hearing aids/similar devices allowed."),
    headwearReq: t('visa.page.photo.headwearReq', 'Headwear Requirements'),
    headwearReqDesc: t('visa.page.photo.headwearReqDesc', 'Hats or headwear are permitted only if worn for religious reasons and do not obscure any facial features.'),
    digitalReq: t('visa.page.photo.digitalReq', 'Digital Photo Requirements'),
    digitalReqDesc: t('visa.page.photo.digitalReqDesc', 'Dimensions: 354~472px high, 420~560px wide. Face width: 191~251px. Eyes: Approx. 256px from bottom edge. Top margin: 10~70px. Submit as JPEG image, size 40-120 KB.'),
    digitalNote: t('visa.page.photo.digitalNote', 'Note: If submitting electronically, please bring two printed photos to your interview.'),
    dimensionLabel: t('visa.page.photo.dimensionLabel', '15-22mm'),
    dimensionLabel2: t('visa.page.photo.dimensionLabel2', '28-33mm'),
    photoSize: t('visa.page.photo.photoSize', 'Photo Dimensions: 33mm (width) × 48mm (height)'),
    qualifiedExample: t('visa.page.photo.qualifiedExample', 'Qualified Photo Example'),
    unqualifiedTitle: t('visa.page.photo.unqualifiedTitle', 'Unqualified Photo Examples'),
    unqualifiedExample: t('visa.page.photo.unqualifiedExample', 'Unqualified Photo Example'),
    dimensionIllustration: t('visa.page.photo.dimensionIllustration', 'Dimension Illustration'),
  };

  return (
    <>
      <SEO 
        title="China Visa Photo Requirements"
        titleZh="中国签证照片要求"
        description="Official photo requirements for China visa applications. Learn the specifications, size, background color and examples of acceptable photos."
        descriptionZh="中国签证申请的官方照片要求。了解规格、尺寸、背景颜色和可接受照片的示例。"
        keywordsZh="签证照片, 中国签证照片, 照片要求, 签证申请照片规格"
        keywords="China visa photo requirements, visa photo specs, photo size for China visa, Chinese visa photo guide"
        url="https://tripcngo.com/visa/photo"
      />
      <VisaLayout breadcrumbTitle={tr.pageTitle}>
        <h2 className="text-2xl font-bold text-center mb-10 text-gray-900">{tr.pageTitle}</h2>
      
      <div className="flex flex-col lg:flex-row gap-10 mb-12">
        {/* Left Column: Text */}
        <div className="flex-1 space-y-6">
          <section>
            <h3 className="text-lg font-bold text-[#1b887a] mb-2">{tr.generalReq}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {tr.generalReqDesc}
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#1b887a] mb-2">{tr.photoDimensions}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {tr.photoDimensionsDesc}
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#1b887a] mb-2">{tr.faceReq}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {tr.faceReqDesc}
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#1b887a] mb-2">{tr.headwearReq}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {tr.headwearReqDesc}
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#1b887a] mb-2">{tr.digitalReq}</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              {tr.digitalReqDesc}
            </p>
            <p className="text-sm text-red-500">
              {tr.digitalNote}
            </p>
          </section>
        </div>

        {/* Right Column: Reference Images */}
        <div className="w-full lg:w-[350px] flex flex-col items-center">
          <div className="bg-[#a8c6fa] p-6 rounded-md mb-2 flex flex-col items-center justify-center w-full relative">
            <div className="relative border border-blue-400 bg-white inline-block">
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-600 w-max">{tr.dimensionLabel}</div>
               <div className="absolute border-t border-blue-500 w-[15px] -top-2 left-1/2 -translate-x-1/2"></div>
               
               <div className="absolute top-1/2 -left-8 -translate-y-1/2 text-[10px] text-gray-600">{tr.dimensionLabel2}</div>
               <div className="absolute border-l border-blue-500 h-[28px] top-1/2 -left-2 -translate-y-1/2"></div>
               
               <img src={baseImage} alt={tr.dimensionIllustration} className="w-[120px] h-[160px] object-cover object-top" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-6 text-center">{tr.photoSize}</p>

          <div className="w-full">
            <h4 className="text-sm font-bold text-gray-900 mb-3">{tr.qualifiedExample}</h4>
            <img src={childImage} alt={tr.qualifiedExample} className="rounded-sm" />
          </div>
        </div>
      </div>

      {/* Bad Examples Matrix */}
      <div className="bg-gray-50/50 border border-gray-100 rounded-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <X className="w-5 h-5 text-red-500 mr-2" strokeWidth={3} />
          {tr.unqualifiedTitle}
        </h3>
        <div className="flex flex-col items-center">
            <div className="bg-white overflow-hidden mb-2 relative flex items-center justify-center border border-gray-200">
                <img 
                    src={badImage} 
                    alt={tr.unqualifiedExample}
                    className=""
                />
            </div>
            <span className="text-[14px] font-bold text-gray-700 text-center px-1">{tr.unqualifiedExample}</span>
        </div>
      </div>

    </VisaLayout>
    </>
  );
}
