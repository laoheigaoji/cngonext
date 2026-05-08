"use client";

import GuideDetail from "@/app-views/guide/GuideDetail";

export default function GuideDetailClient({ initialData }: { initialData?: any }) {
  return <GuideDetail initialData={initialData} />;
}
