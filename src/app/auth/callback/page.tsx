"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function AuthCallback() {
  const [status, setStatus] = useState('Logging in...');

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

        // Verify session was established
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          setStatus('Login successful!');
          // Notify opener window
          if (window.opener) {
            try {
              window.opener.postMessage({ type: 'AUTH_SUCCESS' }, '*');
            } catch (e) {
              console.error('postMessage failed:', e);
            }
            // Try multiple times to close the popup
            setTimeout(() => window.close(), 200);
            setTimeout(() => window.close(), 500);
            setTimeout(() => window.close(), 1000);
            // Final fallback: redirect to a blank page
            setTimeout(() => {
              window.location.href = 'about:blank';
            }, 2000);
          } else {
            setTimeout(() => window.location.replace("/"), 300);
          }
        } else {
          // Wait for onAuthStateChange
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
              if (event === 'SIGNED_IN' || session) {
                setStatus('Login successful!');
                if (window.opener) {
                  try {
                    window.opener.postMessage({ type: 'AUTH_SUCCESS' }, '*');
                  } catch (e) {
                    console.error('postMessage failed:', e);
                  }
                  setTimeout(() => window.close(), 200);
                  setTimeout(() => window.close(), 500);
                  setTimeout(() => window.close(), 1000);
                  setTimeout(() => { window.location.href = 'about:blank'; }, 2000);
                } else {
                  setTimeout(() => window.location.replace("/"), 500);
                }
                subscription.unsubscribe();
              }
            }
          );

          // Timeout fallback
          setTimeout(() => {
            subscription.unsubscribe();
            if (window.opener) {
              try {
                window.opener.postMessage({ type: 'AUTH_SUCCESS' }, '*');
              } catch (e) {}
              window.location.href = 'about:blank';
            } else {
              window.location.replace("/");
            }
          }, 8000);
        }
      } catch (err) {
        console.error("[AuthCallback] Error:", err);
        if (window.opener) {
          try {
            window.opener.postMessage({ type: 'AUTH_ERROR', error: String(err) }, '*');
          } catch (e) {}
          setTimeout(() => window.close(), 500);
          setTimeout(() => { window.location.href = 'about:blank'; }, 1500);
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
        {!status.includes('successful') && (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1b887a] mx-auto mb-4"></div>
        )}
        {status.includes('successful') && (
          <div className="mx-auto flex items-center justify-center h-8 w-8 rounded-full bg-green-100 mb-4">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        <p className="text-gray-700 font-medium">{status}</p>
        {status.includes('successful') && (
          <p className="text-gray-400 text-sm mt-2">You can close this window</p>
        )}
      </div>
    </div>
  );
}
