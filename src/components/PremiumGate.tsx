import React, { useState, useEffect } from 'react';
import { Lock, CreditCard, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface PremiumGateProps {
  children: React.ReactNode;
  isZh?: boolean;
}

export default function PremiumGate({ children, isZh = true }: PremiumGateProps) {
  const { language } = useLanguage();
  const { user, hasPurchased: authHasPurchased, initiateCheckout, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 检查登录和购买状态
  useEffect(() => {
    if (authHasPurchased) {
      setIsPurchased(true);
      setIsLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setIsAuthenticated(true);
          // 检查购买记录
          const { data: purchase } = await supabase
            .from('purchases')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('item_id', 'all_access')
            .single();
          
          if (purchase) {
            setIsPurchased(true);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // 监听登录状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (!session) {
        setIsPurchased(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [authHasPurchased]);

  // Google 登录
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // 支付
  const handlePay = async () => {
    setIsProcessing(true);
    try {
      await initiateCheckout();
    } catch (error) {
      console.error('Payment error:', error);
      alert(isZh ? '支付失败，请重试' : 'Payment failed, please try again');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  // 已购买，直接显示内容
  if (isPurchased) {
    return <>{children}</>;
  }

  // 付费引导卡片
  return (
    <div className="relative">
      {/* 磨砂玻璃遮罩层 - 让下方内容隐约可见 */}
      <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-md rounded-2xl" />

      {/* 付费引导卡片 - 居中显示 */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 text-center">
          {/* 锁定图标 */}
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-green-600" />
          </div>

          {/* 标题 */}
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {isZh ? '解锁全站资源' : 'Unlock All Content'}
          </h3>
          
          {/* 描述 */}
          <p className="text-gray-500 mb-8 leading-relaxed">
            {isZh 
              ? '一次支付 $1，终身有效，持续更新！包含离线对话、VPN 避雷、移动支付全流程等核心进阶锦囊。' 
              : 'One-time $1 payment, lifetime access! Includes offline guides, VPN tips, mobile payment tutorials and more.'}
          </p>

          {/* 按钮区域 */}
          <div className="space-y-4">
            {!isAuthenticated ? (
              // 未登录 - 显示登录按钮
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-700 font-bold py-4 px-6 rounded-2xl transition-all active:scale-95 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>{isZh ? '使用 Google 登录' : 'Sign in with Google'}</span>
              </button>
            ) : (
              // 已登录未购买 - 显示购买按钮
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 px-6 rounded-2xl transition-all active:scale-95 shadow-lg shadow-green-200"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CreditCard className="w-5 h-5" />
                )}
                <span>
                  {isProcessing 
                    ? (isZh ? '支付处理中...' : 'Processing...') 
                    : (isZh ? '立即支付 $1 解锁全站' : 'Pay $1 to Unlock All')}
                </span>
              </button>
            )}
            
            {/* 底部提示 */}
            <div className="pt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-1 text-[11px] text-gray-400 uppercase tracking-wider font-bold">
                <CheckCircle2 className="w-3 h-3" /> {isZh ? '一键访问' : 'One-tap access'}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-gray-400 uppercase tracking-wider font-bold">
                <CheckCircle2 className="w-3 h-3" /> {isZh ? '支付保障' : 'Secure payment'}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-gray-400 uppercase tracking-wider font-bold">
                <CheckCircle2 className="w-3 h-3" /> {isZh ? '终身有效' : 'Lifetime'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 成功提示 */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {isZh ? '支付成功！' : 'Payment Successful!'}
            </h3>
            <p className="text-gray-500 mb-4">
              {isZh ? '您已成功解锁全部锦囊内容' : 'You now have access to all guide content'}
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-2 transition-colors"
            >
              {isZh ? '开始阅读' : 'Start Reading'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
