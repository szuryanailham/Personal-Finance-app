import type { Metadata } from "next";
import { PersonalizedGreeting } from "@/components/home/personalized-greeting";
import { AppShell } from "@/components/layout/app-shell";
import { SummaryCarousel } from "@/components/mobile/summary-carousel";
import { MenuGrid } from "@/components/mobile/menu-grid";
import { MobileTodayTransactions } from "@/components/mobile/mobile-today-transactions";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <AppShell
      title="Dashboard"
      mobile={
        <div className="flex flex-col gap-6 pb-6">
          <div className="flex flex-col gap-3">
            <PersonalizedGreeting className="px-4 pt-4" />
            <SummaryCarousel />
          </div>
          <div className="px-4">
            <MenuGrid />
            <MobileTodayTransactions />
          </div>
        </div>
      }
    >
      {children}
    </AppShell>
  );
}
