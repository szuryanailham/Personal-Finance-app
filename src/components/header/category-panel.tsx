"use client"

import { cn } from "@/lib/utils"
import { CategoryManagerContent } from "./category-manager-content"
import { useCategoryManager } from "./use-category-manager"

interface CategoryPanelProps {
  // Fetch hanya berjalan saat enabled
  enabled: boolean
  className?: string
}

// Versi halaman (bukan modal) dari kelola kategori, dipakai di route /category
export function CategoryPanel({ enabled, className }: CategoryPanelProps) {
  const manager = useCategoryManager(enabled)

  return (
    <section className={cn("flex flex-col gap-4 rounded-2xl bg-white p-4", className)}>
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          {manager.editing ? "Edit Kategori" : "Tambah Kategori"}
        </h2>
        <p className="text-sm text-muted-foreground">Kelola kategori untuk transaksi kamu</p>
      </div>

      <CategoryManagerContent manager={manager} tableClassName="max-h-none" />
    </section>
  )
}
