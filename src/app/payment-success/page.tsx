"use client";

import { useEffect } from 'react';

/**
 * 支付成功回调页面
 * Creem 支付完成后重定向到此页面（在弹窗内）
 * 此页面只负责：通知原页面支付成功，然后关闭弹窗
 */
export default function PaymentSuccess() {
  useEffect(() => {
    // 方式1: postMessage 通知打开此弹窗的原页面
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({ type: 'PAYMENT_SUCCESS' }, window.location.origin);
    }

    // 方式2: BroadcastChannel 通知同源其他标签页
    try {
      const bc = new BroadcastChannel('payment_channel');
      bc.postMessage({ type: 'PAYMENT_SUCCESS' });
      bc.close();
    } catch {}

    // 方式3: localStorage 通知（兼容性最好）
    localStorage.setItem('payment_success_time', Date.now().toString());

    // 延迟关闭弹窗，确保消息发送成功
    setTimeout(() => {
      try {
        window.close();
      } catch {}
      // 如果 window.close() 不生效（某些浏览器限制非脚本打开的窗口），
      // 显示手动关闭提示
    }, 300);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-green-50">
      <div className="text-center p-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-6">You can close this window now.</p>
        <button
          onClick={() => window.close()}
          className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors"
        >
          Close Window
        </button>
      </div>
    </div>
  );
}
