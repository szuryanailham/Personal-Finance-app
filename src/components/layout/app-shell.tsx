import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { HeadDashboard } from "@/components/header/headDashboard";
import { TransactionFilterProvider } from "@/components/header/transaction-filter-context";
import { TransactionRevisionProvider } from "@/components/header/transaction-revision-context";

interface AppShellProps {
  title: string;
  children: ReactNode;
}

// Kerangka halaman aplikasi: sidebar di kiri, header + konten di kanan
export function AppShell({ title, children }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <TransactionRevisionProvider>
        <TransactionFilterProvider>
          <div className="flex min-w-0 flex-1 flex-col px-6">
            <HeadDashboard title={title} />
            <main className="flex-1">{children}</main>
          </div>
        </TransactionFilterProvider>
      </TransactionRevisionProvider>
    </SidebarProvider>
  );
}
