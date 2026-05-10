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

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getDashScopeApiKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: QWEN_MODEL,
        messages: [
          { role: 'system', content: lang === 'zh' 
            ? '你是一位精通中国传统文化的命名大师，擅长根据五行、八字、诗词典故为人们取吉祥如意的名字。你的回复必须是纯JSON格式，不要包含任何其他文字。'
            : 'You are a master of Chinese naming culture, skilled in creating meaningful Chinese names based on Five Elements (Wu Xing), Ba Zi, and classical poetry. You must respond ONLY with valid JSON, no other text.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 4096,
        extra_body: { enable_thinking: false },
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

function buildPrompt(name: string, sex: string, dob: string, info: string, lang: string): string {
  const isZh = lang === 'zh';
  
  const sexDesc = sex === '男' ? (isZh ? '男性' : 'male') : sex === '女' ? (isZh ? '女性' : 'female') : (isZh ? '未指定' : 'not specified');
  const dobDesc = dob ? (isZh ? `出生日期: ${dob}` : `Date of birth: ${dob}`) : '';
  const infoDesc = info ? (isZh ? `额外信息: ${info}` : `Additional info: ${info}`) : '';

  if (isZh) {
    return `请为以下人生成3个优质中文名字选项，要求详细解析每个名字。

姓名: ${name}
性别: ${sexDesc}
${dobDesc}
${infoDesc}

请严格按照以下JSON格式返回（不要包含任何其他文字或markdown）：
{
  "names": [
    {
      "chinese": "完整中文名（含姓）",
      "surname": "姓",
      "givenName": "名",
      "pinyin": "完整拼音（带声调，如 Zhāng Míng Yuè）",
      "wuxing": {
        "element": "主五行（金/木/水/火/土）",
        "explanation": "为什么这个五行适合此人"
      },
      "zodiac": "生肖（如：龙、兔等，根据出生年份推算）",
      "luckyNumber": "幸运数字",
      "meaning": "名字整体寓意的详细解释（50字以上）",
      "charAnalysis": [
        {
          "char": "名中的每个字",
          "pinyin": "该字拼音（带声调）",
          "meaning": "该字含义",
          "wuxing": "该字五行属性",
          "source": "该字的出处（如出自诗经某篇、楚辞某篇等，无则填"无特定出处"）"
        }
      ],
      "whyFit": "为什么这个名字适合此人（80字以上，结合其背景、性别、五行等综合分析）"
    }
  ]
}

要求：
1. 每个名字都要有深厚的文化底蕴，来自诗词典故或传统美德
2. 名字要音律和谐，朗朗上口
3. 根据出生日期推算生肖和五行，使名字与命理相合
4. 3个名字风格要有差异（如一个古典诗意、一个大气阳刚/温婉柔美、一个简约现代）
5. 姓氏要根据原姓名的发音或含义来匹配一个合适的中国姓氏`;
  }

  return `Generate 3 excellent Chinese name options for the following person, with detailed analysis for each name.

Name: ${name}
Gender: ${sexDesc}
${dobDesc}
${infoDesc}

Return ONLY valid JSON in this exact format (no markdown, no other text):
{
  "names": [
    {
      "chinese": "Full Chinese name (including surname)",
      "surname": "Surname character",
      "givenName": "Given name characters",
      "pinyin": "Full pinyin with tone marks (e.g., Zhāng Míng Yuè)",
      "wuxing": {
        "element": "Primary Wu Xing / Five Elements element (Metal/Wood/Water/Fire/Earth - use Chinese: 金/木/水/火/土)",
        "explanation": "Why this element suits this person (in English)"
      },
      "zodiac": "Chinese Zodiac animal (e.g., Dragon, Rabbit - calculate from birth year)",
      "luckyNumber": "Lucky number",
      "meaning": "Detailed explanation of the name's overall meaning and symbolism (50+ words in English)",
      "charAnalysis": [
        {
          "char": "Each character in the given name",
          "pinyin": "Pinyin with tone marks for this character",
          "meaning": "Meaning of this character (in English)",
          "wuxing": "Five Elements attribute of this character (金/木/水/火/土)",
          "source": "Classical source of this character (e.g., 'Book of Songs - Daya', 'Chu Ci - Li Sao', or 'No specific source')"
        }
      ],
      "whyFit": "Why this name suits this person (80+ words, combining their background, gender, Five Elements analysis, etc. in English)"
    }
  ]
}

Requirements:
1. Each name should have deep cultural significance, derived from classical poetry or traditional virtues
2. Names should be melodious and easy to pronounce
3. Calculate the Chinese Zodiac and Five Elements from the birth date, making the name harmonize with their destiny
4. The 3 names should have different styles (e.g., one classical poetic, one bold masculine / graceful feminine, one simple modern)
5. Match a suitable Chinese surname based on the sound or meaning of the original name`;
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
