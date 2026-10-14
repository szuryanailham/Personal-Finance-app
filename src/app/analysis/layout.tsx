import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "Analysis",
};

export default function AnalysisLayout({ children }: LayoutProps<"/analysis">) {
  return <AppShell title="Analysis">{children}</AppShell>;
}
