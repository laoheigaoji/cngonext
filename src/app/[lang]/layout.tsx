import { LANGUAGES } from "@/lib/static-params";
import LangLayoutClient from "./LangLayoutClient";

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export default function LangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LangLayoutClient>{children}</LangLayoutClient>;
}
