"use client";

import GuideDetail from "@/views/guide/GuideDetail";

export default function ArticleDetailClient({ initialData, ssrContentRendered, ssrArticleContent }: { initialData?: any; ssrContentRendered?: boolean; ssrArticleContent?: string }) {
  return <GuideDetail initialData={initialData} ssrContentRendered={ssrContentRendered} ssrArticleContent={ssrArticleContent} />;
}
