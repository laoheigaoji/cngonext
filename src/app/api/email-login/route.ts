import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * 邮箱直接登录（无需邮件验证）
 * POST /api/email-login
 * Body: { email }
 *
 * 流程：
 * 1. 查找或创建用户
 * 2. 给用户设置一个随机密码（如果还没有）
 * 3. 赠送免费积分
 * 4. 返回邮箱，前端用密码直接 signInWithPassword
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

    // 生成一个固定格式的随机密码
    const autoPassword = 'Ep_' + lowerEmail.split('@')[0] + '_' + Date.now().toString(36) + '!';

    if (!existingUser) {
      // 创建用户，直接带密码
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: lowerEmail,
        password: autoPassword,
        email_confirm: true,
        user_metadata: { source: 'email_login' },
      });
      if (createError) {
        console.error('[Email Login] createUser error:', createError.message);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
      }
      userId = newUser.user?.id || null;
      console.log(`[Email Login] User created: ${lowerEmail}`);
    } else {
      // 用户已存在，更新密码为我们知道的密码
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
        password: autoPassword,
      });
      if (updateError) {
        console.error('[Email Login] updatePassword error:', updateError.message);
        return NextResponse.json({ error: 'Failed to set password' }, { status: 500 });
      }
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
        if (!plan.expires_at || new Date(plan.expires_at) > new Date()) {
          hasPlan = true;
          planName = plan.plan_name;
        }
      }

      // 3. 免费用户赠送500积分
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

    // 4. 返回邮箱和密码，前端用 signInWithPassword 登录
    console.log(`[Email Login] Ready for direct login: ${lowerEmail}, plan: ${planName}`);

    return NextResponse.json({
      success: true,
      hasPlan: hasPlan,
      planName,
      email: lowerEmail,
      password: autoPassword,
    });
  } catch (e: any) {
    console.error('[Email Login] Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
