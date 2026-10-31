import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { HeadDashboard } from "@/components/header/headDashboard";
import { TransactionFilterProvider } from "@/components/header/transaction-filter-context";
import { TransactionRevisionProvider } from "@/components/header/transaction-revision-context";
import { ResponsiveShell } from "@/components/layout/responsive-shell";
import { MobileShell } from "@/components/layout/mobile-shell";

interface AppShellProps {
  title: string;
  /** Konten halaman versi mobile; kosong jika halaman mobile belum dibuat */
  mobile?: ReactNode;
  children: ReactNode;
}

// Kerangka halaman aplikasi: sidebar di kiri, header + konten di kanan (desktop),
// layout terpisah untuk mobile. Provider dipasang di luar agar dipakai kedua layout.
export function AppShell({ title, mobile, children }: AppShellProps) {
  return (
    <div data-guidance-shell>
    <TransactionRevisionProvider>
      <TransactionFilterProvider>
        <ResponsiveShell mobile={<MobileShell>{mobile}</MobileShell>}>
          <SidebarProvider className="md:[--sidebar:#14864A] md:[--sidebar-foreground:#ffffff] md:[--sidebar-accent:#10733e] md:[--sidebar-accent-foreground:#ffffff]">
            <AppSidebar />
            <div className="flex min-w-0 flex-1 flex-col px-6">
              <HeadDashboard title={title} />
              <main className="flex-1">{children}</main>
            </div>
          </SidebarProvider>
        </ResponsiveShell>
      </TransactionFilterProvider>
    </TransactionRevisionProvider>
    </div>
  );
}
