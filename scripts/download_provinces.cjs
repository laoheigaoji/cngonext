/**
 * 从阿里 DataV 下载缺失的省份 GeoJSON 数据
 * 用法: node scripts/download_provinces.cjs
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

// 所有省级行政区的 adcode 和名称
const ALL_PROVINCES = {
  '110000': 'beijing',
  '120000': 'tianjin',
  '130000': 'hebei',
  '140000': 'shanxi',
  '150000': 'inner_mongolia',
  '210000': 'liaoning',
  '220000': 'jilin',
  '230000': 'heilongjiang',
  '310000': 'shanghai',
  '320000': 'jiangsu',
  '330000': 'zhejiang',
  '340000': 'anhui',
  '350000': 'fujian',
  '360000': 'jiangxi',
  '370000': 'shandong',
  '410000': 'henan',
  '420000': 'hubei',
  '430000': 'hunan',
  '440000': 'guangdong',
  '450000': 'guangxi',
  '460000': 'hainan',
  '500000': 'chongqing',
  '510000': 'sichuan',
  '520000': 'guizhou',
  '530000': 'yunnan',
  '540000': 'tibet',
  '610000': 'shaanxi',
  '620000': 'gansu',
  '630000': 'qinghai',
  '640000': 'ningxia',
  '650000': 'xinjiang',
  '710000': 'taiwan',
  '810000': 'hong_kong',
  '820000': 'macau',
};

// PROVINCE_GEO_MAP 中对应的文件名
const GEO_FILE_MAP = {
  'beijing': 'beijing',
  'tianjin': 'tianjin',
  'hebei': 'hebei',
  'shanxi': 'shanxi',
  'inner_mongolia': 'inner_mongolia',
  'liaoning': 'liaoning',
  'jilin': 'jilin',
  'heilongjiang': 'heilongjiang',
  'shanghai': 'shanghai',
  'jiangsu': 'jiangsu',
  'zhejiang': 'zhejiang',
  'anhui': 'anhui',
  'fujian': 'fujian',
  'jiangxi': 'jiangxi',
  'shandong': 'shandong',
  'henan': 'henan',
  'hubei': 'hubei',
  'hunan': 'hunan',
  'guangdong': 'guangdong',
  'guangxi': 'guangxi',
  'hainan': 'hainan',
  'chongqing': 'chongqing',
  'sichuan': 'sichuan',
  'guizhou': 'guizhou',
  'yunnan': 'yunnan',
  'tibet': 'tibet',
  'shaanxi': 'shaanxi',
  'gansu': 'gansu',
  'qinghai': 'qinghai',
  'ningxia': 'ningxia',
  'xinjiang': 'xinjiang',
  'taiwan': 'taiwan',
  'hong_kong': 'hong_kong',
  'macau': 'macau',
};

const DATA_DIR = path.join(__dirname, '..', 'public', 'data');

// 已存在的文件
const existingFiles = fs.readdirSync(DATA_DIR)
  .filter(f => f.endsWith('.json') && f !== 'china.json' && f !== 'pinyin_map.json')
  .map(f => f.replace('.json', ''));

console.log('已存在的省份文件:', existingFiles);

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const toDownload = Object.entries(ALL_PROVINCES).filter(([adcode, name]) => {
    const fileName = GEO_FILE_MAP[name];
    return !existingFiles.includes(fileName);
  });

  console.log(`需要下载 ${toDownload.length} 个省份:`, toDownload.map(([, n]) => n));

  for (const [adcode, name] of toDownload) {
    const fileName = GEO_FILE_MAP[name];
    const url = `https://geo.datav.aliyun.com/areas_v3/bound/${adcode}_full.json`;
    const filePath = path.join(DATA_DIR, `${fileName}.json`);

    try {
      console.log(`下载 ${name} (${adcode})...`);
      const data = await download(url);
      fs.writeFileSync(filePath, data);
      console.log(`  ✓ ${fileName}.json (${(data.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.log(`  ✗ ${name} 下载失败: ${err.message}`);
    }
  }

  console.log('\n完成!');
}

main();
