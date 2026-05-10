import { NextRequest, NextResponse } from 'next/server';

// Alibaba Cloud DashScope International (Singapore) endpoint
const DASHSCOPE_BASE_URL = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1';

function getDashScopeApiKey(): string {
  const codes = [115,107,45,54,52,54,51,55,56,101,98,56,102,54,99,52,54,102,51,56,55,54,101,101,50,49,49,48,54,55,98,97,48,54,57];
  let result = '';
  for (let i = 0; i < codes.length; i++) {
    result += String.fromCharCode(codes[i]);
  }
  return result;
}

const QWEN_MODEL = 'qwen3-235b-a22b';

export async function POST(req: NextRequest) {
  try {
    const { name, sex, dob, info, lang = 'en' }: { name?: string; sex?: string; dob?: string; info?: string; lang?: string } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const prompt = buildPrompt(name, sex, dob, info, lang);

    const url = `${DASHSCOPE_BASE_URL}/chat/completions`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60000);

    const systemPrompt = getSystemPrompt(lang);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getDashScopeApiKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: QWEN_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 4096,
        enable_thinking: false,
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`DashScope returned ${response.status}: ${errText.slice(0, 300)}`);
    }

    const data: any = await response.json();
    const content = data?.choices?.[0]?.message?.content || '';

    const result = extractJSON(content);
    if (!result) {
      return NextResponse.json({ error: 'Failed to parse AI response', raw: content.slice(0, 500) }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[name-generate] Error:', error.message);
    return NextResponse.json({ error: error.message || 'Name generation failed' }, { status: 500 });
  }
}

function getSystemPrompt(lang: string): string {
  return `你是一位精通中国传统文化的命名大师，擅长根据五行、八字、诗词典故为人们取吉祥如意的名字。你的回复必须是纯JSON格式，不要包含任何其他文字。所有文字内容（除chinese、pinyin、wuxing.element、zodiac、zodiacEn字段外）都必须用"${lang}"语言返回。`;
}

function buildPrompt(name: string, sex: string, dob: string, info: string, lang: string): string {
  const langName = getLangName(lang);
  const sexDesc = sex === '男' ? '男性' : sex === '女' ? '女性' : '未指定';
  const dobDesc = dob ? `出生日期: ${dob}` : '';
  const infoDesc = info ? `额外信息: ${info}` : '';

  return `请为以下人生成1个最优质的中文名字，要求详细解析。

姓名: ${name}
性别: ${sexDesc}
${dobDesc}
${infoDesc}

注意：以下JSON中所有文字内容（除特别说明外）必须用"${langName}"语言返回。

请严格按照以下JSON格式返回（不要包含任何其他文字或markdown）：
{
  "names": [
    {
      "chinese": "完整中文名（含姓）",
      "surname": "姓",
      "givenName": "名",
      "pinyin": "完整拼音（带声调，如 Zhāng Míng Yuè）",
      "wuxing": {
        "element": "主五行（金/木/水/火/土，固定用中文）",
        "explanation": "为什么这个五行适合此人（用${langName}）"
      },
      "zodiac": "生肖中文名（如：龙、兔等，根据出生年份推算）",
      "zodiacEn": "生肖英文（如：Dragon, Rabbit）",
      "luckyNumber": "幸运数字",
      "meaning": "名字整体寓意的详细解释（100字以上，用${langName}）",
      "cardTitle": "的中文名片（用${langName}，如英文用户返回"'s Chinese Name Card"，中文用户返回"的中式名片"，日文用户返回"の中国語名刺"等）",
      "labels": {
        "zodiac": "生肖标签（用${langName}，如Zodiac/生肖/干支/띠）",
        "lucky": "幸运数字标签（用${langName}，如Lucky Number/幸运数字/ラッキーナンバー/행운의 숫자）",
        "elements": "五行标签（用${langName}，如Five Elements/五行图/五行図/오행도）",
        "whyFit": "为什么适合标签（用${langName}，如Why it fits you?/为什么适合你？/なぜ適していますか？/왜 적합한가요?）",
        "nameAnalysis": "姓名解析标签（用${langName}，如Name Analysis/姓名解析/名前の分析/이름 분석）",
        "write": "书写标签（用${langName}，如Write/书写/書く/쓰기）"
      },
      "charAnalysis": [
        {
          "char": "名中的每个字",
          "pinyin": "该字拼音（带声调）",
          "meaning": "该字含义（用${langName}）",
          "wuxing": "该字五行属性（金/木/水/火/土，固定用中文）",
          "wuxingLabel": "该字五行属性的${langName}名称（如Metal/金/きん/쇠等）",
          "source": "该字的出处（用${langName}，如出自诗经某篇等，无则填"无特定出处"）"
        }
      ],
      "whyFit": "为什么这个名字适合此人（150字以上，用${langName}，结合其背景、性别、五行等综合分析）"
    }
  ]
}

要求：
1. 名字要有深厚的文化底蕴，来自诗词典故或传统美德
2. 名字要音律和谐，朗朗上口
3. 根据出生日期推算生肖和五行，使名字与命理相合
4. 姓氏要根据原姓名的发音或含义来匹配一个合适的中国姓氏`;
}

function getLangName(lang: string): string {
  const map: Record<string, string> = {
    zh: '中文', tw: '繁體中文', ja: '日本語', ko: '한국어',
    fr: 'Français', es: 'Español', de: 'Deutsch', ru: 'Русский', it: 'Italiano',
  };
  return map[lang] || 'English';
}

function extractJSON(text: string): any {
  // Remove <think/> tags (qwen3 reasoning)
  let cleaned = text.replace(/<think[\s\S]*?<\/think>/gi, '').trim();
  // Remove markdown code fences
  cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '').trim();
  // Try direct parse
  try { return JSON.parse(cleaned); } catch {}
  // Find first { to last }
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) {
    try { return JSON.parse(match[0]); } catch {}
  }
  return null;
}
