import { LANGUAGES } from "@/lib/static-params";
import { Metadata } from "next";
import LangLayoutClient from "./LangLayoutClient";

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

export default function LangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LangLayoutClient>{children}</LangLayoutClient>;
}
