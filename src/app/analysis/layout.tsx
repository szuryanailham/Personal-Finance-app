import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { MobileAnalysisPage } from "@/components/mobile/mobile-analysis-page";

export const metadata: Metadata = {
  title: "Analisis",
};

export default function AnalysisLayout({ children }: LayoutProps<"/analysis">) {
  return (
    <AppShell title="Analisis" mobile={<MobileAnalysisPage />}>
      {children}
    </AppShell>
  );
}
