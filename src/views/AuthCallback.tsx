"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const [status, setStatus] = useState('Logging in...');

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Try to establish session from URL
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

        // Also check if session already exists
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          setStatus('Login successful!');
          if (window.opener) {
            window.opener.postMessage({ type: 'AUTH_SUCCESS' }, '*');
            setTimeout(() => window.close(), 300);
          } else {
            setTimeout(() => window.location.replace('/'), 500);
          }
        } else {
          // Wait for onAuthStateChange
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
              if (event === 'SIGNED_IN' || session) {
                setStatus('Login successful!');
                if (window.opener) {
                  window.opener.postMessage({ type: 'AUTH_SUCCESS' }, '*');
                  setTimeout(() => window.close(), 300);
                } else {
                  setTimeout(() => window.location.replace('/'), 500);
                }
                subscription.unsubscribe();
              }
            }
          );

          // Timeout fallback
          setTimeout(() => {
            if (window.opener) {
              window.close();
            } else {
              window.location.replace('/');
            }
          }, 5000);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        if (window.opener) {
          window.opener.postMessage({ type: 'AUTH_ERROR', error: String(err) }, '*');
          setTimeout(() => window.close(), 1000);
        } else {
          setTimeout(() => window.location.replace('/'), 1000);
        }
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-8 max-w-sm w-full">
        {!status.includes('successful') && (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1b887a] mx-auto mb-4"></div>
        )}
        {status.includes('successful') && (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        <p className="text-gray-700 font-medium text-lg">{status}</p>
      </div>
    </div>
  );
}
