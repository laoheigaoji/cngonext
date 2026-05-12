import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const R2_ENDPOINT = process.env.R2_ENDPOINT || '';
const R2_BUCKET = process.env.R2_BUCKET || 'tripcngo-assets';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://static.tripcngo.com';

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

/**
 * 上传 buffer/blob 到 R2
 */
export async function uploadToR2(buffer: Buffer | Uint8Array, key: string, contentType?: string): Promise<string> {
  const s3 = getS3Client();
  await s3.send(new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType || 'image/jpeg',
  }));
  return `${R2_PUBLIC_URL}/${key}`;
}

/**
 * 从远程 URL 下载并上传到 R2
 */
export async function downloadAndUploadToR2(imageUrl: string, key: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    return await uploadToR2(buffer, key, contentType);
  } catch (e) {
    console.warn('[R2] downloadAndUpload failed:', e);
    return null;
  }
}

/**
 * 获取唯一的 R2 key（包含时间戳和随机串）
 */
export function getR2Key(folder: string, ext: string = 'jpg'): string {
  const rand = Math.random().toString(36).substring(7);
  return `${folder}/${Date.now()}-${rand}.${ext.replace(/^\./, '')}`;
}

export { R2_PUBLIC_URL };
