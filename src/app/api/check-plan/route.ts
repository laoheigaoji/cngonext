import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * 查询邮箱是否有套餐
 * POST /api/check-plan
 * Body: { email }
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const lowerEmail = email.toLowerCase().trim();

    // 查找用户
    const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = usersData?.users?.find(u => u.email?.toLowerCase() === lowerEmail);

    let hasPlan = false;
    let planName: string | null = null;
    let userId: string | null = null;

    if (existingUser) {
      userId = existingUser.id;
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

    return NextResponse.json({ hasPlan, planName, userId });
  } catch (e: any) {
    console.error('[Check Plan] Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
