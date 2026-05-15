import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const TABLE = 'payment_config';
const CONFIG_ID = 'default';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select('*')
      .eq('id', CONFIG_ID)
      .maybeSingle();

    if (error) {
      console.error('[PaymentConfig] GET error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 默认配置
    const config = data || {
      id: CONFIG_ID,
      sandbox_mode: true,
      sandbox_url: 'https://www.creem.io/test/payment/prod_5xXOa84Nq51M6OpgInrSKp',
      webhook_secret: '',
      plans: {
        traveler: { product_id: 'prod_3TVyXsKR8av0l01JAJoBrU', url: 'https://www.creem.io/payment/prod_3TVyXsKR8av0l01JAJoBrU' },
        starter_monthly: { product_id: 'prod_7YpsVCJSFtxQr3Fqhk0uHZ', url: 'https://www.creem.io/payment/prod_7YpsVCJSFtxQr3Fqhk0uHZ' },
        starter_yearly: { product_id: 'prod_2Jw6Tigcj1ydA2JxbiNLpN', url: 'https://www.creem.io/payment/prod_2Jw6Tigcj1ydA2JxbiNLpN' },
        pro_monthly: { product_id: 'prod_5O65NauyqMWA0ZtiroA9XG', url: 'https://www.creem.io/payment/prod_5O65NauyqMWA0ZtiroA9XG' },
        pro_yearly: { product_id: 'prod_268yTiuPPqD5QbnW18jo2x', url: 'https://www.creem.io/payment/prod_268yTiuPPqD5QbnW18jo2x' },
      },
      updated_at: null,
    };

    return NextResponse.json({ config });
  } catch (e: any) {
    console.error('[PaymentConfig] GET exception:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sandbox_mode, sandbox_url, sandbox_api_key, api_key, webhook_secret, plans } = body;

    const payload: any = {
      updated_at: new Date().toISOString(),
    };
    if (typeof sandbox_mode === 'boolean') payload.sandbox_mode = sandbox_mode;
    if (sandbox_url !== undefined) payload.sandbox_url = sandbox_url;
    if (sandbox_api_key !== undefined) payload.sandbox_api_key = sandbox_api_key;
    if (api_key !== undefined) payload.api_key = api_key;
    if (webhook_secret !== undefined) payload.webhook_secret = webhook_secret;
    if (plans !== undefined) payload.plans = plans;

    // upsert
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .upsert({ id: CONFIG_ID, ...payload })
      .select()
      .maybeSingle();

    if (error) {
      console.error('[PaymentConfig] POST error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ config: data });
  } catch (e: any) {
    console.error('[PaymentConfig] POST exception:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
