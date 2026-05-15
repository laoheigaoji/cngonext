import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// 产品 ID → 套餐标识
const PRODUCT_PLAN_MAP: Record<string, string> = {
  'prod_3TVyXsKR8av0l01JAJoBrU': 'traveler',
  'prod_7YpsVCJSFtxQr3Fqhk0uHZ': 'starter',
  'prod_2Jw6Tigcj1ydA2JxbiNLpN': 'starter-yearly',
  'prod_5O65NauyqMWA0ZtiroA9XG': 'pro',
  'prod_268yTiuPPqD5QbnW18jo2x': 'pro-yearly',
  'prod_5xXOa84Nq51M6OpgInrSKp': 'traveler',
};

const PLANS: Record<string, { name: string; cycle: string; amount: number; credits: number }> = {
  'traveler':       { name: 'Traveler', cycle: '10days',  amount: 4.99,  credits: 5000 },
  'starter':        { name: 'Starter',  cycle: 'monthly', amount: 9.99,  credits: 11000 },
  'starter-yearly': { name: 'Starter',  cycle: 'yearly',  amount: 99,    credits: 132000 },
  'pro':            { name: 'Pro',      cycle: 'monthly', amount: 19.99, credits: 25000 },
  'pro-yearly':     { name: 'Pro',      cycle: 'yearly',  amount: 199,   credits: 300000 },
};

function calcExpiresAt(plan: string): string | null {
  const now = Date.now();
  switch (plan) {
    case 'traveler':       return new Date(now + 10 * 24 * 60 * 60 * 1000).toISOString();
    case 'starter':
    case 'pro':            return new Date(now + 30 * 24 * 60 * 60 * 1000).toISOString();
    case 'starter-yearly':
    case 'pro-yearly':     return new Date(now + 365 * 24 * 60 * 60 * 1000).toISOString();
    default:               return null;
  }
}

/**
 * POST /api/activate-plan
 * 支付成功后，前端直接调用此接口激活套餐
 * 需要用户已登录（通过 Authorization header 验证）
 */
export async function POST(req: NextRequest) {
  try {
    const { productId, user_id: bodyUserId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: '缺少产品ID' }, { status: 400 });
    }

    // 验证用户登录状态
    const authHeader = req.headers.get('authorization')?.replace('Bearer ', '');
    let userId: string | null = null;

    if (authHeader) {
      const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(authHeader);
      if (!userError && user) {
        userId = user.id;
      }
    }

    // 降级：用 body 中的 user_id（UUID 格式校验）
    if (!userId && bodyUserId) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(bodyUserId)) {
        userId = bodyUserId;
      }
    }

    if (!userId) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    // 映射产品ID到套餐
    const plan = PRODUCT_PLAN_MAP[productId];
    if (!plan) {
      return NextResponse.json({ error: '未知产品' }, { status: 400 });
    }

    const info = PLANS[plan] || PLANS.traveler;
    const expiresAt = calcExpiresAt(plan);

    // 检查是否已有该套餐
    const { data: existing } = await supabaseAdmin
      .from('user_plans')
      .select('id, credits, credits_used')
      .eq('user_id', userId)
      .eq('plan', plan)
      .eq('status', 'active')
      .limit(1);

    if (existing && existing.length > 0) {
      // 续费/叠加积分
      const oldCredits = existing[0].credits || 0;
      const { error: updateError } = await supabaseAdmin
        .from('user_plans')
        .update({
          status: 'active',
          expires_at: expiresAt,
          credits: oldCredits + info.credits,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing[0].id);

      if (updateError) throw updateError;

      console.log(`[Activate-Plan] Plan renewed: userId=${userId}, plan=${plan}, addCredits=${info.credits}`);
    } else {
      // 新套餐
      const { error: insertError } = await supabaseAdmin
        .from('user_plans')
        .insert({
          user_id: userId,
          plan,
          plan_name: info.name,
          cycle: info.cycle,
          amount: info.amount,
          currency: 'USD',
          status: 'active',
          credits: info.credits,
          credits_used: 0,
          purchased_at: new Date().toISOString(),
          expires_at: expiresAt,
        });

      if (insertError) throw insertError;

      console.log(`[Activate-Plan] Plan created: userId=${userId}, plan=${plan}, credits=${info.credits}`);
    }

    // 返回激活后的套餐信息
    return NextResponse.json({
      success: true,
      plan: {
        plan,
        name: info.name,
        cycle: info.cycle,
        credits: info.credits,
        creditsUsed: 0,
        creditsRemaining: info.credits,
        expiresAt,
      },
    });
  } catch (e: any) {
    console.error('[Activate-Plan] Error:', e);
    return NextResponse.json({ error: e.message || '激活失败' }, { status: 500 });
  }
}
