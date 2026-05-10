"use client";

import GuideDetail from "@/app-views/guide/GuideDetail";

export default function GuideDetailClient({ initialData, ssrContentRendered, ssrArticleContent }: { initialData?: any; ssrContentRendered?: boolean; ssrArticleContent?: string }) {
  return <GuideDetail initialData={initialData} ssrContentRendered={ssrContentRendered} ssrArticleContent={ssrArticleContent} />;
}
