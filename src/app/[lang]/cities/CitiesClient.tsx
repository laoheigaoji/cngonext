"use client";

import Cities from "@/app-views/Cities";

export default function CitiesClient({ initialData }: { initialData?: any[] }) {
  return <Cities initialData={initialData} />;
}
