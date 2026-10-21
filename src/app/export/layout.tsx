import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { MobileExportPage } from "@/components/mobile/mobile-export-page";

export const metadata: Metadata = {
  title: "Export",
};

export default function ExportLayout({ children }: LayoutProps<"/export">) {
  return (
    <AppShell title="Export" mobile={<MobileExportPage />}>
      {children}
    </AppShell>
  );
}
