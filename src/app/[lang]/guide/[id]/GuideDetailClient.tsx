"use client";

import GuideDetail from "@/app-views/guide/GuideDetail";

export default function GuideDetailClient({ initialData, initialTranslations }: { initialData?: any[]; initialTranslations?: Record<string, string> }) {
  return <GuideDetail initialData={initialData} initialTranslations={initialTranslations} />;
}
