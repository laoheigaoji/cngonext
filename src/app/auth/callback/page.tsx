"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function AuthCallback() {
  const [status, setStatus] = useState('Logging in...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectTo = params.get('redirect_to');
    const redirectPath = redirectTo || sessionStorage.getItem('auth_redirect_path') || '/cn';
    sessionStorage.removeItem('auth_redirect_path');

    let redirected = false;
    const doRedirect = (path: string) => {
      if (redirected) return;
      redirected = true;
      window.location.replace(path);
    };

    // Safety timeout: always redirect within 5 seconds
    const safetyTimer = setTimeout(() => doRedirect(redirectPath), 5000);

    const handleCallback = async () => {
      try {
        const fullUrl = window.location.href;
        console.log("[AuthCallback] URL:", fullUrl);

        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
          console.error("[AuthCallback] No code in URL");
          clearTimeout(safetyTimer);
          doRedirect(redirectPath);
          return;
        }

        // Create a DIRECT Supabase client (not the Proxy) to avoid any SSR/caching issues
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://cxegaqhwexiidezycbyg.supabase.co';
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZWdhcWh3ZXhpaWRlenljYnlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NDIyMjUsImV4cCI6MjA5MzUxODIyNX0.7Tp0V5WoTfWOIhbHOH-SKoTH7VRJeGDQDcQXIaJuz6g';

        const supabase = createClient(supabaseUrl, supabaseKey, {
          auth: {
            flowType: 'pkce',
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
        });

        console.log("[AuthCallback] Exchanging code for session...");
        setStatus('Verifying...');

        const { error } = await supabase.auth.exchangeCodeForSession(fullUrl);

        if (error) {
          console.error("[AuthCallback] Exchange error:", error.message);
          setStatus('Login failed, redirecting...');
        } else {
          console.log("[AuthCallback] Exchange success!");
          setStatus('Success! Redirecting...');

          // Verify session was established
          const { data: { session } } = await supabase.auth.getSession();
          console.log("[AuthCallback] Session established:", !!session?.user);
        }
      } catch (err) {
        console.error("[AuthCallback] Error:", err);
        setStatus('Error, redirecting...');
      }

      clearTimeout(safetyTimer);
      // Small delay so user sees success message
      setTimeout(() => doRedirect(redirectPath), 500);
    };

    handleCallback();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  );
}
