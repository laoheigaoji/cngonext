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
        const fullUrl = window.location.href;

        console.log("[AuthCallback] Full URL:", fullUrl);
        console.log("[AuthCallback] Hash:", hash);
        console.log("[AuthCallback] Search:", search);

        if (hash && hash.length > 1 && hash.includes("access_token=")) {
          // Implicit flow: tokens in hash fragment
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
          // PKCE flow: exchange code for session
          await supabase.auth.exchangeCodeForSession(fullUrl);
        }

        // Clean up hash from URL
        if (hash && hash.length > 1) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }

        // Try multiple times to get session with delay
        // Supabase client may need time to sync from storage
        let session: any = null;
        for (let i = 0; i < 5; i++) {
          const result = await supabase.auth.getSession();
          session = result.data.session;
          console.log(`[AuthCallback] getSession attempt ${i + 1}:`, session ? "found" : "not found");
          if (session) break;
          // Wait 500ms before retry
          await new Promise(r => setTimeout(r, 500));
        }

        if (session) {
          setStatus('Login successful! Redirecting...');
          // Priority: URL param > sessionStorage > default
          const urlParams = new URLSearchParams(window.location.search);
          const redirectPath = urlParams.get('redirect') || sessionStorage.getItem('auth_redirect_path') || '/cn/tools/menu-translator/';
          sessionStorage.removeItem('auth_redirect_path');
          console.log("[AuthCallback] Redirecting to:", redirectPath);
          setTimeout(() => {
            window.location.replace(redirectPath);
          }, 500);
          return;
        }

        // Fallback: listen for auth state change
        let resolved = false;
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log("[AuthCallback] onAuthStateChange:", event, session ? "has session" : "no session");
            if (resolved) return;
            if (event === 'SIGNED_IN' || session) {
              resolved = true;
              setStatus('Login successful! Redirecting...');
              const urlParams = new URLSearchParams(window.location.search);
              const redirectPath = urlParams.get('redirect') || sessionStorage.getItem('auth_redirect_path') || '/cn/tools/menu-translator/';
              sessionStorage.removeItem('auth_redirect_path');
              console.log("[AuthCallback] onAuthStateChange redirecting to:", redirectPath);
              setTimeout(() => {
                window.location.replace(redirectPath);
              }, 500);
              subscription.unsubscribe();
            }
          }
        );

        // Timeout fallback - redirect to menu translator
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            subscription.unsubscribe();
            console.log("[AuthCallback] Timed out, redirecting to menu translator");
            setStatus('Login timed out. Redirecting...');
            const urlParams = new URLSearchParams(window.location.search);
            const redirectPath = urlParams.get('redirect') || '/cn/tools/menu-translator/';
            setTimeout(() => window.location.replace(redirectPath), 1000);
          }
        }, 10000);
      } catch (err) {
        console.error("[AuthCallback] Error:", err);
        setStatus('Login failed. Redirecting...');
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPath = urlParams.get('redirect') || '/cn/tools/menu-translator/';
        setTimeout(() => window.location.replace(redirectPath), 2000);
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
