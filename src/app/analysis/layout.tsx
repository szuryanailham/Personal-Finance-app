import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { MobileAnalysisPage } from "@/components/mobile/mobile-analysis-page";

export const metadata: Metadata = {
  title: "Analysis",
};

export default function AnalysisLayout({ children }: LayoutProps<"/analysis">) {
  return (
    <AppShell title="Analysis" mobile={<MobileAnalysisPage />}>
      {children}
    </AppShell>
  );
}
