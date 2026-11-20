import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { MobileSummaryCard } from "@/components/mobile/mobile-summary-card";
import { MobileTodayTransactions } from "@/components/mobile/mobile-today-transactions";
import { CategoryBudgetTable } from "@/components/table/category-budget-table";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <AppShell
      title="Dashboard"
      mobile={
        <div className="flex flex-col gap-6 pb-6">
          <MobileSummaryCard />
          <div className="min-w-0 px-4">
            <CategoryBudgetTable compact />
            <MobileTodayTransactions />
          </div>
        </div>
      }
    >
      {children}
    </AppShell>
  );
}
