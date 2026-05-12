"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as echarts from 'echarts';
import { useLanguage } from '../context/LanguageContext';



// ========== 免签省份和口岸数据 ==========
// 全省/市开放的省份
const FULL_PROVINCES = [
  '北京市', '天津市', '河北省', '辽宁省', '上海市', '江苏省', '浙江省',
  '福建省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '海南省',
  '重庆市', '贵州省', '陕西省',
];

// 部分地区开放的省份
const PARTIAL_PROVINCES = [
  '山西省',  // 太原市、大同市
  '黑龙江省', // 哈尔滨市
  '江西省',  // 南昌市、景德镇市
  '广西壮族自治区', // 南宁市等多市
  '四川省',  // 成都市等多市
  '云南省',  // 昆明市等多市
  '安徽省',  // 安徽省
];

// 部分开放省份的具体开放城市
const PARTIAL_OPEN_CITIES: Record<string, string[]> = {
  '山西省': ['太原市', '大同市'],
  '黑龙江省': ['哈尔滨市'],
  '江西省': ['南昌市', '景德镇市'],
  '广西壮族自治区': ['南宁市', '柳州市', '桂林市', '梧州市', '北海市', '防城港市', '钦州市', '贵港市', '玉林市', '百色市', '贺州市', '河池市', '来宾市', '崇左市'],
  '四川省': ['成都市', '绵阳市', '德阳市', '广安市', '乐山市', '眉山市', '自贡市', '宜宾市', '泸州市', '达州市', '内江市', '资阳市', '遂宁市', '雅安市', '南充市'],
  '云南省': ['昆明市', '玉溪市', '普洱市', '保山市', '曲靖市', '大理白族自治州', '丽江市', '红河哈尼族彝族自治州', '文山壮族苗族自治州', '楚雄彝族自治州', '西双版纳傣族自治州', '德宏傣族景颇族自治州'],
  '安徽省': ['合肥市', '黄山市'],
};

// 省份到英文键名的映射（用于翻译key和GeoJSON加载）
const PROVINCE_KEY_MAP: Record<string, string> = {
  '北京市': 'Beijing', '天津市': 'Tianjin', '河北省': 'Hebei',
  '山西省': 'Shanxi', '辽宁省': 'Liaoning', '黑龙江省': 'Heilongjiang',
  '上海市': 'Shanghai', '江苏省': 'Jiangsu', '浙江省': 'Zhejiang',
  '安徽省': 'Anhui', '福建省': 'Fujian', '江西省': 'Jiangxi',
  '山东省': 'Shandong', '河南省': 'Henan', '湖北省': 'Hubei',
  '湖南省': 'Hunan', '广东省': 'Guangdong', '广西壮族自治区': 'Guangxi',
  '海南省': 'Hainan', '重庆市': 'Chongqing', '四川省': 'Sichuan',
  '贵州省': 'Guizhou', '云南省': 'Yunnan', '陕西省': 'Shaanxi',
};

// 省份GeoJSON文件映射
const PROVINCE_GEO_MAP: Record<string, string> = {
  '北京市': 'beijing', '天津市': 'tianjin', '河北省': 'hebei',
  '山西省': 'shanxi', '内蒙古自治区': 'inner_mongolia', '辽宁省': 'liaoning',
  '吉林省': 'jilin', '黑龙江省': 'heilongjiang', '上海市': 'shanghai',
  '江苏省': 'jiangsu', '浙江省': 'zhejiang', '安徽省': 'anhui',
  '福建省': 'fujian', '江西省': 'jiangxi', '山东省': 'shandong',
  '河南省': 'henan', '湖北省': 'hubei', '湖南省': 'hunan',
  '广东省': 'guangdong', '广西壮族自治区': 'guangxi', '海南省': 'hainan',
  '重庆市': 'chongqing', '四川省': 'sichuan', '贵州省': 'guizhou',
  '云南省': 'yunnan', '西藏自治区': 'tibet', '陕西省': 'shaanxi',
  '甘肃省': 'gansu', '青海省': 'qinghai', '宁夏回族自治区': 'ningxia',
  '新疆维吾尔自治区': 'xinjiang', '香港特别行政区': 'hong_kong',
  '澳门特别行政区': 'macau',
};

