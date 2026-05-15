import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import crypto from 'crypto';

// ============ 映射关系 ============

// Creem 产品 ID → 内部套餐标识
const PRODUCT_PLAN_MAP: Record<string, string> = {
  'prod_3TVyXsKR8av0l01JAJoBrU': 'traveler',
  'prod_7YpsVCJSFtxQr3Fqhk0uHZ': 'starter',
  'prod_2Jw6Tigcj1ydA2JxbiNLpN': 'starter-yearly',
  'prod_5O65NauyqMWA0ZtiroA9XG': 'pro',
  'prod_268yTiuPPqD5QbnW18jo2x': 'pro-yearly',
  // 本地沙盒测试用
  'prod_5xXOa84Nq51M6OpgInrSKp': 'traveler',
};

// 套餐信息
const PLANS: Record<string, { name: string; cycle: string; amount: number; credits: number }> = {
  'traveler':       { name: 'Traveler', cycle: '10days',  amount: 4.99,  credits: 5000 },
  'starter':        { name: 'Starter',  cycle: 'monthly', amount: 9.99,  credits: 11000 },
  'starter-yearly': { name: 'Starter',  cycle: 'yearly',  amount: 99,    credits: 132000 },
  'pro':            { name: 'Pro',      cycle: 'monthly', amount: 19.99, credits: 25000 },
  'pro-yearly':     { name: 'Pro',      cycle: 'yearly',  amount: 199,   credits: 300000 },
};

function getPlan(plan: string) {
  return PLANS[plan] || PLANS.traveler;
}

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

// ============ 签名验证 ============

function verifySignature(payload: string, signature: string, secret: string): boolean {
  const computed = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  if (computed.length !== signature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature));
}

// ============ 查询用户 ============

/** 通过邮箱在 Supabase Auth 中查找用户，不存在则自动创建 */
async function findOrCreateUserByEmail(email: string): Promise<string | null> {
  try {
    // 先查找
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      console.error('[Creem Webhook] listUsers error:', error.message);
      return null;
    }
    const existingUser = data?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());
    if (existingUser) return existingUser.id;

    // 用户不存在，自动创建
    console.log(`[Creem Webhook] User not found for email: ${email}, creating...`);
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true, // 自动确认邮箱
      user_metadata: { source: 'creem_payment' },
    });

    if (createError) {
      console.error('[Creem Webhook] createUser error:', createError.message);
      return null;
    }

    console.log(`[Creem Webhook] User created: ${email}, id: ${newUser.user?.id}`);
    return newUser.user?.id || null;
  } catch (e) {
    console.error('[Creem Webhook] findOrCreateUserByEmail error:', e);
    return null;
  }
}

// ============ 核心事件处理 ============

