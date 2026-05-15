"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

import PaymentSuccessModal from '../components/PaymentSuccessModal';

interface AuthContextType {
  user: any;
  loading: boolean;
  hasPurchased: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  initiateCheckout: () => Promise<void>;
  completePayment: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Helper: check purchase status for a given user
  const checkPurchase = async (userId: string) => {
    try {
      const { data: purchases } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', userId)
        .eq('item_id', 'all_access')
        .limit(1);
      if (purchases && purchases.length > 0) {
        setHasPurchased(true);
        localStorage.setItem('hasPurchased', 'true');
      } else if (localStorage.getItem('hasPurchased') !== 'true') {
        setHasPurchased(false);
      }
    } catch (e) {
      console.error('Purchase check error:', e);
    }
  };

  useEffect(() => {
    // Check local purchase flag first
    if (typeof window !== 'undefined' && localStorage.getItem('hasPurchased') === 'true') {
      setHasPurchased(true);
    }

    // Initial session check
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await checkPurchase(session.user.id);
        } else if (process.env.NODE_ENV === 'development') {
          // 开发模式：从 localStorage 恢复测试用户
          const stored = localStorage.getItem('dev_test_user');
          if (stored) {
            setUser(JSON.parse(stored));
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes (detects login from popup callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await checkPurchase(session.user.id);
      } else {
        setUser(null);
        if (localStorage.getItem('hasPurchased') !== 'true') {
          setHasPurchased(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 监听跨标签页登录/同页回跳
  useEffect(() => {
    const refreshSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          localStorage.removeItem('dev_test_user');
          await checkPurchase(session.user.id);
        }
      } catch (e) {
        console.error('Session refresh failed:', e);
      }
    };

    // postMessage from popup
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'AUTH_SUCCESS') {
        await refreshSession();
      }
    };

    // BroadcastChannel from callback page (magic link)
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('auth_channel');
      bc.onmessage = async (event) => {
        if (event.data?.type === 'AUTH_SUCCESS') {
          await refreshSession();
        }
      };
    } catch {}

    // storage: 其他标签页 localStorage 变化时触发（邮件登录新标签页保存 session 后）
    const handleStorage = (e: StorageEvent) => {
      if (e.key?.startsWith('supabase.auth.') || e.key === 'dev_test_user') {
        refreshSession();
      }
    };

    // visibilitychange: 用户切回此标签页时检查
    const handleVisibility = () => { if (document.visibilityState === 'visible') refreshSession(); };
    const handleFocus = () => refreshSession();

    window.addEventListener('message', handleMessage);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorage);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('visibilitychange', handleVisibility);
      bc?.close();
    };
  }, []);

  // Payment callback handling
  useEffect(() => {
    const handlePaymentSuccess = async () => {
      completePayment();
      // 刷新 session 确保登录状态不丢失
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
        }
      } catch {}
    };

    // 监听来自 payment-success 弹窗页面的 postMessage
    const handlePaymentMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'PAYMENT_SUCCESS') {
        await handlePaymentSuccess();
      }
      // 兼容旧格式
      if (event.data === 'creem_payment_success') {
        await handlePaymentSuccess();
      }
    };

    // 监听 BroadcastChannel（payment-success 页面通过此通道通知）
    let payBc: BroadcastChannel | null = null;
    try {
      payBc = new BroadcastChannel('payment_channel');
      payBc.onmessage = async (event) => {
        if (event.data?.type === 'PAYMENT_SUCCESS') {
          await handlePaymentSuccess();
        }
      };
    } catch {}

    // 监听 storage 事件（payment-success 页面写入 localStorage）
    const handlePaymentStorage = (e: StorageEvent) => {
      if (e.key === 'payment_success_time') {
        handlePaymentSuccess();
      }
    };

    window.addEventListener('message', handlePaymentMessage);
    window.addEventListener('storage', handlePaymentStorage);
    return () => {
      window.removeEventListener('message', handlePaymentMessage);
      window.removeEventListener('storage', handlePaymentStorage);
      payBc?.close();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      // Save current path so we can return to it after login
      const currentPath = window.location.pathname + window.location.search;
      sessionStorage.setItem('auth_redirect_path', currentPath);

      // Use a clean callback URL without extra params - Supabase will append its own params
      const callbackUrl = window.location.origin + '/auth/callback/';

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: { prompt: 'select_account' },
          redirectTo: callbackUrl,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed, please try again');
    }
  };

  const signInWithEmail = async (email: string): Promise<{ success: boolean; error?: string; hasPlan?: boolean }> => {
    try {
      // 调用后端 API：查套餐 + 直接生成 session
      const res = await fetch('/api/email-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!data.success && data.hasPlan === false) {
        // 没有套餐
        return { success: false, hasPlan: false, error: 'No active plan found. Please purchase a plan first.' };
      }

      if (!data.success || !data.access_token || !data.refresh_token) {
        return { success: false, error: data.error || 'Login failed' };
      }

      // 用返回的 token 直接设置 session
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      if (sessionError) {
        console.error('[Auth] setSession error:', sessionError);
        return { success: false, error: sessionError.message };
      }

      if (sessionData.user) {
        setUser(sessionData.user);
        await checkPurchase(sessionData.user.id);
      }

      return { success: true, hasPlan: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('Supabase signOut error:', error.message);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
    // Immediately clear state regardless of signOut result
    setUser(null);
    setHasPurchased(false);
    localStorage.removeItem('hasPurchased');
    localStorage.removeItem('device_purchase_token');
    localStorage.removeItem('dev_test_user');
    localStorage.removeItem('user_plan');
    // Clear all Supabase auth tokens from localStorage
    if (typeof window !== 'undefined') {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('sb-')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
    // Redirect to home page after sign out (use replace to avoid back button issues)
    if (typeof window !== 'undefined') {
      window.location.replace('/');
    }
  };

  const initiateCheckout = async () => {
    if (!user) {
      alert('Please log in first');
      return;
    }

    // 从环境变量获取 product_id
    const productId = (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID : null) || 'prod_5xXOa84Nq51M6OpgInrSKp';

    try {
      // 通过后端 API 创建 Creem 结账，在 metadata 中传入 user_id，预填邮箱
      const res = await fetch('/api/creem-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          user_id: user.id,
          customer_email: user.email || undefined,
          success_url: window.location.origin + '/payment-success',
        }),
      });

      const data = await res.json();

      if (data.checkout_url) {
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const paymentWindow = window.open(
          data.checkout_url,
          'creem-payment',
          `width=${width},height=${height},left=${left},top=${top}`
        );

        if (!paymentWindow) {
          window.location.href = data.checkout_url;
        }
      } else {
        // 降级：使用旧方式直接打开 Creem 托管页面
        console.warn('[Auth] Creem Checkout API failed, falling back to hosted checkout');
        const checkoutUrl = (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_CREEM_CHECKOUT_URL || process.env.VITE_CREEM_CHECKOUT_URL : null) || 'https://www.creem.io/payment/prod_5xXOa84Nq51M6OpgInrSKp';
        const url = new URL(checkoutUrl);
        url.searchParams.append('client_reference_id', user.id);
        url.searchParams.append('success_url', window.location.origin + '/payment-success');

        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const paymentWindow = window.open(
          url.toString(),
          'creem-payment',
          `width=${width},height=${height},left=${left},top=${top}`
        );

        if (!paymentWindow) {
          window.location.href = url.toString();
        }
      }
    } catch (error) {
      console.error('[Auth] initiateCheckout error:', error);
      // 降级到旧方式
      const checkoutUrl = (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_CREEM_CHECKOUT_URL || process.env.VITE_CREEM_CHECKOUT_URL : null) || 'https://www.creem.io/payment/prod_5xXOa84Nq51M6OpgInrSKp';
      window.open(checkoutUrl, 'creem-payment');
    }
  };

  const completePayment = async () => {
    localStorage.setItem('hasPurchased', 'true');
    setHasPurchased(true);

    if (!sessionStorage.getItem('payment_alert_shown')) {
      setIsSuccessModalOpen(true);
      sessionStorage.setItem('payment_alert_shown', 'true');
    }

    if (user) {
      try {
        const { data: existingPurchases } = await supabase
          .from('purchases')
          .select('*')
          .eq('user_id', user.id)
          .eq('item_id', 'all_access')
          .limit(1);

        if (existingPurchases && existingPurchases.length > 0) return;

        await supabase.from('purchases').insert({
          user_id: user.id,
          amount: 99,
          item_id: 'all_access',
          status: 'completed',
        });
      } catch (error) {
        console.error('Cloud save failed:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, hasPurchased, signInWithGoogle, signInWithEmail, signOut, initiateCheckout, completePayment }}>
      {children}
      <PaymentSuccessModal 
        isOpen={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)} 
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
