"use client";

import { useEffect } from "react";

export default function AuthCallback() {
  useEffect(() => {
    // Supabase SDK (detectSessionInUrl: true) automatically processes the OAuth callback.
    // Just redirect back to where the user came from.
    const redirectPath = sessionStorage.getItem('auth_redirect_path') || '/cn';
    sessionStorage.removeItem('auth_redirect_path');
    window.location.replace(redirectPath);
  }, []);

  return null;
}
