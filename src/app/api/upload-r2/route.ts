import { NextRequest, NextResponse } from 'next/server';
import { uploadToR2, getR2Key } from '@/lib/r2';
import { checkUserPlan, deductCredits, CREDITS_PER_CONVERSION } from '@/lib/checkPlan';

export async function POST(req: NextRequest) {
  try {
    // 检测用户权限和积分
    const authHeader = req.headers.get('authorization');
    const { hasAccess, plan } = await checkUserPlan(authHeader);

    // 没有有效套餐 → 拒绝上传
    if (!hasAccess) {
      const msg = !plan
        ? '无上传权限，请先购买套餐'
        : `积分不足！每次操作消耗 ${CREDITS_PER_CONVERSION} 积分，请购买更多积分`;
      return NextResponse.json({
        error: msg,
        needPurchase: true,
        plan: null,
      }, { status: 403 });
    }

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

    // 上传成功，消耗积分
    let creditsRemaining = 0;
    try {
      const deductResult = await deductCredits(authHeader, CREDITS_PER_CONVERSION);
      creditsRemaining = deductResult.creditsRemaining;
    } catch (e) {
      console.error('[Upload-R2] Credit deduction failed (non-fatal):', e);
    }

    return NextResponse.json({ success: true, url, key: finalKey, plan: plan?.name || null, creditsRemaining });
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
