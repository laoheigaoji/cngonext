"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function AuthCallback() {
  const [status, setStatus] = useState('Logging in...');

  useEffect(() => {
    const handleCallback = async () => {
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

        // Verify session was established
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          setStatus('Login successful! Redirecting...');
          // Get saved redirect path or default to home
          const redirectPath = sessionStorage.getItem('auth_redirect_path') || '/';
          sessionStorage.removeItem('auth_redirect_path');
          setTimeout(() => {
            window.location.replace(redirectPath);
          }, 500);
        } else {
          // Wait for onAuthStateChange as fallback
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
              if (event === 'SIGNED_IN' || session) {
                setStatus('Login successful! Redirecting...');
                const redirectPath = sessionStorage.getItem('auth_redirect_path') || '/';
                sessionStorage.removeItem('auth_redirect_path');
                setTimeout(() => {
                  window.location.replace(redirectPath);
                }, 500);
                subscription.unsubscribe();
              }
            }
          );

          // Timeout fallback
          setTimeout(() => {
            subscription.unsubscribe();
            setStatus('Login timed out. Redirecting...');
            setTimeout(() => window.location.replace('/'), 1000);
          }, 10000);
        }
      } catch (err) {
        console.error("[AuthCallback] Error:", err);
        setStatus('Login failed. Redirecting...');
        setTimeout(() => window.location.replace('/'), 2000);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        {!status.includes('successful') && !status.includes('failed') && !status.includes('timed') && (
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1b887a] mx-auto mb-4"></div>
        )}
        {(status.includes('successful') || status.includes('Redirecting')) && (
          <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        {status.includes('failed') && (
          <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-red-100 mb-4">
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
