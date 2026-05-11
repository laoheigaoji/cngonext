"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ChevronDown, ChevronUp, Sparkles, Copy, Check, Star, Flame, Droplets, TreePine, Mountain, Zap, ThumbsUp, ThumbsDown, Download, Share2, PenTool, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPng } from 'html-to-image';
import HanziWriter from 'hanzi-writer';

interface CharAnalysis {
  char: string;
  pinyin: string;
  meaning: string;
  wuxing: string;
  wuxingLabel?: string;
  source: string;
}

interface NameLabels {
  zodiac?: string;
  lucky?: string;
  elements?: string;
  whyFit?: string;
  nameAnalysis?: string;
  write?: string;
}

interface NameResult {
  chinese: string;
  surname: string;
  givenName: string;
  pinyin: string;
  wuxing: {
    element: string;
    explanation: string;
  };
  zodiac: string;
  zodiacEn?: string;
  luckyNumber: string;
  meaning: string;
  cardTitle?: string;
  labels?: NameLabels;
  charAnalysis: CharAnalysis[];
  whyFit: string;
}

interface NameResponse {
  names: NameResult[];
}

const WUXING_CONFIG: Record<string, { icon: typeof Flame; color: string; bg: string; border: string; label: string; hex: string }> = {
  '金': { icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Metal', hex: '#ca8a04' },
  '木': { icon: TreePine, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Wood', hex: '#16a34a' },
  '水': { icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Water', hex: '#2563eb' },
  '火': { icon: Flame, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Fire', hex: '#dc2626' },
  '土': { icon: Mountain, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Earth', hex: '#b45309' },
};

const ZODIAC_MAP: Record<string, { emoji: string; cn: string; en: string; ja: string; ko: string }> = {
  '鼠': { emoji: '🐭', cn: '鼠', en: 'Rat', ja: '子（ね）', ko: '쥐' },
  '牛': { emoji: '🐂', cn: '牛', en: 'Ox', ja: '丑（うし）', ko: '소' },
  '虎': { emoji: '🐯', cn: '虎', en: 'Tiger', ja: '寅（とら）', ko: '호랑이' },
  '兔': { emoji: '🐰', cn: '兔', en: 'Rabbit', ja: '卯（うさぎ）', ko: '토끼' },
  '龙': { emoji: '🐲', cn: '龙', en: 'Dragon', ja: '辰（たつ）', ko: '용' },
  '蛇': { emoji: '🐍', cn: '蛇', en: 'Snake', ja: '巳（み）', ko: '뱀' },
  '马': { emoji: '🐴', cn: '马', en: 'Horse', ja: '午（うま）', ko: '말' },
  '羊': { emoji: '🐑', cn: '羊', en: 'Goat', ja: '未（ひつじ）', ko: '양' },
  '猴': { emoji: '🐵', cn: '猴', en: 'Monkey', ja: '申（さる）', ko: '원숭이' },
  '鸡': { emoji: '🐔', cn: '鸡', en: 'Rooster', ja: '酉（とり）', ko: '닭' },
  '狗': { emoji: '🐶', cn: '狗', en: 'Dog', ja: '戌（いぬ）', ko: '개' },
  '猪': { emoji: '🐷', cn: '猪', en: 'Pig', ja: '亥（いのしし）', ko: '돼지' },
  'Rat': { emoji: '🐭', cn: '鼠', en: 'Rat', ja: '子（ね）', ko: '쥐' },
  'Ox': { emoji: '🐂', cn: '牛', en: 'Ox', ja: '丑（うし）', ko: '소' },
  'Tiger': { emoji: '🐯', cn: '虎', en: 'Tiger', ja: '寅（とら）', ko: '호랑이' },
  'Rabbit': { emoji: '🐰', cn: '兔', en: 'Rabbit', ja: '卯（うさぎ）', ko: '토끼' },
  'Dragon': { emoji: '🐲', cn: '龙', en: 'Dragon', ja: '辰（たつ）', ko: '용' },
  'Snake': { emoji: '🐍', cn: '蛇', en: 'Snake', ja: '巳（み）', ko: '뱀' },
  'Horse': { emoji: '🐴', cn: '马', en: 'Horse', ja: '午（うま）', ko: '말' },
  'Goat': { emoji: '🐑', cn: '羊', en: 'Goat', ja: '未（ひつじ）', ko: '양' },
  'Monkey': { emoji: '🐵', cn: '猴', en: 'Monkey', ja: '申（さる）', ko: '원숭이' },
  'Rooster': { emoji: '🐔', cn: '鸡', en: 'Rooster', ja: '酉（とり）', ko: '닭' },
  'Dog': { emoji: '🐶', cn: '狗', en: 'Dog', ja: '戌（いぬ）', ko: '개' },
  'Pig': { emoji: '🐷', cn: '猪', en: 'Pig', ja: '亥（いのしし）', ko: '돼지' },
};

// UI labels for each language
const UI_LABELS: Record<string, {
  cardTitle: string; zodiac: string; lucky: string; elements: string;
  whyFit: string; nameAnalysis: string; write: string; like: string;
  dislike: string; saveImage: string; shareX: string; copy: string;
  copied: string; saving: string; viewDetails: string; hideDetails: string;
  regenerateHint: string; footer: string;
  aiRecommended: string; charDetail: string; wuxingAnalysis: string;
  source: string; whyFitDetail: string; noName: string; genFailed: string;
  shareTitle: string; shareCopied: string; sharePrefix: string; shareSuffix: string;
  pinyinTool: string; pinyinToolDesc: string; charCounterTool: string; charCounterToolDesc: string;
  article1Title: string; article1Desc: string; article2Title: string; article2Desc: string;
  article3Title: string; article3Desc: string;
}> = {
  zh: {
    cardTitle: '的中式名片', zodiac: '生肖', lucky: '幸运数字', elements: '五行图',
    whyFit: '为什么适合你？', nameAnalysis: '姓名解析', write: '书写',
    like: '喜欢', dislike: '不喜欢', saveImage: '保存图片', shareX: '分享到 X',
    copy: '复制', copied: '已复制', saving: '保存中...', viewDetails: '查看详情',
    hideDetails: '收起详情', regenerateHint: '💡 不满意？修改信息后重新生成，AI 会为您推荐不同的名字',
    footer: '漫游中国指南',
    aiRecommended: 'AI 为您推荐的名字', charDetail: '逐字解析',
    wuxingAnalysis: '五行解析', source: '出处', whyFitDetail: '为什么适合您',
    noName: '未生成名字', genFailed: '生成失败',
    shareTitle: '我的中文名', shareCopied: '已复制分享内容到剪贴板',
    sharePrefix: '我的中文名是', shareSuffix: '快来获取你的专属中文名！',
    pinyinTool: '中文转拼音', pinyinToolDesc: '可将任何中文转换为标准拼音，查看每个字的笔画和分词。',
    charCounterTool: '中文字符计数器', charCounterToolDesc: '精确统计汉字、英文、数字、标点、行数与总字符数。',
    article1Title: '中国复姓大盘点：探秘十大顶级复姓的起源和故事', article1Desc: '深度解读欧阳、诸葛、上官、司马等十大顶级复姓的起源故事。',
    article2Title: '中国孩子取名趋势大盘点：男孩名霸气，女孩名温柔？', article2Desc: '揭秘中国名字的时代变迁：从60年代的"建国"到20年代的"瑞泽""沐瑶"。',
    article3Title: '有趣的中文名：揭秘欧美明星在中国的外号从何而来？', article3Desc: '探索中国网民如何用谐音、直译和幕后故事为国际明星创造中文昵称。',
  },
  tw: {
    cardTitle: '的中式名片', zodiac: '生肖', lucky: '幸運數字', elements: '五行圖',
    whyFit: '為什麼適合你？', nameAnalysis: '姓名解析', write: '書寫',
    like: '喜歡', dislike: '不喜歡', saveImage: '儲存圖片', shareX: '分享到 X',
    copy: '複製', copied: '已複製', saving: '儲存中...', viewDetails: '查看詳情',
    hideDetails: '收起詳情', regenerateHint: '💡 不滿意？修改資訊後重新生成，AI 會為您推薦不同的名字',
    footer: '漫遊中國指南',
    aiRecommended: 'AI 為您推薦的名字', charDetail: '逐字解析',
    wuxingAnalysis: '五行解析', source: '出處', whyFitDetail: '為什麼適合您',
    noName: '未生成名字', genFailed: '生成失敗',
    shareTitle: '我的中文名', shareCopied: '已複製分享內容到剪貼簿',
    sharePrefix: '我的中文名是', shareSuffix: '快來獲取你的專屬中文名！',
    pinyinTool: '中文轉拼音', pinyinToolDesc: '可將任何中文轉換為標準拼音，查看每個字的筆畫和分詞。',
    charCounterTool: '中文字元計數器', charCounterToolDesc: '精確統計漢字、英文、數字、標點、行數與總字元數。',
    article1Title: '中國複姓大盤點：探秘十大頂級複姓的起源和故事', article1Desc: '深度解讀歐陽、諸葛、上官、司馬等十大頂級複姓的起源故事。',
    article2Title: '中國孩子取名趨勢大盤點：男孩名霸氣，女孩名溫柔？', article2Desc: '揭密中國名字的時代變遷：從60年代的"建國"到20年代的"瑞澤""沐瑤"。',
    article3Title: '有趣的中文名：揭密歐美明星在中國的外號從何而來？', article3Desc: '探索中國網民如何用諧音、直譯和幕後故事為國際明星創造中文暱稱。',
  },
  ja: {
    cardTitle: 'の中国語名刺', zodiac: '干支', lucky: 'ラッキーナンバー', elements: '五行図',
    whyFit: 'なぜこの名前が適していますか？', nameAnalysis: '名前の分析', write: '書く',
    like: 'いいね', dislike: 'よくない', saveImage: '画像を保存', shareX: 'Xでシェア',
    copy: 'コピー', copied: 'コピー済み', saving: '保存中...', viewDetails: '詳細を見る',
    hideDetails: '詳細を閉じる', regenerateHint: '💡 満足できない場合は、情報を変更して再生成してください',
    footer: '中国旅行ガイド',
    aiRecommended: 'AIがおすすめする名前', charDetail: '文字ごとの分析',
    wuxingAnalysis: '五行分析', source: '出典', whyFitDetail: 'なぜこの名前が適していますか',
    noName: '名前が生成されませんでした', genFailed: '生成に失敗しました',
    shareTitle: '私の中国語名', shareCopied: '共有内容をクリップボードにコピーしました',
    sharePrefix: '私の中国語名は', shareSuffix: 'あなたも専用の中国語名を入手しましょう！',
    pinyinTool: 'ピンイン変換', pinyinToolDesc: '中国語を標準ピンインに変換し、各文字の画数と分かち書きを表示します。',
    charCounterTool: '中国語文字カウンター', charCounterToolDesc: '漢字、英語、数字、句読点、行数、総文字数を正確にカウントします。',
    article1Title: '中国の複姓トップ10：有名複姓の起源と物語', article1Desc: '欧陽、諸葛、上官、司馬などのトップ10複姓の起源物語を深く解説します。',
    article2Title: '中国の命名トレンド：男の子は力強く、女の子は優しく？', article2Desc: '1960年代の"建国"から2020年代の"瑞泽""沐瑶"まで、中国の名前の変遷を紹介します。',
    article3Title: '面白い中国語名：欧米スターの中国語ニックネームの由来', article3Desc: '中国のネットユーザーが国際スターに中国語ニックネームをつける方法を探ります。',
  },
  ko: {
    cardTitle: '의 중국어 명함', zodiac: '띠', lucky: '행운의 숫자', elements: '오행도',
    whyFit: '왜 이 이름이 적합한가요?', nameAnalysis: '이름 분석', write: '쓰기',
    like: '좋아요', dislike: '싫어요', saveImage: '이미지 저장', shareX: 'X에 공유',
    copy: '복사', copied: '복사됨', saving: '저장 중...', viewDetails: '상세 보기',
    hideDetails: '상세 닫기', regenerateHint: '💡 만족하지 않으시면 정보를 수정하고 다시 생성하세요',
    footer: '중국 여행 가이드',
    aiRecommended: 'AI가 추천하는 이름', charDetail: '글자별 분석',
    wuxingAnalysis: '오행 분석', source: '출처', whyFitDetail: '왜 이 이름이 적합한가요',
    noName: '이름이 생성되지 않았습니다', genFailed: '생성 실패',
    shareTitle: '나의 중국어 이름', shareCopied: '공유 내용이 클립보드에 복사되었습니다',
    sharePrefix: '나의 중국어 이름은', shareSuffix: '당신만의 중국어 이름을 받아보세요!',
    pinyinTool: '병음 변환기', pinyinToolDesc: '중국어를 표준 병음으로 변환하고 각 글자의 획수와 분할을 확인합니다.',
    charCounterTool: '한자 카운터', charCounterToolDesc: '한자, 영어, 숫자, 문장부호, 줄 수 및 총 문자 수를 정확히 계산합니다.',
    article1Title: '중국 복성 대정리: 10대 복성의 기원과 이야기', article1Desc: '구양, 제갈, 상관, 사마 등 10대 복성의 기원 이야기를 깊이 있게 해설합니다.',
    article2Title: '중국 이름 짓기 트렌드: 남자는 강하게, 여자는 부드럽게?', article2Desc: '1960년대 "건국"에서 2020년대 "서택""목요"까지 중국 이름의 시대적 변천을 소개합니다.',
    article3Title: '재미있는 중국어 이름: 서양 스타의 중국어 별명은 어떻게 만들어졌을까?', article3Desc: '중국 네티즌이 국제 스타에게 중국어 별명을 만드는 방법을 탐구합니다.',
  },
  fr: {
    cardTitle: '- Carte chinoise', zodiac: 'Zodiaque', lucky: 'Numéro chance', elements: 'Cinq Éléments',
    whyFit: 'Pourquoi ce nom vous convient ?', nameAnalysis: 'Analyse du nom', write: 'Écrire',
    like: 'J\'aime', dislike: 'Pas pour moi', saveImage: 'Sauvegarder', shareX: 'Partager sur X',
    copy: 'Copier', copied: 'Copié', saving: 'Sauvegarde...', viewDetails: 'Voir détails',
    hideDetails: 'Masquer détails', regenerateHint: '💡 Pas satisfait ? Modifiez vos informations et régénérez',
    footer: 'Guide de voyage Chine',
    aiRecommended: 'Noms recommandés par l\'IA', charDetail: 'Analyse caractère par caractère',
    wuxingAnalysis: 'Analyse des Cinq Éléments', source: 'Source', whyFitDetail: 'Pourquoi ce nom vous convient',
    noName: 'Aucun nom généré', genFailed: 'Échec de la génération',
    shareTitle: 'Mon nom chinois', shareCopied: 'Contenu de partage copié dans le presse-papiers',
    sharePrefix: 'Mon nom chinois est', shareSuffix: 'Obtenez votre propre nom chinois !',
    pinyinTool: 'Convertisseur Pinyin', pinyinToolDesc: 'Convertissez le chinois en pinyin standard, consultez les traits et la segmentation.',
    charCounterTool: 'Compteur de caractères chinois', charCounterToolDesc: 'Comptez précisément les caractères chinois, anglais, chiffres, ponctuation, lignes et total.',
    article1Title: 'Top 10 des noms composés chinois', article1Desc: 'Explorez les origines des noms composés Ouyang, Zhuge, Shangguan, Sima.',
    article2Title: 'Tendances de nomination en Chine', article2Desc: 'Découvrez l\'évolution des noms chinois des années 60 aux années 2020.',
    article3Title: 'Comment les stars occidentales ont obtenu leurs surnoms chinois', article3Desc: 'Explorez comment les internautes chinois créent des surnoms pour les stars internationales.',
  },
  es: {
    cardTitle: '- Tarjeta china', zodiac: 'Zodiaco', lucky: 'Número de la suerte', elements: 'Cinco Elementos',
    whyFit: '¿Por qué este nombre te conviene?', nameAnalysis: 'Análisis del nombre', write: 'Escribir',
    like: 'Me gusta', dislike: 'No me gusta', saveImage: 'Guardar imagen', shareX: 'Compartir en X',
    copy: 'Copiar', copied: 'Copiado', saving: 'Guardando...', viewDetails: 'Ver detalles',
    hideDetails: 'Ocultar detalles', regenerateHint: '💡 ¿No satisfecho? Modifica la información y regenera',
    footer: 'Guía de viaje China',
    aiRecommended: 'Nombres recomendados por IA', charDetail: 'Análisis carácter por carácter',
    wuxingAnalysis: 'Análisis de los Cinco Elementos', source: 'Fuente', whyFitDetail: 'Por qué este nombre te conviene',
    noName: 'No se generaron nombres', genFailed: 'Error en la generación',
    shareTitle: 'Mi nombre chino', shareCopied: 'Contenido para compartir copiado al portapapeles',
    sharePrefix: 'Mi nombre chino es', shareSuffix: '¡Obtén tu propio nombre chino!',
    pinyinTool: 'Conversor de Pinyin', pinyinToolDesc: 'Convierte chino a pinyin estándar, consulta trazos y segmentación.',
    charCounterTool: 'Contador de caracteres chinos', charCounterToolDesc: 'Cuenta con precisión caracteres chinos, ingleses, números, puntuación, líneas y total.',
    article1Title: 'Top 10 apellidos compuestos chinos', article1Desc: 'Explora los orígenes de los apellidos Ouyang, Zhuge, Shangguan, Sima.',
    article2Title: 'Tendencias de nombres en China', article2Desc: 'Descubre la evolución de los nombres chinos desde los años 60 hasta los 2020.',
    article3Title: 'Cómo las estrellas occidentales obtuvieron sus apodos chinos', article3Desc: 'Explora cómo los internautas chinos crean apodos para las estrellas internacionales.',
  },
  de: {
    cardTitle: '- Chinesische Karte', zodiac: 'Tierkreis', lucky: 'Glückszahl', elements: 'Fünf Elemente',
    whyFit: 'Warum passt dieser Name zu Ihnen?', nameAnalysis: 'Namensanalyse', write: 'Schreiben',
    like: 'Gefällt mir', dislike: 'Gefällt mir nicht', saveImage: 'Bild speichern', shareX: 'Auf X teilen',
    copy: 'Kopieren', copied: 'Kopiert', saving: 'Speichere...', viewDetails: 'Details anzeigen',
    hideDetails: 'Details ausblenden', regenerateHint: '💡 Nicht zufrieden? Ändern Sie Ihre Daten und generieren Sie erneut',
    footer: 'China-Reiseführer',
    aiRecommended: 'KI-empfohlene Namen', charDetail: 'Zeichenanalyse',
    wuxingAnalysis: 'Fünf-Elemente-Analyse', source: 'Quelle', whyFitDetail: 'Warum dieser Name zu Ihnen passt',
    noName: 'Kein Name generiert', genFailed: 'Generierung fehlgeschlagen',
    shareTitle: 'Mein chinesischer Name', shareCopied: 'Freigabeinhalt in die Zwischenablage kopiert',
    sharePrefix: 'Mein chinesischer Name ist', shareSuffix: 'Holen Sie sich Ihren eigenen chinesischen Namen!',
    pinyinTool: 'Pinyin-Konverter', pinyinToolDesc: 'Konvertieren Sie Chinesisch in Standard-Pinyin, zeigen Sie Striche und Segmentierung an.',
    charCounterTool: 'Chinesisch-Zeichenzähler', charCounterToolDesc: 'Zählen Sie genau chinesische Zeichen, Englisch, Zahlen, Interpunktion, Zeilen und Gesamtanzahl.',
    article1Title: 'Top 10 chinesische Doppelnamen', article1Desc: 'Erkunden Sie die Ursprünge der Doppelnamen Ouyang, Zhuge, Shangguan, Sima.',
    article2Title: 'Namensgebungstrends in China', article2Desc: 'Entdecken Sie die Entwicklung chinesischer Namen von den 60er bis zu den 2020er Jahren.',
    article3Title: 'Wie westliche Stars zu ihren chinesischen Spitznamen kamen', article3Desc: 'Erkunden Sie, wie chinesische Internetnutzer Spitznamen für internationale Stars kreieren.',
  },
  ru: {
    cardTitle: '- Китайская карточка', zodiac: 'Зодиак', lucky: 'Счастливое число', elements: 'Пять элементов',
    whyFit: 'Почему это имя вам подходит?', nameAnalysis: 'Анализ имени', write: 'Написать',
    like: 'Нравится', dislike: 'Не нравится', saveImage: 'Сохранить', shareX: 'Поделиться в X',
    copy: 'Копировать', copied: 'Скопировано', saving: 'Сохранение...', viewDetails: 'Подробнее',
    hideDetails: 'Скрыть', regenerateHint: '💡 Не довольны? Измените данные и сгенерируйте снова',
    footer: 'Путеводитель по Китаю',
    aiRecommended: 'Имена, рекомендованные ИИ', charDetail: 'Анализ по иероглифам',
    wuxingAnalysis: 'Анализ Пяти элементов', source: 'Источник', whyFitDetail: 'Почему это имя вам подходит',
    noName: 'Имя не сгенерировано', genFailed: 'Ошибка генерации',
    shareTitle: 'Моё китайское имя', shareCopied: 'Содержимое для обмена скопировано в буфер',
    sharePrefix: 'Моё китайское имя —', shareSuffix: 'Получите своё китайское имя!',
    pinyinTool: 'Конвертер пиньинь', pinyinToolDesc: 'Конвертируйте китайский в стандартный пиньинь, просматривайте черты и сегментацию.',
    charCounterTool: 'Счётчик китайских символов', charCounterToolDesc: 'Точный подсчёт китайских иероглифов, английских букв, цифр, пунктуации, строк и общего количества.',
    article1Title: 'Топ-10 китайских двойных фамилий', article1Desc: 'Исследуйте происхождение двойных фамилий Оуян, Чжугэ, Шангуань, Сыма.',
    article2Title: 'Тренды именин в Китае', article2Desc: 'Откройте для себя эволюцию китайских имён от 60-х до 2020-х годов.',
    article3Title: 'Как западные звёзды получили свои китайские прозвища', article3Desc: 'Исследуйте, как китайские пользователи создают прозвища для международных звёзд.',
  },
  it: {
    cardTitle: '- Carta cinese', zodiac: 'Zodiaco', lucky: 'Numero fortunato', elements: 'Cinque Elementi',
    whyFit: 'Perché questo nome ti si addice?', nameAnalysis: 'Analisi del nome', write: 'Scrivere',
    like: 'Mi piace', dislike: 'Non mi piace', saveImage: 'Salva immagine', shareX: 'Condividi su X',
    copy: 'Copia', copied: 'Copiato', saving: 'Salvataggio...', viewDetails: 'Vedi dettagli',
    hideDetails: 'Nascondi dettagli', regenerateHint: '💡 Non soddisfatto? Modifica le informazioni e rigenera',
    footer: 'Guida di viaggio Cina',
    aiRecommended: 'Nomi consigliati dall\'IA', charDetail: 'Analisi carattere per carattere',
    wuxingAnalysis: 'Analisi dei Cinque Elementi', source: 'Fonte', whyFitDetail: 'Perché questo nome ti si addice',
    noName: 'Nessun nome generato', genFailed: 'Generazione fallita',
    shareTitle: 'Il mio nome cinese', shareCopied: 'Contenuto di condivisione copiato negli appunti',
    sharePrefix: 'Il mio nome cinese è', shareSuffix: 'Ottieni il tuo nome cinese!',
    pinyinTool: 'Convertitore Pinyin', pinyinToolDesc: 'Converti il cinese in pinyin standard, visualizza tratti e segmentazione.',
    charCounterTool: 'Contatore di caratteri cinesi', charCounterToolDesc: 'Contare con precisione caratteri cinesi, inglesi, numeri, punteggiatura, righe e totale.',
    article1Title: 'Top 10 cognomi composti cinesi', article1Desc: 'Esplora le origini dei cognomi Ouyang, Zhuge, Shangguan, Sima.',
    article2Title: 'Tendenze di nomi in Cina', article2Desc: 'Scopri l\'evoluzione dei nomi cinesi dagli anni 60 ai 2020.',
    article3Title: 'Come le star occidentali hanno ottenuto i loro soprannomi cinesi', article3Desc: 'Esplora come gli internauti cinesi creano soprannomi per le star internazionali.',
  },
};

function getUILabels(lang: string) {
  const fallback = {
    cardTitle: "'s Chinese Card", zodiac: 'Zodiac', lucky: 'Lucky', elements: 'Elements',
    whyFit: 'Why it fits you?', nameAnalysis: 'Name Analysis', write: 'Write',
    like: 'Like', dislike: 'Dislike', saveImage: 'Save Image', shareX: 'Share to X',
    copy: 'Copy', copied: 'Copied', saving: 'Saving...', viewDetails: 'View details',
    hideDetails: 'Hide details', regenerateHint: '💡 Not satisfied? Modify and regenerate',
    footer: 'China Travel Guide',
    aiRecommended: 'AI Recommended Names', charDetail: 'Character Analysis',
    wuxingAnalysis: 'Five Elements Analysis', source: 'Source', whyFitDetail: 'Why This Name Fits You',
    noName: 'No names generated', genFailed: 'Generation failed',
    shareTitle: 'My Chinese Name', shareCopied: 'Share content copied to clipboard',
    sharePrefix: 'My Chinese name is', shareSuffix: 'Get your own Chinese name!',
    pinyinTool: 'Pinyin Converter', pinyinToolDesc: 'Convert any Chinese to standard pinyin, view strokes and segmentation.',
    charCounterTool: 'Chinese Character Counter', charCounterToolDesc: 'Accurately count Chinese characters, English, numbers, punctuation, lines and total characters.',
    article1Title: 'Top 10 Chinese Compound Surnames', article1Desc: 'Explore the origins of famous compound surnames like Ouyang, Zhuge, Shangguan, Sima.',
    article2Title: 'Chinese Baby Naming Trends', article2Desc: 'Discover the evolution of Chinese names from the 1960s to 2020s.',
    article3Title: 'How Western Celebrities Got Their Chinese Nicknames', article3Desc: 'Explore how Chinese netizens create Chinese nicknames for international stars.',
  };
  return UI_LABELS[lang] || fallback;
}

interface RelatedArticle {
  id: string;
  title: string;
  title_en?: string;
  title_ja?: string;
  title_ko?: string;
  title_tw?: string;
  subtitle?: string;
  subtitle_en?: string;
  subtitle_ja?: string;
  subtitle_ko?: string;
  subtitle_tw?: string;
  thumbnail?: string;
  category?: string;
}

export default function NameGenerator({ skipHero, relatedArticles }: { skipHero?: boolean; relatedArticles?: RelatedArticle[] }) {
  const { t, language } = useLanguage();
  const labels = getUILabels(language);
  const [formData, setFormData] = useState({ name: '', sex: '男', dob: '', info: '' });
  const [results, setResults] = useState<NameResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [likedCards, setLikedCards] = useState<Record<number, boolean>>({});
  const [dislikedCards, setDislikedCards] = useState<Record<number, boolean>>({});
  const [savingCard, setSavingCard] = useState<number | null>(null);
  const [writingCharIdx, setWritingCharIdx] = useState<{ cardIdx: number; charIdx: number } | null>(null);
  const [copiedBtn, setCopiedBtn] = useState<string | null>(null);
  const [speakingBtn, setSpeakingBtn] = useState<string | null>(null);
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const writerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const writerInstanceRefs = useRef<Record<string, any>>({});

  // Speech synthesis
  const speakText = useCallback((textToSpeak: string, lang?: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const hasChinese = /[\u4e00-\u9fa5]/.test(textToSpeak);
    utterance.lang = lang || (hasChinese ? 'zh-CN' : 'en-US');
    utterance.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(utterance.lang));
    if (matchedVoice) utterance.voice = matchedVoice;
    utterance.onend = () => setSpeakingBtn(null);
    window.speechSynthesis.speak(utterance);
  }, []);

  // Copy with animation
  const handleAnimatedCopy = useCallback(async (text: string, btnId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBtn(btnId);
      setTimeout(() => setCopiedBtn(null), 1500);
    } catch {}
  }, []);

  // HanziWriter effect - inline writing
  useEffect(() => {
    if (!writingCharIdx) return;
    const key = `${writingCharIdx.cardIdx}-${writingCharIdx.charIdx}`;
    const container = writerRefs.current[key];
    if (!container) return;

    // Find the character data
    const nameResult = results?.[writingCharIdx.cardIdx];
    if (!nameResult) return;
    const charData = nameResult.charAnalysis?.[writingCharIdx.charIdx];
    const char = charData?.char || nameResult.chinese[writingCharIdx.charIdx] || '';

    container.innerHTML = '';
    writerInstanceRefs.current[key] = null;

    if (!char) return;

    const writer = HanziWriter.create(container, char, {
      width: 64,
      height: 64,
      padding: 2,
      showOutline: true,
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 200,
      strokeColor: '#1b887a',
      outlineColor: '#d1d5db',
      drawingColor: '#1b887a',
      radicalColor: '#16816c',
      highlightColor: '#a3e4db',
      showCharacter: false,
      highlightOnComplete: true,
      charDataLoader: (charToLoad: string, onComplete: (data: any) => void, onError: (err?: any) => void) => {
        fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${charToLoad}.json`)
          .then(res => {
            if (!res.ok) throw new Error('Not found');
            return res.json();
          })
          .then(data => onComplete(data))
          .catch((err) => onError(err));
      },
    });

    writerInstanceRefs.current[key] = writer;

    const timer = setTimeout(() => {
      writer.animateCharacter({
        onComplete: () => {
          // After animation completes, show the character and keep the outline
          setTimeout(() => {
            writer.showCharacter();
          }, 300);
        },
      });
    }, 200);

    return () => {
      clearTimeout(timer);
      if (container) container.innerHTML = '';
      delete writerInstanceRefs.current[key];
    };
  }, [writingCharIdx, results]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);
    try {
      const response = await fetch('/api/name-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          sex: formData.sex,
          dob: formData.dob,
          info: formData.info,
          lang: language,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${response.status}`);
      }

      const data: NameResponse = await response.json();
      if (data.names && data.names.length > 0) {
        setResults(data.names);
      } else {
        throw new Error(labels.noName);
      }
    } catch (error: any) {
      console.error(error);
      alert(`${labels.genFailed}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getWuxingConfig = (element: string) => {
    const key = element.replace(/[金木水火土]/g, m => m);
    return WUXING_CONFIG[key] || WUXING_CONFIG['金'];
  };

  const handleSaveImage = useCallback(async (idx: number) => {
    const el = cardRefs.current[idx];
    if (!el) return;
    setSavingCard(idx);

    // Remember current writing state and reset for clean screenshot
    const prevWriting = writingCharIdx;
    const isWritingThisCard = prevWriting?.cardIdx === idx;
    if (isWritingThisCard) {
      setWritingCharIdx(null);
    }

    // Wait for DOM to update (writing area reverts to static text)
    await new Promise(r => setTimeout(r, 100));

    try {
      const dataUrl = await toPng(el, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#faf9f7',
        cacheBust: true,
        skipFonts: true,
        fontEmbedCSS: '',
        imagePlaceholder: undefined,
      });
      if (!dataUrl || dataUrl === 'data:,') {
        throw new Error('Generated empty image');
      }
      const link = document.createElement('a');
      link.download = `chinese-name-card-${results?.[idx]?.chinese || idx}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err: any) {
      console.error('Save image failed:', err?.message || err);
      alert('Save image failed, please try again.');
    } finally {
      // Restore writing state
      if (isWritingThisCard && prevWriting) {
        setWritingCharIdx(prevWriting);
      }
      setSavingCard(null);
    }
  }, [results, writingCharIdx]);

  const handleShare = useCallback(async (idx: number) => {
    const nameResult = results?.[idx];
    if (!nameResult) return;
    const shareText = language === 'zh' || language === 'tw'
      ? `${labels.sharePrefix}「${nameResult.chinese}」(${nameResult.pinyin})，${ZODIAC_MAP[nameResult.zodiac || '']?.cn || nameResult.zodiac}${labels.zodiac}，${labels.wuxingAnalysis}${nameResult.wuxing?.element}，${labels.lucky}${nameResult.luckyNumber}。${labels.shareSuffix}`
      : `${labels.sharePrefix} "${nameResult.chinese}" (${nameResult.pinyin}), ${labels.zodiac}: ${nameResult.zodiac}, ${labels.elements}: ${nameResult.wuxing?.element}, ${labels.lucky}: ${nameResult.luckyNumber}. ${labels.shareSuffix}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: labels.shareTitle, text: shareText });
      } catch {}
    } else {
      await navigator.clipboard.writeText(shareText);
      alert(labels.shareCopied);
    }
  }, [results, language]);

  return (
    <>
      <div className="bg-[#f7f7f7] min-h-screen">

        {/* Hero Section */}
        {!skipHero && (
          <div
            className="relative h-[400px] flex items-end justify-center bg-cover bg-center pb-16"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1543097692-fa13c6cd8595?q=80&w=2670&auto=format&fit=crop)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/40" />
            <div className="relative text-center px-6 max-w-3xl mx-auto">
              <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">{t('tools.name.title')}</h1>
              <p className="text-white/80 text-lg font-medium leading-relaxed">{t('tools.name.subtitle')}</p>
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-12 mt-10 relative z-20">

          {/* Generator Form */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">{t('tools.name.formTitle')}</h2>
              <p className="text-gray-500 text-sm mt-1">{t('tools.name.formSubtitle')}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                    <svg className="w-4 h-4 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {t('tools.name.label.name')}
                  </label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1b887a] focus:border-transparent outline-none transition" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder={t('tools.name.label.namePlaceholder')} required />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                    <svg className="w-4 h-4 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4a4 4 0 100 8 4 4 0 000-8z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7m-3-3h6" />
                    </svg>
                    {t('tools.name.label.gender')}
                  </label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1b887a] focus:border-transparent outline-none transition bg-white" value={formData.sex} onChange={e => setFormData({ ...formData, sex: e.target.value })}>
                    <option value="">{t('tools.name.label.genderSelect')}</option>
                    <option value="男">{t('tools.name.label.genderMale')}</option>
                    <option value="女">{t('tools.name.label.genderFemale')}</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                    <svg className="w-4 h-4 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {t('tools.name.label.dob')}
                  </label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1b887a] focus:border-transparent outline-none transition" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
                </div>
              </div>
              <div className="mb-4">
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <svg className="w-4 h-4 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t('tools.name.label.info')}
                </label>
                <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1b887a] focus:border-transparent outline-none transition resize-none" rows={3} value={formData.info} onChange={e => setFormData({ ...formData, info: e.target.value })} placeholder={t('tools.name.label.infoPlaceholder')}></textarea>
              </div>
              <button type="submit" className="w-full bg-[#1b887a] hover:bg-[#167a6a] text-white rounded-lg py-3.5 font-bold text-base transition flex items-center justify-center gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('tools.name.buttonLoading')}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {t('tools.name.button')}
                  </>
                )}
              </button>
            </form>

            {/* AI Results */}
            <AnimatePresence>
              {results && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-8 space-y-6"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-[#1b887a]" />
                    <h3 className="text-lg font-bold text-gray-900">
                      {labels.aiRecommended}
                    </h3>
                  </div>

                  {results.map((nameResult, idx) => {
                    const wuxingCfg = getWuxingConfig(nameResult.wuxing?.element || '金');
                    const WuxingIcon = wuxingCfg.icon;
                    const zodiacInfo = ZODIAC_MAP[nameResult.zodiac || ''];
                    // Use AI-returned labels with fallback to UI_LABELS
                    const aiLabels = nameResult.labels || {};
                    const lbl = {
                      zodiac: aiLabels.zodiac || labels.zodiac,
                      lucky: aiLabels.lucky || labels.lucky,
                      elements: aiLabels.elements || labels.elements,
                      whyFit: aiLabels.whyFit || labels.whyFit,
                      nameAnalysis: aiLabels.nameAnalysis || labels.nameAnalysis,
                      write: aiLabels.write || labels.write,
                    };

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.15 }}
                        className="space-y-3"
                      >
                        {/* Name Card - Chinese Style (Light Theme) */}
                        <div
                          ref={el => { cardRefs.current[idx] = el; }}
                          className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg"
                          style={{
                            background: 'linear-gradient(180deg, #faf9f7 0%, #f5f3ef 100%)',
                          }}
                        >
                          {/* Card Header */}
                          <div className="text-center py-4 border-b border-gray-100">
                            <h3 className="text-gray-800 text-lg font-bold tracking-wide">
                              【{formData.name || nameResult.surname}】{nameResult.cardTitle || labels.cardTitle}
                            </h3>
                          </div>

                          <div className="p-6">
                            {/* Middle Row: Writing + Info side by side */}
                            <div className="flex items-center gap-8 mb-5">
                              {/* Left: Character Writing Section + Vertical Play/Copy */}
                              <div className="flex items-center gap-3">
                                <div className="flex gap-4">

                                {nameResult.charAnalysis && nameResult.charAnalysis.length > 0 ? (
                                  nameResult.charAnalysis.map((char, cIdx) => {
                                    const writeKey = `${idx}-${cIdx}`;
                                    const isWriting = writingCharIdx?.cardIdx === idx && writingCharIdx?.charIdx === cIdx;
                                    return (
                                    <div key={cIdx} className="flex flex-col items-center">
                                      <span className="text-gray-500 text-sm mb-1 font-medium">{char.pinyin}</span>
                                      <div
                                        className="w-20 h-20 flex items-center justify-center border-2 rounded-lg mb-1.5 relative overflow-hidden"
                                        style={{ borderColor: isWriting ? '#1b887a' : '#4ade80', background: '#fff' }}
                                      >
                                        {isWriting ? (
                                          <div ref={el => { writerRefs.current[writeKey] = el; }} className="flex items-center justify-center" style={{ width: 64, height: 64 }} />
                                        ) : (
                                          <span className="text-4xl font-bold text-gray-800">{char.char}</span>
                                        )}
                                      </div>
                                      <button
                                        className={`flex items-center gap-0.5 text-xs transition-colors ${isWriting ? 'text-[#1b887a] font-medium' : 'text-gray-400 hover:text-gray-600'}`}
                                        onClick={() => {
                                          if (isWriting) {
                                            const w = writerInstanceRefs.current[writeKey];
                                            if (w) { w.hideCharacter(); w.animateCharacter({ onComplete: () => setTimeout(() => w.showCharacter(), 300) }); }
                                          } else {
                                            setWritingCharIdx({ cardIdx: idx, charIdx: cIdx });
                                          }
                                        }}
                                      >
                                        <PenTool className="w-3 h-3" />
                                        <span>{isWriting ? lbl.write + '...' : lbl.write}</span>
                                      </button>
                                    </div>
                                    );
                                  })
                                ) : (
                                  nameResult.chinese.split('').slice(0, 3).map((char, cIdx) => {
                                    const writeKey = `${idx}-${cIdx}`;
                                    const isWriting = writingCharIdx?.cardIdx === idx && writingCharIdx?.charIdx === cIdx;
                                    return (
                                    <div key={cIdx} className="flex flex-col items-center">
                                      <span className="text-gray-500 text-sm mb-1">&nbsp;</span>
                                      <div
                                        className="w-20 h-20 flex items-center justify-center border-2 rounded-lg mb-1.5 relative overflow-hidden"
                                        style={{ borderColor: isWriting ? '#1b887a' : '#4ade80', background: '#fff' }}
                                      >
                                        {isWriting ? (
                                          <div ref={el => { writerRefs.current[writeKey] = el; }} className="flex items-center justify-center" style={{ width: 64, height: 64 }} />
                                        ) : (
                                          <span className="text-4xl font-bold text-gray-800">{char}</span>
                                        )}
                                      </div>
                                      <button
                                        className={`flex items-center gap-0.5 text-xs transition-colors ${isWriting ? 'text-[#1b887a] font-medium' : 'text-gray-400 hover:text-gray-600'}`}
                                        onClick={() => {
                                          if (isWriting) {
                                            const w = writerInstanceRefs.current[writeKey];
                                            if (w) { w.hideCharacter(); w.animateCharacter({ onComplete: () => setTimeout(() => w.showCharacter(), 300) }); }
                                          } else {
                                            setWritingCharIdx({ cardIdx: idx, charIdx: cIdx });
                                          }
                                        }}
                                      >
                                        <PenTool className="w-3 h-3" />
                                        <span>{isWriting ? lbl.write + '...' : lbl.write}</span>
                                      </button>
                                    </div>
                                    );
                                  })
                                )}
                              </div>

                              {/* Vertical Play & Copy Buttons */}
                              <div className="flex flex-col items-center gap-3">
                                <button
                                  onClick={() => {
                                    const btnId = `speak-name-${idx}`;
                                    setSpeakingBtn(btnId);
                                    speakText(nameResult.chinese);
                                  }}
                                  className="w-10 h-10 rounded-full bg-[#1b887a]/10 flex items-center justify-center hover:bg-[#1b887a]/20 transition"
                                >
                                  <Volume2 className={`w-5 h-5 ${speakingBtn === `speak-name-${idx}` ? 'text-[#1b887a]' : 'text-gray-500'}`} />
                                </button>
                                <button
                                  onClick={() => handleAnimatedCopy(nameResult.chinese, `copy-name-${idx}`)}
                                  className="w-10 h-10 rounded-full bg-[#1b887a]/10 flex items-center justify-center hover:bg-[#1b887a]/20 transition"
                                >
                                  {copiedBtn === `copy-name-${idx}` ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-500" />}
                                </button>
                              </div>
                              </div>

                              {/* Divider */}
                              <div className="w-px h-32 bg-gray-300 flex-shrink-0"></div>

                              {/* Right: Zodiac | Lucky Number | Wuxing in one row */}
                              <div className="flex items-center gap-5">
                                {/* Zodiac */}
                                {zodiacInfo && (
                                  <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-1.5 shadow-sm">
                                      <span className="text-4xl">{zodiacInfo.emoji}</span>
                                    </div>
                                    <span className="text-gray-700 text-sm font-semibold">{zodiacInfo[language === 'ja' ? 'ja' : language === 'ko' ? 'ko' : language === 'tw' ? 'cn' : 'en']}</span>
                                    <span className="text-gray-400 text-xs">{lbl.zodiac}</span>
                                  </div>
                                )}

                                {/* Lucky Number */}
                                {nameResult.luckyNumber && (
                                  <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-1.5 shadow-sm">
                                      <span className="text-3xl font-bold text-green-600">{nameResult.luckyNumber}</span>
                                    </div>
                                    <span className="text-gray-400 text-xs">{lbl.lucky}</span>
                                  </div>
                                )}

                                {/* Wuxing Radar Chart */}
                                {nameResult.wuxing?.element && (
                                  <div className="flex flex-col items-center">
                                    <div className="relative w-20 h-20 mb-1.5">
                                      <svg viewBox="0 0 60 60" className="w-full h-full">
                                        <polygon points="30,5 55,20 47,50 13,50 5,20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                                        <polygon points="30,15 45,25 40,42 20,42 15,25" fill="rgba(74, 222, 128, 0.2)" stroke="#4ade80" strokeWidth="1.5" />
                                        <text x="30" y="12" textAnchor="middle" fontSize="8" fill="#6b7280">金</text>
                                        <text x="52" y="22" textAnchor="middle" fontSize="8" fill="#6b7280">木</text>
                                        <text x="42" y="55" textAnchor="middle" fontSize="8" fill="#6b7280">水</text>
                                        <text x="18" y="55" textAnchor="middle" fontSize="8" fill="#6b7280">火</text>
                                        <text x="8" y="22" textAnchor="middle" fontSize="8" fill="#6b7280">土</text>
                                      </svg>
                                    </div>
                                    <span className="text-gray-700 text-sm font-semibold">{nameResult.wuxing.element}</span>
                                    <span className="text-gray-400 text-xs">{lbl.elements}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Why Fit Section - Green text style */}
                            {nameResult.whyFit && (
                              <div className="mt-6">
                                <h4 className="text-green-600 text-sm font-medium mb-2">
                                  {lbl.whyFit}
                                </h4>
                                <div className="bg-green-50/50 rounded-lg p-3 border border-green-100">
                                  <p className="text-green-700 text-xs leading-relaxed">{nameResult.whyFit}</p>
                                </div>
                              </div>
                            )}

                            {/* Name Analysis Section */}
                            {(nameResult.meaning || nameResult.charAnalysis) && (
                              <div className="mt-4">
                                <h4 className="text-gray-700 text-sm font-medium mb-2">
                                  {lbl.nameAnalysis}
                                </h4>
                                <div className="space-y-2">
                                  {nameResult.meaning && (
                                    <p className="text-gray-600 text-xs leading-relaxed">{nameResult.meaning}</p>
                                  )}
                                  {nameResult.charAnalysis && nameResult.charAnalysis.length > 0 && (
                                    <div className="space-y-1">
                                      {nameResult.charAnalysis.map((char, cIdx) => (
                                        <p key={cIdx} className="text-gray-600 text-xs leading-relaxed">
                                          <span className="font-medium text-gray-800">{char.char}</span>：{char.meaning}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-gray-400 text-xs">tripcngo.com</span>
                            <div className="flex items-center gap-1.5">
                              <img src="/logo1.png" alt="logo" className="w-4 h-4 object-contain" />
                              <span className="text-gray-400 text-xs">{labels.footer}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 md:flex items-center justify-center gap-4 md:gap-6 py-3">
                          <button
                            onClick={() => setLikedCards(prev => ({ ...prev, [idx]: !prev[idx] }))}
                            className="flex items-center gap-1.5 text-sm transition-colors"
                          >
                            <ThumbsUp className={`w-4 h-4 ${likedCards[idx] ? 'text-green-600 fill-green-600' : 'text-gray-400'}`} />
                            <span className={likedCards[idx] ? 'text-green-600 font-medium' : 'text-gray-400'}>{labels.like}</span>
                          </button>
                          <button
                            onClick={() => setDislikedCards(prev => ({ ...prev, [idx]: !prev[idx] }))}
                            className="flex items-center gap-1.5 text-sm transition-colors"
                          >
                            <ThumbsDown className={`w-4 h-4 ${dislikedCards[idx] ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                            <span className={dislikedCards[idx] ? 'text-red-500 font-medium' : 'text-gray-400'}>{labels.dislike}</span>
                          </button>
                          <button
                            onClick={() => handleSaveImage(idx)}
                            disabled={savingCard === idx}
                            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50"
                          >
                            {savingCard === idx ? (
                              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                            <span>{savingCard === idx ? labels.saving : labels.saveImage}</span>
                          </button>
                          <button
                            onClick={() => handleShare(idx)}
                            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-500 transition-colors"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                            <span>{labels.shareX}</span>
                          </button>
                        </div>

                        {/* Expanded Detail (click to toggle) */}
                        <div
                          className="cursor-pointer"
                          onClick={() => setExpandedCard(expandedCard === idx ? null : idx)}
                        >
                          <div className="flex items-center justify-center py-2">
                            <span className="text-xs text-[#1b887a] font-medium flex items-center gap-1">
                              {expandedCard === idx ? labels.hideDetails : labels.viewDetails}
                              {expandedCard === idx ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </span>
                          </div>
                        </div>

                        <AnimatePresence>
                          {expandedCard === idx && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 space-y-4 bg-white border rounded-xl">
                                {/* Character Analysis */}
                                {nameResult.charAnalysis && nameResult.charAnalysis.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                                      <Zap className="w-4 h-4 text-[#1b887a]" />
                                      {labels.charDetail}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {nameResult.charAnalysis.map((char, cIdx) => {
                                        const charWuxing = getWuxingConfig(char.wuxing || '金');
                                        const CharIcon = charWuxing.icon;
                                        return (
                                          <div key={cIdx} className={`${charWuxing.bg} border ${charWuxing.border} rounded-xl p-4`}>
                                            <div className="flex items-center gap-3 mb-2">
                                              <span className="text-2xl font-black text-gray-900">{char.char}</span>
                                              <div>
                                                <span className="text-sm font-medium text-gray-700">{char.pinyin}</span>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                  <CharIcon className={`w-3 h-3 ${charWuxing.color}`} />
                                                  <span className={`text-xs font-medium ${charWuxing.color}`}>{char.wuxingLabel || char.wuxing}</span>
                                                </div>
                                              </div>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-1">{char.meaning}</p>
                                            {char.source && char.source !== '无特定出处' && char.source !== 'No specific source' && (
                                              <p className="text-xs text-gray-400 italic">{labels.source}: {char.source}</p>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* Wu Xing Explanation */}
                                {nameResult.wuxing?.explanation && (
                                  <div className={`${wuxingCfg.bg} border ${wuxingCfg.border} rounded-xl p-4`}>
                                    <div className="flex items-center gap-2 mb-2">
                                      <WuxingIcon className={`w-5 h-5 ${wuxingCfg.color}`} />
                                      <span className="font-bold text-gray-700">
                                        {labels.wuxingAnalysis} · {nameResult.wuxing.element}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">{nameResult.wuxing.explanation}</p>
                                  </div>
                                )}

                                {/* Why Fit */}
                                {nameResult.whyFit && (
                                  <div className="bg-gradient-to-r from-[#1b887a]/5 to-[#1b887a]/10 border border-[#1b887a]/20 rounded-xl p-4">
                                    <h4 className="font-bold text-[#1b887a] mb-2 flex items-center gap-1.5">
                                      <Star className="w-4 h-4" />
                                      {labels.whyFitDetail}
                                    </h4>
                                    <p className="text-sm text-gray-700 leading-relaxed">{nameResult.whyFit}</p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Separator */}
                        {idx < results.length - 1 && (
                          <div className="h-px mt-3" style={{ background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)' }} />
                        )}
                      </motion.div>
                    );
                  })}

                  {/* Regenerate Hint */}
                  <p className="text-center text-xs text-gray-400 pt-2">
                    {labels.regenerateHint}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Why */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t('tools.name.whyTitle')}</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-4">
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2">{t('tools.name.whyBasicTitle')}</h3>
                  <p className="text-sm text-gray-600 mb-3">{t('tools.name.whyBasicDesc')}</p>
                  <ul className="space-y-2">
                    {[
                      t('tools.name.whyBasic1'),
                      t('tools.name.whyBasic2'),
                      t('tools.name.whyBasic3')
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-[#1b887a] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2">{t('tools.name.whyBeyondTitle')}</h3>
                  <p className="text-sm text-gray-600 mb-3">{t('tools.name.whyBeyondDesc')}</p>
                  <ul className="space-y-2">
                    {[
                      t('tools.name.whyBeyond1'),
                      t('tools.name.whyBeyond2'),
                      t('tools.name.whyBeyond3')
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-[#1b887a] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">{t('tools.name.structureTitle')}</h3>
                <p className="text-sm text-gray-600 mb-4">{t('tools.name.structureDesc')}</p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#1b887a]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{t('tools.name.structure.surname')}</p>
                      <p className="text-xs text-gray-500">{t('tools.name.structure.surnameDesc')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#1b887a]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{t('tools.name.structure.givenName')}</p>
                      <p className="text-xs text-gray-500">{t('tools.name.structure.givenNameDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">{t('tools.name.howTitle')}</h2>
            <p className="text-gray-500 text-center mb-8">{t('tools.name.howSubtitle')}</p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-100 text-center">
                <div className="w-12 h-12 bg-[#1b887a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t('tools.name.howStep1Title')}</h3>
                <p className="text-sm text-gray-500">{t('tools.name.howStep1Desc')}</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100 text-center">
                <div className="w-12 h-12 bg-[#1b887a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t('tools.name.howStep2Title')}</h3>
                <p className="text-sm text-gray-500">{t('tools.name.howStep2Desc')}</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100 text-center">
                <div className="w-12 h-12 bg-[#1b887a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t('tools.name.howStep3Title')}</h3>
                <p className="text-sm text-gray-500">{t('tools.name.howStep3Desc')}</p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-center">{t('tools.name.faqTitle')}</h2>
            <div className="bg-white p-6 rounded shadow-sm border space-y-4">
              {[0, 1, 2, 3, 4].map((faqIdx) => (
                <div key={faqIdx}>
                  {expandedFaq === faqIdx && <p className="text-gray-600 text-sm mb-2">{t(`tools.name.faq.a${faqIdx + 1}`)}</p>}
                  <button className="w-full text-left flex justify-between items-center border-b pb-2" onClick={() => setExpandedFaq(expandedFaq === faqIdx ? null : faqIdx)}>
                    {t(`tools.name.faq.q${faqIdx + 1}`)} {expandedFaq === faqIdx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Case Studies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">{t('tools.name.caseTitle')}</h2>
            <p className="text-gray-500 text-center mb-8">{t('tools.name.caseSubtitle')}</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: "진나래", cn: "金芮琳", py: "Jīn Ruì Lín" },
                { name: "Мубарак Диана", cn: "穆迪娅", py: "Mù Dí Yà" },
                { name: "Мейрамбекова Балжан", cn: "梅兰珍", py: "Méi Lán Zhēn" },
                { name: "박시호 siho park", cn: "朴诗涵", py: "Pǔ Shī Hán" },
                { name: "민은율", cn: "闵恩律", py: "Mǐn Ēn Lǜ" },
                { name: "송의담", cn: "宋奕丹", py: "Sòng Yì Dān" },
                { name: "Abdul Kader. BAYNES", cn: "白凯哲", py: "Bái Kǎi Zhé" },
                { name: "Mulberry Rain", cn: "祁雨盈", py: "Qí Yǔ Yíng" },
                { name: "Mulberry Rain", cn: "祁雨琳", py: "Qí Yǔ Lín" },
                { name: "Aurora Klesh E. Barrios", cn: "柏若曦", py: "Bǎi Ruò Xī" }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-400 truncate mb-1">{item.name}</p>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 bg-[#1b887a] rounded-full"></span>
                    <p className="font-bold text-lg text-gray-900">{item.cn}</p>
                  </div>
                  <p className="text-xs text-gray-400">{item.py}</p>
                </div>
              ))}
            </div>
          </section>

          {/* More Tools */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('tools.name.moreTitle')}</h2>
            <p className="text-gray-500 mb-8">{t('tools.name.moreSubtitle')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a href={`/${language === 'zh' ? 'cn' : language}/tools/pinyin-segmentation`} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer block">
                <div className="w-10 h-10 bg-[#1b887a]/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{labels.pinyinTool}</h3>
                <p className="text-sm text-gray-500">{labels.pinyinToolDesc}</p>
              </a>
              <a href={`/${language === 'zh' ? 'cn' : language}/tools/character-counter`} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer block">
                <div className="w-10 h-10 bg-[#1b887a]/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-[#1b887a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{labels.charCounterTool}</h3>
                <p className="text-sm text-gray-500">{labels.charCounterToolDesc}</p>
              </a>
            </div>
          </section>

          {/* Articles */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{t('tools.name.articleTitle')}</h2>
              <a href={`/${language === 'zh' ? 'cn' : language}/articles`} className="text-[#1b887a] text-sm hover:underline">{t('tools.name.articleMore')}</a>
            </div>
            <p className="text-gray-500 mb-8">{t('tools.name.articleDesc')}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(relatedArticles && relatedArticles.length > 0 ? relatedArticles.slice(0, 3) : [
                { id: '', title: labels.article1Title, subtitle: labels.article1Desc },
                { id: '', title: labels.article2Title, subtitle: labels.article2Desc },
                { id: '', title: labels.article3Title, subtitle: labels.article3Desc }
              ]).map((item, i) => {
                const langPrefix = language === 'zh' ? 'cn' : language;
                // Get i18n title/subtitle
                const displayTitle = language === 'zh' ? item.title
                  : language === 'tw' ? (item.title_tw || item.title)
                  : language === 'ja' ? (item.title_ja || item.title)
                  : language === 'ko' ? (item.title_ko || item.title)
                  : (item.title_en || item.title);
                const displaySubtitle = language === 'zh' ? (item.subtitle || '')
                  : language === 'tw' ? (item.subtitle_tw || item.subtitle || '')
                  : language === 'ja' ? (item.subtitle_ja || item.subtitle || '')
                  : language === 'ko' ? (item.subtitle_ko || item.subtitle || '')
                  : (item.subtitle_en || item.subtitle || '');

                return (
                  <a
                    key={i}
                    href={item.id ? `/${langPrefix}/articles/${item.id}` : '#'}
                    className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow block group"
                  >
                    <div className="h-40 overflow-hidden">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={displayTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1b887a] to-[#2a9d8f]"></div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-[#1b887a] transition-colors">{displayTitle}</h3>
                      {displaySubtitle && (
                        <p className="text-xs text-gray-500 line-clamp-3 mb-3">{displaySubtitle}</p>
                      )}
                      <span className="text-[#1b887a] text-xs">{t('tools.name.articleMoreLink')}</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        </div>
      </div>


    </>
  );
}
