"use client";

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface ZodiacCalculatorProps {
    translations?: Record<string, string>;
}

interface ZodiacInfo {
    animal: string;
    animalEn: string;
    pinyin: string;
    icon: string;
    description: string;
    descriptionEn: string;
    nextBenmingYear: number;
    element: string;
    elementEn: string;
    startDate: string;
}

const zodiacData: ZodiacInfo[] = [
    { animal: '猴', animalEn: 'Monkey', pinyin: 'hóu', icon: '🐵', description: '猴子聪明机智，善于解决问题。在中国文化中，猴子象征着智慧、灵活和长寿。', descriptionEn: 'Monkeys are clever and resourceful. In Chinese culture, they symbolize wisdom, agility, and longevity.', nextBenmingYear: 2028, element: '金', elementEn: 'Metal', startDate: '2月8日' },
    { animal: '鸡', animalEn: 'Rooster', pinyin: 'jī', icon: '🐔', description: '鸡勤奋守时，象征着勤劳、诚实和守信。在中国传统文化中，鸡有驱邪避凶的寓意。', descriptionEn: 'Roosters are diligent and punctual, symbolizing hard work, honesty, and trustworthiness.', nextBenmingYear: 2029, element: '土', elementEn: 'Earth', startDate: '1月26日' },
    { animal: '狗', animalEn: 'Dog', pinyin: 'gǒu', icon: '🐕', description: '狗忠诚可靠，是人类最忠实的朋友。象征着忠诚、正义和保护。', descriptionEn: 'Dogs are loyal and reliable, symbolizing faithfulness, justice, and protection.', nextBenmingYear: 2030, element: '土', elementEn: 'Earth', startDate: '2月13日' },
    { animal: '猪', animalEn: 'Pig', pinyin: 'zhū', icon: '🐷', description: '猪憨厚老实，象征着财富、好运和诚实。在中国文化中，猪也代表着丰收和富足。', descriptionEn: 'Pigs are honest and generous, symbolizing wealth, good fortune, and honesty.', nextBenmingYear: 2031, element: '水', elementEn: 'Water', startDate: '2月3日' },
    { animal: '鼠', animalEn: 'Rat', pinyin: 'shǔ', icon: '🐭', description: '鼠机智灵活，善于适应环境。在中国文化中，鼠象征着智慧、机敏和繁衍。', descriptionEn: 'Rats are quick-witted and adaptable, symbolizing wisdom, alertness, and fertility.', nextBenmingYear: 2032, element: '水', elementEn: 'Water', startDate: '1月25日' },
    { animal: '牛', animalEn: 'Ox', pinyin: 'niú', icon: '🐮', description: '牛勤劳踏实，象征着勤奋、坚韧和力量。在中国农业社会中，牛是重要的生产伙伴。', descriptionEn: 'Oxen are hardworking and steadfast, symbolizing diligence, perseverance, and strength.', nextBenmingYear: 2033, element: '土', elementEn: 'Earth', startDate: '2月12日' },
    { animal: '虎', animalEn: 'Tiger', pinyin: 'hǔ', icon: '🐯', description: '虎威猛霸气，是百兽之王。象征着勇气、力量和威严，有驱邪避凶的寓意。', descriptionEn: 'Tigers are powerful and majestic, symbolizing courage, strength, and authority.', nextBenmingYear: 2034, element: '木', elementEn: 'Wood', startDate: '1月31日' },
    { animal: '兔', animalEn: 'Rabbit', pinyin: 'tù', icon: '🐰', description: '兔温柔可爱，象征着温和、善良和长寿。在中国神话中，玉兔在月宫捣药。', descriptionEn: 'Rabbits are gentle and lovely, symbolizing kindness, grace, and longevity.', nextBenmingYear: 2035, element: '木', elementEn: 'Wood', startDate: '2月19日' },
    { animal: '龙', animalEn: 'Dragon', pinyin: 'lóng', icon: '🐲', description: '龙是中国文化中最具代表性的象征之一，常与力量、生命力、变化和吉祥联系在一起。它不是现实动物，而是一种深植于宫殿、庙宇、节庆和公共视觉中的神话形象。对旅行者来说，龙的主题很适合进入皇城、名山、宏大建筑和礼制空间。', descriptionEn: 'Dragons are the most iconic symbol in Chinese culture, associated with power, vitality, and auspiciousness. For travelers, dragon themes are perfect for exploring imperial palaces, sacred mountains, and grand architecture.', nextBenmingYear: 2036, element: '土', elementEn: 'Earth', startDate: '2月8日' },
    { animal: '蛇', animalEn: 'Snake', pinyin: 'shé', icon: '🐍', description: '蛇神秘智慧，象征着灵性、智慧和重生。在中国文化中，蛇也被称为"小龙"。', descriptionEn: 'Snakes are mysterious and wise, symbolizing spirituality, wisdom, and rebirth.', nextBenmingYear: 2037, element: '火', elementEn: 'Fire', startDate: '1月27日' },
    { animal: '马', animalEn: 'Horse', pinyin: 'mǎ', icon: '🐴', description: '马奔放自由，象征着活力、成功和进取。在中国文化中，马有"马到成功"的美好寓意。', descriptionEn: 'Horses are free-spirited and energetic, symbolizing vitality, success, and ambition.', nextBenmingYear: 2038, element: '火', elementEn: 'Fire', startDate: '2月15日' },
    { animal: '羊', animalEn: 'Goat', pinyin: 'yáng', icon: '🐑', description: '羊温顺祥和，象征着和平、美好和孝顺。在中国文化中，"羊"与"祥"谐音，代表吉祥。', descriptionEn: 'Goats are gentle and peaceful, symbolizing harmony, beauty, and filial piety.', nextBenmingYear: 2039, element: '土', elementEn: 'Earth', startDate: '2月4日' },
];

