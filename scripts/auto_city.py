#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
城市数据全自动生成脚本

功能：
  1. 自动检查 Supabase 数据库中缺少的城市
  2. 自动调用 DeepSeek 生成城市数据（中英双语）
  3. 自动翻译为 8 种语言（ja/ko/ru/fr/es/de/tw/it）
  4. 自动调用 Gemini API 生成背景图 + PIL 叠加书法字体生成封面图（listCover + heroImage）
  5. 自动上传封面图到 Supabase Storage
  6. 自动写入 Supabase 数据库

用法：
  python scripts/auto_city.py                              # 自动检测并补充缺少数据的城市
  python scripts/auto_city.py "成都,重庆,西安"              # 批量添加/更新城市
  python scripts/auto_city.py --list                       # 列出所有城市
  python scripts/auto_city.py --check                      # 检查哪些城市数据不完整
  python scripts/auto_city.py --only-images                # 只补充缺少封面图的城市
  python scripts/auto_city.py "成都,重庆" --only-new       # 只添加新城市，跳过已有的

依赖安装：
  pip install requests
"""

import sys
import os
import json
import time
import re
import base64
import requests
from datetime import datetime

# Windows 下设置 UTF-8 输出
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# ============ 配置 ============
DEEPSEEK_KEY = os.environ.get("DEEPSEEK_KEY", "sk-59621d871ea2481ebb5cef488b8137be")

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://cxegaqhwexiidezycbyg.supabase.co")
SUPABASE_SERVICE_KEY = os.environ.get(
    "SUPABASE_SERVICE_KEY",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZWdhcWh3ZXhpaWRlenljYnlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk0MjIyNSwiZXhwIjoyMDkzNTE4MjI1fQ.e-OEm6Gtyp8Dp0_dOorW1FSXYjEpvEdDTt6NjPQQ1W8",
)

HEADERS = {
    "apikey": SUPABASE_SERVICE_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}

# 城市英文名映射
CITY_EN_MAP = {
    "北京": "Beijing", "上海": "Shanghai", "广州": "Guangzhou", "深圳": "Shenzhen",
    "杭州": "Hangzhou", "成都": "Chengdu", "重庆": "Chongqing", "西安": "Xi'an",
    "南京": "Nanjing", "苏州": "Suzhou", "武汉": "Wuhan", "长沙": "Changsha",
    "青岛": "Qingdao", "厦门": "Xiamen", "丽江": "Lijiang", "大理": "Dali",
    "桂林": "Guilin", "三亚": "Sanya", "昆明": "Kunming", "拉萨": "Lhasa",
    "天津": "Tianjin", "哈尔滨": "Harbin", "沈阳": "Shenyang", "大连": "Dalian",
    "郑州": "Zhengzhou", "福州": "Fuzhou", "海口": "Haikou", "宁波": "Ningbo",
    "上饶": "Shangrao", "济南": "Jinan", "合肥": "Hefei", "南昌": "Nanchang",
    "贵阳": "Guiyang", "兰州": "Lanzhou", "太原": "Taiyuan", "石家庄": "Shijiazhuang",
    "呼和浩特": "Hohhot", "乌鲁木齐": "Urumqi", "南宁": "Nanning", "银川": "Yinchuan",
    "西宁": "Xining", "长春": "Changchun", "无锡": "Wuxi", "佛山": "Foshan",
    "东莞": "Dongguan", "珠海": "Zhuhai", "中山": "Zhongshan", "惠州": "Huizhou",
    "扬州": "Yangzhou", "洛阳": "Luoyang", "敦煌": "Dunhuang", "九寨沟": "Jiuzhaigou",
    "张家界": "Zhangjiajie", "黄山": "Huangshan", "西双版纳": "Xishuangbanna",
    "凤凰古城": "Fenghuang", "平遥": "Pingyao", "周庄": "Zhouzhuang",
    "泉州": "Quanzhou", "潮州": "Chaozhou", "宜宾": "Yibin", "乐山": "Leshan",
    "峨眉山": "Emeishan", "婺源": "Wuyuan", "景德镇": "Jingdezhen", "承德": "Chengde",
    "秦皇岛": "Qinhuangdao", "威海": "Weihai", "烟台": "Yantai",
    "岳阳": "Yueyang", "襄阳": "Xiangyang", "宜昌": "Yichang",
    "赣州": "Ganzhou", "九江": "Jiujiang", "泰安": "Tai'an",
    "日照": "Rizhao", "潍坊": "Weifang", "临沂": "Linyi",
    "常州": "Changzhou", "南通": "Nantong", "盐城": "Yancheng",
    "嘉兴": "Jiaxing", "湖州": "Huzhou", "绍兴": "Shaoxing",
    "金华": "Jinhua", "台州": "Taizhou", "温州": "Wenzhou",
    "漳州": "Zhangzhou", "莆田": "Putian", "龙岩": "Longyan",
    "株洲": "Zhuzhou", "湘潭": "Xiangtan", "衡阳": "Hengyang",
    "岳阳": "Yueyang", "常德": "Changde", "张家界": "Zhangjiajie",
    "绵阳": "Mianyang", "德阳": "Deyang", "泸州": "Luzhou",
    "遵义": "Zunyi", "曲靖": "Qujing", "大理": "Dali",
    "丽江": "Lijiang", "香格里拉": "Shangri-La", "腾冲": "Tengchong",
}

# ============ DeepSeek API ============
def ask_deepseek(prompt: str, temperature: float = 0.7, max_tokens: int = 8000) -> str:
    """调用 DeepSeek API"""
    resp = requests.post(
        "https://api.deepseek.com/chat/completions",
        headers={"Authorization": f"Bearer {DEEPSEEK_KEY}", "Content-Type": "application/json"},
        json={
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": "You are a professional travel curator for China. Respond ONLY with valid JSON, no markdown, no explanation."},
                {"role": "user", "content": prompt},
            ],
            "response_format": {"type": "json_object"},
            "temperature": temperature,
            "max_tokens": max_tokens,
        },
        timeout=120,
    )
    resp.raise_for_status()
    content = resp.json()["choices"][0]["message"]["content"]
    return content


def clean_json(text: str) -> str:
    """清理 JSON 字符串"""
    text = text.strip()
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1:
        text = text[start : end + 1]
    return text


# ============ Gemini 图像生成 API + PIL 叠加文字 ============

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyB1GiAVEG7OW6G9MZX0tJHt1whBU8BkyHs")

# 参考图：用北京的 listCover 作为风格参考
REFERENCE_IMAGE_URL = "https://cxegaqhwexiidezycbyg.supabase.co/storage/v1/object/public/images/city_list_covers/1777907675210-beijing.jpg"

# 字体路径（优先使用衡山毛笔行书，其次楷体，最后黑体）
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
FONT_PATHS = [
    os.path.join(SCRIPT_DIR, "fonts", "kouzan_brush.ttf"),  # 衡山毛笔行书（需手动下载）
    os.path.join(SCRIPT_DIR, "fonts", "maobixingshu.ttf"),   # 备用毛笔行书
    "C:/Windows/Fonts/simkai.ttf",   # 楷体（系统自带）
    "C:/Windows/Fonts/simhei.ttf",   # 黑体（系统自带）
]

def _get_font(size: int):
    """获取可用的书法字体"""
    from PIL import ImageFont
    for path in FONT_PATHS:
        if os.path.exists(path):
            try:
                font = ImageFont.truetype(path, size)
                print(f"    使用字体: {os.path.basename(path)}")
                return font
            except Exception:
                continue
    return ImageFont.load_default()


def fetch_image_as_base64(url: str) -> str:
    """下载图片并转为 base64"""
    resp = requests.get(url, timeout=60)
    resp.raise_for_status()
    return base64.b64encode(resp.content).decode("utf-8")


def generate_bg_with_gemini(prompt: str, reference_image_url: str = None) -> bytes:
    """
    调用 Gemini API 生成纯背景图（无文字）
    返回图片二进制数据
    """
    parts = [{"text": prompt}]

    # 如果有参考图，附加到请求中
    if reference_image_url:
        try:
            ref_b64 = fetch_image_as_base64(reference_image_url)
            parts.append({
                "inline_data": {
                    "mime_type": "image/jpeg",
                    "data": ref_b64,
                }
            })
            parts.append({"text": "Generate a background image in the SAME dark, moody, golden-hour photographic style as this reference, but with the landmark described above. NO TEXT, NO LETTERS, NO WORDS in the image."})
        except Exception as e:
            print(f"    ⚠️ 参考图下载失败，将不带参考图生成: {e}")

    payload = {
        "contents": [{"parts": parts}],
        "generationConfig": {
            "responseModalities": ["TEXT", "IMAGE"],
        },
    }

    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=" + GEMINI_API_KEY

    resp = requests.post(url, json=payload, timeout=180)
    resp.raise_for_status()
    data = resp.json()

    # 解析 Gemini 返回的图片数据
    try:
        candidates = data.get("candidates", [])
        if candidates:
            parts = candidates[0].get("content", {}).get("parts", [])
            for part in parts:
                if "inlineData" in part:
                    img_b64 = part["inlineData"].get("data", "")
                    if img_b64:
                        return base64.b64decode(img_b64)
                if "inline_data" in part:
                    img_b64 = part["inline_data"].get("data", "")
                    if img_b64:
                        return base64.b64decode(img_b64)
    except Exception as e:
        print(f"    ❌ Gemini 返回解析失败: {e}")
        print(f"    返回数据: {json.dumps(data, ensure_ascii=False)[:500]}")

    raise Exception(f"Gemini 生图返回异常: {json.dumps(data, ensure_ascii=False)[:500]}")


def overlay_city_text(bg_image_bytes: bytes, city_name: str, en_name: str, is_list_cover: bool = True) -> bytes:
    """
    在背景图上叠加城市名（竖排书法）+ 英文名（横排大写带间距）
    返回处理后的图片二进制数据
    """
    from PIL import Image, ImageDraw, ImageFont, ImageFilter
    import io

    img = Image.open(io.BytesIO(bg_image_bytes)).convert("RGBA")
    w, h = img.size

    # 创建文字图层
    txt_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(txt_layer)

    if is_list_cover:
        # === listCover：1:1 方形，左侧竖排城市名 + 中间英文名 ===

        # 1. 竖排书法城市名（左侧）
        cn_font_size = int(w * 0.14)  # 字体大小约为图片宽度的14%
        cn_font = _get_font(cn_font_size)

        # 竖排：从上到下逐字排列
        chars = list(city_name)
        char_h = cn_font_size + int(cn_font_size * 0.15)
        total_h = len(chars) * char_h
        start_y = (h - total_h) // 2
        x_cn = int(w * 0.08)  # 左侧位置

        for i, ch in enumerate(chars):
            y = start_y + i * char_h
            # 文字阴影
            shadow_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
            shadow_draw = ImageDraw.Draw(shadow_layer)
            shadow_draw.text((x_cn + 2, y + 2), ch, font=cn_font, fill=(0, 0, 0, 180))
            shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(3))
            txt_layer = Image.alpha_composite(txt_layer, shadow_layer)
            draw = ImageDraw.Draw(txt_layer)
            # 白色文字
            draw.text((x_cn, y), ch, font=cn_font, fill=(255, 255, 255, 230))

        # 2. 英文名（横排，大写带间距，中间偏下）
        en_font_size = int(w * 0.05)
        en_font = _get_font(en_font_size)

        en_text = " ".join(en_name.upper())  # 字母间加空格
        tw, _ = draw.textsize(en_text, font=en_font)
        x_en = (w - tw) // 2
        y_en = int(h * 0.72)

        # 阴影
        shadow_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
        shadow_draw = ImageDraw.Draw(shadow_layer)
        shadow_draw.text((x_en + 1, y_en + 1), en_text, font=en_font, fill=(0, 0, 0, 160))
        shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(2))
        txt_layer = Image.alpha_composite(txt_layer, shadow_layer)
        draw = ImageDraw.Draw(txt_layer)
        draw.text((x_en, y_en), en_text, font=en_font, fill=(255, 255, 255, 220))

    else:
        # === heroImage：4:3 横版，不加文字 ===
        pass

    # 合成
    result = Image.alpha_composite(img, txt_layer)

    # 转为 JPEG
    output = io.BytesIO()
    result = result.convert("RGB")
    result.save(output, format="JPEG", quality=92)
    return output.getvalue()


# ============ Supabase 操作 ============
def supabase_get(path: str, params: dict = None):
    """GET 请求 Supabase REST API"""
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    resp = requests.get(url, headers=HEADERS, params=params, timeout=30)
    resp.raise_for_status()
    return resp.json()


def supabase_post(path: str, data: dict):
    """POST 请求 Supabase REST API"""
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    resp = requests.post(url, headers=HEADERS, json=data, timeout=30)
    resp.raise_for_status()
    return resp.json()


def supabase_patch(path: str, data: dict, params: dict = None):
    """PATCH 请求 Supabase REST API"""
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    resp = requests.patch(url, headers=HEADERS, json=data, params=params, timeout=30)
    resp.raise_for_status()
    return resp.json()


def supabase_upload_image(storage_path: str, image_bytes: bytes, content_type: str = "image/jpeg") -> str:
    """上传图片到 Supabase Storage，返回公开 URL"""
    url = f"{SUPABASE_URL}/storage/v1/object/images/{storage_path}"
    resp = requests.post(
        url,
        headers={
            "apikey": SUPABASE_SERVICE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
            "Content-Type": content_type,
        },
        data=image_bytes,
        timeout=60,
    )
    if resp.status_code == 409:
        # 文件已存在，用 PUT 覆盖
        resp = requests.put(
            url,
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                "Content-Type": content_type,
            },
            data=image_bytes,
            timeout=60,
        )
    resp.raise_for_status()
    public_url = f"{SUPABASE_URL}/storage/v1/object/public/images/{storage_path}"
    return public_url


def get_existing_cities() -> list:
    """获取所有现有城市"""
    return supabase_get("cities", {"select": "id,name,enName,listCover,heroImage,paragraphs,attractions,food,transportation,history,bestTravelTime,translations"})


def create_city_record(city_name: str, en_name: str):
    """在 Supabase 创建城市记录"""
    city_id = re.sub(r"[^a-z0-9]", "", en_name.lower())
    if not city_id:
        city_id = f"city_{int(time.time())}"

    try:
        result = supabase_post("cities", {
            "id": city_id,
            "name": city_name,
            "enName": en_name,
        })
        print(f"  ✅ 创建记录 {city_name} (id: {city_id})")
        return city_id
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 409:
            # ID 冲突，加时间戳
            city_id = f"{city_id}_{int(time.time())}"
            try:
                result = supabase_post("cities", {
                    "id": city_id,
                    "name": city_name,
                    "enName": en_name,
                })
                print(f"  ✅ 创建记录 {city_name} (id: {city_id})")
                return city_id
            except Exception as e2:
                print(f"  ❌ 创建 {city_name} 失败: {e2}")
                return None
        print(f"  ❌ 创建 {city_name} 失败: {e}")
        return None


# ============ AI 生成城市数据 ============
def generate_city_data(city_name: str, en_name: str):
    """用 DeepSeek 生成城市完整数据"""
    print(f"  🤖 生成 {city_name}({en_name}) 数据...")

    prompt = f"""You are a world-class travel curator. Generate a deep, high-value city guide for '{city_name}' ({en_name}) in China.

