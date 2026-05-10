"use client";

import React, { useState } from 'react';
import VisaLayout from '../../components/visa/VisaLayout';
import { X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { VISA_PHOTO_TEXT, LangKey, MultiLang } from '../../data/visa-data';

export default function VisaPhoto() {
  const { language } = useLanguage();
  const baseImage = 'https://static.tripcngo.com/ing/zhaopian1.jpg';
  const childImage = 'https://static.tripcngo.com/ing/zhaopian2.png';
  const badImage = 'https://static.tripcngo.com/ing/zhaopian3.png';
  const [lightbox, setLightbox] = useState<string | null>(null);

  const langKey = (language === 'zh' ? 'cn' : language) as LangKey;
  const tr = VISA_PHOTO_TEXT;
  const get = (ml: MultiLang) => ml[langKey] || ml.en;

  return (
    <VisaLayout breadcrumbTitle={get(tr.pageTitle)}>
        <div className="bg-white border border-gray-100 rounded-sm shadow-sm p-6">
        <h2 className="text-2xl font-bold text-center mb-10 text-gray-900">{get(tr.pageTitle)}</h2>
      
      <div className="flex flex-col lg:flex-row gap-10 mb-12">
        <div className="flex-1 space-y-6">
          <section>
            <h3 className="text-lg font-bold text-[#1b887a] mb-2">{get(tr.generalReq)}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{get(tr.generalReqDesc)}</p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-[#1b887a] mb-2">{get(tr.photoDimensions)}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{get(tr.photoDimensionsDesc)}</p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-[#1b887a] mb-2">{get(tr.faceReq)}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{get(tr.faceReqDesc)}</p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-[#1b887a] mb-2">{get(tr.headwearReq)}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{get(tr.headwearReqDesc)}</p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-[#1b887a] mb-2">{get(tr.digitalReq)}</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">{get(tr.digitalReqDesc)}</p>
            <p className="text-sm text-red-500">{get(tr.digitalNote)}</p>
          </section>
        </div>

        <div className="w-full lg:w-[350px] flex flex-col items-center">
          <div className="bg-[#a8c6fa] p-6 rounded-md mb-2 flex flex-col items-center justify-center w-full relative">
            <div className="relative border border-blue-400 bg-white inline-block">
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-600 w-max">{get(tr.dimensionLabel)}</div>
               <div className="absolute border-t border-blue-500 w-[15px] -top-2 left-1/2 -translate-x-1/2"></div>
               <div className="absolute top-1/2 -left-8 -translate-y-1/2 text-[10px] text-gray-600">{get(tr.dimensionLabel2)}</div>
               <div className="absolute border-l border-blue-500 h-[28px] top-1/2 -left-2 -translate-y-1/2"></div>
               <img src={baseImage} alt={get(tr.dimensionIllustration)} className="w-[120px] h-[160px] object-cover object-top cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setLightbox(baseImage)} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-6 text-center">{get(tr.photoSize)}</p>
          <div className="w-full">
            <h4 className="text-sm font-bold text-gray-900 mb-3">{get(tr.qualifiedExample)}</h4>
            <img src={childImage} alt={get(tr.qualifiedExample)} className="rounded-sm cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setLightbox(childImage)} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <X className="w-5 h-5 text-red-500 mr-2" strokeWidth={3} />
          {get(tr.unqualifiedTitle)}
        </h3>
        <div className="flex flex-col items-center">
            <div className="overflow-hidden mb-2 relative flex items-center justify-center cursor-pointer" onClick={() => setLightbox(badImage)}>
                <img src={badImage} alt={get(tr.unqualifiedExample)} className="hover:opacity-80 transition-opacity" />
            </div>
            <span className="text-[14px] font-bold text-gray-700 text-center px-1">{get(tr.unqualifiedExample)}</span>
        </div>
      </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors" onClick={() => setLightbox(null)}>
              <X className="w-8 h-8" />
            </button>
            <img src={lightbox} alt="Preview" className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg" style={{ minWidth: '300px' }} />
          </div>
        </div>
      )}
    </VisaLayout>
  );
}
