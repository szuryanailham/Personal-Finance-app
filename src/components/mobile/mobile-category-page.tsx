"use client"

import { CategoryPanel } from "@/components/header/category-panel"
import { useIsMobile } from "@/hooks/use-mobile"

// Halaman kategori versi mobile. Tree mobile tetap ter-mount di desktop (hanya disembunyikan CSS),
// jadi fetch dibatasi saat layar mobile agar tidak dobel dengan halaman desktop.
export function MobileCategoryPage() {
  const isMobile = useIsMobile()

  return (
    <div className="flex flex-col gap-4 px-4 pb-6">
      <h1 className="text-lg font-semibold text-slate-900">Kategori</h1>
      <CategoryPanel enabled={isMobile} />
    </div>
  )
}
