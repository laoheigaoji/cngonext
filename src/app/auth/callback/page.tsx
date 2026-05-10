"use client";

import { useEffect } from "react";
import { supabase } from "../../../lib/supabase";

export default function AuthCallback() {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Try to establish session from URL hash (implicit flow) or code (PKCE flow)
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

        // Notify opener window that auth completed successfully
        if (window.opener) {
          window.opener.postMessage({ type: 'AUTH_SUCCESS' }, '*');
          // Close popup after a small delay
          setTimeout(() => window.close(), 200);
        } else {
          // Full redirect mode: go to home
          setTimeout(() => window.location.replace("/"), 300);
        }
      } catch (err) {
        console.error("[AuthCallback] Error:", err);
        if (window.opener) {
          window.opener.postMessage({ type: 'AUTH_ERROR', error: String(err) }, '*');
          setTimeout(() => window.close(), 500);
        } else {
          setTimeout(() => window.location.replace("/"), 500);
        }
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p>Logging in...</p>
      </div>
    </div>
  );
}
