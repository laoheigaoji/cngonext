"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function AuthCallback() {
  const [status, setStatus] = useState('Logging in...');

  useEffect(() => {
    const handleCallback = async () => {
      const redirectPath = sessionStorage.getItem('auth_redirect_path') || '/cn';
      sessionStorage.removeItem('auth_redirect_path');

      try {
        const fullUrl = window.location.href;
        console.log("[AuthCallback] URL:", fullUrl);

        // PKCE flow: exchange code for session
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code) {
          console.log("[AuthCallback] Exchanging code for session...");
          const { data, error } = await supabase.auth.exchangeCodeForSession(fullUrl);
          if (error) {
            console.error("[AuthCallback] Exchange error:", error.message);
          } else if (data.session) {
            console.log("[AuthCallback] Login success!");
          }
        }

        // Wait briefly for session to be available, then redirect
        setStatus('Redirecting...');
        setTimeout(() => {
          window.location.replace(redirectPath);
        }, 500);
      } catch (err) {
        console.error("[AuthCallback] Error:", err);
        // Still redirect on error
        window.location.replace(redirectPath);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <p className="text-gray-500">{status}</p>
    </div>
  );
}
