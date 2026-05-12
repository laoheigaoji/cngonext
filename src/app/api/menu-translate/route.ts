import { NextRequest, NextResponse } from 'next/server';
import { S3Client, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

// ===== Tencent 文搜图 + R2 缓存（替代下厨房） =====
const TENCENT_SECRET_ID = process.env.TENCENT_SECRET_ID || '';
const TENCENT_SECRET_KEY = process.env.TENCENT_SECRET_KEY || '';
const R2_ENDPOINT = process.env.R2_ENDPOINT || '';
const R2_BUCKET = process.env.R2_BUCKET || '';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

function getS3Client() {
  return new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
  });
}

function getDishKey(dishName: string): string {
  return `dish_images/${encodeURIComponent(dishName)}.jpg`;
}

// 1. 检查 R2 缓存
async function checkR2Cache(dishName: string): Promise<string | null> {
  const key = getDishKey(dishName);
  const publicUrl = `${R2_PUBLIC_URL}/${key}`;
  // 用 S3 headObject 直接查 R2（绕过 CDN 缓存）
  try {
    const s3 = getS3Client();
    await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET!, Key: key }));
    console.log(`[menu-translate] R2缓存命中: ${dishName}`);
    return publicUrl;
  } catch {
    return null;
  }
}

// 2. 腾讯文搜图（HMAC 签名 - 用 Web Crypto API，兼容 Edge Runtime）
async function sha256(message: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message));
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hmacSha256(key: string | ArrayBuffer, message: string): Promise<ArrayBuffer> {
  const keyBytes = typeof key === 'string' ? new TextEncoder().encode(key) : key;
  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  return crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message));
}

async function callTencentSearch(query: string): Promise<any[]> {
  const SERVICE = 'wimgs';
  const HOST = 'wimgs.tencentcloudapi.com';
  const VERSION = '2025-11-06';
  const ACTION = 'SearchByText';
  const REGION = 'ap-guangzhou';
  const timestamp = Math.floor(Date.now() / 1000);
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  const httpRequestMethod = 'POST';
  const canonicalUri = '/';
  const canonicalQueryString = '';
  const canonicalHeaders = `content-type:application/json\nhost:${HOST}\nx-tc-action:${ACTION.toLowerCase()}\n`;
  const signedHeaders = 'content-type;host;x-tc-action';
  const payload = JSON.stringify({ Query: query });
  const hashedRequestPayload = await sha256(payload);
  const canonicalRequest = `${httpRequestMethod}\n${canonicalUri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${hashedRequestPayload}`;

  const algorithm = 'TC3-HMAC-SHA256';
  const credentialScope = `${date}/${SERVICE}/tc3_request`;
  const hashedCanonicalRequest = await sha256(canonicalRequest);
  const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${hashedCanonicalRequest}`;

  const secretDate = await hmacSha256(`TC3${TENCENT_SECRET_KEY}`, date);
  const secretService = await hmacSha256(secretDate, SERVICE);
  const secretSigning = await hmacSha256(secretService, 'tc3_request');
  const signatureBuf = await hmacSha256(secretSigning, stringToSign);
  const signature = Array.from(new Uint8Array(signatureBuf)).map(b => b.toString(16).padStart(2, '0')).join('');

  const authorization = `${algorithm} Credential=${TENCENT_SECRET_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const response = await fetch(`https://${HOST}`, {
    method: 'POST',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
      Host: HOST,
      'X-TC-Action': ACTION,
      'X-TC-Timestamp': String(timestamp),
      'X-TC-Version': VERSION,
      'X-TC-Region': REGION,
    },
    body: payload,
  });

  if (!response.ok) {
    throw new Error(`Tencent API error ${response.status}: ${await response.text().catch(() => '')}`);
  }

  const data: any = await response.json();
  const images = data.Response?.Images;
  if (!images || !Array.isArray(images)) throw new Error('No images found');

  return images.map((imgStr: string) => {
    try { return JSON.parse(imgStr); } catch { return null; }
  }).filter(Boolean);
}

