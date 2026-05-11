import React from "react";
import type { Metadata } from "next";
import "../index.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "tripcngo.com - Your Ultimate China Travel Guide",
  description: "Your ultimate guide to traveling China. Explore authentic Chinese culture, detailed visa policies, practical travel tips. Payment, transport, and essential app guides make trip planning easy.",
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="google-adsense-account" content="ca-pub-8643427369112788" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8643427369112788" crossOrigin="anonymous"></script>
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
