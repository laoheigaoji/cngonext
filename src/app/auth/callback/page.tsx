"use client";

import { useEffect } from "react";

export default function AuthCallback() {
  useEffect(() => {
    const fullUrl = window.location.href;
    console.log("[AuthCallback] Loaded, URL:", fullUrl);

    // When redirected back from Google OAuth (direct redirect, not popup)
    // Exchange the code for a session right here
    const exchangeCode = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://cxegaqhwexiidezycbyg.supabase.co';
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZWdhcWh3ZXhpaWRlenljYnlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NDIyMjUsImV4cCI6MjA5MzUxODIyNX0.7Tp0V5WoTfWOIhbHOH-SKoTH7VRJeGDQDcQXIaJuz6g';
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { error, data } = await supabase.auth.exchangeCodeForSession(fullUrl);
        if (error) {
          console.error("[AuthCallback] Exchange error:", error.message);
        } else {
          console.log("[AuthCallback] Exchange success, session:", !!data.session);
        }
      } catch (err) {
        console.error("[AuthCallback] Exchange failed:", err);
      }

      // Always redirect back to the main page after handling
      // Use replace to not leave callback in browser history
      window.location.replace("/");
    };

    exchangeCode();
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
