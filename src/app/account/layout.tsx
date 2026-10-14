import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "Account",
};

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return <AppShell title="Account">{children}</AppShell>;
}
