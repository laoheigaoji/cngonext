"use client";

import VisaTypes from "@/app-views/visa/VisaTypes";

export default function VisaTypesClient({ initialData, initialTranslations }: { initialData?: { visaTypes: any[]; documents: any[] }; initialTranslations?: Record<string, string> }) {
  return <VisaTypes initialData={initialData} initialTranslations={initialTranslations} />;
}
