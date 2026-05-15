import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * 通过 Creem Checkout API 创建结账会话
 * POST /api/creem-checkout
 * Body: { product_id, user_id, success_url }
 * 
 * API Key 从数据库 payment_config 读取，根据 sandbox_mode 选择测试/生产密钥
 */
export async function POST(req: NextRequest) {
  try {
    const { product_id, user_id, customer_email, success_url } = await req.json();

    if (!product_id || !user_id) {
      return NextResponse.json({ error: 'Missing product_id or user_id' }, { status: 400 });
    }

    // 从数据库读取 API Key（根据 sandbox_mode 选择）
    const { data: config } = await supabaseAdmin
      .from('payment_config')
      .select('sandbox_mode, api_key, sandbox_api_key')
      .eq('id', 'default')
      .maybeSingle();

    const apiKey = config?.sandbox_mode ? config?.sandbox_api_key : config?.api_key;

    if (!apiKey) {
      console.error('[Creem Checkout] No API key configured for', config?.sandbox_mode ? 'sandbox' : 'production', 'mode');
      return NextResponse.json({ error: 'API key not configured. Please set it in admin payment settings.' }, { status: 500 });
    }

    // 通过 Creem API 创建结账
    const baseUrl = config?.sandbox_mode ? 'https://api.creem.io/v1' : 'https://api.creem.io/v1';
    const response = await fetch(`${baseUrl}/checkouts`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id,
        customer: customer_email ? { email: customer_email } : undefined,
        metadata: {
          user_id, // 传入 Supabase user_id，webhook 可读取
        },
        success_url: success_url || undefined,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Creem Checkout] API error:', data);
      return NextResponse.json({ error: data.message || 'Failed to create checkout' }, { status: response.status });
    }

    console.log('[Creem Checkout] Created checkout:', data.id, 'user_id:', user_id, 'mode:', config?.sandbox_mode ? 'sandbox' : 'production');

    return NextResponse.json({ checkout_url: data.url, checkout_id: data.id });
  } catch (e: any) {
    console.error('[Creem Checkout] Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
