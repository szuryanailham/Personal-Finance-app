import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "Pengaturan",
};

export default function SettingsLayout({ children }: LayoutProps<"/settings">) {
  return <AppShell title="Pengaturan">{children}</AppShell>;
}
