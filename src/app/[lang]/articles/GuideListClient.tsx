"use client";

import GuideList from "@/app-views/guide/GuideList";

export default function GuideListClient({ initialData }: { initialData?: any[] }) {
  return <GuideList initialData={initialData} />;
}
