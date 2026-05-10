"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

import PaymentSuccessModal from '../components/PaymentSuccessModal';

interface AuthContextType {
  user: any;
  loading: boolean;
  hasPurchased: boolean;
  signInWithGoogle: () => Promise<void>;
  initiateCheckout: () => Promise<void>;
  completePayment: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const userRef = useRef<any>(null);
  userRef.current = user;

  useEffect(() => {
    // 优先检查本地存储的购买状态
    if (typeof window !== 'undefined' && localStorage.getItem('hasPurchased') === 'true') {
      setHasPurchased(true);
    }

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          // 检查购买记录
          const { data: purchases } = await supabase
            .from('purchases')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('item_id', 'all_access')
            .limit(1);
          
          if (purchases && purchases.length > 0) {
            setHasPurchased(true);
            localStorage.setItem('hasPurchased', 'true');
          } else {
            if (localStorage.getItem('hasPurchased') !== 'true') {
              setHasPurchased(false);
            }
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);
      if (!session?.user) {
        // 如果没有登录，保持 localStorage 里的购买状态，如果不为 true 才设为 false
        if (localStorage.getItem('hasPurchased') !== 'true') {
          setHasPurchased(false);
        }
      } else {
        // 检查购买记录
        const { data: purchases } = await supabase
          .from('purchases')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('item_id', 'all_access')
          .limit(1);
        
        if (purchases && purchases.length > 0) {
          setHasPurchased(true);
          localStorage.setItem('hasPurchased', 'true');
        } else {
          // 如果云端没有，但本地有，可能刚买完还没同步（在补充方案下），保持本地状态
          if (localStorage.getItem('hasPurchased') !== 'true') {
            setHasPurchased(false);
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // 处理支付成功回调
    const params = new URLSearchParams(window.location.search);
    if (params.get('unlock') === 'true') {
      if (window.opener) {
        // 如果是支付弹窗回调回来，通知主窗口并关闭
        window.opener.postMessage('creem_payment_success', '*');
        setTimeout(() => window.close(), 100);
      } else {
        // 如果是在当前窗口直接跳转回来的
        completePayment();
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    const handleMessage = async (event: MessageEvent) => {
      if (event.data === 'creem_payment_success') {
        completePayment();
      }
      // Google login callback from popup: exchange code for session
      if (event.data?.type === 'google_login_callback' && event.data?.url) {
        console.log('[AuthContext] Received google_login_callback:', event.data.url);
        try {
          const { error, data } = await supabase.auth.exchangeCodeForSession(event.data.url);
          if (error) {
            console.error('[AuthContext] Google login exchange error:', error.message);
          } else {
            console.log('[AuthContext] Google login exchange success, session:', !!data.session);
          }
          // onAuthStateChange will pick up the new session automatically
        } catch (err) {
          console.error('[AuthContext] Google login callback error:', err);
        }
      }
    };

    // Poll for session changes as a fallback (popup may close before postMessage arrives)
    let sessionPollInterval: ReturnType<typeof setInterval> | null = null;
    const pollSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && !userRef.current) {
        console.log('[AuthContext] Session detected via polling, updating user');
        setUser(session.user);
        // Check purchases
        const { data: purchases } = await supabase
          .from('purchases')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('item_id', 'all_access')
          .limit(1);
        if (purchases && purchases.length > 0) {
          setHasPurchased(true);
          localStorage.setItem('hasPurchased', 'true');
        }
      }
    };
    sessionPollInterval = setInterval(pollSession, 2000);

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      if (sessionPollInterval) clearInterval(sessionPollInterval);
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            prompt: 'select_account',
          },
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: true,
        },
      });
      if (error) throw error;

      if (data?.url) {
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const authWindow = window.open(
          data.url,
          'google-login',
          `width=${width},height=${height},left=${left},top=${top}`
        );

        if (!authWindow) {
          alert('弹窗被拦截，请允许弹窗后重试。浏览器可能阻止了弹窗。');
        } else {
          // Watch for popup closing — when it closes, check session as fallback
          const checkClosed = setInterval(() => {
            if (authWindow.closed) {
              clearInterval(checkClosed);
              console.log('[AuthContext] Popup closed, checking session...');
              // Small delay to allow exchangeCodeForSession to complete if postMessage worked
              setTimeout(async () => {
                if (!userRef.current) {
                  const { data: { session } } = await supabase.auth.getSession();
                  if (session?.user) {
                    console.log('[AuthContext] Got session after popup close');
                    setUser(session.user);
                    const { data: purchases } = await supabase
                      .from('purchases')
                      .select('*')
                      .eq('user_id', session.user.id)
                      .eq('item_id', 'all_access')
                      .limit(1);
                    if (purchases && purchases.length > 0) {
                      setHasPurchased(true);
                      localStorage.setItem('hasPurchased', 'true');
                    }
                  }
                }
              }, 1000);
            }
          }, 500);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('登录失败，请重试');
    }
  };

  const initiateCheckout = async () => {
    // 纯无账号方案：如果没有本地分配的ID，就生成一个。
    let localToken = localStorage.getItem('device_purchase_token');
    if (!localToken) {
      localToken = 'dev_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('device_purchase_token', localToken);
    }

    const checkoutUrl = (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_CREEM_CHECKOUT_URL || process.env.VITE_CREEM_CHECKOUT_URL : null) || 'https://www.creem.io/payment/prod_5xXOa84Nq51M6OpgInrSKp';
    if (checkoutUrl) {
      const url = new URL(checkoutUrl);
      // 有 user 则附带 user.id，没有则使用 localToken（便于之后如果有后台需求可以对账）
      url.searchParams.append('client_reference_id', user ? user.id : localToken);
      url.searchParams.append('success_url', window.location.origin + window.location.pathname + '?unlock=true');
      
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
        alert('弹窗被拦截，将直接在当前页面打开支付');
        window.location.href = url.toString();
      }
    }
  };

  const completePayment = async () => {
    // 1. 无账号核心：将购买状态直接保存在当前设备浏览器缓存
    localStorage.setItem('hasPurchased', 'true');
    setHasPurchased(true);

    // 告知用户状态（避免重复提示，可以存一个提示标记，或者既然完成就只提示一次）
    if (!sessionStorage.getItem('payment_alert_shown')) {
        setIsSuccessModalOpen(true);
        sessionStorage.setItem('payment_alert_shown', 'true');
    }

    // 2. 兼容有登录账户的情况（作为补充，如果用户碰巧登录了，还是记到云端）
    if (user) {
      try {
        const { data: existingPurchases } = await supabase
          .from('purchases')
          .select('*')
          .eq('user_id', user.id)
          .eq('item_id', 'all_access')
          .limit(1);

        if (existingPurchases && existingPurchases.length > 0) {
          return; // 已存
        }

        await supabase.from('purchases').insert({
          user_id: user.id,
          amount: 99,
          item_id: 'all_access',
          status: 'completed',
        });
      } catch (error) {
        console.error('补充保存至云端失败:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, hasPurchased, signInWithGoogle, initiateCheckout, completePayment }}>
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
