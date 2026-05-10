import json, os, re
from pypinyin import pinyin, Style

# 手动修正多音字
FIXES = {
    '朝阳区': 'Chaoyang', '朝阳市': 'Chaoyang',
    '长安区': "Chang'an", '长宁区': 'Changning', '长寿区': 'Changshou',
    '重庆市': 'Chongqing',
    '大兴区': 'Daxing', '大兴安岭地区': 'Daxinganling',
    '乐山市': 'Leshan', '乐东黎族自治县': 'Ledong',
    '丽水市': 'Lishui', '丽江市': 'Lijiang',
}

all_names = {}

with open('public/data/china.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
for feat in data['features']:
    name = feat['properties']['name']
    if name in FIXES:
        all_names[name] = FIXES[name]
        continue
    clean = re.sub(r'(省|市|自治区|壮族|回族|维吾尔|特别行政区)$', '', name)
    py_parts = [p[0].capitalize() for p in pinyin(clean, style=Style.NORMAL)]
    all_names[name] = ''.join(py_parts)

for fname in os.listdir('public/data'):
    if fname == 'china.json':
        continue
    if not fname.endswith('.json'):
        continue
    try:
        with open(f'public/data/{fname}', 'r', encoding='utf-8') as f:
            data = json.load(f)
        for feat in data['features']:
            name = feat['properties']['name']
            if name in FIXES:
                all_names[name] = FIXES[name]
                continue
            clean = re.sub(r'(省|市|自治区|壮族|回族|维吾尔|特别行政区|自治县|自治州|地区|林区|县|区)$', '', name)
            py_parts = [p[0].capitalize() for p in pinyin(clean, style=Style.NORMAL)]
            all_names[name] = ''.join(py_parts)
    except:
        pass

with open('public/data/pinyin_map.json', 'w', encoding='utf-8') as f:
    json.dump(all_names, f, ensure_ascii=False, indent=2)

print(f'Total: {len(all_names)} entries')
checks = ['北京市', '黑龙江省', '浙江省', '衢州市', '成都市', '朝阳区', '大兴区', '大兴安岭地区', '重庆市', '乐山市', '丽水市', '西安市']
for c in checks:
    if c in all_names:
        print(f'  {c} -> {all_names[c]}')
