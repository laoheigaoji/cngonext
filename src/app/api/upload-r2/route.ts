import { NextRequest, NextResponse } from 'next/server';
import { uploadToR2, getR2Key } from '@/lib/r2';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';
    const key = (formData.get('key') as string) || getR2Key(folder);

    if (!file) {
      return NextResponse.json({ error: '缺少文件' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type || 'image/jpeg';
    const finalKey = key || getR2Key(folder, contentType.split('/').pop() || 'jpg');
    const url = await uploadToR2(buffer, finalKey, contentType);

    return NextResponse.json({ success: true, url, key: finalKey });
  } catch (e: any) {
    console.error('[Upload-R2] Error:', e);
    return NextResponse.json({ error: e.message || '上传失败' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
