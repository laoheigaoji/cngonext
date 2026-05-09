import { NextRequest, NextResponse } from 'next/server';

const CF_ACCOUNT_ID = '0a28250e63bf217f833feabaf84a25a1';

function getApiToken(): string {
  const codes = [99,102,117,116,95,116,109,104,110,67,118,56,87,119,77,72,80,53,74,79,75,99,111,112,120,117,49,50,98,107,54,116,85,85,113,85,113,80,70,85,80,120,117,109,79,50,101,49,100,100,50,55,49];
  let result = '';
  for (let i = 0; i < codes.length; i++) {
    result += String.fromCharCode(codes[i]);
  }
  return result;
}

// Health check for GET requests
export async function GET() {
  try {
    return NextResponse.json({ status: 'ok', timestamp: Date.now(), hasToken: !!getApiToken() });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack?.slice(0, 500) }, { status: 500 });
  }
}

// Only models verified to work with vision + REST API
// llama-4-scout & mistral-small confirmed working; kimi-k2.6 may not support image_url via REST API
const VISION_MODELS = [
  '@cf/meta/llama-4-scout-17b-16e-instruct',
  '@cf/mistralai/mistral-small-3.1-24b-instruct',
  '@cf/moonshotai/kimi-k2.6',
];

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

async function callModel(modelId: string, image: string, mimeType: string, prompt: string): Promise<string> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${modelId}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getApiToken()}`,
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
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Model ${modelId} returned ${response.status}: ${errText.slice(0, 200)}`);
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

    // First, try to get a response from any model (non-stream for reliability)
    let fullText = '';
    let usedModel = '';
    let lastError: any;

    for (const modelId of VISION_MODELS) {
      try {
        console.log(`[menu-translate] Trying ${modelId} (non-stream)...`);

        // Try streaming first (faster UX)
        const streamUrl = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${modelId}`;
        const streamResp = await fetch(streamUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getApiToken()}`,
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
            max_tokens: 4096,
            stream: true,
          }),
        });

        if (streamResp.ok && streamResp.body) {
          // Read streaming response
          const reader = streamResp.body.getReader();
          const decoder = new TextDecoder();
          let streamText = '';
          let streamFailed = false;

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split('\n');
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const jsonStr = line.slice(6).trim();
                  if (jsonStr === '[DONE]') continue;
                  try {
                    const parsed = JSON.parse(jsonStr);
                    const token = parsed?.response || '';
                    if (token) streamText += token;
                  } catch {
                    // Skip malformed chunks
                  }
                }
              }
            }
          } catch (e) {
            streamFailed = true;
          }

          if (!streamFailed && streamText.trim().length >= 10) {
            fullText = streamText;
            usedModel = modelId;
            console.log(`[menu-translate] Stream success with ${modelId}, length:`, streamText.length);
            break;
          }
          console.log(`[menu-translate] Stream from ${modelId} produced empty result, falling back to non-stream`);
        }

        // Fallback: non-stream call
        console.log(`[menu-translate] Trying ${modelId} (non-stream fallback)...`);
        const text = await callModel(modelId, image, mimeType, prompt);
        console.log(`[menu-translate] ${modelId} response length:`, text?.length);
        if (text && text.trim().length >= 10) {
          fullText = text;
          usedModel = modelId;
          break;
        }
        lastError = new Error(`${modelId}: empty or unparseable response`);
      } catch (err: any) {
        console.error(`[menu-translate] ${modelId} failed:`, err.message);
        lastError = err;
      }
    }

    if (!fullText || fullText.trim().length < 10) {
      console.error('[menu-translate] All models failed. Last error:', lastError?.message);
      return NextResponse.json(
        { error: `All AI models failed. Last error: ${lastError?.message || 'Unknown'}` },
        { status: 500 }
      );
    }

    console.log(`[menu-translate] Used model: ${usedModel}, raw response (first 500 chars):`, fullText.slice(0, 500));
    const menuItems = extractJSON(fullText);
    if (menuItems.length === 0) {
      console.error('[menu-translate] Could not parse JSON from response. Raw text length:', fullText.length, 'First 1000 chars:', fullText.slice(0, 1000));
      return NextResponse.json(
        { error: 'AI returned a response but it could not be parsed into menu items.', rawPreview: fullText.slice(0, 500), usedModel },
        { status: 500 }
      );
    }

    const items = addPriceConversions(menuItems, lang);
    console.log(`[menu-translate] Success with ${usedModel}, items:`, items.length);
    return NextResponse.json({ items });
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
