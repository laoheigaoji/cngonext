import { Metadata } from "next";
import LangLayoutClient from "./LangLayoutClient";

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
