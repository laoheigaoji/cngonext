"use client";

import TermsOfService from "@/app-views/TermsOfService";

export default function TermsClient({ initialData, lang }: { initialData?: any[]; lang?: string }) {
  return <TermsOfService initialData={initialData} lang={lang} />;
}
