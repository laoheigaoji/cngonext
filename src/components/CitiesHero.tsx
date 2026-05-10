import React from 'react';

interface CitiesHeroProps {
  title: string;
  desc: string;
  introTitle: string;
  introP1: string;
  introP2: string;
  introP3: string;
  introP4: string;
  introP5: string;
  introP6: string;
}

export default function CitiesHero({ title, desc, introTitle, introP1, introP2, introP3, introP4, introP5, introP6 }: CitiesHeroProps) {
  return (
    <>
      <section className="relative h-[400px] flex items-center pt-16 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://static.tripcngo.com/ing/Fbanner_bg_2.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="max-w-[1240px] w-full mx-auto px-6 relative z-10 text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
            {title}
          </h1>
          <p className="text-white/95 text-base max-w-3xl drop-shadow-md">
            {desc}
          </p>
        </div>
      </section>

      <div className="max-w-[1240px] mx-auto px-6 mt-12 bg-[#f5fff9] rounded border border-green-500 border-dashed p-8 mb-12">
        <div className="text-center mb-6">
          <h2 className="text-[28px] font-bold text-green-600 inline-block">{introTitle}</h2>
        </div>
        <div className="space-y-4 text-[15px] text-gray-700 leading-[1.8]">
          <p>{introP1}</p>
          <p>{introP2}</p>
          <p>{introP3}</p>
          <p>{introP4}</p>
          <p>{introP5}</p>
          <p>{introP6}</p>
        </div>
      </div>
    </>
  );
}
