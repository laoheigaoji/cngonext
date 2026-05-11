"use client";

import { useEffect, useState } from "react";

export default function AuthCallback() {
  const [status, setStatus] = useState('Logging in...');

  useEffect(() => {
    const redirectPath = sessionStorage.getItem('auth_redirect_path') || '/cn';
    sessionStorage.removeItem('auth_redirect_path');

    let redirected = false;
    const doRedirect = () => {
      if (redirected) return;
      redirected = true;
      window.location.replace(redirectPath);
    };

    // Safety timeout: always redirect within 3 seconds no matter what
    const safetyTimer = setTimeout(doRedirect, 3000);

    const handleCallback = async () => {
      try {
        const fullUrl = window.location.href;
        console.log("[AuthCallback] URL:", fullUrl);

        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code) {
          // Dynamically import supabase to avoid SSR issues
          const { supabase } = await import("../../../lib/supabase");
          console.log("[AuthCallback] Exchanging code for session...");
          setStatus('Verifying...');

          const { error } = await supabase.auth.exchangeCodeForSession(fullUrl);
          if (error) {
            console.error("[AuthCallback] Exchange error:", error.message);
          } else {
            console.log("[AuthCallback] Exchange success");
          }
        }
      } catch (err) {
        console.error("[AuthCallback] Error:", err);
      }

      // Done - redirect now
      setStatus('Redirecting...');
      clearTimeout(safetyTimer);
      doRedirect();
    };

    handleCallback();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <p className="text-gray-500">{status}</p>
    </div>
  );
}