Output requirements:
- Comprehensive introduction (paragraphs & enParagraphs), MUST be exactly 4 distinct paragraphs:
    1. Geographical location and climate (approx 100 words each language).
    2. Historical significance and unique city charm (approx 100 words each language).
    3. Cultural atmosphere, food specialties, and local lifestyle (approx 100 words each language).
    4. Modern development, international standing, and future vision (approx 100 words each language).
- Best Travel Time (bestTravelTime.paragraphs & enParagraphs), MUST be exactly 3 distinct paragraphs.
- Comprehensiveness Requirements:
    - Attractions: Provide 5 major attractions, covering historical, cultural, and modern sites. Include rating field (AAAAA/AAAA/AAA).
    - Food: Provide 5 local specialties, including main dishes, street foods, and traditional desserts. Include imageIdx (1-6).
    - Transportation: Provide a highly detailed guide for Plane, Train, and Bus/Local Metro (3 entries).
    - History: Provide 5 key historical milestones.
    - Highlights: Include 2 World Heritage sites (if any, empty array if none) and 2 Intangible Cultural Heritages (if any, empty array if none).
- Every field must have its corresponding 'en' field filled.
- DO NOT mix both languages in a single field.
- DO NOT provide any image URLs. Leave heroImage, listCover, and all imageUrl fields as empty strings "".
- Tags should include visa-free info if the city supports 72h/144h transit visa exemption.

