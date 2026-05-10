"""
用 pypinyin 重新生成完整的 pinyin_map.json
用法: python scripts/gen_pinyin_full.py
"""
import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'data')
PINYIN_MAP_PATH = os.path.join(DATA_DIR, 'pinyin_map.json')

try:
    from pypinyin import pinyin, Style
    HAS_PYPINYIN = True
except ImportError:
    HAS_PYPINYIN = False
    print("pypinyin 未安装，使用手动映射")

# 省份映射
PROVINCE_MAP = {
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
}

# 多音字 / 特殊地名修正
FIXES = {
    '朝阳区': 'Chaoyang', '朝阳市': 'Chaoyang',
    '长安区': "Chang'an", '长宁区': 'Changning', '长寿区': 'Changshou',
    '大兴区': 'Daxing', '大兴安岭地区': 'Daxinganling',
    '乐山市': 'Leshan', '乐东黎族自治县': 'Ledong',
    '丽水市': 'Lishui', '丽江市': 'Lijiang',
    '重庆市': 'Chongqing',
    '衡水市': 'Hengshui', '衡阳市': 'Hengyang',
    '哈尔滨市': 'Harbin', '齐齐哈尔市': 'Qiqihar',
    '呼和浩特市': 'Hohhot', '鄂尔多斯市': 'Ordos',
    '锡林郭勒盟': 'Xilin Gol', '巴彦淖尔市': 'Bayannur',
    '乌兰察布市': 'Ulanqab', '阿拉善盟': 'Alxa',
    '兴安盟': "Xing'an", '乌海市': 'Wuhai',
    '包头市': 'Baotou', '赤峰市': 'Chifeng',
    '通辽市': 'Tongliao', '呼伦贝尔市': 'Hulunbuir',
    '克孜勒苏柯尔克孜自治州': 'Kizilsu',
    '巴音郭楞蒙古自治州': 'Bayingolin',
    '博尔塔拉蒙古自治州': 'Bortala',
    '伊犁哈萨克自治州': 'Ili',
    '昌吉回族自治州': 'Changji',
    '临夏回族自治州': 'Linxia',
    '甘南藏族自治州': 'Gannan',
    '海北藏族自治州': 'Haibei',
    '黄南藏族自治州': 'Huangnan',
    '海南藏族自治州': 'Hainan',
    '果洛藏族自治州': 'Golog',
    '玉树藏族自治州': 'Yushu',
    '海西蒙古族藏族自治州': 'Haixi',
    '甘孜藏族自治州': 'Garze',
    '阿坝藏族羌族自治州': 'Aba',
    '凉山彝族自治州': 'Liangshan',
    '黔西南布依族苗族自治州': "Qianxi'nan",
    '黔东南苗族侗族自治州': 'Qiandongnan',
    '黔南布依族苗族自治州': 'Qiannan',
    '湘西土家族苗族自治州': 'Xiangxi',
    '恩施土家族苗族自治州': 'Enshi',
    '延边朝鲜族自治州': 'Yanbian',
    '红河哈尼族彝族自治州': 'Honghe',
    '文山壮族苗族自治州': 'Wenshan',
    '楚雄彝族自治州': 'Chuxiong',
    '大理白族自治州': 'Dali',
    '德宏傣族景颇族自治州': 'Dehong',
    '迪庆藏族自治州': 'Deqen',
    '怒江傈僳族自治州': 'Nujiang',
    '西双版纳傣族自治州': 'Xishuangbanna',
    '普洱市': "Pu'er",
    '日喀则市': 'Shigatse', '昌都市': 'Qamdo',
    '林芝市': 'Nyingchi', '山南市': 'Lhoka',
    '那曲市': 'Nagqu', '阿里地区': 'Ngari',
    '喀什地区': 'Kashgar', '和田地区': 'Hotan',
    '阿克苏地区': 'Aksu', '吐鲁番市': 'Turpan',
    '哈密市': 'Hami', '塔城地区': 'Tacheng',
    '阿勒泰地区': 'Altay', '克拉玛依市': 'Karamay',
    '石河子市': 'Shihezi', '阿拉尔市': 'Alar',
    '图木舒克市': 'Tumxuk', '五家渠市': 'Wujiaqu',
    '北屯市': 'Beitun', '铁门关市': 'Tiemenguan',
    '双河市': 'Shuanghe', '可克达拉市': 'Kokdala',
    '昆玉市': 'Kunyu', '胡杨河市': 'Huyanghe',
    '六安市': "Lu'an",
    '马鞍山市': "Ma'anshan",
    '亳州市': 'Bozhou',
    '蚌埠市': 'Bengbu',
    '阜阳市': 'Fuyang',
    '漯河市': 'Luohe',
    '濮阳市': 'Puyang',
    '张家界市': 'Zhangjiajie',
    '景德镇市': 'Jingdezhen',
    '赣州市': 'Ganzhou',
    '吉安市': "Ji'an",
    '铜仁市': 'Tongren',
    '六盘水市': 'Liupanshui',
    '防城港市': 'Fangchenggang',
    '崇左市': 'Chongzuo',
    '格尔木市': 'Golmud',
    '德令哈市': 'Delingha',
    '中卫市': 'Zhongwei',
    '固原市': 'Guyuan',
    '石嘴山市': 'Shizuishan',
    '吴忠市': 'Wuzhong',
    '白银市': 'Baiyin',
    '嘉峪关市': 'Jiayuguan',
    '金昌市': 'Jinchang',
    '武威市': 'Wuwei',
    '张掖市': 'Zhangye',
    '酒泉市': 'Jiuquan',
    '平凉市': 'Pingliang',
    '庆阳市': 'Qingyang',
    '定西市': 'Dingxi',
    '陇南市': 'Longnan',
    '天水市': 'Tianshui',
}

