import React from "react";
import type { Metadata } from "next";
import "../index.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "tripcngo.com - 旅行中国出发 | Travel China, Let's Go",
  description: "Your ultimate guide to traveling China, from visa policies to AI smart tools.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
