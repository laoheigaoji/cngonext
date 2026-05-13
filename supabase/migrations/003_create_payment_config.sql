-- 支付配置表：存储支付链接、沙盒模式开关、webhook secret 等
CREATE TABLE IF NOT EXISTS payment_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  sandbox_mode BOOLEAN NOT NULL DEFAULT true,
  sandbox_url TEXT NOT NULL DEFAULT 'https://www.creem.io/test/payment/prod_5xXOa84Nq51M6OpgInrSKp',
  webhook_secret TEXT NOT NULL DEFAULT '',
  plans JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ
);

-- 写入默认配置
INSERT INTO payment_config (id, sandbox_mode, sandbox_url, plans)
VALUES (
  'default',
  true,
  'https://www.creem.io/test/payment/prod_5xXOa84Nq51M6OpgInrSKp',
  '{
    "traveler": {"product_id": "prod_3TVyXsKR8av0l01JAJoBrU", "url": "https://www.creem.io/payment/prod_3TVyXsKR8av0l01JAJoBrU"},
    "starter_monthly": {"product_id": "prod_7YpsVCJSFtxQr3Fqhk0uHZ", "url": "https://www.creem.io/payment/prod_7YpsVCJSFtxQr3Fqhk0uHZ"},
    "starter_yearly": {"product_id": "prod_2Jw6Tigcj1ydA2JxbiNLpN", "url": "https://www.creem.io/payment/prod_2Jw6Tigcj1ydA2JxbiNLpN"},
    "pro_monthly": {"product_id": "prod_5O65NauyqMWA0ZtiroA9XG", "url": "https://www.creem.io/payment/prod_5O65NauyqMWA0ZtiroA9XG"},
    "pro_yearly": {"product_id": "prod_268yTiuPPqD5QbnW18jo2x", "url": "https://www.creem.io/payment/prod_268yTiuPPqD5QbnW18jo2x"}
  }'
)
ON CONFLICT (id) DO NOTHING;
