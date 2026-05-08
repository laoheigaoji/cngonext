"use client";

import CityDetail from "@/app-views/city/CityDetail";

export default function CityDetailClient({ initialData }: { initialData?: any }) {
  return <CityDetail initialData={initialData} />;
}
