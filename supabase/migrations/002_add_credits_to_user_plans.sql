-- ============================================
-- 为 user_plans 表增加积分字段
-- 在 Supabase Dashboard > SQL Editor 中运行
-- ============================================

ALTER TABLE IF EXISTS public.user_plans
  ADD COLUMN IF NOT EXISTS credits INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS credits_used INTEGER NOT NULL DEFAULT 0;