// 口岸经纬度数据
const PORT_DATA: Record<string, { name: string; coords: [number, number] }[]> = {
  '北京市': [
    { name: '北京首都国际机场', coords: [116.5975, 40.0799] },
    { name: '北京大兴国际机场', coords: [116.4107, 39.5098] },
  ],
  '天津市': [
    { name: '天津滨海国际机场', coords: [117.3511, 39.1244] },
    { name: '天津港', coords: [117.7, 38.98] },
  ],
  '河北省': [
    { name: '石家庄正定国际机场', coords: [114.70, 38.28] },
    { name: '秦皇岛港', coords: [119.60, 39.93] },
  ],
  '山西省': [
    { name: '太原武宿国际机场', coords: [112.63, 37.79] },
  ],
  '辽宁省': [
    { name: '沈阳桃仙国际机场', coords: [123.48, 41.64] },
    { name: '大连周水子国际机场', coords: [121.54, 38.96] },
    { name: '大连港', coords: [121.63, 38.92] },
  ],
  '黑龙江省': [
    { name: '哈尔滨太平国际机场', coords: [126.25, 45.62] },
  ],
  '上海市': [
    { name: '上海虹桥国际机场', coords: [121.336, 31.194] },
    { name: '上海浦东国际机场', coords: [121.808, 31.144] },
    { name: '上海港', coords: [121.49, 31.23] },
  ],
  '江苏省': [
    { name: '南京禄口国际机场', coords: [118.86, 31.74] },
    { name: '苏南硕放国际机场', coords: [120.43, 31.50] },
    { name: '扬州泰州国际机场', coords: [119.73, 32.57] },
    { name: '连云港港', coords: [119.47, 34.75] },
  ],
  '浙江省': [
    { name: '杭州萧山国际机场', coords: [120.43, 30.23] },
    { name: '宁波栎社国际机场', coords: [121.46, 29.83] },
    { name: '温州龙湾国际机场', coords: [120.85, 27.91] },
    { name: '义乌机场', coords: [120.03, 29.36] },
    { name: '温州港', coords: [120.70, 28.00] },
    { name: '舟山港', coords: [122.10, 30.01] },
  ],
  '安徽省': [
    { name: '合肥新桥国际机场', coords: [116.99, 31.98] },
    { name: '黄山屯溪国际机场', coords: [118.26, 29.73] },
  ],
  '福建省': [
    { name: '福州长乐国际机场', coords: [119.66, 25.93] },
    { name: '厦门高崎国际机场', coords: [118.13, 24.54] },
    { name: '泉州晋江国际机场', coords: [118.59, 24.80] },
    { name: '武夷山机场', coords: [118.06, 27.77] },
    { name: '厦门港', coords: [118.09, 24.46] },
  ],
  '江西省': [
    { name: '南昌昌北国际机场', coords: [115.90, 28.66] },
  ],
  '山东省': [
    { name: '济南遥墙国际机场', coords: [117.22, 36.85] },
    { name: '青岛胶东国际机场', coords: [120.38, 36.44] },
    { name: '烟台蓬莱国际机场', coords: [120.98, 37.74] },
    { name: '威海大水泊国际机场', coords: [122.23, 37.19] },
    { name: '青岛港', coords: [120.38, 36.07] },
  ],
  '河南省': [
    { name: '郑州新郑国际机场', coords: [113.84, 34.52] },
  ],
  '湖北省': [
    { name: '武汉天河国际机场', coords: [114.36, 30.78] },
  ],
  '湖南省': [
    { name: '长沙黄花国际机场', coords: [113.22, 28.19] },
    { name: '张家界荷花国际机场', coords: [110.44, 29.10] },
  ],
  '广东省': [
    { name: '广州白云国际机场', coords: [113.30, 23.39] },
    { name: '深圳宝安国际机场', coords: [113.81, 22.64] },
    { name: '南沙港', coords: [113.55, 22.78] },
    { name: '揭阳潮汕国际机场', coords: [116.75, 23.56] },
    { name: '蛇口港', coords: [113.92, 22.49] },
  ],
  '广西壮族自治区': [
    { name: '南宁吴圩国际机场', coords: [108.01, 22.61] },
    { name: '桂林两江国际机场', coords: [110.04, 25.22] },
    { name: '北海福成机场', coords: [109.29, 21.55] },
    { name: '北海港', coords: [109.12, 21.48] },
  ],
  '海南省': [
    { name: '海口美兰国际机场', coords: [110.46, 19.93] },
    { name: '三亚凤凰国际机场', coords: [109.41, 18.30] },
  ],
  '重庆市': [
    { name: '重庆江北国际机场', coords: [106.64, 29.72] },
  ],
  '四川省': [
    { name: '成都双流国际机场', coords: [103.95, 30.57] },
    { name: '成都天府国际机场', coords: [104.50, 30.32] },
  ],
  '贵州省': [
    { name: '贵阳龙洞堡国际机场', coords: [106.80, 26.54] },
  ],
  '云南省': [
    { name: '昆明长水国际机场', coords: [102.99, 25.10] },
    { name: '丽江三义国际机场', coords: [100.25, 26.62] },
    { name: '磨憨铁路口岸', coords: [101.68, 21.18] },
  ],
  '陕西省': [
    { name: '西安咸阳国际机场', coords: [108.75, 34.44] },
  ],
};

