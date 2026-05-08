import { LANGUAGES, GUIDE_IDS } from "@/lib/static-params";
import GuideDetailClient from "./GuideDetailClient";

export function generateStaticParams() {
  return LANGUAGES.flatMap((lang) =>
    GUIDE_IDS.map((id) => ({ lang, id }))
  );
}

export default function Page() {
  return <GuideDetailClient />;
}
