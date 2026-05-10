"use client";

import { useEffect } from "react";
import { supabase } from "../../../lib/supabase";

export default function AuthCallback() {
  useEffect(() => {
    const handleCallback = async () => {
      const hash = window.location.hash;
      const search = window.location.search;

      try {
        if (hash && hash.includes("access_token=")) {
          // Implicit flow: Parse hash fragment and set session
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");

          if (accessToken && refreshToken) {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) {
              console.error("[AuthCallback] setSession error:", error.message);
            } else {
              console.log("[AuthCallback] setSession success, user:", data.user?.email);
            }
          }
        } else if (search && search.includes("code=")) {
          // PKCE flow: exchange code for session
          const fullUrl = window.location.href;
          const { error } = await supabase.auth.exchangeCodeForSession(fullUrl);
          if (error) {
            console.error("[AuthCallback] Code exchange error:", error.message);
          } else {
            console.log("[AuthCallback] Code exchange success");
          }
        }

        // If this is a popup window (opened by signInWithGoogle), close it
        // The main window's onAuthStateChange will detect the new session
        if (window.opener) {
          // Small delay to ensure session is persisted
          setTimeout(() => {
            window.close();
          }, 300);
        } else {
          // Full redirect mode: redirect to home after session is set
          setTimeout(() => {
            window.location.replace("/");
          }, 500);
        }
      } catch (err) {
        console.error("[AuthCallback] Callback handling failed:", err);
        // Still try to close popup or redirect
        if (window.opener) {
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
