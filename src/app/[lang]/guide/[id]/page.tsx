import { LANGUAGES, GUIDE_IDS } from "@/lib/static-params";
import GuideDetailClient from "./GuideDetailClient";
import { getHreflangAlternates, baseUrl } from "@/lib/seo-config";

export function generateStaticParams() {
  return LANGUAGES.flatMap((lang) =>
    GUIDE_IDS.map((id) => ({ lang, id }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;

  return {
    title: `Travel Guide - tripcngo.com`,
    description: 'Practical China travel tips and guides on tripcngo.com',
    alternates: {
      canonical: `${baseUrl}/${lang}/guide/${id}`,
      languages: getHreflangAlternates(`/guide/${id}`),
    },
  };
}

export default function Page() {
  return <GuideDetailClient />;
}
