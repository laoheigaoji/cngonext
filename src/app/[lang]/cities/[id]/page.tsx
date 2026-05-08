import { LANGUAGES, getCityIds } from "@/lib/static-params";
import CityDetailClient from "./CityDetailClient";
import { getHreflangAlternates, baseUrl } from "@/lib/seo-config";

export async function generateStaticParams() {
  const cityIds = await getCityIds();
  return LANGUAGES.flatMap((lang) =>
    cityIds.map((id) => ({ lang, id }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;

  return {
    title: `City Guide - tripcngo.com`,
    description: 'Explore China travel destinations with tripcngo.com city guides',
    alternates: {
      canonical: `${baseUrl}/${lang}/cities/${id}`,
      languages: getHreflangAlternates(`/cities/${id}`),
    },
  };
}

export default function Page() {
  return <CityDetailClient />;
}