Format: {{
  "name": "{city_name}",
  "enName": "{en_name}",
  "paragraphs": ["para1", "para2", "para3", "para4"],
  "enParagraphs": ["enPara1", "enPara2", "enPara3", "enPara4"],
  "tags": [{{"text": "string", "enText": "string", "color": "string"}}],
  "info": {{"area": "string", "population": "string"}},
  "stats": {{"wantToVisit": number, "recommended": number}},
  "bestTravelTime": {{"strongText": "string", "enStrongText": "string", "paragraphs": ["p1","p2","p3"], "enParagraphs": ["ep1","ep2","ep3"]}},
  "history": [{{"year": "string", "enYear": "string", "title": "string", "enTitle": "string", "desc": "string", "enDesc": "string"}}],
  "attractions": [{{"name": "string", "enName": "string", "desc": "string", "enDesc": "string", "price": "string", "enPrice": "string", "season": "string", "enSeason": "string", "time": "string", "enTime": "string", "rating": "string"}}],
  "worldHeritage": [{{"name": "string", "enName": "string", "year": "string", "enYear": "string", "desc": "string", "enDesc": "string"}}],
  "intangibleHeritage": [{{"name": "string", "enName": "string", "year": "string", "enYear": "string", "desc": "string", "enDesc": "string", "imageUrl": ""}}],
  "transportation": [{{"iconName": "Plane", "title": "string", "enTitle": "string", "desc": "string", "enDesc": "string", "price": "string", "enPrice": "string"}}],
  "food": [{{"name": "string", "enName": "string", "pinyin": "string", "price": "string", "desc": "string", "enDesc": "string", "ingredients": "string", "enIngredients": "string", "imageIdx": 1}}]
}}"""

    try:
        raw = ask_deepseek(prompt, max_tokens=8000)
        data = json.loads(clean_json(raw))
        print(f"  ✅ {city_name} 数据生成完成")
        return data
    except Exception as e:
        print(f"  ❌ {city_name} 数据生成失败: {e}")
        return None


# ============ AI 翻译 ============
def translate_city_data(city_name: str, city_data: dict) -> dict:
    """翻译城市数据为 8 种语言"""
    languages = {
        "ja": "Japanese", "ko": "Korean", "ru": "Russian", "fr": "French",
        "es": "Spanish", "de": "German", "tw": "Traditional Chinese", "it": "Italian",
    }
    translations = {}

    # 准备需要翻译的关键内容
    tags_summary = json.dumps([{"text": t.get("text", ""), "enText": t.get("enText", "")} for t in (city_data.get("tags") or [])], ensure_ascii=False)
    attractions_summary = json.dumps([{"name": a.get("name", ""), "enName": a.get("enName", "")} for a in (city_data.get("attractions") or [])], ensure_ascii=False)
    food_summary = json.dumps([{"name": f.get("name", ""), "enName": f.get("enName", "")} for f in (city_data.get("food") or [])], ensure_ascii=False)
    transport_summary = json.dumps([{"title": t.get("title", ""), "enTitle": t.get("enTitle", "")} for t in (city_data.get("transportation") or [])], ensure_ascii=False)

    btt = city_data.get("bestTravelTime") or {}

    for lang_code, lang_name in languages.items():
        print(f"    🌐 翻译 {city_name} -> {lang_name}...")

        prompt = f"""Translate the following city data to {lang_name}.
