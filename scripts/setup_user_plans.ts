// 初始化 user_plans 表
// 运行: npx ts-node scripts/setup_user_plans.ts

const SUPABASE_URL = 'https://cxegaqhwexiidezycbyg.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZWdhcWh3ZXhpaWRlenljYnlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk0MjIyNSwiZXhwIjoyMDkzNTE4MjI1fQ.e-OEm6Gtyp8Dp0_dOorW1FSXYjEpvEdDTt6NjPQQ1W8';

async function main() {
  const sql = `
    -- 用户套餐购买记录表
    CREATE TABLE IF NOT EXISTS public.user_plans (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      plan TEXT NOT NULL,
      plan_name TEXT NOT NULL,
      cycle TEXT NOT NULL DEFAULT 'monthly',
      amount NUMERIC(10,2) NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'USD',
      status TEXT NOT NULL DEFAULT 'active',
      purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      expires_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_user_plans_user_id ON public.user_plans(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_plans_status ON public.user_plans(status);
    CREATE INDEX IF NOT EXISTS idx_user_plans_expires ON public.user_plans(expires_at);

    ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view own plans" ON public.user_plans;
    CREATE POLICY "Users can view own plans" ON public.user_plans
      FOR SELECT USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can insert own plans" ON public.user_plans;
    CREATE POLICY "Users can insert own plans" ON public.user_plans
      FOR INSERT WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Service role full access" ON public.user_plans;
    CREATE POLICY "Service role full access" ON public.user_plans
      FOR ALL USING (true) WITH CHECK (true);
  `;

  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  console.log('Response status:', response.status);
  const text = await response.text();
  console.log('Response:', text);
}

main().catch(console.error);
