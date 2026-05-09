import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const runtime = 'edge';

const CF_ACCOUNT_ID = '0a28250e63bf217f833feabaf84a25a1';

function getApiToken(): string {
  try {
    const { env } = getCloudflareContext();
    const token = (env as any).CF_AI_API_TOKEN;
    if (token) return token;
  } catch {}
  return process.env.CF_AI_API_TOKEN || '';
}

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

const VISION_MODELS = [
  '@cf/meta/llama-4-scout-17b-16e-instruct',
  '@cf/mistralai/mistral-small-3.1-24b-instruct',
  '@cf/moonshotai/kimi-k2.6',
  '@cf/google/gemma-4-26b-a4b-it',
];

// Call via AI binding (preferred in Cloudflare Workers/Pages)
async function callViaBinding(modelId: string, image: string, mimeType: string, prompt: string): Promise<string> {
  const { env } = getCloudflareContext();
  const ai = (env as any).AI;
  if (!ai) throw new Error('AI binding not available');

  const response = await ai.run(modelId, {
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

  return (response as any)?.response || '';
}

// Call via REST API (fallback)
async function callViaRestAPI(modelId: string, image: string, mimeType: string, prompt: string): Promise<string> {
  const apiToken = getApiToken();
  if (!apiToken) throw new Error('CF_AI_API_TOKEN not configured');

  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${modelId}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
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
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`REST API ${modelId} returned ${response.status}: ${errText.slice(0, 300)}`);
  }

  const data: any = await response.json();
  return data?.result?.response || data?.response || '';
}

export async function POST(req: NextRequest) {
  try {
    const { image, mimeType, lang = 'en' }: { image?: string; mimeType?: string; lang?: string } = await req.json();

    if (!image || !mimeType) {
      return NextResponse.json({ error: 'Missing image or mimeType' }, { status: 400 });
    }

    const prompt = buildPrompt(lang);

    // Try vision models in order: Binding first, REST API fallback
    let lastError: any;
    for (const modelId of VISION_MODELS) {
      // Strategy 1: AI Binding (works in Cloudflare Workers/Pages natively)
      try {
        console.log(`[menu-translate] Trying Binding with ${modelId}...`);
        const text = await callViaBinding(modelId, image, mimeType, prompt);
        console.log(`[menu-translate] Binding ${modelId} response length:`, text?.length);
        if (text && text.trim().length >= 10) {
          const menuItems = extractJSON(text);
          if (menuItems.length > 0) {
            console.log(`[menu-translate] Success via Binding with ${modelId}, items:`, menuItems.length);
            return NextResponse.json({ items: addPriceConversions(menuItems, lang) });
          }
        }
        lastError = new Error(`Binding ${modelId}: empty or unparseable response`);
      } catch (bindErr: any) {
        console.error(`[menu-translate] Binding ${modelId} failed:`, bindErr.message);
        lastError = bindErr;
      }

      // Strategy 2: REST API fallback
      try {
        console.log(`[menu-translate] Trying REST API with ${modelId}...`);
        const text = await callViaRestAPI(modelId, image, mimeType, prompt);
        console.log(`[menu-translate] REST API ${modelId} response length:`, text?.length);
        if (text && text.trim().length >= 10) {
          const menuItems = extractJSON(text);
          if (menuItems.length > 0) {
            console.log(`[menu-translate] Success via REST API with ${modelId}, items:`, menuItems.length);
            return NextResponse.json({ items: addPriceConversions(menuItems, lang) });
          }
        }
        lastError = new Error(`REST API ${modelId}: empty or unparseable response`);
      } catch (restErr: any) {
        console.error(`[menu-translate] REST API ${modelId} failed:`, restErr.message);
        lastError = restErr;
      }
    }

    console.error('[menu-translate] All models failed. Last error:', lastError?.message);
    return NextResponse.json(
      { error: `All AI models failed. Last error: ${lastError?.message || 'Unknown'}` },
      { status: 500 }
    );
  } catch (error: any) {
    console.error('[menu-translate] Fatal error:', error);
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    );
  }
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