// 省份简称映射
const PROVINCE_SHORT: Record<string, string> = {
  '北京市': '京', '天津市': '津', '河北省': '冀', '山西省': '晋',
  '内蒙古自治区': '蒙', '辽宁省': '辽', '吉林省': '吉', '黑龙江省': '黑',
  '上海市': '沪', '江苏省': '苏', '浙江省': '浙', '安徽省': '皖',
  '福建省': '闽', '江西省': '赣', '山东省': '鲁', '河南省': '豫',
  '湖北省': '鄂', '湖南省': '湘', '广东省': '粤', '广西壮族自治区': '桂',
  '海南省': '琼', '重庆市': '渝', '四川省': '川', '贵州省': '黔',
  '云南省': '滇', '西藏自治区': '藏', '陕西省': '陕', '甘肃省': '甘',
  '青海省': '青', '宁夏回族自治区': '宁', '新疆维吾尔自治区': '新',
  '台湾省': '台', '香港特别行政区': '港', '澳门特别行政区': '澳',
};

// 城市中文名 → URL Slug 映射（点击城市导航用，动态从Supabase加载）
let gCityNameMap: Record<string, string> | null = null;
let gCityMapPromise: Promise<Record<string, string>> | null = null;
async function loadCityNameMap(): Promise<Record<string, string>> {
  if (gCityNameMap) return gCityNameMap;
  if (gCityMapPromise) return gCityMapPromise;
  gCityMapPromise = (async () => {
    try {
      const supabaseUrl = 'https://cxegaqhwexiidezycbyg.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZWdhcWh3ZXhpaWRlenljYnlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk0MjIyNSwiZXhwIjoyMDkzNTE4MjI1fQ.e-OEm6Gtyp8Dp0_dOorW1FSXYjEpvEdDTt6NjPQQ1W8';
      const res = await fetch(`${supabaseUrl}/rest/v1/cities?select=id,name`, {
        headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
      });
      if (!res.ok) return {};
      const cities: { id: string; name: string }[] = await res.json();
      const map: Record<string, string> = {};
      for (const c of cities) {
        if (c.name) {
          // 存入带"市"和不带"市"两种格式
          map[c.name] = c.id;
          if (c.name.endsWith('市')) {
            map[c.name.slice(0, -1)] = c.id;
          }
        }
      }
      gCityNameMap = map;
      return map;
    } catch {
      return {};
    }
  })();
  return gCityMapPromise;
}

// 省份拼音映射

// 省份拼音映射
const PROVINCE_PINYIN: Record<string, string> = {
  '北京市': 'Beijing', '天津市': 'Tianjin', '河北省': 'Hebei',
  '山西省': 'Shanxi', '内蒙古自治区': 'Inner Mongolia', '辽宁省': 'Liaoning',
  '吉林省': 'Jilin', '黑龙江省': 'Heilongjiang', '上海市': 'Shanghai',
  '江苏省': 'Jiangsu', '浙江省': 'Zhejiang', '安徽省': 'Anhui',
  '福建省': 'Fujian', '江西省': 'Jiangxi', '山东省': 'Shandong',
  '河南省': 'Henan', '湖北省': 'Hubei', '湖南省': 'Hunan',
  '广东省': 'Guangdong', '广西壮族自治区': 'Guangxi', '海南省': 'Hainan',
  '重庆市': 'Chongqing', '四川省': 'Sichuan', '贵州省': 'Guizhou',
  '云南省': 'Yunnan', '西藏自治区': 'Tibet', '陕西省': 'Shaanxi',
  '甘肃省': 'Gansu', '青海省': 'Qinghai', '宁夏回族自治区': 'Ningxia',
  '新疆维吾尔自治区': 'Xinjiang', '台湾省': 'Taiwan',
  '香港特别行政区': 'Hong Kong', '澳门特别行政区': 'Macau',
};

interface ChinaVisaMapProps {
  t: (key: string) => string;
}

