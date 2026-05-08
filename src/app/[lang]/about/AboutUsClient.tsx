"use client";

import AboutUs from "@/app-views/AboutUs";

export default function AboutUsClient({ initialData, lang }: { initialData?: any[]; lang?: string }) {
  return <AboutUs initialData={initialData} lang={lang} />;
}
