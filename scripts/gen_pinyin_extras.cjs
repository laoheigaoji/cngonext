/**
 * 从下载的省份GeoJSON中提取所有城市名，生成拼音映射追加到pinyin_map.json
 * 用法: node scripts/gen_pinyin_extras.cjs
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'public', 'data');
const PINYIN_MAP_PATH = path.join(DATA_DIR, 'pinyin_map.json');

// 手动映射（多音字和已知地名）
const MANUAL_MAP = {
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
  // 多音字城市手动修正
  '朝阳区': "Chaoyang", '朝阳市': 'Chaoyang',
  '长安区': "Chang'an", '长宁区': 'Changning', '长寿区': 'Changshou',
  '大兴区': 'Daxing', '大兴安岭地区': 'Daxinganling',
  '乐山市': 'Leshan', '乐东黎族自治县': 'Ledong',
  '丽水市': 'Lishui', '丽江市': 'Lijiang',
  '哈尔滨市': 'Harbin', '齐齐哈尔市': 'Qiqihar',
  '呼和浩特市': 'Hohhot', '鄂尔多斯市': 'Ordos',
  '锡林郭勒盟': 'Xilin Gol', '巴彦淖尔市': 'Bayannur',
  '乌兰察布市': 'Ulanqab', '阿拉善盟': 'Alxa',
  '兴安盟': "Xing'an", '乌海市': 'Wuhai',
  '包头市': 'Baotou', '赤峰市': 'Chifeng',
  '通辽市': 'Tongliao', '呼伦贝尔市': 'Hulunbuir',
  '克孜勒苏柯尔克孜自治州': 'Kizilsu', '巴音郭楞蒙古自治州': 'Bayingolin',
  '博尔塔拉蒙古自治州': 'Bortala', '伊犁哈萨克自治州': 'Ili',
  '昌吉回族自治州': 'Changji',
  '临夏回族自治州': 'Linxia', '甘南藏族自治州': 'Gannan',
  '海北藏族自治州': 'Haibei', '黄南藏族自治州': 'Huangnan',
  '海南藏族自治州': 'Hainan Pref', '果洛藏族自治州': 'Golog',
  '玉树藏族自治州': 'Yushu', '海西蒙古族藏族自治州': 'Haixi',
  '甘孜藏族自治州': 'Garze', '阿坝藏族羌族自治州': 'Aba',
  '凉山彝族自治州': 'Liangshan',
  '黔西南布依族苗族自治州': "Qianxi'nan",
  '黔东南苗族侗族自治州': 'Qiandongnan', '黔南布依族苗族自治州': 'Qiannan',
  '湘西土家族苗族自治州': 'Xiangxi', '恩施土家族苗族自治州': 'Enshi',
  '延边朝鲜族自治州': 'Yanbian',
  '红河哈尼族彝族自治州': 'Honghe', '文山壮族苗族自治州': 'Wenshan',
  '楚雄彝族自治州': 'Chuxiong', '大理白族自治州': 'Dali',
  '德宏傣族景颇族自治州': 'Dehong', '迪庆藏族自治州': 'Deqen',
  '怒江傈僳族自治州': 'Nujiang', '西双版纳傣族自治州': 'Xishuangbanna',
  '普洱市': "Pu'er",
  '铜仁市': 'Tongren', '六盘水市': 'Liupanshui',
  '防城港市': 'Fangchenggang', '崇左市': 'Chongzuo',
  '来宾市': 'Laibin', '贺州市': 'Hezhou',
  '百色市': 'Baise', '河池市': 'Hechi',
  '贵港市': 'Guigang', '梧州市': 'Wuzhou',
  '钦州市': 'Qinzhou', '玉林市': 'Yulin',
  '中卫市': 'Zhongwei', '固原市': 'Guyuan',
  '石嘴山市': 'Shizuishan', '吴忠市': 'Wuzhong',
  '白银市': 'Baiyin', '天水市': 'Tianshui',
  '武威市': 'Wuwei', '张掖市': 'Zhangye',
  '平凉市': 'Pingliang', '酒泉市': 'Jiuquan',
  '庆阳市': 'Qingyang', '定西市': 'Dingxi',
  '陇南市': 'Longnan', '嘉峪关市': 'Jiayuguan',
  '金昌市': 'Jinchang',
  '格尔木市': 'Golmud', '德令哈市': 'Delingha',
  '玉树市': 'Yushu', '同仁市': 'Tongren',
  '张家界市': 'Zhangjiajie',
  '漯河市': 'Luohe', '濮阳市': 'Puyang',
  '焦作市': 'Jiaozuo', '鹤壁市': 'Hebi',
  '三门峡市': 'Sanmenxia', '驻马店市': 'Zhumadian',
  '周口市': 'Zhoukou', '信阳市': 'Xinyang',
  '商丘市': 'Shangqiu', '许昌市': 'Xuchang',
  '阜阳市': 'Fuyang', '宿州市': 'Suzhou',
  '淮北市': 'Huaibei', '亳州市': 'Bozhou',
  '滁州市': 'Chuzhou', '六安市': "Lu'an",
  '蚌埠市': 'Bengbu',
  '淮南市': 'Huainan', '马鞍山市': "Ma'anshan",
  '芜湖市': 'Wuhu', '铜陵市': 'Tongling',
  '安庆市': 'Anqing', '黄山市': 'Huangshan',
  '池州市': 'Chizhou', '宣城市': 'Xuancheng',
  '赣州市': 'Ganzhou', '吉安市': "Ji'an",
  '上饶市': 'Shangrao', '抚州市': 'Fuzhou',
  '萍乡市': 'Pingxiang',
  '新余市': 'Xinyu', '鹰潭市': 'Yingtan',
  '景德镇市': 'Jingdezhen', '九江市': 'Jiujiang',
  '随州市': 'Suizhou', '咸宁市': 'Xianning',
  '黄石市': 'Huangshi', '鄂州市': 'Ezhou',
  '孝感市': 'Xiaogan', '黄冈市': 'Huanggang',
  '荆州市': 'Jingzhou', '荆门市': 'Jingmen',
  '襄阳市': 'Xiangyang', '十堰市': 'Shiyan',
  '宜昌市': 'Yichang', '潜江市': 'Qianjiang',
  '仙桃市': 'Xiantao', '天门市': 'Tianmen',
  '神农架林区': 'Shennongjia',
  '曲靖市': 'Qujing', '昭通市': 'Zhaotong',
  '保山市': 'Baoshan', '临沧市': 'Lincang',
  '日喀则市': 'Shigatse', '昌都市': 'Qamdo',
  '林芝市': 'Nyingchi', '山南市': 'Lhoka',
  '那曲市': 'Nagqu', '阿里地区': 'Ngari',
  '喀什地区': 'Kashgar', '和田地区': 'Hotan',
  '阿克苏地区': 'Aksu', '吐鲁番市': 'Turpan',
  '哈密市': 'Hami', '塔城地区': 'Tacheng',
  '阿勒泰地区': 'Altay', '克拉玛依市': 'Karamay',
  '石河子市': 'Shihezi', '阿拉尔市': 'Alar',
  '图木舒克市': 'Tumushuk', '五家渠市': 'Wujiaqu',
  '北屯市': 'Beitun', '铁门关市': 'Tiemenguan',
  '双河市': 'Shuanghe', '可克达拉市': 'Kokdala',
  '昆玉市': 'Kunyu', '胡杨河市': 'Huyanghe',
};

function main() {
  const existingMap = JSON.parse(fs.readFileSync(PINYIN_MAP_PATH, 'utf-8'));

  // 读取所有省份JSON，提取城市名
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json') && f !== 'china.json' && f !== 'pinyin_map.json');

  let addedCount = 0;

  for (const file of files) {
    const geoJson = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));
    const features = geoJson.features || [];
    for (const f of features) {
      const name = f.properties.name;
      if (name && !existingMap[name]) {
        // 去除行政后缀作为 fallback
        const cleaned = name.replace(/(省|市|自治区|壮族|回族|维吾尔|特别行政区|自治县|自治州|地区|林区|县|区|盟|旗)/g, '');
        existingMap[name] = cleaned;
        addedCount++;
      }
    }
  }

  // 手动映射覆盖
  for (const [key, val] of Object.entries(MANUAL_MAP)) {
    existingMap[key] = val;
  }

  fs.writeFileSync(PINYIN_MAP_PATH, JSON.stringify(existingMap, null, 2));
  console.log(`新增 ${addedCount} 条拼音映射，总计 ${Object.keys(existingMap).length} 条`);
}

main();
