"use client";

import Home from "@/app-views/Home";

export default function HomeClient({ initialData }: { initialData?: { articles: any[]; cities: any[]; faqs: any[] } }) {
  return <Home initialData={initialData} />;
}
