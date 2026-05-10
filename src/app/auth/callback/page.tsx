"use client";

import { useEffect } from "react";

export default function AuthCallback() {
  useEffect(() => {
    const fullUrl = window.location.href;
    console.log("[AuthCallback] Popup loaded, URL:", fullUrl);
    console.log("[AuthCallback] Has opener:", !!window.opener);

    // The popup callback page: pass the URL back to the opener window
    // so the opener can exchange the code for a session (PKCE code_verifier
    // is stored in the opener's localStorage, not accessible from the popup)
    if (window.opener) {
      // Try postMessage first
      try {
        window.opener.postMessage(
          { type: "google_login_callback", url: fullUrl },
          window.location.origin
        );
        console.log("[AuthCallback] postMessage sent successfully");
      } catch (err) {
        console.error("[AuthCallback] postMessage failed:", err);
      }
      // Close the popup after a short delay
      setTimeout(() => {
        console.log("[AuthCallback] Closing popup");
        window.close();
      }, 500);
    } else {
      // If opened directly (not a popup), handle locally
      window.location.href = "/";
    }
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
