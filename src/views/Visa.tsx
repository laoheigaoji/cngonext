"use client";

import React, { useState } from 'react';
import { Phone, ChevronDown, ChevronUp, FileText, Download, Camera, FileEdit, CreditCard, PenTool, ExternalLink } from 'lucide-react';
import { Link } from '@/lib/router-compat';
import { useVisaTranslation } from '../hooks/useVisaTranslation';
import ChinaVisaMap from '../components/ChinaVisaMap';

export default function Visa() {
  const { language, t } = useVisaTranslation();
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const MENU = [
    { name: t('visa.menu.types'), path: `/${language === 'zh' ? 'cn' : language}/visa/types`, icon: <FileText className="w-4 h-4" /> },
    { name: t('visa.menu.photo'), path: `/${language === 'zh' ? 'cn' : language}/visa/photo`, icon: <Camera className="w-4 h-4" /> },
    { name: t('visa.menu.fee'), path: `/${language === 'zh' ? 'cn' : language}/visa/fees`, icon: <CreditCard className="w-4 h-4" /> },
    { name: t('visa.menu.form'), path: `/${language === 'zh' ? 'cn' : language}/visa/form`, icon: <PenTool className="w-4 h-4" /> },
    { name: t('visa.menu.entryCard'), path: `/${language === 'zh' ? 'cn' : language}/visa/arrival-card`, icon: <FileEdit className="w-4 h-4" /> },
    { name: t('visa.menu.download'), path: `/${language === 'zh' ? 'cn' : language}/visa/downloads`, icon: <Download className="w-4 h-4" /> },
  ];

  const FAQS = [
    { q: t('visa.faq.q1'), a: t('visa.faq.a1') },
    { q: t('visa.faq.q2'), a: t('visa.faq.a2') },
    { q: t('visa.faq.q3'), a: t('visa.faq.a3') },
    { q: t('visa.faq.q4'), a: t('visa.faq.a4') },
    { q: t('visa.faq.q5'), a: t('visa.faq.a5') },
    { q: t('visa.faq.q6'), a: t('visa.faq.a6') },
    { q: t('visa.faq.q7'), a: t('visa.faq.a7') },
    { q: t('visa.faq.q8'), a: t('visa.faq.a8') },
    { q: t('visa.faq.q9'), a: t('visa.faq.a9') },
    { q: t('visa.faq.q10'), a: t('visa.faq.a10') },
    { q: t('visa.faq.q11'), a: t('visa.faq.a11') },
    { q: t('visa.faq.q12'), a: t('visa.faq.a12') },
    { q: t('visa.faq.q13'), a: t('visa.faq.a13') },
    { q: t('visa.faq.q14'), a: t('visa.faq.a14') },
    { q: t('visa.faq.q15'), a: t('visa.faq.a15') },
    { q: t('visa.faq.q16'), a: t('visa.faq.a16') },
    { q: t('visa.faq.q17'), a: t('visa.faq.a17') },
    { q: t('visa.faq.q18'), a: t('visa.faq.a18') },
    { q: t('visa.faq.q19'), a: t('visa.faq.a19') },
    { q: t('visa.faq.q20'), a: t('visa.faq.a20') },
    { q: t('visa.faq.q21'), a: t('visa.faq.a21') },
    { q: t('visa.faq.q22'), a: t('visa.faq.a22') },
  ];

  return (
    <div className="w-full bg-[#f7f7f7] pb-20">
      {/* Hero Map Section */}
      <ChinaVisaMap t={t} />

      {/* Navigation Menu */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-center gap-x-4 gap-y-3 sm:gap-10 py-4 sm:py-5">
            {MENU.map(item => (
              <Link key={item.name} to={item.path} className="flex items-center gap-2 text-gray-700 hover:text-[var(--color-primary)] text-[13px] sm:text-[15px] font-medium transition-colors p-2 sm:p-0 rounded-lg hover:bg-gray-50 sm:hover:bg-transparent">
                <span className="text-green-600 flex-shrink-0">{item.icon}</span>
                <span className="truncate">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 mt-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column */}
          <div className="flex-1 space-y-8">
            
            {/* 来华240小时过境免签 Box */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                {t('visa.transit.title')}
              </h2>
              
              <div className="mb-6">
                <h3 className="text-[17px] font-bold text-gray-900 mb-4">{t('visa.transit.countriesTitle')}</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">{t('visa.transit.europe')}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t('visa.countries.europe')}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">{t('visa.transit.americas')}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t('visa.countries.americas')}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">{t('visa.transit.oceania')}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t('visa.countries.oceania')}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">{t('visa.transit.asia')}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {t('visa.countries.asia')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-[17px] font-bold text-gray-900 mb-4">{t('visa.transit.portsTitle')}</h3>
                <div className="overflow-auto max-h-[400px] rounded-md border border-gray-200 custom-scrollbar">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
                      <tr className="text-gray-700">
                        <th className="p-3 font-medium border-b border-gray-200 bg-gray-50">{t('visa.transit.tableCity')}</th>
                        <th className="p-3 font-medium border-b border-gray-200 bg-gray-50">{t('visa.transit.tablePort')}</th>
                        <th className="p-3 font-medium border-b border-gray-200 border-l border-gray-200 bg-gray-50">{t('visa.transit.tableArea')}</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y divide-gray-200">
                      {[
                        // ... items remain unchanged as they have both CN and EN info already ...
                        { city: '北京', cityEn: 'Beijing', ports: [{ name: '北京首都国际机场口岸', nameEn: 'Beijing Capital International Airport' }, { name: '北京大兴国际机场口岸', nameEn: 'Beijing Daxing International Airport' }], area: '北京市', areaEn: 'Beijing Municipality' },
                        { city: '天津', cityEn: 'Tianjin', ports: [{ name: '天津滨海国际机场口岸', nameEn: 'Tianjin Binhai International Airport' }, { name: '天津海港口岸（客运）', nameEn: 'Tianjin Port (Passenger)' }], area: '天津市', areaEn: 'Tianjin Municipality' },
                        { city: '河北', cityEn: 'Hebei', ports: [{ name: '石家庄正定国际机场口岸', nameEn: 'Shijiazhuang Zhengding International Airport' }, { name: '秦皇岛海港口岸（客运）', nameEn: 'Qinhuangdao Port (Passenger)' }], area: '河北省', areaEn: 'Hebei Province' },
                        { city: '辽宁', cityEn: 'Liaoning', ports: [{ name: '沈阳桃仙国际机场口岸', nameEn: 'Shenyang Taoxian International Airport' }, { name: '大连周水子国际机场口岸', nameEn: 'Dalian Zhoushuizi International Airport' }, { name: '大连海港口岸（客运）', nameEn: 'Dalian Port (Passenger)' }], area: '辽宁省', areaEn: 'Liaoning Province' },
                        { city: '上海', cityEn: 'Shanghai', ports: [{ name: '上海虹桥国际机场口岸', nameEn: 'Shanghai Hongqiao International Airport' }, { name: '上海浦东国际机场口岸', nameEn: 'Shanghai Pudong International Airport' }, { name: '上海海港口岸（客运）', nameEn: 'Shanghai Port (Passenger)' }], area: '上海市', areaEn: 'Shanghai Municipality' },
                        { city: '江苏', cityEn: 'Jiangsu', ports: [{ name: '南京禄口国际机场口岸', nameEn: 'Nanjing Lukou International Airport' }, { name: '苏南硕放国际机场口岸', nameEn: 'Sunan Shuofang International Airport' }, { name: '扬州泰州国际机场口岸', nameEn: 'Yangzhou Taizhou International Airport' }, { name: '连云港海港口岸', nameEn: 'Lianyungang Port (Passenger)' }], area: '江苏省', areaEn: 'Jiangsu Province' },
                        { city: '浙江', cityEn: 'Zhejiang', ports: [{ name: '杭州萧山国际机场口岸', nameEn: 'Hangzhou Xiaoshan International Airport' }, { name: '宁波栎社国际机场口岸', nameEn: 'Ningbo Lishe International Airport' }, { name: '温州龙湾国际机场口岸', nameEn: 'Wenzhou Longwan International Airport' }, { name: '义乌机场口岸', nameEn: 'Yiwu Airport' }, { name: '温州港口岸（客运）', nameEn: 'Wenzhou Port (Passenger)' }, { name: '舟山港口岸', nameEn: 'Zhoushan Port (Passenger)' }], area: '浙江省', areaEn: 'Zhejiang Province' },
                        { city: '安徽', cityEn: 'Anhui', ports: [{ name: '合肥新桥国际机场口岸', nameEn: 'Hefei Xingiao International Airport' }, { name: '黄山屯溪国际机场口岸', nameEn: 'Huangshan Tunxi International Airport' }], area: '安徽省', areaEn: 'Anhui Province' },
                        { city: '福建', cityEn: 'Fujian', ports: [{ name: '福州长乐国际机场口岸', nameEn: 'Fuzhou Changle International Airport' }, { name: '厦门高崎国际机场口岸', nameEn: 'Xiamen Gaogi International Airport' }, { name: '泉州晋江国际机场口岸', nameEn: 'Quanzhou Jinjiang International Airport' }, { name: '武夷山机场口岸', nameEn: 'Wuyishan Airport' }, { name: '厦门海港口岸（客运）', nameEn: 'Xiamen Port (Passenger)' }], area: '福建省', areaEn: 'Fujian Province' },
                        { city: '山东', cityEn: 'Shandong', ports: [{ name: '济南遥墙国际机场口岸', nameEn: 'Jinan Yaoqiang International Airport' }, { name: '青岛胶东国际机场口岸', nameEn: 'Qingdao Jiaodong International Airport' }, { name: '烟台蓬莱国际机场口岸', nameEn: 'Yantai Penglai International Airport' }, { name: '威海大水泊国际机场口岸', nameEn: 'Weihai Dashuibo International Airport' }, { name: '青岛海港口岸（客运）', nameEn: 'Qingdao Port (Passenger)' }], area: '山东省', areaEn: 'Shandong Province' },
                        { city: '河南', cityEn: 'Henan', ports: [{ name: '郑州新郑国际机场口岸', nameEn: 'Zhengzhou Xinzheng International Airport' }], area: '河南省', areaEn: 'Henan Province' },
                        { city: '湖北', cityEn: 'Hubei', ports: [{ name: '武汉天河国际机场口岸', nameEn: 'Wuhan Tianhe International Airport' }], area: '湖北省', areaEn: 'Hubei Province' },
                        { city: '湖南', cityEn: 'Hunan', ports: [{ name: '长沙黄花国际机场口岸', nameEn: 'Changsha Huanghua International Airport' }, { name: '张家界荷花国际机场口岸', nameEn: 'Zhangjiajie Hehua International Airport' }], area: '湖南省', areaEn: 'Hunan Province' },
                        { city: '广东', cityEn: 'Guangdong', ports: [{ name: '广州白云国际机场口岸', nameEn: 'Guangzhou Baiyun International Airport' }, { name: '深圳宝安国际机场口岸', nameEn: 'Shenzhen Bao\'an International Airport' }, { name: '南沙港口岸（客运）', nameEn: 'Nansha Port (Passenger)' }, { name: '揭阳潮汕国际机场口岸', nameEn: 'Jieyang Chaoshan International Airport' }, { name: '蛇口港口岸（客运）', nameEn: 'Shekou Port (Passenger)' }], area: '广东省', areaEn: 'Guangdong Province' },
                        { city: '海南', cityEn: 'Hainan', ports: [{ name: '海口美兰国际机场口岸', nameEn: 'Haikou Meilan International Airport' }, { name: '三亚凤凰国际机场口岸', nameEn: 'Sanya Phoenix International Airport' }], area: '海南省', areaEn: 'Hainan Province' },
                        { city: '重庆', cityEn: 'Chongqing', ports: [{ name: '重庆江北国际机场口岸', nameEn: 'Chongqing Jiangbei International Airport' }], area: '重庆市', areaEn: 'Chongqing Municipality' },
                        { city: '贵州', cityEn: 'Guizhou', ports: [{ name: '贵阳龙洞堡国际机场口岸', nameEn: 'Guiyang Longdongbao International Airport' }], area: '贵州省', areaEn: 'Guizhou Province' },
                        { city: '陕西', cityEn: 'Shaanxi', ports: [{ name: '西安咸阳国际机场口岸', nameEn: 'Xi\'an Xianyang International Airport' }], area: '陕西省', areaEn: 'Shaanxi Province' },
                        { city: '山西', cityEn: 'Shanxi', ports: [{ name: '太原武宿国际机场口岸', nameEn: 'Taiyuan Wusu International Airport' }], area: '太原市、大同市', areaEn: 'Taiyuan City, Datong City' },
                        { city: '黑龙江', cityEn: 'Heilongjiang', ports: [{ name: '哈尔滨太平国际机场口岸', nameEn: 'Harbin Taiping International Airport' }], area: '哈尔滨市', areaEn: 'Harbin City' },
                        { city: '江西', cityEn: 'Jiangxi', ports: [{ name: '南昌昌北国际机场口岸', nameEn: 'Nanchang Changbei International Airport' }], area: '南昌市、景德镇市', areaEn: 'Nanchang City, Jingdezhen City' },
                        { city: '广西', cityEn: 'Guangxi', ports: [{ name: '南宁吴圩国际机场口岸', nameEn: 'Nanning Wuxu International Airport' }, { name: '桂林两江国际机场口岸', nameEn: 'Guilin Liangjiang International Airport' }, { name: '北海福成机场口岸', nameEn: 'Beihai Fucheng Airport' }, { name: '北海海港口岸', nameEn: 'Beihai Port (Passenger)' }], area: '南宁市、柳州市、桂林市、梧州市、北海市、防城港市、钦州市、贵港市、玉林市、贺州市、河池市、来宾市', areaEn: 'Nanning, Liuzhou, Guilin, Wuzhou, Beihai, Fangchenggang, Qinzhou, Guigang, Yulin, Hezhou, Hechi, Laibin' },
                        { city: '四川', cityEn: 'Sichuan', ports: [{ name: '成都双流国际机场口岸', nameEn: 'Chengdu Shuangliu International Airport' }, { name: '成都天府国际机场口岸', nameEn: 'Chengdu Tianfu International Airport' }], area: '成都市、自贡市、泸州市、德阳市、遂宁市、内江市、乐山市、宜宾市、雅安市、眉山市、资阳市', areaEn: 'Chengdu, Zigong, Luzhou, Deyang, Suining, Neijiang, Leshan, Yibin, Ya\'an, Meishan, Ziyang' },
                        { city: '云南', cityEn: 'Yunnan', ports: [{ name: '昆明长水国际机场口岸', nameEn: 'Kunming Changshui International Airport' }, { name: '丽江三义国际机场口岸', nameEn: 'Lijiang Sanyi International Airport' }, { name: '磨憨铁路口岸', nameEn: 'Mohan Railway Port' }], area: '昆明市、玉溪市、红河哈尼族彝族自治州、普洱市、西双版纳傣族自治州、丽江市、大理白族自治州', areaEn: 'Kunming, Yuxi, Honghe, Pu\'er, Xishuangbanna, Lijiang, Dali' },
                      ].map((item, index) => (
                        <tr key={index}>
                          <td className="p-3">
                            <div>{language === 'zh' ? item.city : item.cityEn}</div>
                            {language === 'zh' && <div className="text-gray-400 text-xs">({item.cityEn})</div>}
                          </td>
                          <td className="p-3">
                            {item.ports.map((port, pIndex) => (
                              <div key={pIndex} className="mb-2 last:mb-0">
                                <div>{language === 'zh' ? port.name : port.nameEn}</div>
                                {language === 'zh' && <div className="text-gray-400 text-xs">({port.nameEn})</div>}
                              </div>
                            ))}
                          </td>
                          <td className="p-3 bg-gray-50/50 border-l border-gray-200">
                            <div>{language === 'zh' ? item.area : item.areaEn}</div>
                            <div className="text-gray-400 text-[10px] leading-tight max-w-[200px]">
                              {language === 'zh' ? `(${item.areaEn})` : `(${item.area})`}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 单方面免签 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
               <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-2">{t('visa.unilateral.title')}</h2>
               <p className="text-sm text-gray-500 mb-6 text-left">{t('visa.unilateral.desc')}</p>
               <div className="overflow-auto max-h-[400px] rounded-md border border-gray-200 text-left custom-scrollbar">
                 <table className="w-full text-sm">
                    <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
                      <tr className="text-gray-700">
                        <th className="p-3 font-medium border-b border-gray-200 bg-gray-50">{t('visa.unilateral.tableCountry')}</th>
                        <th className="p-3 font-medium border-b border-gray-200 border-l border-gray-200 bg-gray-50">{t('visa.unilateral.tableDays')}</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y divide-gray-200">
                      {[
                        {n: '澳大利亚', en: 'Australia', d: '30天', den: '30 days'},
                        {n: '奥地利', en: 'Austria', d: '30天', den: '30 days'},
                        {n: '安道尔', en: 'Andorra', d: '30天', den: '30 days'},
                        {n: '阿根廷', en: 'Argentina', d: '30天', den: '30 days'},
                        {n: '比利时', en: 'Belgium', d: '30天', den: '30 days'},
                        {n: '保加利亚', en: 'Bulgaria', d: '30天', den: '30 days'},
                        {n: '巴西', en: 'Brazil', d: '30天', den: '30 days'},
                        {n: '塞浦路斯', en: 'Cyprus', d: '30天', den: '30 days'},
                        {n: '克罗地亚', en: 'Croatia', d: '30天', den: '30 days'},
                        {n: '智利', en: 'Chile', d: '30天', den: '30 days'},
                        {n: '丹麦', en: 'Denmark', d: '30天', den: '30 days'},
                        {n: '爱沙尼亚', en: 'Estonia', d: '30天', den: '30 days'},
                        {n: '芬兰', en: 'Finland', d: '30天', den: '30 days'},
                        {n: '法国', en: 'France', d: '30天', den: '30 days'},
                        {n: '德国', en: 'Germany', d: '30天', den: '30 days'},
                        {n: '希腊', en: 'Greece', d: '30天', den: '30 days'},
                        {n: '匈牙利', en: 'Hungary', d: '30天', den: '30 days'},
                        {n: '冰岛', en: 'Iceland', d: '30天', den: '30 days'},
                        {n: '爱尔兰', en: 'Ireland', d: '30天', den: '30 days'},
                        {n: '意大利', en: 'Italy', d: '30天', den: '30 days'},
                        {n: '日本', en: 'Japan', d: '30天', den: '30 days'},
                        {n: '韩国', en: 'South Korea', d: '30天', den: '30 days'},
                        {n: '卢森堡', en: 'Luxembourg', d: '30天', den: '30 days'},
                        {n: '列支敦士登', en: 'Liechtenstein', d: '30天', den: '30 days'},
                        {n: '拉脱维亚', en: 'Latvia', d: '30天', den: '30 days'},
                        {n: '摩纳哥', en: 'Monaco', d: '30天', den: '30 days'},
                        {n: '黑山', en: 'Montenegro', d: '30天', den: '30 days'},
                        {n: '马耳他', en: 'Malta', d: '30天', den: '30 days'},
                        {n: '荷兰', en: 'Netherlands', d: '30天', den: '30 days'},
                        {n: '新西兰', en: 'New Zealand', d: '30天', den: '30 days'},
                        {n: '挪威', en: 'Norway', d: '30天', den: '30 days'},
                        {n: '北马其顿', en: 'North Macedonia', d: '30天', den: '30 days'},
                        {n: '波兰', en: 'Poland', d: '30天', den: '30 days'},
                        {n: '葡萄牙', en: 'Portugal', d: '30天', den: '30 days'},
                        {n: '秘鲁', en: 'Peru', d: '30天', den: '30 days'},
                        {n: '罗马尼亚', en: 'Romania', d: '30天', den: '30 days'},
                        {n: '斯洛伐克', en: 'Slovakia', d: '30天', den: '30 days'},
                        {n: '斯洛文尼亚', en: 'Slovenia', d: '30天', den: '30 days'},
                        {n: '西班牙', en: 'Spain', d: '30天', den: '30 days'},
                        {n: '瑞士', en: 'Switzerland', d: '30天', den: '30 days'},
                        {n: '乌拉圭', en: 'Uruguay', d: '30天', den: '30 days'},
                      ].map((c, i) => (
                        <tr key={i}>
                          <td className="p-3">
                            <div className="font-bold">{language === 'zh' ? c.n : c.en}</div>
                            {language === 'zh' && <div className="text-gray-400 text-xs">{c.en}</div>}
                          </td>
                          <td className="p-3 border-l border-gray-200">
                            <div>{language === 'zh' ? c.d : c.den}</div>
                            {language === 'zh' && <div className="text-gray-400 text-xs">{c.den}</div>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
            </div>

            {/* 互免签证 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
               <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-2">{t('visa.mutual.title')}</h2>
               <p className="text-sm text-gray-500 mb-6 text-left">{t('visa.mutual.desc')}</p>
               <div className="overflow-auto max-h-[400px] rounded-md border border-gray-200 text-left custom-scrollbar">
                 <table className="w-full text-sm">
                    <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
                      <tr className="text-gray-700">
                        <th className="p-3 font-medium border-b border-gray-200 bg-gray-50">{t('visa.mutual.tableCountry')}</th>
                        <th className="p-3 font-medium border-b border-gray-200 border-l border-gray-200 bg-gray-50 w-2/3">{t('visa.mutual.tableDays')}</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y divide-gray-200">
                      {[
                        {n: '阿尔巴尼亚', en: 'Albania', d: '每180天停留最长不超过90天', den: 'Maximum stay of no more than 90 days per 180 days'},
                        {n: '安提瓜和巴布达', en: 'Antigua and Barbuda', d: '30天; 每180天累计停留不超过90天', den: '30 days; cumulative stay of no more than 90 days per 180 days'},
                        {n: '亚美尼亚', en: 'Armenia', d: '每180天停留最长不超过90天', den: 'Maximum stay of no more than 90 days per 180 days'},
                        {n: '巴哈马', en: 'Bahamas', d: '30天', den: '30 days'},
                        {n: '巴巴多斯', en: 'Barbados', d: '30天', den: '30 days'},
                        {n: '白俄罗斯', en: 'Belarus', d: '30天, 每年不超过90天', den: '30 days, not exceeding 90 days per year'},
                        {n: '波斯尼亚和黑塞哥维那', en: 'Bosnia and Herzegovina', d: '每180天停留最长不超过90天', den: 'Maximum stay of no more than 90 days per 180 days'},
                        {n: '文莱', en: 'Brunei', d: '30天', den: '30 days'},
                        {n: '多米尼克', en: 'Dominica', d: '30天', den: '30 days'},
                        {n: '俄罗斯', en: 'Russia', d: '30天', den: '30 days (Trial run till Sep 2026)'},
                        {n: '厄瓜多尔', en: 'Ecuador', d: '30天', den: '30 days'},
                        {n: '斐济', en: 'Fiji', d: '30天', den: '30 days'},
                        {n: '格林纳达', en: 'Grenada', d: '30天', den: '30 days'},
                        {n: '格鲁吉亚', en: 'Georgia', d: '30天, 每180天累计停留不超过90天', den: '30 days, cumulative stay of no more than 90 days per 180 days'},
                        {n: '哈萨克斯坦', en: 'Kazakhstan', d: '30天, 每180天停留最长不超过90天', den: '30 days, maximum stay of no more than 90 days per 180 days'},
                        {n: '马尔代夫', en: 'Maldives', d: '30天', den: '30 days'},
                        {n: '毛里求斯', en: 'Mauritius', d: '60天', den: '60 days'},
                        {n: '马来西亚', en: 'Malaysia', d: '30天', den: '30 days'},
                        {n: '卡塔尔', en: 'Qatar', d: '30天', den: '30 days'},
                        {n: '圣马力诺', en: 'San Marino', d: '不超过90天', den: 'Not exceeding 90 days'},
                        {n: '塞尔维亚', en: 'Serbia', d: '30天', den: '30 days'},
                        {n: '塞舌尔', en: 'Seychelles', d: '30天', den: '30 days'},
                        {n: '苏里南', en: 'Suriname', d: '30天', den: '30 days'},
                        {n: '新加坡', en: 'Singapore', d: '30天', den: '30 days'},
                        {n: '所罗门群岛', en: 'Solomon Islands', d: '30天, 每180天累计停留不超过90天', den: '30 days, cumulative stay of no more than 90 days per 180 days'},
                        {n: '萨摩亚独立国', en: 'Samoa', d: '30天, 每180天累计停留不超过90天', den: '30 days, cumulative stay of no more than 90 days per 180 days'},
                        {n: '汤加', en: 'Tonga', d: '30天', den: '30 days'},
                        {n: '泰国', en: 'Thailand', d: '30天, 每180天停留最长不超过90天', den: '30 days, maximum stay of no more than 90 days per 180 days'},
                        {n: '阿拉伯联合酋长国', en: 'United Arab Emirates', d: '30天', den: '30 days'},
                        {n: '乌兹别克斯坦', en: 'Uzbekistan', d: '30天, 每180天累计停留不超过90天', den: '30 days, cumulative stay of no more than 90 days per 180 days'},
                      ].map((c, i) => (
                        <tr key={i}>
                          <td className="p-3">
                            <div className="font-bold">{language === 'zh' ? c.n : c.en}</div>
                            {language === 'zh' && <div className="text-gray-400 text-xs">{c.en}</div>}
                          </td>
                          <td className="p-3 border-l border-gray-200">
                            <div>{language === 'zh' ? c.d : c.den}</div>
                            {language === 'zh' && <div className="text-gray-400 text-xs">{c.den}</div>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
            </div>

            {/* FAQ Area */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{t('visa.faq.title')}</h3>
              <div className="space-y-3">
                {FAQS.map((faq, i) => (
                  <div key={i} className="bg-white rounded-md overflow-hidden cursor-pointer shadow-sm border border-gray-100" onClick={() => setOpenFAQ(openFAQ === i ? null : i)}>
                    <div className="px-6 py-4 flex justify-between items-center text-gray-900 font-bold hover:bg-gray-50 transition-colors">
                      <div className="flex gap-4 text-sm">
                        <span>{i + 1}.</span>
                        <span>{faq.q}</span>
                      </div>
                      {openFAQ === i ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                    {openFAQ === i && <div className="px-12 py-5 bg-white text-gray-600 leading-relaxed text-sm border-t border-gray-50">{faq.a}</div>}
                  </div>
                ))}
              </div>
            </div>
            
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-[320px] flex-shrink-0 space-y-6">
            
            {/* 注意事项 */}
            <div>
              <h3 className="text-[17px] font-bold text-gray-900 mb-4 bg-transparent border-b-2 border-[var(--color-primary)] inline-block pb-2">{t('visa.sidebar.notice')}</h3>
              
              <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm relative">
                <div 
                  className="relative cursor-pointer group"
                  onClick={(e) => {
                    const video = e.currentTarget.querySelector('video');
                    const playBtn = e.currentTarget.querySelector('.play-btn');
                    if (video) {
                      if (video.paused) {
                        video.play();
                        video.controls = true;
                        if (playBtn) playBtn.classList.add('hidden');
                      } else {
                        video.pause();
                      }
                    }
                  }}
                >
                  <video 
                    src="https://static.tripcngo.com/video/240hour.mp4" 
                    className="w-full h-auto object-cover block aspect-[9/16]"
                    playsInline
                    poster="https://static.tripcngo.com/ing/videobg.jpg"
                  />
                  <div className="play-btn absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl border border-white/50 pl-1.5">
                      <svg viewBox="0 0 24 24" className="w-8 h-8 text-blue-600 fill-current"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 space-y-5 bg-[#fefefe]">
                  <div className="flex gap-3 items-start">
                    <span className="mt-0.5 text-yellow-500"><svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 2L9 9H2L7 14L5 22L12 17L19 22L17 14L22 9H15L12 2Z" /></svg></span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{t('visa.sidebar.portTitle')}</h4>
                      <p className="text-xs text-gray-500 mt-1">{t('visa.sidebar.portDesc1')}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{t('visa.sidebar.portDesc2')}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <span className="mt-0.5 text-blue-500"><svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2"><path d="M9 12h6M9 16h6M9 8h6M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{t('visa.sidebar.materialTitle')}</h4>
                      <p className="text-xs text-gray-500 mt-1">{t('visa.sidebar.materialDesc1')}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{t('visa.sidebar.materialDesc2')}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{t('visa.sidebar.materialDesc3')}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <span className="mt-0.5 text-green-500"><svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{t('visa.sidebar.areaTitle')}</h4>
                      <p className="text-xs text-gray-500 mt-1">{t('visa.sidebar.areaDesc1')}</p>
                      <p className="text-xs text-gray-500 mt-0.5 text-red-500">{t('visa.sidebar.areaDesc2')}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <span className="mt-0.5 text-red-500"><svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{t('visa.sidebar.ruleTitle')}</h4>
                      <p className="text-xs text-gray-500 mt-1">{t('visa.sidebar.ruleDesc1')}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{t('visa.sidebar.ruleDesc2')}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{t('visa.sidebar.ruleDesc3')}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{t('visa.sidebar.ruleDesc4')}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-gray-50 rounded p-3 text-[11px] text-gray-400">
                    {t('visa.sidebar.disclaimer')}
                  </div>
                </div>
              </div>
            </div>

            {/* 中国移民管理局 */}
            <div className="mt-10">
              <h3 className="text-[17px] font-bold text-gray-900 mb-4 bg-transparent border-b-2 border-[var(--color-primary)] inline-block pb-2">{t('visa.sidebar.niaTitle')}</h3>
              <div className="flex gap-3">
                <div className="flex-1 bg-white border border-gray-100 shadow-sm rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">{t('visa.sidebar.hotline')}</div>
                    <div className="font-bold text-gray-900">12367</div>
                  </div>
                </div>
                
                <a href="https://www.nia.gov.cn/Enquiry/" target="_blank" rel="noopener noreferrer" className="flex-1 bg-white border border-gray-100 shadow-sm rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 rounded-full bg-green-50 text-[var(--color-primary)] flex items-center justify-center">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">{t('visa.sidebar.interaction')}</div>
                    <div className="font-bold text-gray-900">{t('visa.sidebar.ask')}</div>
                  </div>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Ad Section Mock */}
      <section className="py-12 flex justify-center px-4">
        <div className="max-w-[728px] w-full border border-gray-200 shadow-sm bg-white relative flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 rounded-md">
          <div className="absolute top-0 right-0 p-1 flex gap-1 z-10">
            <span className="w-4 h-4 bg-blue-100 flex items-center justify-center text-[10px] text-blue-500 rounded-sm cursor-pointer">i</span>
            <span className="w-4 h-4 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 rounded-sm cursor-pointer">x</span>
          </div>
          <div className="w-full sm:w-[300px] h-[150px] flex-shrink-0 relative overflow-hidden rounded-md">
             <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600" alt="Track" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-between flex-1 py-1">
            <h3 className="text-xl sm:text-2xl font-normal text-gray-800 break-words pr-8">Spa 2026 Tickets</h3>
            <div className="flex justify-between items-center w-full mt-auto pt-4 gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-yellow-400 flex items-center justify-center border border-gray-200 overflow-hidden">
                   <div className="w-4 h-4 bg-black rounded-lg"></div>
                </div>
                <span className="text-gray-600 text-sm font-medium truncate">Global-Tickets</span>
              </div>
              <button className="bg-[#1a1a1a] hover:bg-black text-white px-6 sm:px-8 py-2 sm:py-2.5 rounded-full font-medium transition-colors text-sm flex-shrink-0">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
