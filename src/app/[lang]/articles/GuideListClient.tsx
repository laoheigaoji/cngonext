"use client";

import GuideList from "@/app-views/guide/GuideList";

export default function GuideListClient({ initialData, skipHero }: { initialData?: any[]; skipHero?: boolean }) {
  return <GuideList initialData={initialData} skipHero={skipHero} />;
}
