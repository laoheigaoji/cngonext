"use client";

import AboutUs from "@/app-views/AboutUs";

export default function AboutUsClient({ translations }: { translations?: Record<string, string> }) {
  return <AboutUs translations={translations} />;
}