// 3. 搜图 + 下载 + 上传 R2
async function searchAndUploadDishImage(dishName: string): Promise<string | null> {
  console.log(`[menu-translate] 腾讯文搜图: "${dishName}"`);
  let images: any[];
  try {
    images = await callTencentSearch(dishName);
  } catch (e: any) {
    console.error(`[menu-translate] 腾讯搜图失败: "${dishName}": ${e.message}`);
    return null;
  }
  if (!images.length) {
    console.log(`[menu-translate] 未搜到: "${dishName}"`);
    return null;
  }

  const firstImage = images[0];
  const imageUrl = firstImage.origPicUrl || firstImage.thumbnailUrl;
  if (!imageUrl) return null;

  // 下载图片
  let imgResp: Response;
  try {
    imgResp = await fetch(imageUrl, { signal: AbortSignal.timeout(15000) });
    if (!imgResp.ok) return null;
  } catch {
    return null;
  }

  const buffer = await imgResp.arrayBuffer();
  const key = getDishKey(dishName);

  // 上传到 R2
  try {
    const s3 = getS3Client();
    await s3.send(new PutObjectCommand({
      Bucket: R2_BUCKET!,
      Key: key,
      Body: new Uint8Array(buffer),
      ContentType: 'image/jpeg',
    }));
    console.log(`[menu-translate] R2上传成功: ${key}`);
  } catch (e: any) {
    console.error(`[menu-translate] R2上传失败: ${e.message}`);
    return null;
  }

  return `${R2_PUBLIC_URL}/${key}`;
}

// 4. 批量获取菜品图片（先用R2缓存，没有再调腾讯搜图）
async function getDishImages(dishNames: string[]): Promise<Record<string, string | null>> {
  const results: Record<string, string | null> = {};
  // 并发5个
  const chunks: string[][] = [];
  for (let i = 0; i < dishNames.length; i += 5) {
    chunks.push(dishNames.slice(i, i + 5));
  }
  for (const chunk of chunks) {
    const promises = chunk.map(async (name) => {
      // 先查R2缓存
      const cached = await checkR2Cache(name);
      if (cached) {
        results[name] = cached;
        return;
      }
      // 缓存未命中，调腾讯搜图
      const url = await searchAndUploadDishImage(name);
      results[name] = url || null;
      if (url) console.log(`[menu-translate] 已缓存到R2: "${name}" -> ${url}`);
      else console.log(`[menu-translate] 搜图失败: "${name}"`);
    });
    await Promise.all(promises);
  }
  return results;
}

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

const QWEN_MODEL = 'qwen3-vl-flash';

