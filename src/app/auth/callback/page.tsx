"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

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
    // Priority: sessionStorage > URL redirect param > default
    const storageRedirect = sessionStorage.getItem('auth_redirect_path');
    sessionStorage.removeItem('auth_redirect_path');
    if (storageRedirect) return storageRedirect;

    const urlParams = new URLSearchParams(window.location.search);
    const urlRedirect = urlParams.get('redirect');
    if (urlRedirect) return urlRedirect;

    // Default: use language from URL path or fallback to cn
    const pathParts = window.location.pathname.split('/');
    const lang = (pathParts.length > 1 && ['cn', 'tw', 'en', 'ja', 'ko', 'ru', 'fr', 'es', 'de', 'it'].includes(pathParts[1])) ? pathParts[1] : 'cn';
    return `/${lang}/tools/menu-translator/`;
  };

  useEffect(() => {
    let redirected = false;
    const redirectPath = getRedirectPath();

    const doRedirect = (path: string) => {
      if (redirected) return;
      redirected = true;
      setStatus('Login successful! Redirecting...');
      console.log("[AuthCallback] Redirecting to:", path);
      window.location.replace(path);
    };

    const handleCallback = async () => {
      try {
        const hash = window.location.hash;
        const search = window.location.search;
        const fullUrl = window.location.href;

        console.log("[AuthCallback] Full URL:", fullUrl);
        console.log("[AuthCallback] Hash:", hash);
        console.log("[AuthCallback] Search:", search);
        console.log("[AuthCallback] Redirect path:", redirectPath);

        // 1. Implicit flow: tokens in hash fragment
        if (hash && hash.length > 1 && hash.includes("access_token=")) {
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");
          if (accessToken && refreshToken) {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
          }
        }

        // 2. PKCE flow: code in URL search params or hash
        const urlParams = new URLSearchParams(search);
        const hashParams = hash ? new URLSearchParams(hash.substring(1)) : new URLSearchParams();
        const code = urlParams.get("code") || hashParams.get("code");
        if (code) {
          console.log("[AuthCallback] Found PKCE code:", code);
          try {
            const { data, error } = await supabase.auth.exchangeCodeForSession(fullUrl);
            if (error) {
              console.log("[AuthCallback] exchangeCodeForSession error:", error.message);
            } else {
              console.log("[AuthCallback] exchangeCodeForSession success, session:", data.session ? "present" : "null");
            }
          } catch (e: any) {
            console.log("[AuthCallback] exchangeCodeForSession exception:", e?.message || e);
          }
        }

        // 3. Clean up hash from URL
        if (hash && hash.length > 1) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }

        // 4. Try to get session with retries
        for (let i = 0; i < 10; i++) {
          const { data: { session } } = await supabase.auth.getSession();
          console.log(`[AuthCallback] getSession attempt ${i + 1}:`, session ? "found" : "not found");
          if (session) {
            doRedirect(redirectPath);
            return;
          }
          await new Promise(r => setTimeout(r, 500));
        }

        // 5. If we still don't have session, try onAuthStateChange
        console.log("[AuthCallback] Session not found via polling, listening for onAuthStateChange...");
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log("[AuthCallback] onAuthStateChange:", event, session ? "has session" : "no session");
            if (event === 'SIGNED_IN' || session) {
              doRedirect(redirectPath);
              subscription.unsubscribe();
            }
          }
        );

        // 6. Final timeout - redirect anyway (user may already be logged in via Supabase)
        setTimeout(() => {
          if (!redirected) {
            subscription.unsubscribe();
            console.log("[AuthCallback] Timed out, redirecting to:", redirectPath);
            doRedirect(redirectPath);
          }
        }, 5000);
      } catch (err) {
        console.error("[AuthCallback] Error:", err);
        doRedirect(redirectPath);
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
