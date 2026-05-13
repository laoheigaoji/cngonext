-- ============================================
-- 用户套餐购买记录表
-- 在 Supabase Dashboard > SQL Editor 中运行
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan TEXT NOT NULL,                -- 'traveler', 'starter', 'starter-yearly', 'pro', 'pro-yearly'
  plan_name TEXT NOT NULL,           -- 'Traveler', 'Starter', 'Pro'
  cycle TEXT NOT NULL DEFAULT 'monthly',  -- 'monthly', 'yearly', '10days'
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'active',  -- 'active', 'expired', 'cancelled'
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,            -- 过期时间（Traveler 10天后过期，月付30天后，年付365天后）
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_user_plans_user_id ON public.user_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_plans_status ON public.user_plans(status);
CREATE INDEX IF NOT EXISTS idx_user_plans_expires ON public.user_plans(expires_at);

-- RLS
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;

-- 用户可以查看自己的套餐
DROP POLICY IF EXISTS "Users can view own plans" ON public.user_plans;
CREATE POLICY "Users can view own plans" ON public.user_plans
  FOR SELECT USING (auth.uid() = user_id);

-- 用户可以插入自己的套餐
DROP POLICY IF EXISTS "Users can insert own plans" ON public.user_plans;
CREATE POLICY "Users can insert own plans" ON public.user_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- service_role 全权限
DROP POLICY IF EXISTS "Service role full access" ON public.user_plans;
CREATE POLICY "Service role full access" ON public.user_plans
  FOR ALL USING (true) WITH CHECK (true);