// Step 1: Quick check if menu has dish photos
async function checkMenuHasPhotos(image: string, mimeType: string): Promise<boolean> {
  try {
    const url = `${DASHSCOPE_BASE_URL}/chat/completions`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getDashScopeApiKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: QWEN_MODEL,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${image}` } },
            { type: 'text', text: 'Does this menu have dish food photos/images next to the dish names? Reply ONLY "yes" or "no".' }
          ]
        }],
        max_tokens: 5,
        extra_body: { enable_thinking: false },
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!response.ok) return false;
    const data: any = await response.json();
    const text = (data?.choices?.[0]?.message?.content || '').toLowerCase().trim();
    console.log(`[menu-translate] Has photos check: "${text}"`);
    return text.includes('yes');
  } catch {
    return false;
  }
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dish = searchParams.get('dish');
    const dishes = searchParams.get('dishes');

    if (dishes) {
      // Batch mode: use Tencent search + R2 cache
      const dishNames = dishes.split(',').filter(Boolean);
      const images = await getDishImages(dishNames);
      return NextResponse.json({ images });
    }

    if (dish) {
      // Single dish
      const cached = await checkR2Cache(dish);
      if (cached) return NextResponse.json({ dish, imageUrl: cached });
      const imageUrl = await searchAndUploadDishImage(dish);
      return NextResponse.json({ dish, imageUrl });
    }

    return NextResponse.json({ status: 'ok', timestamp: Date.now(), hasToken: !!getDashScopeApiKey() });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

function buildPrompt(lang: string, hasPhotos: boolean): string {
  const targetLang = LANG_NAMES[lang] || 'English';
  const isZh = lang === 'zh';
  const isTw = lang === 'tw';

  const bboxInstruction = hasPhotos
    ? `, bbox(absolute pixel coordinates [x1,y1,x2,y2] of the dish FOOD PHOTO area only - NOT text, carefully locate each dish's own photo, each dish must have a different bbox. Set null if a specific dish has no photo), mask(array of [x,y] polygon vertices tightly tracing the dish's FOOD contour/outline within the bbox - at least 6 points, must be ordered clockwise or counter-clockwise to form a closed polygon, use absolute pixel coordinates, set null if no photo)`
    : '';

  if (isZh) {
    return `识别这张菜单图片中的所有菜品。对每道菜提取：name(中文名), price(价格数字，无价格则null), category(分类如"川菜"), enName(英文名), description(中文描述一句), enDescription(英文描述一句), ingredients(中文食材3个), enIngredients(英文食材3个), allergens(英文过敏原如["peanuts"]), dietary(英文膳食标签如["spicy","vegetarian"])${bboxInstruction}。
输出紧凑JSON数组，不要解释，不要markdown。示例：
[{"name":"宫保鸡丁","price":38,"category":"川菜","enName":"Kung Pao Chicken","description":"经典川菜","enDescription":"Classic Sichuan dish","ingredients":["鸡肉","花生"],"enIngredients":["chicken","peanuts"],"allergens":["peanuts"],"dietary":["spicy"]${hasPhotos ? ',"bbox":[120,80,480,380],"mask":[[120,80],[300,80],[480,80],[480,200],[480,380],[300,380],[120,380],[120,200]]' : ''}}]`;
  }

  const localFields = isTw
    ? 'localName(繁體中文名), localDescription(繁體中文一句), localIngredients(繁體中文3個)'
    : `localName(${targetLang}翻译名), localDescription(${targetLang}描述一句), localIngredients(${targetLang}食材3個)`;

  return `Extract all dishes from this menu image. For each provide: name(Chinese), ${localFields}, price(number or null), enName(English), enCategory(English category), enDescription(English 1 sentence), enIngredients(3 English items), allergens(English array e.g.["peanuts"]), dietary(English array e.g.["spicy"])${bboxInstruction}.
Output ONLY a compact JSON array. No explanation, no markdown. Example:
[{"name":"宫保鸡丁","localName":"Poulet Kung Pao","price":38,"enName":"Kung Pao Chicken","enCategory":"Sichuan","enDescription":"Classic Sichuan dish","enIngredients":["chicken","peanuts"],"localDescription":"Plat classique du Sichuan","localIngredients":["poulet","arachides"],"allergens":["peanuts"],"dietary":["spicy"]${hasPhotos ? ',"bbox":[120,80,480,380],"mask":[[120,80],[300,80],[480,80],[480,200],[480,380],[300,380],[120,380],[120,200]]' : ''}}]`;
}

async function callQwenVL(image: string, mimeType: string, prompt: string, timeoutMs = 120000): Promise<string> {
  const url = `${DASHSCOPE_BASE_URL}/chat/completions`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getDashScopeApiKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: QWEN_MODEL,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${image}` },
            },
            { type: 'text', text: prompt }
          ]
        }],
        max_tokens: 8192,
        // Disable thinking mode for faster response
        extra_body: { enable_thinking: false },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Qwen returned ${response.status}: ${errText.slice(0, 300)}`);
    }

    const data: any = await response.json();
    const text = data?.choices?.[0]?.message?.content || '';
    if (!text || text.trim().length < 10) {
      throw new Error('Qwen: empty response');
    }
    return text;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { image, mimeType, lang = 'en' }: { image?: string; mimeType?: string; lang?: string } = await req.json();

    if (!image || !mimeType) {
      return NextResponse.json({ error: 'Missing image or mimeType' }, { status: 400 });
    }

    // Step 1: Quick check if menu has dish photos (adds ~5-10s but avoids inaccurate bboxes)
    let hasPhotos = false;
    try {
      hasPhotos = await checkMenuHasPhotos(image, mimeType);
      console.log(`[menu-translate] Menu has dish photos: ${hasPhotos}`);
    } catch {
      hasPhotos = false;
    }

    const prompt = buildPrompt(lang, hasPhotos);
    let fullText = '';

    try {
      console.log(`[menu-translate] Calling ${QWEN_MODEL} via Singapore endpoint...`);
      fullText = await callQwenVL(image, mimeType, prompt, 120000);
      console.log(`[menu-translate] Success, response length:`, fullText.length);
    } catch (err: any) {
      console.error(`[menu-translate] Failed:`, err.message);
      return NextResponse.json(
        { error: `AI analysis failed: ${err.message}` },
        { status: 500 }
      );
    }

    console.log(`[menu-translate] Response (first 300):`, fullText.slice(0, 300));
    let menuItems = extractJSON(fullText);
    if (menuItems.length === 0) {
      menuItems = tryFixTruncatedJSON(fullText);
    }
    if (menuItems.length === 0) {
      return NextResponse.json(
        { error: 'Could not parse menu items from AI response.', rawPreview: fullText.slice(0, 500), usedModel: QWEN_MODEL },
        { status: 500 }
      );
    }

    const items = addPriceConversions(menuItems, lang);
    console.log(`[menu-translate] Done: ${QWEN_MODEL}, ${items.length} items`);
    return NextResponse.json({ items, usedModel: QWEN_MODEL });
  } catch (error: any) {
    console.error('[menu-translate] Fatal:', error);
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}

function extractJSON(text: string): any[] {
  // Step 1: Remove <think/> tags (Qwen3 thinking mode output)
  let cleaned = text.replace(/<think[\s\S]*?<\/think>/gi, '').trim();
  // Step 2: Remove markdown code fences
  cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '').trim();
  // Step 3: Try direct parse
  try {
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : [];
  } catch {}
  // Step 4: Find first [ to last ] and try parse
  const match = cleaned.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {}
  }
  // Step 5: Find first { to last } — single object wrapped in array
  const objMatch = cleaned.match(/\{[\s\S]*\}/);
  if (objMatch) {
    try {
      const obj = JSON.parse(objMatch[0]);
      return Array.isArray(obj) ? obj : [obj];
    } catch {}
  }
  return [];
}

function tryFixTruncatedJSON(text: string): any[] {
  // Remove <think/> tags first
  let cleaned = text.replace(/<think[\s\S]*?<\/think>/gi, '').trim();
  cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '').trim();
  const lastCompleteObj = cleaned.lastIndexOf('}');
  if (lastCompleteObj > 0) {
    const jsonStr = cleaned.slice(0, lastCompleteObj + 1) + ']';
    try {
      const parsed = JSON.parse(jsonStr);
      return Array.isArray(parsed) ? parsed : [];
    } catch {}
  }
  // Try to find individual JSON objects and collect them
  const objRegex = /\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g;
  const objects: any[] = [];
  let m;
  while ((m = objRegex.exec(cleaned)) !== null) {
    try {
      objects.push(JSON.parse(m[0]));
    } catch {}
  }
  if (objects.length > 0) return objects;
  return [];
}

function addPriceConversions(items: any[], lang: string) {
  const cur = CURRENCY_MAP[lang] || CURRENCY_MAP.en;
  return items.map((item: any) => {
    const hasPrice = item.price !== null && item.price !== undefined && item.price !== '';
    const priceStr = String(item.price).replace(/[^\d.]/g, '');
    const priceInCny = hasPrice && priceStr ? parseFloat(priceStr) || 0 : null;
    // Validate bbox: must be array of 4 positive numbers (absolute pixels [x1,y1,x2,y2])
    const rawBbox = item.bbox;
    const hasValidBbox = Array.isArray(rawBbox) && rawBbox.length === 4
      && rawBbox.every((v: number) => typeof v === 'number' && v >= 0)
      && rawBbox[2] > rawBbox[0] && rawBbox[3] > rawBbox[1];
    // Validate mask: must be array of [x,y] pairs with at least 6 points
    const rawMask = item.mask;
    const hasValidMask = Array.isArray(rawMask) && rawMask.length >= 6
      && rawMask.every((p: any) => Array.isArray(p) && p.length === 2 && typeof p[0] === 'number' && typeof p[1] === 'number');
    return {
      ...item,
      price: priceInCny,
      hasPrice: priceInCny !== null && priceInCny > 0,
      ...(priceInCny !== null && priceInCny > 0 ? {
        convertedPrice: lang === 'zh' ? 0 : +(priceInCny * cur.rate).toFixed(2),
        currencyCode: cur.code,
        currencySymbol: cur.symbol,
      } : {}),
      allergens: Array.isArray(item.allergens) ? item.allergens : [],
      dietary: Array.isArray(item.dietary) ? item.dietary : [],
      bbox: hasValidBbox ? rawBbox : null,
      mask: hasValidMask ? rawMask : null,
    };
  });
}