def to_pinyin(name):
    """将中文名转为拼音首字母大写的格式"""
    if not HAS_PYPINYIN:
        return name
    result = pinyin(name, style=Style.NORMAL, heteronym=False)
    # Flatten and capitalize
    parts = []
    for p_list in result:
        p = p_list[0]
        if p:
            parts.append(p[0].upper() + p[1:])
    return ''.join(parts)

def clean_pinyin(name):
    """去除行政后缀后转拼音"""
    import re
    cleaned = re.sub(r'(省|市|自治区|壮族|回族|维吾尔|特别行政区|自治县|自治州|地区|林区|县|区|盟|旗)', '', name)
    return to_pinyin(cleaned) if HAS_PYPINYIN else cleaned

def main():
    pinyin_map = {}

    # 添加省份映射
    pinyin_map.update(PROVINCE_MAP)

    # 读取所有省份GeoJSON
    for filename in os.listdir(DATA_DIR):
        if not filename.endswith('.json') or filename in ('china.json', 'pinyin_map.json'):
            continue
        filepath = os.path.join(DATA_DIR, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            geojson = json.load(f)
        for feature in geojson.get('features', []):
            name = feature['properties']['name']
            if not name:
                continue
            if name in FIXES:
                pinyin_map[name] = FIXES[name]
            elif name in PROVINCE_MAP:
                pinyin_map[name] = PROVINCE_MAP[name]
            elif HAS_PYPINYIN:
                pinyin_map[name] = clean_pinyin(name)
            else:
                # fallback: 去后缀
                import re
                cleaned = re.sub(r'(省|市|自治区|壮族|回族|维吾尔|特别行政区|自治县|自治州|地区|林区|县|区|盟|旗)', '', name)
                pinyin_map[name] = cleaned

    # 手动修正覆盖
    pinyin_map.update(FIXES)

    with open(PINYIN_MAP_PATH, 'w', encoding='utf-8') as f:
        json.dump(pinyin_map, f, ensure_ascii=False, indent=2)

    print(f"总计 {len(pinyin_map)} 条拼音映射")

    # 检查哪些还是中文（没转成功）
    chinese_remaining = {k: v for k, v in pinyin_map.items() if any('\u4e00' <= c <= '\u9fff' for c in v)}
    if chinese_remaining:
        print(f"\n仍有 {len(chinese_remaining)} 条未转拼音:")
        for k, v in sorted(chinese_remaining.items()):
            print(f"  '{k}': '{v}',")
    else:
        print("\n所有映射都已转为拼音!")

if __name__ == '__main__':
    main()
