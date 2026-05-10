"use client";

import CityDetail from "@/views/city/CityDetail";

export default function CityDetailClient({ initialData, ssrContentRendered }: { initialData?: any; ssrContentRendered?: boolean }) {
  return <CityDetail initialData={initialData} ssrContentRendered={ssrContentRendered} />;
}