export default function ChinaVisaMap({ t }: ChinaVisaMapProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [currentMap, setCurrentMap] = useState('china');
  const [pinyinMap, setPinyinMap] = useState<Record<string, string>>({});
  const pinyinMapRef = useRef<Record<string, string>>({});
  const currentMapRef = useRef('china');

  const isZh = language === 'zh' || language === 'cn' || language === 'tw';

  const getProvinceStatus = useCallback((name: string) => {
    if (FULL_PROVINCES.includes(name)) return 'full';
    if (PARTIAL_PROVINCES.includes(name)) return 'partial';
    return 'none';
  }, []);

  const getAreaColor = useCallback((name: string) => {
    const status = getProvinceStatus(name);
    if (status === 'full') return '#2ECC71';    // 深绿 - 全省开放
    if (status === 'partial') return '#A8E6CF'; // 浅绿 - 部分开放
    return '#e5e7eb';                            // 灰色 - 不在范围
  }, [getProvinceStatus]);

  const getBorderColor = useCallback((name: string) => {
    const status = getProvinceStatus(name);
    if (status === 'full') return '#27ae60';
    if (status === 'partial') return '#7dcea0';
    return '#d1d5db';
  }, [getProvinceStatus]);

  const getCityColor = useCallback((cityName: string, provinceName: string) => {
    const provStatus = getProvinceStatus(provinceName);
    if (provStatus === 'full') return { areaColor: '#2ECC71', borderColor: '#27ae60' }; // 全省开放，所有城市深绿
    if (provStatus === 'partial') {
      const openCities = PARTIAL_OPEN_CITIES[provinceName] || [];
      if (openCities.includes(cityName)) {
        return { areaColor: '#A8E6CF', borderColor: '#7dcea0' }; // 开放城市浅绿
      }
      return { areaColor: '#e5e7eb', borderColor: '#d1d5db' }; // 未开放城市灰色
    }
    return { areaColor: '#e5e7eb', borderColor: '#d1d5db' }; // 非免签省份灰色
  }, [getProvinceStatus]);

  const buildChartOption = useCallback((mapName: string, geoJson: any, provinceName?: string, pyMap?: Record<string, string>) => {
    echarts.registerMap(mapName, geoJson);

    const regions = geoJson.features?.map((f: any) => {
      const name = f.properties.name;
      let areaColor: string;
      let borderColor: string;

      if (mapName === 'china') {
        areaColor = getAreaColor(name);
        borderColor = getBorderColor(name);
      } else {
        // 省份下钻：根据省份状态给城市着色
        const cityColors = getCityColor(name, mapName);
        areaColor = cityColors.areaColor;
        borderColor = cityColors.borderColor;
      }

      return {
        name,
        itemStyle: { areaColor, borderColor },
      };
    }) || [];

    return {
      tooltip: { show: false },
      geo: {
        map: mapName,
        roam: true,
        zoom: mapName === 'china' ? 1.2 : 1,
        center: mapName === 'china' ? [104.5, 35.5] : undefined,
        scaleLimit: { min: 0.5, max: 8 },
        label: {
          show: true,
          color: '#4b5563',
          fontSize: mapName === 'china' ? 9 : 11,
          formatter: (params: any) => {
            const name = params.name;
            if (pyMap && pyMap[name]) return pyMap[name];
            return name.replace(/(省|市|自治区|壮族|回族|维吾尔|特别行政区|自治县|自治州|地区|林区|县|区)/g, '');
          },
        },
        itemStyle: {
          areaColor: '#e5e7eb',
          borderColor: '#9ca3af',
          borderWidth: 0.5,
        },
        emphasis: {
          label: {
            color: '#111827',
            fontSize: mapName === 'china' ? 11 : 13,
            fontWeight: 'bold',
          },
          itemStyle: {
            areaColor: '#fbbf24',
            borderColor: '#f59e0b',
            borderWidth: 2,
          },
        },
        select: {
          disabled: true,
        },
        regions,
      },
      series: [
        {
          type: 'map',
          map: mapName,
          geoIndex: 0,
          data: [],
        },
      ],
    };
  }, [getAreaColor, getBorderColor]);

  // 初始化地图
  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    chartInstance.current = chart;

    // 加载拼音映射
    fetch('/data/pinyin_map.json')
      .then(res => res.json())
      .then(map => {
        setPinyinMap(map);
        pinyinMapRef.current = map;
      })
      .catch(() => {});

    fetch('/data/china.json')
      .then(res => res.json())
      .then(geoJson => {
        const option = buildChartOption('china', geoJson, undefined, pinyinMapRef.current);
        chart.setOption(option);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load China map:', err);
        setLoading(false);
      });

    // 事件：点击省份 - 下钻；点击城市 - 跳转详情页
    chart.on('click', { seriesType: 'map' }, (params: any) => {
      const name = params.name;

      // 已下钻到省份：点击地级城市跳转到城市详情页
      if (currentMapRef.current !== 'china') {
        loadCityNameMap().then(map => {
          const citySlug = map[name];
          if (citySlug) {
            const langPrefix = window.location.pathname.split('/')[1] || 'en';
            window.location.href = `/${langPrefix}/cities/${citySlug}`;
          }
        });
        return;
      }

      // 全国视图：下钻到省份
      const geoFile = PROVINCE_GEO_MAP[name];
      if (geoFile) {
        setLoading(true);
        fetch(`/data/${geoFile}.json`)
          .then(res => res.json())
          .then(geoJson => {
            setCurrentMap(name);
            currentMapRef.current = name;
            const option = buildChartOption(name, geoJson, name, pinyinMapRef.current);
            chart.setOption(option, true);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      }
    });

    // 右键返回全国（仅桌面端）
    chart.getZr().on('contextmenu', (params: any) => {
      params.event?.preventDefault?.();
      // 移动端长按不触发返回，避免干扰触摸拖拽
      if ('ontouchstart' in window) return;
      if (currentMapRef.current !== 'china') {
        setLoading(true);
        fetch('/data/china.json')
          .then(res => res.json())
          .then(geoJson => {
            const option = buildChartOption('china', geoJson, undefined, pinyinMapRef.current);
            chart.setOption(option, true);
            setCurrentMap('china');
            currentMapRef.current = 'china';
            setLoading(false);
          })
          .catch(() => setLoading(false));
      }
    });

    // 响应窗口大小
    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
      chartInstance.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 拼音映射加载完后刷新地图标签
  useEffect(() => {
    pinyinMapRef.current = pinyinMap;
    if (Object.keys(pinyinMap).length > 0 && chartInstance.current) {
      if (currentMap === 'china') {
        fetch('/data/china.json')
          .then(res => res.json())
          .then(geoJson => {
            const option = buildChartOption('china', geoJson, undefined, pinyinMap);
            chartInstance.current?.setOption(option);
          })
          .catch(() => {});
      } else {
        const geoFile = PROVINCE_GEO_MAP[currentMap];
        if (geoFile) {
          fetch(`/data/${geoFile}.json`)
            .then(res => res.json())
            .then(geoJson => {
              const option = buildChartOption(currentMap, geoJson, currentMap, pinyinMap);
              chartInstance.current?.setOption(option);
            })
            .catch(() => {});
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinyinMap]);

  return (
    <div className="relative w-full h-[500px] sm:h-[560px] md:h-[620px] bg-[#759dd1] overflow-hidden">
      {/* ECharts 地图容器 */}
      <div ref={chartRef} className="w-full h-full" />

      {/* 加载动画 */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#759dd1]/80 z-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-white/80 text-sm">{isZh ? '加载地图数据...' : 'Loading map data...'}</span>
          </div>
        </div>
      )}

      {/* 底部 China 文字 - 点击返回全国地图 */}
      <div
        onClick={() => {
          if (currentMap === 'china' || !chartInstance.current) return;
          setLoading(true);
          fetch('/data/china.json')
            .then(res => res.json())
            .then(geoJson => {
              const option = buildChartOption('china', geoJson, undefined, pinyinMapRef.current);
              chartInstance.current?.setOption(option, true);
              setCurrentMap('china');
              currentMapRef.current = 'china';
              setLoading(false);
            })
            .catch(() => setLoading(false));
        }}
        className={`absolute bottom-12 left-1/2 -translate-x-1/2 text-white font-bold text-3xl tracking-[0.5em] uppercase z-20 ${currentMap !== 'china' ? 'cursor-pointer hover:text-white/80' : ''}`}
      >
        China
      </div>

      {/* 图例 */}
      <div className="absolute right-4 bottom-4 bg-white/90 backdrop-blur-sm p-4 rounded-md shadow-md text-sm text-gray-800 z-10">
        <div className="font-bold mb-2">{t('visa.hero.legendTitle')}</div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#2ECC71' }} />
          <span>{t('visa.hero.legendFull')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#A8E6CF' }} />
          <span>{t('visa.hero.legendPartial')}</span>
        </div>
      </div>


    </div>
  );
}
