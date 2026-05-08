"use client";

import GuideDetail from "@/app-views/guide/GuideDetail";

export default function ArticleDetailClient({ initialData }: { initialData?: any }) {
  return <GuideDetail initialData={initialData} />;
}
