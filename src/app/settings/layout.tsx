import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { MobileSettingsPage } from "@/components/mobile/mobile-settings-page";

export const metadata: Metadata = {
  title: "Pengaturan",
};

export default function SettingsLayout({ children }: LayoutProps<"/settings">) {
  return (
    <AppShell title="Pengaturan" mobile={<MobileSettingsPage />}>
      {children}
    </AppShell>
  );
}
