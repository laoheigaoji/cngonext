import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// 计算过期时间
function calcExpiresAt(plan: string): string | null {
  const now = new Date();
  switch (plan) {
    case 'traveler':
      // 10天
      return new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString();
    case 'starter':
    case 'pro':
      // 30天
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    case 'starter-yearly':
    case 'pro-yearly':
      // 365天
      return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();
    default:
      return null;
  }
}

// 获取套餐价格
function getPlanAmount(plan: string): number {
  const prices: Record<string, number> = {
    'traveler': 4.99,
    'starter': 9.99,
    'starter-yearly': 99,
    'pro': 19.99,
    'pro-yearly': 199,
  };
  return prices[plan] || 0;
}

// 获取套餐积分
function getPlanCredits(plan: string): number {
  const credits: Record<string, number> = {
    'traveler': 5000,
    'starter': 11000,
    'starter-yearly': 132000,
    'pro': 25000,
    'pro-yearly': 300000,
  };
  return credits[plan] || 0;
}

function getPlanInfo(plan: string): { plan_name: string; cycle: string } {
  if (plan === 'traveler') return { plan_name: 'Traveler', cycle: '10days' };
  if (plan === 'starter') return { plan_name: 'Starter', cycle: 'monthly' };
  if (plan === 'starter-yearly') return { plan_name: 'Starter', cycle: 'yearly' };
  if (plan === 'pro') return { plan_name: 'Pro', cycle: 'monthly' };
  if (plan === 'pro-yearly') return { plan_name: 'Pro', cycle: 'yearly' };
  return { plan_name: 'Traveler', cycle: 'monthly' };
}

// POST: 保存用户套餐到数据库
export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();
    if (!plan) {
      return NextResponse.json({ error: '缺少套餐参数' }, { status: 400 });
    }

    // 获取当前登录用户
    const authHeader = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!authHeader) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(authHeader);
    if (userError || !user) {
      return NextResponse.json({ error: '用户验证失败' }, { status: 401 });
    }

    const { plan_name, cycle } = getPlanInfo(plan);
    const amount = getPlanAmount(plan);
    const expiresAt = calcExpiresAt(plan);
    const credits = getPlanCredits(plan);

    // 检查是否已有该套餐（避免重复插入）
    const { data: existing } = await supabaseAdmin
      .from('user_plans')
      .select('id')
      .eq('user_id', user.id)
      .eq('plan', plan)
      .eq('status', 'active')
      .limit(1);

    if (existing && existing.length > 0) {
      // 已有有效套餐，更新过期时间和积分（积分叠加）
      const { data: currPlan } = await supabaseAdmin
        .from('user_plans')
        .select('credits, credits_used')
        .eq('id', existing[0].id)
        .limit(1)
        .single();
      const oldCredits = currPlan?.credits || 0;
      const { error: updateError } = await supabaseAdmin
        .from('user_plans')
        .update({
          status: 'active',
          expires_at: expiresAt,
          credits: oldCredits + credits,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing[0].id);

      if (updateError) throw updateError;
    } else {
      // 新套餐
      const { error: insertError } = await supabaseAdmin
        .from('user_plans')
        .insert({
          user_id: user.id,
          plan,
          plan_name,
          cycle,
          amount,
          credits,
          currency: 'USD',
          status: 'active',
          purchased_at: new Date().toISOString(),
          expires_at: expiresAt,
        });

      if (insertError) throw insertError;
    }

    return NextResponse.json({ success: true, plan: { plan, plan_name, cycle, expires_at: expiresAt, credits } });
  } catch (e: any) {
    console.error('[Save-Plan] Error:', e);
    return NextResponse.json({ error: e.message || '保存失败' }, { status: 500 });
  }
}

// GET: 查询用户当前有效套餐
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')?.replace('Bearer ', '');
    const devEmail = req.headers.get('x-dev-user-email');

    let userId: string | null = null;

    if (authHeader) {
      const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(authHeader);
      if (!userError && user) {
        userId = user.id;
      }
    }

    // 开发模式降级：通过 email 查找 user_plans
    if (!userId && devEmail && process.env.NODE_ENV === 'development') {
      const { data: plansByEmail } = await supabaseAdmin
        .from('user_plans')
        .select('user_id')
        .eq('status', 'active')
        .limit(1);
      // 直接用测试 user_id 查询
      userId = 'test-user-001';
    }

    if (!userId) {
      return NextResponse.json({ plan: null, hasAccess: false });
    }

    // 查询用户所有有效套餐（未过期且状态为 active）
    const now = new Date().toISOString();
    const { data: plans } = await supabaseAdmin
      .from('user_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .gte('expires_at', now)
      .order('purchased_at', { ascending: false });

    if (!plans || plans.length === 0) {
      // 检查是否有永不过期的套餐
      const { data: noExpirePlans } = await supabaseAdmin
        .from('user_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .is('expires_at', null)
        .order('purchased_at', { ascending: false });

      if (!noExpirePlans || noExpirePlans.length === 0) {
        return NextResponse.json({ plan: null, hasAccess: false });
      }

      const activePlan = noExpirePlans[0];
      const credits = activePlan.credits || 0;
      const creditsUsed = activePlan.credits_used || 0;
      return NextResponse.json({
        plan: {
          id: activePlan.id,
          plan: activePlan.plan,
          name: activePlan.plan_name,
          cycle: activePlan.cycle,
          purchasedAt: activePlan.purchased_at,
          expiresAt: activePlan.expires_at,
          credits,
          creditsUsed,
          creditsRemaining: credits - creditsUsed,
        },
        hasAccess: true,
      });
    }

    // 取最新（可能是最高级）的套餐
    const activePlan = plans[0];
    const credits = activePlan.credits || 0;
    const creditsUsed = activePlan.credits_used || 0;
    return NextResponse.json({
      plan: {
        id: activePlan.id,
        plan: activePlan.plan,
        name: activePlan.plan_name,
        cycle: activePlan.cycle,
        purchasedAt: activePlan.purchased_at,
        expiresAt: activePlan.expires_at,
        credits,
        creditsUsed,
        creditsRemaining: credits - creditsUsed,
      },
      hasAccess: true,
    });
  } catch (e: any) {
    console.error('[Check-Plan] Error:', e);
    return NextResponse.json({ plan: null, hasAccess: false, error: e.message });
  }
}
