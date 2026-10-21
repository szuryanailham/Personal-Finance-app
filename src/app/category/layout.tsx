import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { MobileCategoryPage } from "@/components/mobile/mobile-category-page";

export const metadata: Metadata = {
  title: "Kategori",
};

export default function CategoryLayout({ children }: LayoutProps<"/category">) {
  return (
    <AppShell title="Kategori" mobile={<MobileCategoryPage />}>
      {children}
    </AppShell>
  );
}
