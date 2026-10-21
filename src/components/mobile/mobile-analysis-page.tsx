"use client"

import { CategoryAnalysis } from "@/components/chart/category-analysis"
import { useIsMobile } from "@/hooks/use-mobile"

// Halaman analisis versi mobile. Tree mobile tetap ter-mount di desktop (hanya disembunyikan CSS),
// jadi konten hanya dirender saat layar mobile agar fetch tidak dobel dengan halaman desktop.
export function MobileAnalysisPage() {
  const isMobile = useIsMobile()

  return (
    <div className="flex min-w-0 flex-col gap-4 px-4 pb-6">
      <h1 className="text-lg font-semibold text-slate-900">Analisis</h1>
      {isMobile && <CategoryAnalysis />}
    </div>
  )
}