Keep all JSON keys in English. Only translate the values.
For "tw" (Traditional Chinese), convert Simplified Chinese to Traditional Chinese.
For other languages, translate from the English values where available, otherwise from Chinese.
Return valid JSON only.

City data to translate (key fields only):
{{
  "name": "{city_data.get('name', '')}",
  "enName": "{city_data.get('enName', '')}",
  "tags": {tags_summary},
  "paragraphs": {json.dumps((city_data.get('paragraphs') or [])[:2], ensure_ascii=False)},
  "bestTravelTime": {{
    "strongText": "{btt.get('strongText', '')}",
    "paragraphs": {json.dumps((btt.get('paragraphs') or [])[:1], ensure_ascii=False)}
  }},
  "attractions": {attractions_summary},
  "food": {food_summary},
  "transportation": {transport_summary}
}}

Format: {{
  "name": "translated name",
  "enName": "romanized name if applicable",
  "tags": [{{"text": "translated tag", "enText": "translated enText"}}],
  "paragraphs": ["translated paragraph 1", "translated paragraph 2"],
  "bestTravelTime": {{"strongText": "translated", "paragraphs": ["translated"]}},
  "attractions": [{{"name": "translated", "enName": "translated"}}],
  "food": [{{"name": "translated", "enName": "translated"}}],
  "transportation": [{{"title": "translated", "enTitle": "translated"}}]
}}"""

        try:
            raw = ask_deepseek(prompt, temperature=0.3, max_tokens=4000)
            translations[lang_code] = json.loads(clean_json(raw))
            print(f"    ✅ {lang_name} 完成")
        except Exception as e:
            print(f"    ❌ {lang_name} 失败: {e}")
            translations[lang_code] = {}

        time.sleep(0.5)  # 限流

    return translations


# ============ 生成封面图 ============
def generate_city_images(city_name: str, en_name: str):
    """
    生成城市封面图：
    1. Gemini 生成纯背景图（地标建筑风景，无文字）
    2. PIL 本地叠加书法字体城市名 + 英文名
    返回 (listCoverUrl, heroImageUrl)
    """
    print(f"  🎨 生成 {city_name} 封面图（Gemini 背景 + PIL 文字叠加）...")

    # listCover 背景提示词（1:1 方形，无文字）
    list_bg_prompt = (
        f"Generate a square (1:1) travel photograph of the most iconic landmark of {city_name} ({en_name}), China. "
        f"Style: dark, moody, atmospheric, professional travel photography with soft golden hour lighting and deep shadows. "
        f"The landmark should dominate the frame. Leave some space on the left side for text overlay. "
        f"IMPORTANT: NO TEXT, NO LETTERS, NO WORDS, NO WATERMARK in the image."
    )

    # heroImage 背景提示词（4:3 横版，无文字）
    hero_bg_prompt = (
        f"Generate a wide panoramic travel photograph of {en_name}, China. "
        f"Showcasing the city's most famous landmarks and natural scenery in a breathtaking panoramic view. "
        f"Dramatic sunset sky, cinematic composition, ultra-wide angle, "
        f"professional travel photography, 4K quality. "
        f"IMPORTANT: NO TEXT, NO LETTERS, NO WORDS, NO WATERMARK in the image."
    )

    list_cover_url = None
    hero_image_url = None

    # 生成 listCover：Gemini 背景 + PIL 文字叠加
    try:
        print(f"    🖼️  生成 listCover 背景 ({city_name})...")
        bg_bytes = generate_bg_with_gemini(list_bg_prompt, reference_image_url=REFERENCE_IMAGE_URL)

        print(f"    ✏️  叠加文字：{city_name} / {en_name.upper()}...")
        final_bytes = overlay_city_text(bg_bytes, city_name, en_name, is_list_cover=True)

        ts = int(time.time() * 1000)
        storage_path = f"city_list_covers/{ts}-{en_name.lower()}.jpg"
        list_cover_url = supabase_upload_image(storage_path, final_bytes, "image/jpeg")
        print(f"    ✅ listCover 上传成功: {list_cover_url[:80]}...")
    except Exception as e:
        print(f"    ❌ listCover 生成失败: {e}")

    time.sleep(2)  # 限流

    # 生成 heroImage：纯背景，不加文字
    try:
        print(f"    🖼️  生成 heroImage ({city_name})...")
        bg_bytes = generate_bg_with_gemini(hero_bg_prompt, reference_image_url=None)

        # heroImage 不加文字，直接上传
        ts = int(time.time() * 1000)
        storage_path = f"city_covers/{ts}-{en_name.lower()}bg.jpg"
        hero_image_url = supabase_upload_image(storage_path, bg_bytes, "image/jpeg")
        print(f"    ✅ heroImage 上传成功: {hero_image_url[:80]}...")
    except Exception as e:
        print(f"    ❌ heroImage 生成失败: {e}")

    return list_cover_url, hero_image_url


# ============ 写入 Supabase ============
def update_city_to_supabase(city_id: str, city_name: str, city_data: dict, translations: dict = None, list_cover: str = None, hero_image: str = None) -> bool:
    """更新城市数据到 Supabase"""
    update_data = {}

    # 基础字段
    simple_fields = [
        "name", "enName", "tags", "info", "stats", "bestTravelTime",
        "history", "attractions", "worldHeritage", "intangibleHeritage",
        "transportation", "food",
    ]

    # camelCase -> 数据库字段映射
    field_map = {
        "enName": "enName",
        "bestTravelTime": "bestTravelTime",
        "worldHeritage": "worldHeritage",
        "intangibleHeritage": "intangibleHeritage",
    }

    for field in simple_fields:
        if field in city_data and city_data[field]:
            db_field = field_map.get(field, field)
            update_data[db_field] = city_data[field]

    # paragraphs 字段映射
    if city_data.get("paragraphs"):
        update_data["paragraphs"] = city_data["paragraphs"]
    if city_data.get("enParagraphs"):
        update_data["enParagraphs"] = city_data["enParagraphs"]

    # 封面图
    if list_cover:
        update_data["listCover"] = list_cover
    if hero_image:
        update_data["heroImage"] = hero_image

    # SEO 字段
    if city_data.get("paragraphs"):
        update_data["description"] = " ".join(city_data["paragraphs"][:2])
        update_data["short_description"] = city_data["paragraphs"][0][:120] if city_data["paragraphs"] else ""

    # 翻译
    if translations:
        update_data["translations"] = translations

    try:
        supabase_patch("cities", update_data, {"id": f"eq.{city_id}"})
        print(f"  ✅ {city_name} 数据写入 Supabase 成功")
        return True
    except Exception as e:
        print(f"  ❌ {city_name} 数据写入失败: {e}")
        return False


# ============ 检查数据完整性 ============
def check_completeness():
    """检查所有城市数据完整性"""
    cities = get_existing_cities()
    print(f"\n📋 检查 {len(cities)} 个城市的数据完整性:\n")

    incomplete = []
    for city in cities:
        issues = []

        if not city.get("paragraphs") or len(city.get("paragraphs", [])) == 0:
            issues.append("缺少 paragraphs")
        if not city.get("enParagraphs") or len(city.get("enParagraphs", [])) == 0:
            issues.append("缺少 enParagraphs")
        if not city.get("attractions") or len(city.get("attractions", [])) == 0:
            issues.append("缺少 attractions")
        if not city.get("food") or len(city.get("food", [])) == 0:
            issues.append("缺少 food")
        if not city.get("transportation") or len(city.get("transportation", [])) == 0:
            issues.append("缺少 transportation")
        if not city.get("history") or len(city.get("history", [])) == 0:
            issues.append("缺少 history")
        if not city.get("bestTravelTime"):
            issues.append("缺少 bestTravelTime")
        if not city.get("listCover"):
            issues.append("缺少 listCover 封面图")
        if not city.get("heroImage"):
            issues.append("缺少 heroImage 大图")
        if not city.get("translations") or len(city.get("translations", {})) < 5:
            issues.append("缺少 translations (多语言)")

        status = "✅" if len(issues) == 0 else "⚠️"
        msg = "完整" if len(issues) == 0 else ", ".join(issues)
        print(f"  {status} {city.get('name', '?')} ({city.get('enName', '?')}): {msg}")

        if issues:
            incomplete.append({"id": city["id"], "name": city.get("name", ""), "issues": issues})

    return incomplete


# ============ 列出所有城市 ============
def list_cities():
    """列出所有城市"""
    cities = get_existing_cities()
    print(f"\n📍 当前城市列表 ({len(cities)} 个):\n")
    for i, city in enumerate(cities, 1):
        has_cover = "🖼️" if city.get("listCover") else "❌"
        has_data = "📝" if city.get("paragraphs") else "❌"
        print(f"  {i:2d}. {city.get('name', '?')} ({city.get('enName', '?')}) [id: {city['id']}] {has_cover} {has_data}")


# ============ 处理单个城市 ============
def process_city(city_name: str, en_name: str, existing_cities: list, only_new: bool = False, skip_images: bool = False) -> bool:
    """处理单个城市的完整流程"""
    print(f"\n{'='*60}")
    print(f"🏙️  处理: {city_name} ({en_name})")
    print(f"{'='*60}")

    # 检查城市是否已存在
    existing = None
    for c in existing_cities:
        if c.get("name") == city_name:
            existing = c
            break

    if existing and only_new:
        print(f"  ⏭️  跳过 {city_name}（已存在）")
        return False

    city_id = None
    need_data = True
    need_images = True

    if existing:
        city_id = existing["id"]
        # 检查是否需要更新数据
        if existing.get("paragraphs") and len(existing.get("paragraphs", [])) > 0:
            need_data = False
            print(f"  📝 数据已存在，跳过数据生成")
        # 检查是否需要封面图
        if existing.get("listCover") and existing.get("heroImage"):
            need_images = False
            print(f"  🖼️  封面图已存在，跳过生图")
    else:
        # 创建新记录
        city_id = create_city_record(city_name, en_name)
        if not city_id:
            return False

    if not need_data and not need_images:
        print(f"  ✅ {city_name} 数据完整，无需更新")
        return True

    # Step 1: 生成城市数据
    city_data = None
    translations = None
    if need_data:
        city_data = generate_city_data(city_name, en_name)
        if city_data:
            city_data["name"] = city_name
            city_data["enName"] = en_name
            # Step 2: 翻译
            translations = translate_city_data(city_name, city_data)
        else:
            print(f"  ⚠️  数据生成失败，将只处理封面图")

    # Step 3: 生成封面图
    list_cover = None
    hero_image = None
    if need_images and not skip_images:
        list_cover, hero_image = generate_city_images(city_name, en_name)

    # Step 4: 写入 Supabase
    if city_data or list_cover or hero_image:
        data_to_update = city_data or {}
        update_city_to_supabase(city_id, city_name, data_to_update, translations, list_cover, hero_image)
    else:
        print(f"  ⚠️  没有数据可更新")

    print(f"  🎉 {city_name} 处理完成!")
    return True


# ============ 只补充封面图 ============
def fill_missing_images():
    """为缺少封面图的城市补图"""
    cities = get_existing_cities()
    missing = [c for c in cities if not c.get("listCover") or not c.get("heroImage")]

    if not missing:
        print("\n✅ 所有城市都有封面图，无需补图")
        return

    print(f"\n🖼️  发现 {len(missing)} 个城市缺少封面图:\n")
    for c in missing:
        print(f"  - {c.get('name', '?')} ({c.get('enName', '?')})")

    for city in missing:
        city_name = city.get("name", "")
        en_name = city.get("enName", "")
        city_id = city["id"]

        print(f"\n🎨 为 {city_name} 生成封面图...")
        list_cover, hero_image = generate_city_images(city_name, en_name)

        update_data = {}
        if list_cover:
            update_data["listCover"] = list_cover
        if hero_image:
            update_data["heroImage"] = hero_image

        if update_data:
            try:
                supabase_patch("cities", update_data, {"id": f"eq.{city_id}"})
                print(f"  ✅ {city_name} 封面图更新成功")
            except Exception as e:
                print(f"  ❌ {city_name} 封面图更新失败: {e}")

        time.sleep(1)


# ============ 自动检测并补充不完整城市 ============
def auto_fill_incomplete():
    """自动检测并补充数据不完整的城市"""
    incomplete = check_completeness()

    if not incomplete:
        print("\n✅ 所有城市数据完整!")
        return

    print(f"\n🚀 开始补充 {len(incomplete)} 个不完整城市...\n")

    for city_info in incomplete:
        city_id = city_info["id"]
        city_name = city_info["name"]
        en_name = CITY_EN_MAP.get(city_name, city_name)
        issues = city_info["issues"]

        print(f"\n{'='*60}")
        print(f"🏙️  补充: {city_name} ({en_name})")
        print(f"  缺少: {', '.join(issues)}")
        print(f"{'='*60}")

        need_data = any(k in " ".join(issues) for k in ["paragraphs", "attractions", "food", "transportation", "history", "bestTravelTime", "translations"])
        need_images = any(k in " ".join(issues) for k in ["listCover", "heroImage"])

        # 生成数据
        city_data = None
        translations = None
        if need_data:
            city_data = generate_city_data(city_name, en_name)
            if city_data:
                city_data["name"] = city_name
                city_data["enName"] = en_name
                translations = translate_city_data(city_name, city_data)

        # 生成封面图
        list_cover = None
        hero_image = None
        if need_images:
            list_cover, hero_image = generate_city_images(city_name, en_name)

        # 更新
        data_to_update = city_data or {}
        update_city_to_supabase(city_id, city_name, data_to_update, translations, list_cover, hero_image)

        time.sleep(1)


# ============ 主入口 ============
def main():
    args = sys.argv[1:]

    # --list
    if "--list" in args:
        list_cities()
        return

    # --check
    if "--check" in args:
        check_completeness()
        return

    # --only-images
    if "--only-images" in args:
        fill_missing_images()
        return

    # 解析城市列表
    only_new = "--only-new" in args
    city_arg = None
    for a in args:
        if not a.startswith("--"):
            city_arg = a
            break

    if city_arg:
        # 批量处理指定城市
        city_names = [c.strip() for c in re.split(r"[,，、\s]+", city_arg) if c.strip()]
        print(f"\n🚀 批量处理 {len(city_names)} 个城市: {', '.join(city_names)}\n")

        existing_cities = get_existing_cities()

        for city_name in city_names:
            en_name = CITY_EN_MAP.get(city_name, city_name)
            process_city(city_name, en_name, existing_cities, only_new)
            time.sleep(1)
    else:
        # 自动检测并补充不完整城市
        auto_fill_incomplete()

    print("\n✨ 全部完成!")


if __name__ == "__main__":
    main()