const ZodiacCalculator = ({ translations }: ZodiacCalculatorProps) => {
    const { language, t } = useLanguage();

    const tt = (key: string): string => {
        if (translations && translations[key] && translations[key] !== key) {
            return translations[key];
        }
        return t(key);
    };

    const isZh = language === 'zh' || language === 'tw';

    const [year, setYear] = useState<string>('2024');
    const [month, setMonth] = useState<string>('3');
    const [day, setDay] = useState<string>('3');
    const [result, setResult] = useState<ZodiacInfo | null>(null);
    const [showResult, setShowResult] = useState(false);

    const calculateZodiac = () => {
        const y = parseInt(year);
        const index = (y - 4) % 12;
        const zodiacIndex = index < 0 ? index + 12 : index;
        setResult(zodiacData[zodiacIndex]);
        setShowResult(true);
    };

    const closeResult = () => {
        setShowResult(false);
    };

    const getNextBenmingYear = (baseYear: number, currentYear: number) => {
        const diff = currentYear - baseYear;
        const cycles = Math.floor(diff / 12);
        return baseYear + (cycles + 1) * 12;
    };

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900">
            {/* Hero Section */}
            <div
                className="relative h-[300px] flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=2670&auto=format&fit=crop)' }}
            >
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative text-center">
                    <h1 className="text-white text-5xl font-bold mb-4">{tt('tools.zodiac.heroTitle')}</h1>
                    <p className="text-white/80 text-xl font-medium">{tt('tools.zodiac.heroDesc')}</p>
                </div>
            </div>

            {/* Calculator Widget - directly below hero */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-10 sm:mt-12">
                <section className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-neutral-100">
                    {/* Date Selectors */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                        <div className="flex flex-col gap-1.5 sm:gap-2">
                            <label className="text-xs font-medium text-neutral-400">{tt('tools.zodiac.year')}</label>
                            <div className="relative">
                                <select 
                                    value={year} 
                                    onChange={e => setYear(e.target.value)} 
                                    className="appearance-none border border-neutral-200 p-2 sm:p-3 rounded-lg sm:rounded-xl w-full bg-neutral-50 text-neutral-700 text-sm sm:font-medium pr-7 sm:pr-8 cursor-pointer hover:border-green-300 transition-colors"
                                >
                                    {[...Array(126)].map((_, i) => <option key={i} value={1900 + i}>{1900 + i}</option>)}
                                </select>
                                <svg className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5 sm:gap-2">
                            <label className="text-xs font-medium text-neutral-400">{tt('tools.zodiac.month')}</label>
                            <div className="relative">
                                <select 
                                    value={month} 
                                    onChange={e => setMonth(e.target.value)} 
                                    className="appearance-none border border-neutral-200 p-2 sm:p-3 rounded-lg sm:rounded-xl w-full bg-neutral-50 text-neutral-700 text-sm sm:font-medium pr-7 sm:pr-8 cursor-pointer hover:border-green-300 transition-colors"
                                >
                                    {[...Array(12)].map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
                                </select>
                                <svg className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5 sm:gap-2">
                            <label className="text-xs font-medium text-neutral-400">{tt('tools.zodiac.day')}</label>
                            <div className="relative">
                                <select 
                                    value={day} 
                                    onChange={e => setDay(e.target.value)} 
                                    className="appearance-none border border-neutral-200 p-2 sm:p-3 rounded-lg sm:rounded-xl w-full bg-neutral-50 text-neutral-700 text-sm sm:font-medium pr-7 sm:pr-8 cursor-pointer hover:border-green-300 transition-colors"
                                >
                                    {[...Array(31)].map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
                                </select>
                                <svg className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    {/* Query Button */}
                    <button 
                        onClick={calculateZodiac} 
                        className="w-full bg-green-600 text-white font-semibold py-3 sm:py-3.5 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-sm hover:shadow-md"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        {tt('tools.zodiac.button')}
                    </button>

                    {/* Result Card */}
                    {showResult && result && (
                        <div className="mt-4 sm:mt-6 bg-green-50/50 rounded-xl sm:rounded-2xl border border-green-100 overflow-hidden">
                            {/* Result Header */}
                            <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 border-b border-green-100">
                                <span className="text-sm font-medium text-neutral-500">{tt('tools.zodiac.resultLabel')}</span>
                                <button 
                                    onClick={closeResult}
                                    className="text-neutral-400 hover:text-neutral-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* Result Content */}
                            <div className="p-4 sm:p-5">
                                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                                    {/* Zodiac Icon */}
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0">
                                        {result.icon}
                                    </div>
                                    {/* Zodiac Info */}
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-bold text-neutral-900">
                                            {result.animalEn} {result.animal}
                                        </h3>
                                        <p className="text-sm text-neutral-500">{result.pinyin}</p>
                                    </div>
                                </div>
                                
                                {/* Description */}
                                <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                                    {isZh ? result.description : result.descriptionEn}
                                </p>
                                
                                {/* Benming Year Info */}
                                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                                    <p className="text-sm text-neutral-600 mb-2">
                                        {tt('tools.zodiac.nextBenming')}<span className="text-green-600 font-semibold">{getNextBenmingYear(parseInt(year), new Date().getFullYear())}</span>
                                    </p>
                                    <h4 className="font-semibold text-neutral-800 text-sm mb-1">{tt('tools.zodiac.benmingTitle')}</h4>
                                    <p className="text-xs text-neutral-500 leading-relaxed">
                                        {tt('tools.zodiac.benmingDesc')}
                                    </p>
                                </div>
                                
                                {/* Footer Note */}
                                <p className="text-[11px] sm:text-xs text-neutral-400 mb-3 sm:mb-4">
                                    {tt('tools.zodiac.footerNote')}
                                </p>
                                
                                {/* Detail Button */}
                                <button className="bg-green-600 text-white text-xs sm:text-sm font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1">
                                    {tt('tools.zodiac.viewDetail')}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </div>

            {/* Content Sections */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-10 sm:mt-12 pb-16">
                {/* Zodiac Year Info Section - Two Column Layout */}
                <div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                        {/* Left: Large Zodiac Card */}
                        <div className="bg-green-50 rounded-2xl p-5 sm:p-8 relative overflow-hidden">
                            {/* Zodiac Icon */}
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl mb-4 sm:mb-6 mx-auto">
                                🐴
                            </div>
                            {/* Year Info */}
                            <div className="text-center mb-4">
                                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-1">{tt('tools.zodiac.currentYearTitle')}</h3>
                                <p className="text-sm text-neutral-500">{tt('tools.zodiac.currentYearStart')}</p>
                            </div>
                            {/* Element Tag */}
                            <div className="flex justify-center">
                                <span className="inline-flex items-center gap-1.5 bg-white px-4 py-2 rounded-full text-sm font-medium text-green-700 shadow-sm">
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                    {tt('tools.zodiac.elementTag')}
                                </span>
                            </div>
                            {/* Next Year Preview Card */}
                            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white rounded-xl p-3 shadow-sm border border-green-100">
                                <p className="text-xs text-green-600 font-medium mb-0.5">{tt('tools.zodiac.nextLabel')}</p>
                                <p className="text-sm font-semibold text-neutral-800">{tt('tools.zodiac.nextPreview')}</p>
                            </div>
                        </div>

                        {/* Right: Description Content */}
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3 sm:mb-4 leading-tight">
                                {tt('tools.zodiac.faq1Title')}
                            </h2>
                            <div className="space-y-2.5 sm:space-y-3 text-neutral-600 text-sm leading-relaxed">
                                <p>{tt('tools.zodiac.faq1P1')}</p>
                                <p>{tt('tools.zodiac.faq1P2')}</p>
                                <p>{tt('tools.zodiac.faq1P3')}</p>
                                <p>{tt('tools.zodiac.faq1P4')}</p>
                            </div>
                            
                            {/* Next Zodiac Preview Box */}
                            <div className="mt-5 sm:mt-6 bg-amber-50 rounded-xl p-4 border border-amber-100">
                                <h4 className="font-semibold text-neutral-800 text-sm mb-1">{tt('tools.zodiac.nextPreviewTitle')}</h4>
                                <p className="text-xs text-neutral-600 leading-relaxed">
                                    {tt('tools.zodiac.nextPreviewDesc')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Zodiac Detail Section */}
                <ZodiacDetailSection tt={tt} />

                {/* Zodiac Year Reference Table */}
                <ZodiacYearTable tt={tt} isZh={isZh} />

                {/* How Chinese Zodiac Works */}
                <ZodiacHowItWorks tt={tt} isZh={isZh} />

                {/* Experience Zodiac Culture When Traveling */}
                <ZodiacTravelTips tt={tt} isZh={isZh} />

                {/* Zodiac Legends Overview */}
                <ZodiacLegends tt={tt} isZh={isZh} />

                {/* Zodiac FAQ */}
                <ZodiacFAQ tt={tt} isZh={isZh} />
            </main>
        </div>
    );
};

interface ZodiacDetail {
    animal: string;
    animalEn: string;
    pinyin: string;
    icon: string;
    years: string;
    personality: string;
    strengths: string;
    challenges: string;
    career: string;
    compatibility: string;
    luckyNumbers: string;
    travelVibe: string;
}

const zodiacDetails: ZodiacDetail[] = [
    { animal: '鼠', animalEn: 'Rat', pinyin: 'shǔ', icon: '🐭', years: '1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020', personality: '机智灵活，善于观察和适应', strengths: '聪明、节俭、社交能力强', challenges: '有时过于谨慎、多疑', career: '适合商业、写作、研究类工作', compatibility: '龙、猴、牛', luckyNumbers: '2, 3', travelVibe: '老城区、美食街、文化密集型城市' },
    { animal: '牛', animalEn: 'Ox', pinyin: 'niú', icon: '🐮', years: '1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021', personality: '踏实稳重，意志力强', strengths: '勤奋、可靠、有耐心', challenges: '固执、不善表达', career: '适合工程、农业、金融类工作', compatibility: '鼠、蛇、鸡', luckyNumbers: '1, 4', travelVibe: '乡村田园、山间步道、慢节奏小镇' },
    { animal: '虎', animalEn: 'Tiger', pinyin: 'hǔ', icon: '🐯', years: '1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022', personality: '勇敢自信，天生领袖', strengths: '果断、有魅力、正义感强', challenges: '冲动、爱冒险', career: '适合管理、军事、创业类工作', compatibility: '马、狗、猪', luckyNumbers: '1, 3, 4', travelVibe: '探险路线、名山大川、边境风光' },
    { animal: '兔', animalEn: 'Rabbit', pinyin: 'tù', icon: '🐰', years: '1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023', personality: '温和优雅，善于社交', strengths: '细腻、有审美、善解人意', challenges: '犹豫、回避冲突', career: '适合艺术、教育、医疗类工作', compatibility: '羊、狗、猪', luckyNumbers: '3, 4, 6', travelVibe: '园林古镇、艺术区、温泉度假' },
    { animal: '龙', animalEn: 'Dragon', pinyin: 'lóng', icon: '🐲', years: '1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024', personality: '雄心勃勃，气场强大', strengths: '自信、有创造力、精力充沛', challenges: '自负、要求过高', career: '适合领导、创新、表演类工作', compatibility: '鼠、猴、鸡', luckyNumbers: '1, 6, 7', travelVibe: '皇城宫殿、宏大建筑、节庆现场' },
    { animal: '蛇', animalEn: 'Snake', pinyin: 'shé', icon: '🐍', years: '1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025', personality: '深思熟虑，直觉敏锐', strengths: '智慧、优雅、洞察力强', challenges: '多疑、占有欲强', career: '适合研究、心理学、投资类工作', compatibility: '牛、鸡', luckyNumbers: '2, 8, 9', travelVibe: '禅寺古刹、隐秘花园、文化深度游' },
    { animal: '马', animalEn: 'Horse', pinyin: 'mǎ', icon: '🐴', years: '1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026', personality: '热情奔放，热爱自由', strengths: '积极、独立、行动力强', challenges: '急躁、不够专注', career: '适合销售、体育、旅游类工作', compatibility: '虎、羊、狗', luckyNumbers: '2, 3, 7', travelVibe: '草原骑行、古道徒步、节庆城市' },
    { animal: '羊', animalEn: 'Goat', pinyin: 'yáng', icon: '🐑', years: '1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027', personality: '温顺善良，富有创意', strengths: '有艺术天赋、善良、坚韧', challenges: '优柔寡断、过于敏感', career: '适合设计、音乐、护理类工作', compatibility: '兔、马、猪', luckyNumbers: '2, 7', travelVibe: '艺术小镇、手工艺村落、山水画境' },
    { animal: '猴', animalEn: 'Monkey', pinyin: 'hóu', icon: '🐵', years: '1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028', personality: '聪明伶俐，幽默风趣', strengths: '适应力强、机智、有创造力', challenges: '不专一、好炫耀', career: '适合科技、媒体、娱乐类工作', compatibility: '鼠、龙', luckyNumbers: '4, 9', travelVibe: '科技都市、主题乐园、夜市美食' },
    { animal: '鸡', animalEn: 'Rooster', pinyin: 'jī', icon: '🐔', years: '1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029', personality: '勤奋守时，注重细节', strengths: '诚实、有条理、观察力强', challenges: '挑剔、爱批评', career: '适合会计、编辑、军事类工作', compatibility: '牛、龙、蛇', luckyNumbers: '5, 7, 8', travelVibe: '历史名城、博物馆密集区、古城墙' },
    { animal: '狗', animalEn: 'Dog', pinyin: 'gǒu', icon: '🐕', years: '1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030', personality: '忠诚正直，值得信赖', strengths: '忠实、勇敢、有正义感', challenges: '焦虑、悲观', career: '适合警察、律师、教师类工作', compatibility: '虎、兔、马', luckyNumbers: '3, 4, 9', travelVibe: '民俗村落、自然保护区、地道美食' },
    { animal: '猪', animalEn: 'Pig', pinyin: 'zhū', icon: '🐷', years: '1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031', personality: '憨厚大方，乐观豁达', strengths: '慷慨、真诚、有福气', challenges: '轻信、过于安逸', career: '适合餐饮、酒店、艺术类工作', compatibility: '虎、兔、羊', luckyNumbers: '2, 5, 8', travelVibe: '美食之旅、温泉小镇、田园度假' },
];

const ZodiacDetailSection = ({ tt }: { tt: (key: string) => string }) => {
    const [selectedIndex, setSelectedIndex] = useState(7); // 默认选中马
    const selected = zodiacDetails[selectedIndex];

    return (
        <div className="mt-10 sm:mt-12">
            {/* Section Title */}
            <div className="mb-5 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">{tt('tools.zodiac.detailTitle')}</h2>
                <p className="text-sm text-neutral-400">{tt('tools.zodiac.detailDesc')}</p>
            </div>

            {/* 12 Zodiac Selector Cards - Grid Layout */}
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2 sm:gap-3 mb-5 sm:mb-6">
                {zodiacDetails.map((z, i) => (
                    <button
                        key={i}
                        onClick={() => setSelectedIndex(i)}
                        className={`flex flex-col items-center gap-0.5 sm:gap-1 px-1 sm:px-3 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition-all border-2 ${
                            selectedIndex === i
                                ? 'bg-white border-green-400 shadow-md shadow-green-100'
                                : 'bg-white border-neutral-100 hover:border-neutral-200 hover:shadow-sm'
                        }`}
                    >
                        <span className="text-xl sm:text-2xl lg:text-3xl">{z.icon}</span>
                        <span className={`text-[10px] sm:text-xs lg:text-sm font-bold ${selectedIndex === i ? 'text-green-700' : 'text-neutral-800'}`}>{z.animalEn}</span>
                        <span className={`text-[10px] sm:text-xs lg:text-sm font-medium ${selectedIndex === i ? 'text-green-600' : 'text-neutral-600'}`}>{z.animal}</span>
                    </button>
                ))}
            </div>

            {/* Selected Zodiac Detail Card */}
            <div className="rounded-2xl border border-neutral-100 overflow-hidden">
                {/* Header with Icon and Title */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 sm:p-8 flex items-center gap-4 sm:gap-6">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-5xl flex-shrink-0 shadow-sm border border-green-100">
                        {selected.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 sm:gap-3 mb-1">
                            <h3 className="text-lg sm:text-2xl font-bold text-neutral-900">{selected.animalEn}</h3>
                            <span className="text-base sm:text-xl font-bold text-neutral-700">{selected.animal}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-400 mb-2">{selected.pinyin}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-neutral-500 bg-white/80 px-2 sm:px-3 py-1 rounded-full border border-green-100">📅 {tt('tools.zodiac.birthYears')}</span>
                            <span className="text-[11px] sm:text-xs text-neutral-600">{selected.years}</span>
                        </div>
                    </div>
                </div>

                {/* Detail Grid */}
                <div className="p-4 sm:p-6 md:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {/* 性格气质 */}
                        <div className="bg-neutral-50 rounded-xl sm:rounded-2xl p-4 sm:p-5">
                            <div className="flex items-center gap-2 sm:gap-2.5 mb-2 sm:mb-3">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center text-sm">🎭</div>
                                <h4 className="font-semibold text-neutral-800 text-sm">{tt('tools.zodiac.personality')}</h4>
                            </div>
                            <p className="text-xs text-neutral-600 leading-relaxed">{selected.personality}</p>
                        </div>
                        {/* 优势特质 */}
                        <div className="bg-neutral-50 rounded-xl sm:rounded-2xl p-4 sm:p-5">
                            <div className="flex items-center gap-2 sm:gap-2.5 mb-2 sm:mb-3">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm">💪</div>
                                <h4 className="font-semibold text-neutral-800 text-sm">{tt('tools.zodiac.strengths')}</h4>
                            </div>
                            <p className="text-xs text-neutral-600 leading-relaxed">{selected.strengths}</p>
                        </div>
                        {/* 挑战 */}
                        <div className="bg-neutral-50 rounded-xl sm:rounded-2xl p-4 sm:p-5">
                            <div className="flex items-center gap-2 sm:gap-2.5 mb-2 sm:mb-3">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-amber-100 rounded-lg flex items-center justify-center text-sm">⚡</div>
                                <h4 className="font-semibold text-neutral-800 text-sm">{tt('tools.zodiac.challenges')}</h4>
                            </div>
                            <p className="text-xs text-neutral-600 leading-relaxed">{selected.challenges}</p>
                        </div>
                        {/* 职业风格 */}
                        <div className="bg-neutral-50 rounded-xl sm:rounded-2xl p-4 sm:p-5">
                            <div className="flex items-center gap-2 sm:gap-2.5 mb-2 sm:mb-3">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center text-sm">💼</div>
                                <h4 className="font-semibold text-neutral-800 text-sm">{tt('tools.zodiac.career')}</h4>
                            </div>
                            <p className="text-xs text-neutral-600 leading-relaxed">{selected.career}</p>
                        </div>
                        {/* 情感匹配 */}
                        <div className="bg-neutral-50 rounded-xl sm:rounded-2xl p-4 sm:p-5">
                            <div className="flex items-center gap-2 sm:gap-2.5 mb-2 sm:mb-3">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-pink-100 rounded-lg flex items-center justify-center text-sm">💕</div>
                                <h4 className="font-semibold text-neutral-800 text-sm">{tt('tools.zodiac.compatibility')}</h4>
                            </div>
                            <p className="text-xs text-neutral-600 leading-relaxed">{selected.compatibility}</p>
                        </div>
                        {/* 幸运数字 */}
                        <div className="bg-neutral-50 rounded-xl sm:rounded-2xl p-4 sm:p-5">
                            <div className="flex items-center gap-2 sm:gap-2.5 mb-2 sm:mb-3">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-sm">🔢</div>
                                <h4 className="font-semibold text-neutral-800 text-sm">{tt('tools.zodiac.luckyNumbers')}</h4>
                            </div>
                            <p className="text-xs text-neutral-600 leading-relaxed">{selected.luckyNumbers}</p>
                        </div>
                    </div>

                    {/* 旅行气质 - Full Width */}
                    <div className="mt-3 sm:mt-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-green-100">
                        <div className="flex items-center gap-2 sm:gap-2.5 mb-2 sm:mb-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-200 rounded-lg flex items-center justify-center text-sm">✈️</div>
                            <h4 className="font-semibold text-neutral-800 text-sm">{tt('tools.zodiac.travelVibe')}</h4>
                        </div>
                        <p className="text-xs text-neutral-600 leading-relaxed">{selected.travelVibe}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ZodiacHowItWorks = ({ tt, isZh }: { tt: (key: string) => string; isZh: boolean }) => {
    const steps = [
        {
            icon: '🎂',
            step: '01',
            title: tt('tools.zodiac.howStep1Title'),
            desc: tt('tools.zodiac.howStep1Desc'),
        },
        {
            icon: '🔄',
            step: '02',
            title: tt('tools.zodiac.howStep2Title'),
            desc: tt('tools.zodiac.howStep2Desc'),
        },
        {
            icon: '🔥',
            step: '03',
            title: tt('tools.zodiac.howStep3Title'),
            desc: tt('tools.zodiac.howStep3Desc'),
        },
    ];

    return (
        <div className="mt-10 sm:mt-12">
            {/* Section Title */}
            <div className="mb-5 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">{tt('tools.zodiac.howTitle')}</h2>
                <p className="text-sm text-neutral-400">{tt('tools.zodiac.howDesc')}</p>
            </div>

            {/* Steps */}
            <div className="space-y-3 sm:space-y-4">
                {steps.map((step, i) => (
                    <div key={i} className="bg-white rounded-xl sm:rounded-2xl border border-neutral-100 p-4 sm:p-6 flex gap-3 sm:gap-5 items-start shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col items-center gap-1 flex-shrink-0">
                            <div className="w-11 h-11 sm:w-14 sm:h-14 bg-green-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl">
                                {step.icon}
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-bold text-green-600 mt-1">STEP {step.step}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-neutral-900 mb-1 sm:mb-1.5 text-sm sm:text-base">{step.title}</h3>
                            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ZodiacTravelTips = ({ tt, isZh }: { tt: (key: string) => string; isZh: boolean }) => {
    const tips = [
        {
            icon: '🏮',
            title: tt('tools.zodiac.tip1Title'),
            desc: tt('tools.zodiac.tip1Desc'),
            color: 'bg-red-50 border-red-100',
            iconBg: 'bg-red-100',
        },
        {
            icon: '🏛️',
            title: tt('tools.zodiac.tip2Title'),
            desc: tt('tools.zodiac.tip2Desc'),
            color: 'bg-amber-50 border-amber-100',
            iconBg: 'bg-amber-100',
        },
        {
            icon: '🎁',
            title: tt('tools.zodiac.tip3Title'),
            desc: tt('tools.zodiac.tip3Desc'),
            color: 'bg-purple-50 border-purple-100',
            iconBg: 'bg-purple-100',
        },
        {
            icon: '📿',
            title: tt('tools.zodiac.tip4Title'),
            desc: tt('tools.zodiac.tip4Desc'),
            color: 'bg-green-50 border-green-100',
            iconBg: 'bg-green-100',
        },
    ];

    return (
        <div className="mt-10 sm:mt-12">
            {/* Section Title */}
            <div className="mb-5 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">{tt('tools.zodiac.travelTitle')}</h2>
                <p className="text-sm text-neutral-400">{tt('tools.zodiac.travelDesc')}</p>
            </div>

            {/* Tips Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {tips.map((tip, i) => (
                    <div key={i} className={`rounded-xl sm:rounded-2xl border p-4 sm:p-5 ${tip.color} transition-shadow hover:shadow-md`}>
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 ${tip.iconBg} rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-lg mb-2 sm:mb-3`}>
                            {tip.icon}
                        </div>
                        <h3 className="font-bold text-neutral-900 mb-1 sm:mb-1.5 text-sm">{tip.title}</h3>
                        <p className="text-xs text-neutral-600 leading-relaxed">{tip.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface ZodiacLegendItem {
    icon: string;
    rank: number;
}

const zodiacLegends: ZodiacLegendItem[] = [
    { icon: '🐭', rank: 1 },
    { icon: '🐮', rank: 2 },
    { icon: '🐯', rank: 3 },
    { icon: '🐰', rank: 4 },
    { icon: '🐲', rank: 5 },
    { icon: '🐍', rank: 6 },
    { icon: '🐴', rank: 7 },
    { icon: '🐑', rank: 8 },
    { icon: '🐵', rank: 9 },
    { icon: '🐔', rank: 10 },
    { icon: '🐕', rank: 11 },
    { icon: '🐷', rank: 12 },
];

const rankColors: Record<number, string> = {
    1: 'bg-yellow-50 border-yellow-200',
    2: 'bg-neutral-50 border-neutral-200',
    3: 'bg-amber-50 border-amber-200',
};

const ZodiacLegends = ({ tt }: { tt: (key: string) => string; isZh?: boolean }) => {
    return (
        <div className="mt-10 sm:mt-12">
            {/* Section Title */}
            <div className="mb-5 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">{tt('tools.zodiac.legendTitle')}</h2>
                <p className="text-sm text-neutral-400">{tt('tools.zodiac.legendDesc')}</p>
            </div>

            {/* Legend Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {zodiacLegends.map((item, i) => (
                    <div
                        key={i}
                        className={`rounded-xl border p-3 sm:p-4 flex gap-3 sm:gap-4 items-start transition-shadow hover:shadow-md ${
                            rankColors[item.rank] || 'bg-white border-neutral-100'
                        }`}
                    >
                        {/* Icon + Rank */}
                        <div className="flex flex-col items-center flex-shrink-0">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl ${
                                item.rank === 1 ? 'bg-yellow-100' : item.rank === 2 ? 'bg-neutral-100' : item.rank === 3 ? 'bg-amber-100' : 'bg-green-50'
                            }`}>
                                {item.icon}
                            </div>
                            <span className={`text-[9px] sm:text-[10px] font-bold mt-1 ${
                                item.rank === 1 ? 'text-yellow-600' : item.rank === 2 ? 'text-neutral-500' : item.rank === 3 ? 'text-amber-600' : 'text-green-600'
                            }`}>
                                #{item.rank}
                            </span>
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-neutral-900 text-sm">{tt(`tools.zodiac.legendAnimalEn${item.rank}`)}</h3>
                                <span className="text-sm text-neutral-500">{tt(`tools.zodiac.legendAnimal${item.rank}`)}</span>
                            </div>
                            <p className="text-xs text-neutral-600 leading-relaxed">
                                {tt(`tools.zodiac.legendText${item.rank}`)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ZodiacFAQ = ({ tt, isZh }: { tt: (key: string) => string; isZh: boolean }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        { q: tt('tools.zodiac.faqQ1'), a: tt('tools.zodiac.faqA1') },
        { q: tt('tools.zodiac.faqQ2'), a: tt('tools.zodiac.faqA2') },
        { q: tt('tools.zodiac.faqQ3'), a: tt('tools.zodiac.faqA3') },
        { q: tt('tools.zodiac.faqQ4'), a: tt('tools.zodiac.faqA4') },
        { q: tt('tools.zodiac.faqQ5'), a: tt('tools.zodiac.faqA5') },
        { q: tt('tools.zodiac.faqQ6'), a: tt('tools.zodiac.faqA6') },
        { q: tt('tools.zodiac.faqQ7'), a: tt('tools.zodiac.faqA7') },
        { q: tt('tools.zodiac.faqQ8'), a: tt('tools.zodiac.faqA8') },
        { q: tt('tools.zodiac.faqQ9'), a: tt('tools.zodiac.faqA9') },
    ];

    return (
        <div className="mt-10 sm:mt-12">
            <div className="mb-5 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">{tt('tools.zodiac.faqSectionTitle')}</h2>
                <p className="text-sm text-neutral-400">{tt('tools.zodiac.faqSectionDesc')}</p>
            </div>
            <div className="space-y-2.5 sm:space-y-3">
                {faqs.map((faq, i) => (
                    <div key={i} className="bg-white rounded-xl sm:rounded-2xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <button
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="w-full flex items-center justify-between p-4 sm:p-5 text-left"
                        >
                            <span className="font-semibold text-neutral-900 text-sm pr-3 sm:pr-4">{faq.q}</span>
                            <svg
                                className={`w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 flex-shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {openIndex === i && (
                            <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{faq.a}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ZodiacCalculator;

interface ZodiacYearRow {
    pinyin: string;
    icon: string;
    years: { year: number; elementKey: string }[];
}

const zodiacYearData: ZodiacYearRow[] = [
    { pinyin: 'shǔ', icon: '🐭', years: [
        { year: 1924, elementKey: 'Wood' }, { year: 1936, elementKey: 'Fire' }, { year: 1948, elementKey: 'Earth' },
        { year: 1960, elementKey: 'Metal' }, { year: 1972, elementKey: 'Water' }, { year: 1984, elementKey: 'Wood' },
        { year: 1996, elementKey: 'Fire' }, { year: 2008, elementKey: 'Earth' }, { year: 2020, elementKey: 'Metal' },
        { year: 2032, elementKey: 'Water' },
    ]},
    { pinyin: 'niú', icon: '🐮', years: [
        { year: 1925, elementKey: 'Wood' }, { year: 1937, elementKey: 'Fire' }, { year: 1949, elementKey: 'Earth' },
        { year: 1961, elementKey: 'Metal' }, { year: 1973, elementKey: 'Water' }, { year: 1985, elementKey: 'Wood' },
        { year: 1997, elementKey: 'Fire' }, { year: 2009, elementKey: 'Earth' }, { year: 2021, elementKey: 'Metal' },
        { year: 2033, elementKey: 'Water' },
    ]},
    { pinyin: 'hǔ', icon: '🐯', years: [
        { year: 1926, elementKey: 'Fire' }, { year: 1938, elementKey: 'Earth' }, { year: 1950, elementKey: 'Metal' },
        { year: 1962, elementKey: 'Water' }, { year: 1974, elementKey: 'Wood' }, { year: 1986, elementKey: 'Fire' },
        { year: 1998, elementKey: 'Earth' }, { year: 2010, elementKey: 'Metal' }, { year: 2022, elementKey: 'Water' },
        { year: 2034, elementKey: 'Wood' },
    ]},
    { pinyin: 'tù', icon: '🐰', years: [
        { year: 1927, elementKey: 'Fire' }, { year: 1939, elementKey: 'Earth' }, { year: 1951, elementKey: 'Metal' },
        { year: 1963, elementKey: 'Water' }, { year: 1975, elementKey: 'Wood' }, { year: 1987, elementKey: 'Fire' },
        { year: 1999, elementKey: 'Earth' }, { year: 2011, elementKey: 'Metal' }, { year: 2023, elementKey: 'Water' },
        { year: 2035, elementKey: 'Wood' },
    ]},
    { pinyin: 'lóng', icon: '🐲', years: [
        { year: 1928, elementKey: 'Earth' }, { year: 1940, elementKey: 'Metal' }, { year: 1952, elementKey: 'Water' },
        { year: 1964, elementKey: 'Wood' }, { year: 1976, elementKey: 'Fire' }, { year: 1988, elementKey: 'Earth' },
        { year: 2000, elementKey: 'Metal' }, { year: 2012, elementKey: 'Water' }, { year: 2024, elementKey: 'Wood' },
        { year: 2036, elementKey: 'Fire' },
    ]},
    { pinyin: 'shé', icon: '🐍', years: [
        { year: 1929, elementKey: 'Earth' }, { year: 1941, elementKey: 'Metal' }, { year: 1953, elementKey: 'Water' },
        { year: 1965, elementKey: 'Wood' }, { year: 1977, elementKey: 'Fire' }, { year: 1989, elementKey: 'Earth' },
        { year: 2001, elementKey: 'Metal' }, { year: 2013, elementKey: 'Water' }, { year: 2025, elementKey: 'Wood' },
        { year: 2037, elementKey: 'Fire' },
    ]},
    { pinyin: 'mǎ', icon: '🐴', years: [
        { year: 1930, elementKey: 'Metal' }, { year: 1942, elementKey: 'Water' }, { year: 1954, elementKey: 'Wood' },
        { year: 1966, elementKey: 'Fire' }, { year: 1978, elementKey: 'Earth' }, { year: 1990, elementKey: 'Metal' },
        { year: 2002, elementKey: 'Water' }, { year: 2014, elementKey: 'Wood' }, { year: 2026, elementKey: 'Fire' },
        { year: 2038, elementKey: 'Earth' },
    ]},
    { pinyin: 'yáng', icon: '🐑', years: [
        { year: 1931, elementKey: 'Metal' }, { year: 1943, elementKey: 'Water' }, { year: 1955, elementKey: 'Wood' },
        { year: 1967, elementKey: 'Fire' }, { year: 1979, elementKey: 'Earth' }, { year: 1991, elementKey: 'Metal' },
        { year: 2003, elementKey: 'Water' }, { year: 2015, elementKey: 'Wood' }, { year: 2027, elementKey: 'Fire' },
        { year: 2039, elementKey: 'Earth' },
    ]},
    { pinyin: 'hóu', icon: '🐵', years: [
        { year: 1932, elementKey: 'Water' }, { year: 1944, elementKey: 'Wood' }, { year: 1956, elementKey: 'Fire' },
        { year: 1968, elementKey: 'Earth' }, { year: 1980, elementKey: 'Metal' }, { year: 1992, elementKey: 'Water' },
        { year: 2004, elementKey: 'Wood' }, { year: 2016, elementKey: 'Fire' }, { year: 2028, elementKey: 'Earth' },
        { year: 2040, elementKey: 'Metal' },
    ]},
    { pinyin: 'jī', icon: '🐔', years: [
        { year: 1933, elementKey: 'Water' }, { year: 1945, elementKey: 'Wood' }, { year: 1957, elementKey: 'Fire' },
        { year: 1969, elementKey: 'Earth' }, { year: 1981, elementKey: 'Metal' }, { year: 1993, elementKey: 'Water' },
        { year: 2005, elementKey: 'Wood' }, { year: 2017, elementKey: 'Fire' }, { year: 2029, elementKey: 'Earth' },
        { year: 2041, elementKey: 'Metal' },
    ]},
    { pinyin: 'gǒu', icon: '🐕', years: [
        { year: 1934, elementKey: 'Wood' }, { year: 1946, elementKey: 'Fire' }, { year: 1958, elementKey: 'Earth' },
        { year: 1970, elementKey: 'Metal' }, { year: 1982, elementKey: 'Water' }, { year: 1994, elementKey: 'Wood' },
        { year: 2006, elementKey: 'Fire' }, { year: 2018, elementKey: 'Earth' }, { year: 2030, elementKey: 'Metal' },
        { year: 2042, elementKey: 'Water' },
    ]},
    { pinyin: 'zhū', icon: '🐷', years: [
        { year: 1935, elementKey: 'Wood' }, { year: 1947, elementKey: 'Fire' }, { year: 1959, elementKey: 'Earth' },
        { year: 1971, elementKey: 'Metal' }, { year: 1983, elementKey: 'Water' }, { year: 1995, elementKey: 'Wood' },
        { year: 2007, elementKey: 'Fire' }, { year: 2019, elementKey: 'Earth' }, { year: 2031, elementKey: 'Metal' },
        { year: 2043, elementKey: 'Water' },
    ]},
];

const elementColorMap: Record<string, string> = {
    'Metal': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Wood': 'bg-green-100 text-green-700 border-green-200',
    'Water': 'bg-blue-100 text-blue-700 border-blue-200',
    'Fire': 'bg-red-100 text-red-700 border-red-200',
    'Earth': 'bg-amber-100 text-amber-700 border-amber-200',
};

const ZodiacYearTable = ({ tt }: { tt: (key: string) => string; isZh?: boolean }) => {
    return (
        <div className="mt-10 sm:mt-12">
            {/* Section Title */}
            <div className="mb-5 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">{tt('tools.zodiac.tableTitle')}</h2>
                <p className="text-sm text-neutral-400">{tt('tools.zodiac.tableDesc')}</p>
            </div>

            {/* Mobile: Card Layout */}
            <div className="sm:hidden space-y-3">
                {zodiacYearData.map((z, i) => (
                    <div key={i} className="bg-white rounded-xl border border-neutral-100 p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">{z.icon}</span>
                            <span className="font-bold text-green-700 text-sm">{tt(`tools.zodiac.tableAnimal${i + 1}`)}</span>
                            <span className="text-sm text-neutral-500">{tt(`tools.zodiac.legendAnimalEn${i + 1}`)}</span>
                            <span className="text-xs text-neutral-400">{z.pinyin}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {z.years.filter(y => y.year >= 1948 && y.year <= 2043).map((y, j) => (
                                <span
                                    key={j}
                                    className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium border ${elementColorMap[y.elementKey] || 'bg-neutral-100 text-neutral-600 border-neutral-200'}`}
                                >
                                    {y.year}
                                    <span className="opacity-60">{tt(`tools.zodiac.element${y.elementKey}`)}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop: Table Layout */}
            <div className="hidden sm:block bg-white rounded-2xl border border-neutral-100 overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[100px_80px_60px_1fr] md:grid-cols-[120px_90px_70px_1fr] bg-neutral-50 border-b border-neutral-100 px-5 py-3">
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{tt('tools.zodiac.colZodiac')}</span>
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{tt('tools.zodiac.colEnglish')}</span>
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{tt('tools.zodiac.colPinyin')}</span>
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{tt('tools.zodiac.colYears')}</span>
                </div>

                {/* Table Rows */}
                {zodiacYearData.map((z, i) => (
                    <div key={i} className={`grid grid-cols-[100px_80px_60px_1fr] md:grid-cols-[120px_90px_70px_1fr] px-5 py-4 items-center ${
                        i < zodiacYearData.length - 1 ? 'border-b border-neutral-50' : ''
                    } hover:bg-neutral-50/50 transition-colors`}>
                        {/* Animal */}
                        <div className="flex items-center gap-2">
                            <span className="text-lg">{z.icon}</span>
                            <span className="font-semibold text-green-700 text-sm">{tt(`tools.zodiac.tableAnimal${i + 1}`)}</span>
                        </div>
                        {/* English Name */}
                        <span className="text-sm text-neutral-600">{tt(`tools.zodiac.legendAnimalEn${i + 1}`)}</span>
                        {/* Pinyin */}
                        <span className="text-xs text-neutral-400">{z.pinyin}</span>
                        {/* Years with Elements */}
                        <div className="flex flex-wrap gap-1.5">
                            {z.years.filter(y => y.year >= 1900 && y.year <= 2050).map((y, j) => (
                                <span
                                    key={j}
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${elementColorMap[y.elementKey] || 'bg-neutral-100 text-neutral-600 border-neutral-200'}`}
                                >
                                    {y.year}
                                    <span className="opacity-60">{tt(`tools.zodiac.element${y.elementKey}`)}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Element Legend */}
            <div className="mt-4 flex flex-wrap gap-2 sm:gap-3 items-center justify-center">
                <span className="text-xs text-neutral-400 mr-1">{tt('tools.zodiac.elementLegend')}</span>
                {[
                    { key: 'Metal', cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
                    { key: 'Wood', cls: 'bg-green-100 text-green-700 border-green-200' },
                    { key: 'Water', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
                    { key: 'Fire', cls: 'bg-red-100 text-red-700 border-red-200' },
                    { key: 'Earth', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
                ].map((e, i) => (
                    <span key={i} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium border ${e.cls}`}>
                        {tt(`tools.zodiac.element${e.key}`)}
                    </span>
                ))}
            </div>
        </div>
    );
};
