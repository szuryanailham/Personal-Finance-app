import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { SummaryCarousel } from "@/components/mobile/summary-carousel";
import { MenuGrid } from "@/components/mobile/menu-grid";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <AppShell
      title="Dashboard"
      mobile={
        <div className="flex flex-col gap-6 pb-6">
          <SummaryCarousel />
          <MenuGrid />
        </div>
      }
    >
      {children}
    </AppShell>
  );
}
