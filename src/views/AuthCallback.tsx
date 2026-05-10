"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const [status, setStatus] = useState('Logging in...');

  // Extract language prefix from a redirect path to build default path
  const getLangPrefix = (path: string | null): string => {
    if (!path) return 'cn';
    const validPrefixes = ['cn', 'tw', 'en', 'ja', 'ko', 'ru', 'fr', 'es', 'de', 'it'];
    const parts = path.split('/');
    if (parts.length > 1 && validPrefixes.includes(parts[1])) {
      return parts[1];
    }
    return 'cn';
  };

  const getRedirectPath = (): string => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlRedirect = urlParams.get('redirect');
    const storageRedirect = sessionStorage.getItem('auth_redirect_path');
    const redirect = urlRedirect || storageRedirect;
    sessionStorage.removeItem('auth_redirect_path');
    if (redirect) return redirect;
    const lang = getLangPrefix(urlRedirect) || 'cn';
    return `/${lang}/tools/menu-translator/`;
  };

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const hash = window.location.hash;
        const search = window.location.search;

        if (hash && hash.includes("access_token=")) {
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");
          if (accessToken && refreshToken) {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
          }
        } else if (search && search.includes("code=")) {
          await supabase.auth.exchangeCodeForSession(window.location.href);
        }

        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          setStatus('Login successful! Redirecting...');
          const redirectPath = getRedirectPath();
          setTimeout(() => {
            window.location.replace(redirectPath);
          }, 500);
        } else {
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
              if (event === 'SIGNED_IN' || session) {
                setStatus('Login successful! Redirecting...');
                const redirectPath = getRedirectPath();
                setTimeout(() => {
                  window.location.replace(redirectPath);
                }, 500);
                subscription.unsubscribe();
              }
            }
          );

          setTimeout(() => {
            subscription.unsubscribe();
            setStatus('Login timed out. Redirecting...');
            const redirectPath = getRedirectPath();
            setTimeout(() => window.location.replace(redirectPath), 1000);
          }, 10000);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setStatus('Login failed. Redirecting...');
        const redirectPath = getRedirectPath();
        setTimeout(() => window.location.replace(redirectPath), 2000);
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-sm w-full">
        {!status.includes('successful') && !status.includes('failed') && !status.includes('timed') && (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1b887a] mx-auto mb-4"></div>
        )}
        {(status.includes('successful') || status.includes('Redirecting')) && (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        {status.includes('failed') && (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}
        <p className="text-gray-700 font-medium text-lg">{status}</p>
      </div>
    </div>
  );
}
