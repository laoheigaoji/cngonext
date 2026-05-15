"use client";

import { useEffect, useState } from 'react';

// planKey → productId 映射（与 MenuTranslator 一致）
const PLAN_PRODUCT_IDS: Record<string, string> = {
  traveler: 'prod_3TVyXsKR8av0l01JAJoBrU',
  starter_monthly: 'prod_7YpsVCJSFtxQr3Fqhk0uHZ',
  starter_yearly: 'prod_2Jw6Tigcj1ydA2JxbiNLpN',
  pro_monthly: 'prod_5O65NauyqMWA0ZtiroA9XG',
  pro_yearly: 'prod_268yTiuPPqD5QbnW18jo2x',
};

/**
 * 支付成功回调页面
 * Creem 支付完成后重定向到此页面
 * 此页面负责：1) 直接调用 activate-plan 激活套餐 2) 通知原页面 3) 关闭弹窗
 */
export default function PaymentSuccess() {
  const [status, setStatus] = useState<'activating' | 'success' | 'error'>('activating');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const activate = async () => {
      // 从 URL 获取 plan 参数
      const params = new URLSearchParams(window.location.search);
      const planKey = params.get('plan');
      const productId = planKey ? PLAN_PRODUCT_IDS[planKey] : null;

      // 获取 user_id：从 localStorage 中 supabase token 解析
      let userId: string | null = null;

      // 方式1: 从 supabase localStorage token 解析
      try {
        const keys = Object.keys(localStorage).filter(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
        for (const key of keys) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw);
            const uid = parsed?.user?.id || parsed?.user_id;
            if (uid) { userId = uid; break; }
          }
        }
      } catch (e) {
        console.error('[PaymentSuccess] Parse localStorage error:', e);
      }

      // 方式2: 从 supabase session 获取
      if (!userId) {
        try {
          // 动态导入 supabase client
          const { supabase } = await import('../../lib/supabase');
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user?.id) {
            userId = session.user.id;
          }
        } catch (e) {
          console.error('[PaymentSuccess] getSession error:', e);
        }
      }

      console.log('[PaymentSuccess] planKey:', planKey, 'productId:', productId, 'userId:', userId);

      if (productId && userId) {
        try {
          // 先等2秒让 Creem webhook 有机会先处理
          await new Promise(r => setTimeout(r, 2000));

          // 先查是否 webhook 已创建套餐
          const checkRes = await fetch(`/api/save-plan?user_id=${encodeURIComponent(userId)}`);
          const checkData = await checkRes.json();

          if (checkData.hasAccess && checkData.plan) {
            // webhook 已创建，直接用
            console.log('[PaymentSuccess] ✅ Webhook already created plan');
            setStatus('success');
            notifyParent(checkData.plan);
            return;
          }

          // webhook 没处理，前端主动激活
          console.log('[PaymentSuccess] Activating plan via API...');
          const res = await fetch('/api/activate-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, user_id: userId }),
          });
          const data = await res.json();

          if (data.success && data.plan) {
            console.log('[PaymentSuccess] ✅ Plan activated');
            setStatus('success');
            notifyParent(data.plan);
          } else {
            console.error('[PaymentSuccess] activate-plan failed:', data);
            setStatus('error');
            setErrorMsg(data.error || '激活失败，请联系客服');
          }
        } catch (e) {
          console.error('[PaymentSuccess] activate error:', e);
          setStatus('error');
          setErrorMsg('网络错误，请刷新重试');
        }
      } else {
        // 没有 planKey 或 userId，仍然通知原页面
        console.warn('[PaymentSuccess] Missing planKey or userId, skipping activation');
        setStatus('success');
      }

      // 通知原页面
      notifyParent(null);

      // 延迟关闭弹窗
      setTimeout(() => {
        try { window.close(); } catch {}
      }, 2000);
    };

    activate();
  }, []);

  const notifyParent = (planData: any) => {
    // 方式1: postMessage
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({ type: 'PAYMENT_SUCCESS', plan: planData }, window.location.origin);
    }
    // 方式2: BroadcastChannel
    try {
      const bc = new BroadcastChannel('payment_channel');
      bc.postMessage({ type: 'PAYMENT_SUCCESS', plan: planData });
      bc.close();
    } catch {}
    // 方式3: localStorage
    localStorage.setItem('payment_success_time', Date.now().toString());
    if (planData) {
      localStorage.setItem('user_plan', JSON.stringify(planData));
      window.dispatchEvent(new CustomEvent('plan-updated', { detail: planData }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-green-50">
      <div className="text-center p-8">
        {status === 'activating' && (
          <>
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Activating your plan...</h1>
            <p className="text-gray-500">Please wait a moment</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-500 mb-6">Your plan has been activated. You can close this window now.</p>
            <button
              onClick={() => window.close()}
              className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors"
            >
              Close Window
            </button>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">Activation Failed</h1>
            <p className="text-gray-500 mb-2">{errorMsg}</p>
            <p className="text-sm text-gray-400 mb-6">Your payment was successful. Please contact support if the issue persists.</p>
            <button
              onClick={() => window.close()}
              className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors"
            >
              Close Window
            </button>
          </>
        )}
      </div>
    </div>
  );
}
