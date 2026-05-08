import React, { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, CloudFog, Zap, Snowflake } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { zhCN, enUS, ja, ko, ru, de, fr, es, it, uk, pl, pt, nl, sv, vi, id, th, ms } from 'date-fns/locale';

interface WeatherWidgetProps {
  cityName: string;
  enCityName: string;
  language: string;
}

// 语言代码到 date-fns locale 的映射
const localeMap: Record<string, any> = {
  'zh': zhCN,
  'en': enUS,
  'ja': ja,
  'ko': ko,
  'ru': ru,
  'de': de,
  'fr': fr,
  'es': es,
  'it': it,
  'tw': zhCN, // 繁体中文使用简体中文 locale
};

const getWeatherIcon = (code: number, props: any) => {
  if (code <= 3) return <Sun {...props} className={"text-amber-300 " + props.className} />;
  if (code >= 45 && code <= 48) return <CloudFog {...props} className={"text-gray-300 " + props.className} />;
  if (code >= 51 && code <= 67) return <CloudRain {...props} className={"text-blue-300 " + props.className} />;
  if (code >= 71 && code <= 77) return <Snowflake {...props} className={"text-sky-200 " + props.className} />;
  if (code >= 80 && code <= 82) return <CloudRain {...props} className={"text-blue-400 " + props.className} />;
  if (code >= 95) return <Zap {...props} className={"text-yellow-400 " + props.className} />;
  return <Cloud {...props} className={"text-gray-300 " + props.className} />;
};