/** checkout.completed — 用户完成支付（一次性或订阅首付） */
async function handleCheckoutCompleted(object: any) {
  const customerEmail = object?.customer?.email;
  const productId = object?.product?.id;
  if (!productId) return;

  const plan = PRODUCT_PLAN_MAP[productId];
  if (!plan) {
    console.log(`[Creem Webhook] Unknown product: ${productId}, name: ${object?.product?.name}`);
    return;
  }

  // 优先从 metadata 获取 user_id（由 /api/creem-checkout 创建时传入）
  let userId: string | null = object?.metadata?.user_id || null;

  // 兜底：通过 email 查找或自动创建用户
  if (!userId && customerEmail) {
    userId = await findOrCreateUserByEmail(customerEmail);
  }

  if (!userId) {
    console.log(`[Creem Webhook] User not found: metadata.user_id=${object?.metadata?.user_id}, email=${customerEmail}`);
    return;
  }

  const info = getPlan(plan);
  const expiresAt = calcExpiresAt(plan);

  // 检查是否已有该套餐
  const { data: existing } = await supabaseAdmin
    .from('user_plans')
    .select('id, credits')
    .eq('user_id', userId)
    .eq('plan', plan)
    .eq('status', 'active')
    .limit(1);

  if (existing && existing.length > 0) {
    // 续费/叠加积分
    const oldCredits = existing[0].credits || 0;
    await supabaseAdmin
      .from('user_plans')
      .update({
        status: 'active',
        expires_at: expiresAt,
        credits: oldCredits + info.credits,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing[0].id);

    console.log(`[Creem Webhook] Plan renewed: user=${customerEmail}, plan=${plan}, addCredits=${info.credits}, total=${oldCredits + info.credits}`);
  } else {
    // 新套餐
    await supabaseAdmin
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

    console.log(`[Creem Webhook] Plan created: user=${customerEmail}, plan=${plan}, credits=${info.credits}`);
  }
}

/** subscription.paid — 订阅续费成功（追加积分） */
async function handleSubscriptionPaid(object: any) {
  const customerEmail = object?.customer?.email;
  const productId = object?.product?.id;
  if (!productId) return;

  const plan = PRODUCT_PLAN_MAP[productId];
  if (!plan) return;

  // 优先从 metadata 获取 user_id
  let userId: string | null = object?.metadata?.user_id || null;
  if (!userId && customerEmail) {
    userId = await findOrCreateUserByEmail(customerEmail);
  }
  if (!userId) return;

  const info = getPlan(plan);
  const expiresAt = calcExpiresAt(plan);

  const { data: existing } = await supabaseAdmin
    .from('user_plans')
    .select('id, credits')
    .eq('user_id', userId)
    .eq('plan', plan)
    .eq('status', 'active')
    .limit(1);

  if (existing && existing.length > 0) {
    const oldCredits = existing[0].credits || 0;
    await supabaseAdmin
      .from('user_plans')
      .update({
        status: 'active',
        expires_at: expiresAt,
        credits: oldCredits + info.credits,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing[0].id);
    console.log(`[Creem Webhook] Subscription paid, credits added: user=${customerEmail}, plan=${plan}, add=${info.credits}, total=${oldCredits + info.credits}`);
  } else {
    // 首次扣款（兜底）
    await supabaseAdmin
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
    console.log(`[Creem Webhook] Subscription paid (new): user=${customerEmail}, plan=${plan}, credits=${info.credits}`);
  }
}

/** subscription.canceled — 订阅取消 */
async function handleSubscriptionCanceled(object: any) {
  const customerEmail = object?.customer?.email;
  const productId = object?.product?.id;
  if (!productId) return;

  const plan = PRODUCT_PLAN_MAP[productId];
  if (!plan) return;

  // 优先从 metadata 获取 user_id
  let userId: string | null = object?.metadata?.user_id || null;
  if (!userId && customerEmail) {
    userId = await findOrCreateUserByEmail(customerEmail);
  }
  if (!userId) return;

  await supabaseAdmin
    .from('user_plans')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('plan', plan)
    .eq('status', 'active');

  console.log(`[Creem Webhook] Subscription canceled: user=${customerEmail}, plan=${plan}`);
}

// ============ POST Handler ============

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('creem-signature') || '';

    // Secret 优先级: env > 数据库配置 > 开发模式 test-secret
    let secret = process.env.CREEM_WEBHOOK_SECRET;
    if (!secret) {
      try {
        const { data } = await supabaseAdmin
          .from('payment_config')
          .select('webhook_secret')
          .eq('id', 'default')
          .maybeSingle();
        if (data?.webhook_secret) secret = data.webhook_secret;
      } catch {}
    }
    if (!secret && process.env.NODE_ENV === 'development') secret = 'test-secret';

    if (!secret) {
      console.error('[Creem Webhook] Missing CREEM_WEBHOOK_SECRET in env');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    // 跳过签名验证（creem-signature 暂不验证）
    console.log('[Creem Webhook] Signature verification skipped');

    const event = JSON.parse(body);
    const eventType = event.eventType;
    const object = event.object;

    console.log(`[Creem Webhook] Received event: ${eventType}, id=${event.id}`);

    switch (eventType) {
      case 'checkout.completed':
        await handleCheckoutCompleted(object);
        break;
      case 'subscription.paid':
        await handleSubscriptionPaid(object);
        break;
      case 'subscription.canceled':
        await handleSubscriptionCanceled(object);
        break;
      case 'subscription.active':
        await handleSubscriptionPaid(object);
        break;
      default:
        console.log(`[Creem Webhook] Unhandled event type: ${eventType}`);
    }

    // 必须返回 200 否则 Creem 会重试
    return new NextResponse('OK', { status: 200 });
  } catch (e: any) {
    console.error('[Creem Webhook] Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
