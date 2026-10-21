import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { MobileTransactionRoutes } from "@/components/mobile/mobile-transaction-routes";

export const metadata: Metadata = {
  title: "Transaksi",
};

export default function TransactionLayout({ children }: LayoutProps<"/transaction">) {
  return (
    <AppShell title="Transaksi" mobile={<MobileTransactionRoutes />}>
      {children}
    </AppShell>
  );
}
