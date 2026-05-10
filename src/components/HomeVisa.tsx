import React from 'react';

interface HomeVisaProps {
  title: string;
  desc: string;
  countries: string;
  countriesDesc: string;
  stay: string;
  stayDesc: string;
  provinces: string;
  provincesDesc: string;
  ports: string;
  portsDesc: string;
}

export default function HomeVisa({ title, desc, countries, countriesDesc, stay, stayDesc, provinces, provincesDesc, ports, portsDesc }: HomeVisaProps) {
  return (
    <section className="py-24 max-w-[1400px] mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <img src="https://static.tripcngo.com/ing/image.png" alt="Visa Free Policy" className="w-full h-auto object-contain" />
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{title}</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-10">
            {desc}
          </p>
          <div className="grid grid-cols-2 gap-y-10 gap-x-6">
            <div>
              <div className="font-black text-4xl text-[#1b887a] mb-2">{countries}</div>
              <div className="text-gray-500 font-medium flex items-center gap-2">{countriesDesc}<svg className="w-4 h-4 text-[#1b887a]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg></div>
            </div>
            <div>
              <div className="font-black text-4xl text-[#1b887a] mb-2">{stay}</div>
              <div className="text-gray-500 font-medium flex items-center gap-2">{stayDesc}<svg className="w-4 h-4 text-[#1b887a]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg></div>
            </div>
            <div>
              <div className="font-black text-4xl text-gray-900 mb-2">{provinces}</div>
              <div className="text-gray-500 font-medium flex items-center gap-2">{provincesDesc}<svg className="w-4 h-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg></div>
            </div>
            <div>
              <div className="font-black text-4xl text-gray-900 mb-2">{ports}</div>
              <div className="text-gray-500 font-medium flex items-center gap-2">{portsDesc}<svg className="w-4 h-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
