"use client";

import Cities from "@/app-views/Cities";

export default function CitiesClient({ initialData, skipStaticSections }: { initialData?: any[]; skipStaticSections?: boolean }) {
  return <Cities initialData={initialData} skipStaticSections={skipStaticSections} />;
}
