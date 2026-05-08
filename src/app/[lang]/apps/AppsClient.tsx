"use client";

import Apps from "@/app-views/Apps";

export default function AppsClient({ initialData }: { initialData?: any[] }) {
  return <Apps initialData={initialData} />;
}
