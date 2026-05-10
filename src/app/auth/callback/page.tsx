"use client";

import { useEffect } from "react";
import { supabase } from "../../../lib/supabase";

export default function AuthCallback() {
  useEffect(() => {
    const handleCallback = async () => {
      const hash = window.location.hash;
      console.log("[AuthCallback] Handling callback, hash:", hash ? "present" : "none");

      try {
        if (hash && hash.includes("access_token=")) {
          // Implicit flow: Parse the hash fragment and set session manually
          const params = new URLSearchParams(hash.substring(1)); // remove leading #
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
          } else {
            console.error("[AuthCallback] Missing access_token or refresh_token in hash");
          }
        } else {
          // PKCE flow: URL has ?code= parameter
          const fullUrl = window.location.href;
          const { error, data } = await supabase.auth.exchangeCodeForSession(fullUrl);
          if (error) {
            console.error("[AuthCallback] Code exchange error:", error.message);
          } else {
            console.log("[AuthCallback] Code exchange success, user:", data.session?.user?.email);
          }
        }
      } catch (err) {
        console.error("[AuthCallback] Callback handling failed:", err);
      }

      // Wait for session to be persisted to localStorage before redirecting
      // This ensures AuthContext's onAuthStateChange fires and picks up the session
      setTimeout(() => {
        window.location.replace("/");
      }, 800);
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
