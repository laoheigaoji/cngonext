"use client";

import Guide from "@/app-views/Guide";

export default function GuideClient({ initialData, initialTranslations, skipHero }: { initialData?: any; initialTranslations?: Record<string, string>; skipHero?: boolean }) {
  return <Guide initialData={initialData} initialTranslations={initialTranslations} skipHero={skipHero} />;
}
