"use client";

import GuideDetail from "@/views/guide/GuideDetail";

export default function ArticleDetailClient({ initialData, ssrContentRendered }: { initialData?: any; ssrContentRendered?: boolean }) {
  return <GuideDetail initialData={initialData} ssrContentRendered={ssrContentRendered} />;
}
