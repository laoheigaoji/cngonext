import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * 邮箱直接登录（无需邮件验证）
 * POST /api/email-login
 * Body: { email }
 *
 * 1. 查询该邮箱是否有活跃套餐
 * 2. 有套餐 → 用 admin API 生成 magic link，提取 token 直接返回
 * 3. 无套餐 → 返回 hasPlan: false，提示购买
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const lowerEmail = email.toLowerCase().trim();

    // 1. 查找用户
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      console.error('[Email Login] listUsers error:', listError.message);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }

    const existingUser = usersData?.users?.find(u => u.email?.toLowerCase() === lowerEmail);

    // 2. 查询套餐
    let hasPlan = false;
    let planName: string | null = null;
    let userId: string | null = existingUser?.id || null;

    if (existingUser) {
      const { data: plans } = await supabaseAdmin
        .from('user_plans')
        .select('plan_name, status, expires_at')
        .eq('user_id', existingUser.id)
        .eq('status', 'active')
        .order('purchased_at', { ascending: false })
        .limit(1);

      if (plans && plans.length > 0) {
        const plan = plans[0];
        if (plan.expires_at && new Date(plan.expires_at) > new Date()) {
          hasPlan = true;
          planName = plan.plan_name;
        }
      }
    }

    // 3. 如果用户不存在，先创建
    if (!existingUser) {
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: lowerEmail,
        email_confirm: true,
        user_metadata: { source: 'email_login' },
      });
      if (createError) {
        console.error('[Email Login] createUser error:', createError.message);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
      }
      userId = newUser.user?.id || null;
      console.log(`[Email Login] User created: ${lowerEmail}`);
    }

    // 4. 免费用户赠送500积分：如果没有任何套餐记录，创建 free 套餐
    if (userId) {
      const { data: allPlans } = await supabaseAdmin
        .from('user_plans')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (!allPlans || allPlans.length === 0) {
        // 新用户，赠送500积分
        const { error: freePlanError } = await supabaseAdmin
          .from('user_plans')
          .insert({
            user_id: userId,
            plan: 'free',
            plan_name: 'Free',
            cycle: 'lifetime',
            amount: 0,
            credits: 500,
            credits_used: 0,
            currency: 'USD',
            status: 'active',
            purchased_at: new Date().toISOString(),
            expires_at: null, // 永不过期，但积分用完就没了
          });
        if (freePlanError) {
          console.error('[Email Login] Free plan create error:', freePlanError.message);
        } else {
          hasPlan = true;
          planName = 'Free (500 credits)';
          console.log(`[Email Login] Free plan with 500 credits created for: ${lowerEmail}`);
        }
      }
    }

    // 4. 有套餐 → 用 admin API 生成 magic link 提取 token，直接登录
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: lowerEmail,
    });

    if (linkError) {
      console.error('[Email Login] generateLink error:', linkError.message);
      return NextResponse.json({ error: 'Failed to generate session' }, { status: 500 });
    }

    // generateLink 返回的 token 在不同位置，尝试多种方式提取
    let access_token: string | null = null;
    let refresh_token: string | null = null;

    // 方式1: 直接从返回的用户对象中获取
    if (linkData?.user) {
      // @ts-ignore - Supabase 内部结构
      const session = linkData.user.user_metadata?.session || linkData.user as any;
      access_token = session?.access_token || null;
      refresh_token = session?.refresh_token || null;
    }

    // 方式2: 从 action_link URL 中解析（可能在 query 或 hash 中）
    if (!access_token && linkData?.properties?.action_link) {
      try {
        const actionLink = linkData.properties.action_link as string;
        // 先尝试从 hash fragment 解析
        const hashMatch = actionLink.match(/[#&]access_token=([^&#]+)/);
        const hashRefresh = actionLink.match(/[#&]refresh_token=([^&#]+)/);
        if (hashMatch) access_token = hashMatch[1];
        if (hashRefresh) refresh_token = hashRefresh[1];

        // 再尝试从 search params 解析
        if (!access_token) {
          const urlObj = new URL(actionLink);
          access_token = urlObj.searchParams.get('access_token');
          refresh_token = urlObj.searchParams.get('refresh_token');
        }
      } catch (e) {
        console.error('[Email Login] Failed to parse action_link:', e);
      }
    }

    if (!access_token || !refresh_token) {
      console.error('[Email Login] Failed to extract tokens. linkData keys:', Object.keys(linkData || {}));
      console.error('[Email Login] linkData.properties:', JSON.stringify(linkData?.properties));
      return NextResponse.json({ error: 'Failed to extract session tokens' }, { status: 500 });
    }

    console.log(`[Email Login] Direct login success: ${lowerEmail}, plan: ${planName}`);

    return NextResponse.json({
      success: true,
      hasPlan: true,
      planName,
      access_token,
      refresh_token,
    });
  } catch (e: any) {
    console.error('[Email Login] Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
