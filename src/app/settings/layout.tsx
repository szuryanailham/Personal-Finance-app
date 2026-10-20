import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsLayout({ children }: LayoutProps<"/settings">) {
  return <AppShell title="Settings">{children}</AppShell>;
}
