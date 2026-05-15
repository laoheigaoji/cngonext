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

    // 3. 没有套餐 → 返回提示购买
    if (!hasPlan) {
      return NextResponse.json({
        success: false,
        hasPlan: false,
        message: 'No active plan found. Please purchase a plan first.',
      });
    }

    // 4. 有套餐 → 生成 magic link 提取 token，直接登录
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: lowerEmail,
    });

    if (linkError || !linkData?.properties?.action_link) {
      console.error('[Email Login] generateLink error:', linkError?.message);
      return NextResponse.json({ error: 'Failed to generate session' }, { status: 500 });
    }

    // 从 magic link URL 中提取 access_token 和 refresh_token
    const actionLink = linkData.properties.action_link;
    const url = new URL(actionLink);
    const access_token = url.searchParams.get('access_token') || url.hash.match(/access_token=([^&]+)/)?.[1];
    const refresh_token = url.searchParams.get('refresh_token') || url.hash.match(/refresh_token=([^&]+)/)?.[1];

    if (!access_token || !refresh_token) {
      console.error('[Email Login] Failed to extract tokens from magic link');
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
