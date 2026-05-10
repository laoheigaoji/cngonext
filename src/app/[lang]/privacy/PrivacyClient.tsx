"use client";

import PrivacyPolicy from "@/app-views/PrivacyPolicy";

export default function PrivacyClient({ translations }: { translations?: Record<string, string> }) {
  return <PrivacyPolicy translations={translations} />;
}
