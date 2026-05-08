"use client";

import Guide from "@/app-views/Guide";

export default function GuideClient({ initialData, initialTranslations }: { initialData?: any[]; initialTranslations?: Record<string, string> }) {
  return <Guide initialData={initialData} initialTranslations={initialTranslations} />;
}
