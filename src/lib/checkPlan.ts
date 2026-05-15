import { supabaseAdmin } from './supabaseAdmin';

// 每次转换消耗的积分数
export const CREDITS_PER_CONVERSION = 500;

export interface UserPlan {
  plan: string;
  name: string;
  cycle: string;
  purchasedAt: string;
  expiresAt: string | null;
  credits: number;       // 总积分
  creditsUsed: number;   // 已消耗积分
}

export interface PlanCheckResult {
  hasAccess: boolean;
  plan: UserPlan | null;
  userId: string | null;
}

/**
 * 检测用户是否有套餐权限（积分制）
 * 有剩余积分的套餐才视为有效
 * 
 * 支持 authHeader（Bearer token）或 userId（UUID）两种验证方式
 */
export async function checkUserPlan(authHeader: string | null, userId?: string | null): Promise<PlanCheckResult> {
  try {
    let resolvedUserId: string | null = null;

    // 优先用 token 验证
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
      if (!userError && user) {
        resolvedUserId = user.id;
      }
    }

    // 降级：用 userId 参数（UUID 格式验证）
    if (!resolvedUserId && userId) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(userId)) {
        resolvedUserId = userId;
      }
    }

    if (!resolvedUserId) {
      return { hasAccess: false, plan: null, userId: null };
    }

    const now = new Date().toISOString();
    const { data: plans } = await supabaseAdmin
      .from('user_plans')
      .select('*')
      .eq('user_id', resolvedUserId)
      .eq('status', 'active')
      .or(`expires_at.gte.${now},expires_at.is.null`)
      .order('purchased_at', { ascending: false });

    if (!plans || plans.length === 0) {
      return { hasAccess: false, plan: null, userId: resolvedUserId };
    }

    const activePlan = plans[0];
    const credits = activePlan.credits || 0;
    const creditsUsed = activePlan.credits_used || 0;
    const creditsRemaining = credits - creditsUsed;

    // 积分耗尽 → 视为无权限
    if (creditsRemaining < CREDITS_PER_CONVERSION) {
      return { hasAccess: false, plan: { ...activePlan, credits, creditsUsed }, userId: resolvedUserId };
    }

    return {
      hasAccess: true,
      plan: {
        plan: activePlan.plan,
        name: activePlan.plan_name,
        cycle: activePlan.cycle,
        purchasedAt: activePlan.purchased_at,
        expiresAt: activePlan.expires_at,
        credits,
        creditsUsed,
      },
      userId: resolvedUserId,
    };
  } catch (e) {
    console.error('[checkUserPlan] Error:', e);
    return { hasAccess: false, plan: null, userId: null };
  }
}

/**
 * 消耗积分
 * 扣减成功返回 true，积分不足返回 false
 * 
 * 支持 authHeader（Bearer token）或 userId（UUID）两种验证方式
 */
export async function deductCredits(authHeader: string | null, amount: number = CREDITS_PER_CONVERSION, userId?: string | null): Promise<{ success: boolean; creditsRemaining: number }> {
  try {
    let resolvedUserId: string | null = null;

    // 优先用 token 验证
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
      if (!userError && user) {
        resolvedUserId = user.id;
      }
    }

    // 降级：用 userId 参数
    if (!resolvedUserId && userId) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(userId)) {
        resolvedUserId = userId;
      }
    }

    if (!resolvedUserId) {
      return { success: false, creditsRemaining: 0 };
    }

    const now = new Date().toISOString();
    const { data: plans } = await supabaseAdmin
      .from('user_plans')
      .select('id, credits, credits_used')
      .eq('user_id', resolvedUserId)
      .eq('status', 'active')
      .or(`expires_at.gte.${now},expires_at.is.null`)
      .order('purchased_at', { ascending: false })
      .limit(1);

    if (!plans || plans.length === 0) {
      return { success: false, creditsRemaining: 0 };
    }

    const plan = plans[0];
    const credits = plan.credits || 0;
    const creditsUsed = plan.credits_used || 0;
    const remaining = credits - creditsUsed;

    if (remaining < amount) {
      return { success: false, creditsRemaining: remaining };
    }

    const { error } = await supabaseAdmin
      .from('user_plans')
      .update({ credits_used: creditsUsed + amount, updated_at: new Date().toISOString() })
      .eq('id', plan.id);

    if (error) throw error;

    return { success: true, creditsRemaining: remaining - amount };
  } catch (e) {
    console.error('[deductCredits] Error:', e);
    return { success: false, creditsRemaining: 0 };
  }
}
