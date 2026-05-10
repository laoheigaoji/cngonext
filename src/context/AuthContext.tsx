"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

import PaymentSuccessModal from '../components/PaymentSuccessModal';

interface AuthContextType {
  user: any;
  loading: boolean;
  hasPurchased: boolean;
  signInWithGoogle: () => Promise<void>;
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

  // Listen for postMessage from popup callback
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'AUTH_SUCCESS') {
        // Popup completed login, refresh session
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            await checkPurchase(session.user.id);
          }
        } catch (e) {
          console.error('Session refresh after popup failed:', e);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Payment callback handling
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('unlock') === 'true') {
      if (window.opener) {
        window.opener.postMessage('creem_payment_success', '*');
        setTimeout(() => window.close(), 100);
      } else {
        completePayment();
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    const handlePaymentMessage = async (event: MessageEvent) => {
      if (event.data === 'creem_payment_success') {
        completePayment();
      }
    };

    window.addEventListener('message', handlePaymentMessage);
    return () => window.removeEventListener('message', handlePaymentMessage);
  }, []);

  const signInWithGoogle = async () => {
    try {
      // Save current path so we can return to it after login
      const currentPath = window.location.pathname + window.location.search;
      sessionStorage.setItem('auth_redirect_path', currentPath);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: { prompt: 'select_account' },
          redirectTo: window.location.origin + '/auth/callback',
        },
      });

      if (error) throw error;
      // Full page redirect - no popup, no close issues
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed, please try again');
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
    // Immediately clear state regardless of signOut result
    setUser(null);
    setHasPurchased(false);
    localStorage.removeItem('hasPurchased');
  };

  const initiateCheckout = async () => {
    let localToken = localStorage.getItem('device_purchase_token');
    if (!localToken) {
      localToken = 'dev_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('device_purchase_token', localToken);
    }

    const checkoutUrl = (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_CREEM_CHECKOUT_URL || process.env.VITE_CREEM_CHECKOUT_URL : null) || 'https://www.creem.io/payment/prod_5xXOa84Nq51M6OpgInrSKp';
    if (checkoutUrl) {
      const url = new URL(checkoutUrl);
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
        alert('Popup blocked, opening payment in current window');
        window.location.href = url.toString();
      }
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
    <AuthContext.Provider value={{ user, loading, hasPurchased, signInWithGoogle, signOut, initiateCheckout, completePayment }}>
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
