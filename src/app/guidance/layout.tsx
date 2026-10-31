import type { Metadata } from "next"
import { AppShell } from "@/components/layout/app-shell"
import { GuidanceCenter } from "@/components/guidance/guidance-center"

export const metadata: Metadata = { title: "Pusat Panduan | Artoku" }

export default function GuidanceLayout({ children }: LayoutProps<"/guidance">) {
  return <AppShell title="Pusat Panduan" mobile={<div className="px-4 pb-6"><h1 className="py-4 text-lg font-semibold">Pusat Panduan</h1><GuidanceCenter /></div>}>{children}</AppShell>
}
