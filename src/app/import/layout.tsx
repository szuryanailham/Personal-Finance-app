import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { MobileImportPage } from "@/components/mobile/mobile-import-page";

export const metadata: Metadata = {
  title: "Import",
};

export default function ImportLayout({ children }: LayoutProps<"/import">) {
  return (
    <AppShell title="Import" mobile={<MobileImportPage />}>
      {children}
    </AppShell>
  );
}
