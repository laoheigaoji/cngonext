"use client";

import TermsOfService from "@/app-views/TermsOfService";

export default function TermsClient({ translations }: { translations?: Record<string, string> }) {
  return <TermsOfService translations={translations} />;
}
