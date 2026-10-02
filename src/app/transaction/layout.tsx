import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "Transaction",
};

export default function TransactionLayout({ children }: LayoutProps<"/transaction">) {
  return <AppShell title="Transaction">{children}</AppShell>;
}
