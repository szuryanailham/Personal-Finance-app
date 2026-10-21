import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { MobileSummaryPage } from "@/components/mobile/mobile-summary-page";

export const metadata: Metadata = {
  title: "Ringkasan",
};

export default function SummaryLayout({ children }: LayoutProps<"/summary">) {
  return (
    <AppShell title="Ringkasan" mobile={<MobileSummaryPage />}>
      {children}
    </AppShell>
  );
}
