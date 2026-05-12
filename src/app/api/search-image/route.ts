import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';
import { uploadToR2 } from '@/lib/r2';

const SECRET_ID = process.env.TENCENT_SECRET_ID || '';
const SECRET_KEY = process.env.TENCENT_SECRET_KEY || '';
const SERVICE = 'wimgs';
const HOST = 'wimgs.tencentcloudapi.com';
const VERSION = '2025-11-06';
const ACTION = 'SearchByText';
const REGION = 'ap-guangzhou';

function sha256(message: string) {
  return crypto.createHash('sha256').update(message).digest('hex');
}

function hmacSha256(key: Buffer | string, message: string) {
  return crypto.createHmac('sha256', key).update(message).digest();
}

async function uploadToR2Storage(imageUrl: string, folder: string, fileName: string): Promise<string | null> {
  try {
    const safeName = fileName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '_').slice(0, 40);
    const key = `${folder}/${Date.now()}-${safeName}.jpg`;
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const url = await uploadToR2(buffer, key);
    return url;
  } catch (e) {
    console.warn('[SearchImage] Upload to R2 failed:', e);
    return imageUrl; // fallback to original URL
  }
}

async function callTencentSearch(query: string): Promise<any[]> {
  const timestamp = Math.floor(Date.now() / 1000);
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  // 1. Canonical Request
  const httpRequestMethod = 'POST';
  const canonicalUri = '/';
  const canonicalQueryString = '';
  const canonicalHeaders = `content-type:application/json\nhost:${HOST}\nx-tc-action:${ACTION.toLowerCase()}\n`;
  const signedHeaders = 'content-type;host;x-tc-action';
  const payload = JSON.stringify({ Query: query });
  const hashedRequestPayload = sha256(payload);
  const canonicalRequest = `${httpRequestMethod}\n${canonicalUri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${hashedRequestPayload}`;

  // 2. String To Sign
  const algorithm = 'TC3-HMAC-SHA256';
  const credentialScope = `${date}/${SERVICE}/tc3_request`;
  const hashedCanonicalRequest = sha256(canonicalRequest);
  const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${hashedCanonicalRequest}`;

  // 3. Sign
  const secretDate = hmacSha256(`TC3${SECRET_KEY}`, date);
  const secretService = hmacSha256(secretDate, SERVICE);
  const secretSigning = hmacSha256(secretService, 'tc3_request');
  const signature = hmacSha256(secretSigning, stringToSign).toString('hex');

  // 4. Authorization
  const authorization = `${algorithm} Credential=${SECRET_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

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
    const text = await response.text();
    throw new Error(`Tencent API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  const images = data.Response?.Images;
  if (!images || !Array.isArray(images)) {
    throw new Error('No images found');
  }

  return images.map((imgStr: string) => {
    try { return JSON.parse(imgStr); } catch { return null; }
  }).filter(Boolean);
}

export async function POST(req: NextRequest) {
  try {
    const { query, folder = 'city-images' } = await req.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: '请输入搜索关键词' }, { status: 400 });
    }

    if (!SECRET_ID || !SECRET_KEY) {
      return NextResponse.json({ error: '未配置腾讯云 API 密钥' }, { status: 500 });
    }

    // 搜索图片
    const images = await callTencentSearch(query);
    if (images.length === 0) {
      return NextResponse.json({ error: '未找到相关图片' }, { status: 404 });
    }

    // 取第一张原图（优先用 origPicUrl，没有则用 thumbnailUrl）
    const firstImage = images[0];
    const imageUrl = firstImage.origPicUrl || firstImage.thumbnailUrl;
    if (!imageUrl) {
      return NextResponse.json({ error: '图片 URL 为空' }, { status: 404 });
    }

    // 下载并转存到 R2
    const safeName = query.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_').slice(0, 30);
    const storedUrl = await uploadToR2Storage(imageUrl, folder, safeName);

    return NextResponse.json({
      success: true,
      imageUrl: storedUrl,
      title: firstImage.title || '',
      source: firstImage.siteName || '',
    });
  } catch (e: any) {
    console.error('[SearchImage] Error:', e);
    return NextResponse.json({ error: e.message || '搜索失败' }, { status: 500 });
  }
}
