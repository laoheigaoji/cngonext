"use client";

import VisaFees from "@/app-views/visa/VisaFees";

export default function VisaFeesClient({ initialData, initialTranslations }: { initialData?: any[]; initialTranslations?: Record<string, string> }) {
  return <VisaFees initialData={initialData} initialTranslations={initialTranslations} />;
}