const getWeatherDesc = (code: number, language: string) => {
  const texts: Record<string, Record<number, string>> = {
    'zh': { 0: '晴朗', 1: '多云', 2: '多云', 3: '多云', 45: '雾', 48: '雾', 51: '雨', 53: '雨', 55: '雨', 61: '雨', 63: '雨', 65: '雨', 71: '雪', 73: '雪', 77: '雪', 80: '阵雨', 81: '阵雨', 82: '阵雨', 95: '雷暴', 96: '雷暴', 99: '雷暴' },
    'en': { 0: 'Clear', 1: 'Partly Cloudy', 2: 'Partly Cloudy', 3: 'Cloudy', 45: 'Fog', 48: 'Fog', 51: 'Rain', 53: 'Rain', 55: 'Rain', 61: 'Rain', 63: 'Rain', 65: 'Rain', 71: 'Snow', 73: 'Snow', 77: 'Snow', 80: 'Showers', 81: 'Showers', 82: 'Showers', 95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm' },
    'ja': { 0: '快晴', 1: '晴れ', 2: '晴れ', 3: '曇り', 45: '霧', 48: '霧', 51: '雨', 53: '雨', 55: '雨', 61: '雨', 63: '雨', 65: '雨', 71: '雪', 73: '雪', 77: '雪', 80: 'にわか雨', 81: 'にわか雨', 82: 'にわか雨', 95: '雷雨', 96: '雷雨', 99: '雷雨' },
    'ko': { 0: '맑음', 1: '구름조금', 2: '구름조금', 3: '흐림', 45: '안개', 48: '안개', 51: '비', 53: '비', 55: '비', 61: '비', 63: '비', 65: '비', 71: '눈', 73: '눈', 77: '눈', 80: '소나기', 81: '소나기', 82: '소나기', 95: '천둥번개', 96: '천둥번개', 99: '천둥번개' },
    'ru': { 0: 'Ясно', 1: 'Переменная облачность', 2: 'Переменная облачность', 3: 'Облачно', 45: 'Туман', 48: 'Туман', 51: 'Дождь', 53: 'Дождь', 55: 'Дождь', 61: 'Дождь', 63: 'Дождь', 65: 'Дождь', 71: 'Снег', 73: 'Снег', 77: 'Снег', 80: 'Ливень', 81: 'Ливень', 82: 'Ливень', 95: 'Гроза', 96: 'Гроза', 99: 'Гроза' },
    'de': { 0: 'Klar', 1: 'Teilweise bewölkt', 2: 'Teilweise bewölkt', 3: 'Bewölkt', 45: 'Nebel', 48: 'Nebel', 51: 'Regen', 53: 'Regen', 55: 'Regen', 61: 'Regen', 63: 'Regen', 65: 'Regen', 71: 'Schnee', 73: 'Schnee', 77: 'Schnee', 80: 'Schauer', 81: 'Schauer', 82: 'Schauer', 95: 'Gewitter', 96: 'Gewitter', 99: 'Gewitter' },
    'fr': { 0: 'Dégagé', 1: 'Partiellement nuageux', 2: 'Partiellement nuageux', 3: 'Nuageux', 45: 'Brouillard', 48: 'Brouillard', 51: 'Pluie', 53: 'Pluie', 55: 'Pluie', 61: 'Pluie', 63: 'Pluie', 65: 'Pluie', 71: 'Neige', 73: 'Neige', 77: 'Neige', 80: 'Averses', 81: 'Averses', 82: 'Averses', 95: 'Orage', 96: 'Orage', 99: 'Orage' },
    'es': { 0: 'Despejado', 1: 'Parcialmente nublado', 2: 'Parcialmente nublado', 3: 'Nublado', 45: 'Niebla', 48: 'Niebla', 51: 'Lluvia', 53: 'Lluvia', 55: 'Lluvia', 61: 'Lluvia', 63: 'Lluvia', 65: 'Lluvia', 71: 'Nieve', 73: 'Nieve', 77: 'Nieve', 80: 'Chubascos', 81: 'Chubascos', 82: 'Chubascos', 95: 'Tormenta', 96: 'Tormenta', 99: 'Tormenta' },
    'it': { 0: 'Sereno', 1: 'Parzialmente nuvoloso', 2: 'Parzialmente nuvoloso', 3: 'Nuvoloso', 45: 'Nebbia', 48: 'Nebbia', 51: 'Pioggia', 53: 'Pioggia', 55: 'Pioggia', 61: 'Pioggia', 63: 'Pioggia', 65: 'Pioggia', 71: 'Neve', 73: 'Neve', 77: 'Neve', 80: 'Rovesci', 81: 'Rovesci', 82: 'Rovesci', 95: 'Temporale', 96: 'Temporale', 99: 'Temporale' },
    'tw': { 0: '晴朗', 1: '多雲', 2: '多雲', 3: '多雲', 45: '霧', 48: '霧', 51: '雨', 53: '雨', 55: '雨', 61: '雨', 63: '雨', 65: '雨', 71: '雪', 73: '雪', 77: '雪', 80: '陣雨', 81: '陣雨', 82: '陣雨', 95: '雷暴', 96: '雷暴', 99: '雷暴' },
  };
  
  const langTexts = texts[language] || texts['zh'];
  return langTexts[code] || langTexts[0];
};

export default function WeatherWidget({ cityName, enCityName, language = 'zh' }: WeatherWidgetProps) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [timezone, setTimezone] = useState('Asia/Shanghai');
  
  // 语言到 locale 的映射（使用 Intl locale 字符串）
  const intlLocaleMap: Record<string, string> = {
    'zh': 'zh-CN',
    'en': 'en-US',
    'ja': 'ja-JP',
    'ko': 'ko-KR',
    'ru': 'ru-RU',
    'de': 'de-DE',
    'fr': 'fr-FR',
    'es': 'es-ES',
    'it': 'it-IT',
    'tw': 'zh-TW',
  };
  
  // 语言到"北京时间"文本的映射
  const timeLabelMap: Record<string, string> = {
    'zh': '北京时间',
    'en': 'Beijing Time',
    'ja': '北京時間',
    'ko': '베이징 시간',
    'ru': 'Пекинское время',
    'de': 'Peking Zeit',
    'fr': 'Heure de Beijing',
    'es': 'Hora de Beijing',
    'it': 'Ora di Pechino',
    'tw': '北京時間',
  };
  
  // 语言到"今日"文本的映射
  const todayLabelMap: Record<string, string> = {
    'zh': '今日',
    'en': 'Today',
    'ja': '今日',
    'ko': '오늘',
    'ru': 'Сегодня',
    'de': 'Heute',
    'fr': "Aujourd'hui",
    'es': 'Hoy',
    'it': 'Oggi',
    'tw': '今日',
  };

  useEffect(() => {
    let interval: any;
    
    const fetchWeather = async () => {
      try {
        // Fetch coordinates
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(enCityName)}&count=1`);
        const geoData = await geoRes.json();
        
        if (!geoData.results || geoData.results.length === 0) return;
        const { latitude, longitude, timezone: tz } = geoData.results[0];
        if (tz) setTimezone(tz);

        // Fetch weather
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
        const weatherData = await weatherRes.json();
        setWeather(weatherData);

      } catch (err) {
        console.error("Error fetching weather:", err);
      }
    };

    fetchWeather();

    const updateTime = () => {
      try {
          const now = new Date();
          const timeString = new Intl.DateTimeFormat('en-US', {
              timeZone: timezone,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
          }).format(now);
          setTimeStr(timeString);

          const locale = intlLocaleMap[language] || 'zh-CN';
          const dateString = new Intl.DateTimeFormat(locale, {
              timeZone: timezone,
              month: 'numeric',
              day: 'numeric',
              weekday: 'short'
          }).format(now);
          setDateStr(dateString);
      } catch (e) {
          // fallback
      }
    };

    updateTime();
    interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [enCityName, timezone, language]);

  if (!weather || !weather.daily) {
      return (
          <div className="animate-pulse">
              <div className="h-20 bg-white/10 rounded-xl mb-4"></div>
              <div className="h-24 bg-white/10 rounded-xl mb-4"></div>
              <div className="h-10 bg-white/10 rounded-xl"></div>
          </div>
      );
  }

  const todayTempMin = Math.round(weather.daily.temperature_2m_min[0]);
  const todayTempMax = Math.round(weather.daily.temperature_2m_max[0]);
  const todayCode = weather.daily.weather_code[0];

  return (
    <>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-white/70 font-medium mb-1">{timeLabelMap[language] || '北京时间'}</h3>
          <div className="text-4xl font-bold font-mono tracking-tight">{timeStr || '00:00:00'}</div>
        </div>
        <div className="text-right">
          <div className="text-white/60 text-sm mt-1">{dateStr}</div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-white/70 text-sm mb-1">{todayLabelMap[language] || '今日'} • {format(parseISO(weather.daily.time[0]), 'M/d')}</div>
            <div className="text-3xl font-bold">{todayTempMin}~{todayTempMax}°</div>
            <div className="text-white/60 text-xs mt-1">{getWeatherDesc(todayCode, language)}</div>
          </div>
          {getWeatherIcon(todayCode, { className: "w-12 h-12" })}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5 opacity-80 text-center">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <div className="text-xs text-white/50 mb-1">{format(parseISO(weather.daily.time[i]), 'M/d')}</div>
              <div className="text-xs mb-2">
                  {(() => {
                      const dayLocale = localeMap[language];
                      return format(parseISO(weather.daily.time[i]), 'EEE', dayLocale ? { locale: dayLocale } : undefined);
                  })()}
              </div>
              {getWeatherIcon(weather.daily.weather_code[i], { className: "w-5 h-5 mx-auto mb-1" })}
              <div className="text-[10px]">
                  {Math.round(weather.daily.temperature_2m_min[i])}~{Math.round(weather.daily.temperature_2m_max[i])}°
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
