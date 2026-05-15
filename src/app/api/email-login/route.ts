import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * 邮箱直接登录（无需邮件验证）
 * POST /api/email-login
 * Body: { email }
 *
 * 流程：输入邮箱 → 查/创建用户 → 赠送免费积分 → 用 generateLink(signup) 获取 token 直接登录
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const lowerEmail = email.toLowerCase().trim();

    // 1. 查找或创建用户
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      console.error('[Email Login] listUsers error:', listError.message);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }

    let existingUser = usersData?.users?.find(u => u.email?.toLowerCase() === lowerEmail);
    let userId: string | null = existingUser?.id || null;

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

    // 2. 查询套餐
    let hasPlan = false;
    let planName: string | null = null;

    if (userId) {
      const { data: plans } = await supabaseAdmin
        .from('user_plans')
        .select('plan_name, status, expires_at')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('purchased_at', { ascending: false })
        .limit(1);

      if (plans && plans.length > 0) {
        const plan = plans[0];
        // 永不过期或未过期
        if (!plan.expires_at || new Date(plan.expires_at) > new Date()) {
          hasPlan = true;
          planName = plan.plan_name;
        }
      }

      // 3. 免费用户赠送500积分：如果没有任何套餐记录，创建 free 套餐
      if (!hasPlan) {
        const { data: allPlans } = await supabaseAdmin
          .from('user_plans')
          .select('id')
          .eq('user_id', userId)
          .limit(1);

        if (!allPlans || allPlans.length === 0) {
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
              expires_at: null,
            });
          if (!freePlanError) {
            hasPlan = true;
            planName = 'Free (500 credits)';
            console.log(`[Email Login] Free plan with 500 credits created for: ${lowerEmail}`);
          }
        }
      }
    }

    // 4. 用 generateLink signup 类型获取 token —— 它直接返回 access_token 和 refresh_token
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email: lowerEmail,
      password: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + '!A1',
    });

    if (linkError) {
      console.error('[Email Login] generateLink error:', linkError.message);
      return NextResponse.json({ error: 'Failed to generate session' }, { status: 500 });
    }

    // signup 类型的 generateLink 直接在返回对象中包含 token
    const access_token = (linkData as any)?.access_token || (linkData?.user as any)?.access_token;
    const refresh_token = (linkData as any)?.refresh_token || (linkData?.user as any)?.refresh_token;

    if (!access_token || !refresh_token) {
      // 最终兜底：打印完整返回结构来调试
      console.error('[Email Login] Failed to extract tokens. linkData:', JSON.stringify(linkData, null, 2));
      return NextResponse.json({ error: 'Failed to extract session tokens' }, { status: 500 });
    }

    console.log(`[Email Login] Direct login success: ${lowerEmail}, plan: ${planName}`);

    return NextResponse.json({
      success: true,
      hasPlan: hasPlan,
      planName,
      access_token,
      refresh_token,
    });
  } catch (e: any) {
    console.error('[Email Login] Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
