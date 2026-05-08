import Feedback from "@/app-views/Feedback";
import { getHreflangAlternates, baseUrl } from "@/lib/seo-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return {
    title: 'Feedback - tripcngo.com',
    description: 'Share your feedback and suggestions to help us improve tripcngo.com.',
    alternates: {
      canonical: `${baseUrl}/${lang}/feedback`,
      languages: getHreflangAlternates('/feedback'),
    },
  };
}

export default function Page() {
  return <Feedback />;
}
