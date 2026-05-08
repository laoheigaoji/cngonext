"use client";

import PrivacyPolicy from "@/app-views/PrivacyPolicy";

export default function PrivacyClient({ initialData, lang }: { initialData?: any[]; lang?: string }) {
  return <PrivacyPolicy initialData={initialData} lang={lang} />;
}
