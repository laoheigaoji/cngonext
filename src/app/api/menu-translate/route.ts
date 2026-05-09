import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const LANG_NAMES: Record<string, string> = {
  en: 'English', ja: 'Japanese', ko: 'Korean', ru: 'Russian',
  fr: 'French', es: 'Spanish', de: 'German', it: 'Italian', tw: 'Traditional Chinese',
};

const CURRENCY_MAP: Record<string, { code: string; symbol: string; rate: number }> = {
  en: { code: 'USD', symbol: '$', rate: 0.14 },
  ja: { code: 'JPY', symbol: '¥', rate: 21.5 },
  ko: { code: 'KRW', symbol: '₩', rate: 195 },
  ru: { code: 'RUB', symbol: '₽', rate: 12.8 },
  fr: { code: 'EUR', symbol: '€', rate: 0.13 },
  es: { code: 'EUR', symbol: '€', rate: 0.13 },
  de: { code: 'EUR', symbol: '€', rate: 0.13 },
  it: { code: 'EUR', symbol: '€', rate: 0.13 },
  tw: { code: 'TWD', symbol: 'NT$', rate: 4.55 },
  zh: { code: 'CNY', symbol: '¥', rate: 1 },
};

function buildPrompt(lang: string): string {
  const targetLang = LANG_NAMES[lang] || 'English';
  const isZh = lang === 'zh';
  const isTw = lang === 'tw';

  if (isZh) {
    return `你是中国美食专家。分析这张菜单图片。
1. 提取每道菜的中文名。
2. 提供专业英文名(enName)。
3. 提取价格数字。
4. 中文描述(description)和英文描述(enDescription)各一句。
5. 中文食材(ingredients)和英文食材(enIngredients)各3-5个。
6. 中文分类(category)和英文分类(enCategory)。
7. 英文过敏原(allergens)，如["peanuts","shellfish","soy","gluten"]。
8. 英文膳食标签(dietary)，如["spicy","vegetarian","vegan","halal"]。

只输出JSON数组，不要解释。示例：
[{"name":"宫保鸡丁","enName":"Kung Pao Chicken","price":38,"description":"经典川菜","enDescription":"Classic Sichuan dish","ingredients":["鸡肉","花生"],"enIngredients":["chicken","peanuts"],"category":"川菜","enCategory":"Sichuan","allergens":["peanuts"],"dietary":["spicy"]}]`;
  }

  const localFields = isTw
    ? `2. 繁體中文名稱作為本地化名稱(localName)。
4. 繁體中文描述(localDescription)一句。
5. 繁體中文食材(localIngredients)3-5個。
6. 繁體中文分類(localCategory)。`
    : `2. Professional ${targetLang} translation as localName.
4. ${targetLang} description (localDescription) in 1 sentence.
5. ${targetLang} ingredients (localIngredients) 3-5 items.
6. ${targetLang} category (localCategory).`;

  const localExample = isTw
    ? `"localName":"宮保雞丁","localDescription":"經典川菜","localIngredients":["雞肉","花生"],"localCategory":"川菜"`
    : `"localName":"Poulet Kung Pao","localDescription":"Plat classique du Sichuan","localIngredients":["poulet","arachides"],"localCategory":"Cuisine du Sichuan"`;

  return `You are a Chinese food expert and translator. Analyze this menu image.
1. Extract every dish with its Chinese name.
${localFields}
3. Extract the price as a number.
5. English description (enDescription) in 1 sentence.
5. English ingredients (enIngredients) 3-5 items.
6. English category (enCategory).
7. Common allergens in English (allergens).
8. Dietary info in English (dietary).

CRITICAL: Output ONLY a JSON array. No explanation. Example:
[{"name":"宫保鸡丁",${localExample},"enName":"Kung Pao Chicken","price":38,"enDescription":"Classic Sichuan dish","enIngredients":["chicken","peanuts"],"enCategory":"Sichuan","allergens":["peanuts"],"dietary":["spicy"]}]`;
}

export async function POST(req: NextRequest) {
  try {
    const { image, mimeType, lang = 'en' } = await req.json();

    if (!image || !mimeType) {
      return NextResponse.json({ error: 'Missing image or mimeType' }, { status: 400 });
    }

    const prompt = buildPrompt(lang);

    // Use Cloudflare Workers AI binding
    const env = (process as any).env || {};
    const ai = env.AI;

    if (!ai) {
      const geminiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
      if (!geminiKey) {
        return NextResponse.json({ error: 'No AI service available' }, { status: 500 });
      }
      return await fallbackGemini(image, mimeType, geminiKey, prompt);
    }

    // Cloudflare Workers AI - Llama 3.2 Vision
    const response = await ai.run('@cf/meta/llama-3.2-11b-vision-instruct', {
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${image}` } }
          ]
        }
      ],
      max_tokens: 2048,
    });

    const text = (response as any)?.response || '';
    const menuItems = extractJSON(text);

    return NextResponse.json({ items: addPriceConversions(menuItems, lang) });
  } catch (error: any) {
    console.error('Menu translation error:', error);
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    );
  }
}

async function fallbackGemini(image: string, mimeType: string, apiKey: string, prompt: string) {
  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey });

  const result = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: {
      parts: [
        { text: prompt },
        { inlineData: { data: image, mimeType } }
      ]
    }
  });

  const text = result.text || '';
  const menuItems = extractJSON(text);

  return NextResponse.json({ items: addPriceConversions(menuItems, 'en') });
}

function extractJSON(text: string): any[] {
  let cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  try {
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : [];
  } catch {}
  const match = cleaned.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      return Array.isArray(parsed) ? parsed : [];
    } catch {}
  }
  return [];
}

function addPriceConversions(items: any[], lang: string) {
  const cur = CURRENCY_MAP[lang] || CURRENCY_MAP.en;
  return items.map((item: any) => {
    const priceInCny = parseFloat(item.price) || 0;
    return {
      ...item,
      price: priceInCny,
      convertedPrice: lang === 'zh' ? 0 : +(priceInCny * cur.rate).toFixed(2),
      currencyCode: cur.code,
      currencySymbol: cur.symbol,
      allergens: Array.isArray(item.allergens) ? item.allergens : [],
      dietary: Array.isArray(item.dietary) ? item.dietary : [],
    };
  });
}
