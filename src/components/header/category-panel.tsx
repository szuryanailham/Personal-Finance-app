"use client"

import { useState } from "react"
import { categoryCurrency } from "@/lib/category-appearance"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CategoryManagerContent } from "./category-manager-content"
import { CategoryTable } from "./category-table"
import { useCategoryManager } from "./use-category-manager"

interface CategoryPanelProps {
  // Fetch hanya berjalan saat enabled
  enabled: boolean
  className?: string
}

// Daftar kategori untuk halaman /category
export function CategoryPanel({ enabled, className }: CategoryPanelProps) {
  const manager = useCategoryManager(enabled)
  const { categories, isLoading, error, editing, setEditing, handleDelete, reset } = manager

  const [viewingId, setViewingId] = useState<string | null>(null)
  const viewedCategory = categories.find((category) => category.id === viewingId)

  return (
    <section data-guidance="category" className={cn("flex flex-col gap-4 rounded-2xl bg-white p-4", className)}>
      {error && !editing && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <CategoryTable
        categories={categories}
        isLoading={isLoading}
        showBudget={false}
        onViewDetails={(category) => setViewingId(category.id)}
        actions={{
          editingId: editing?.id ?? null,
          onEdit: (category) => { reset(); setEditing(category) },
          onDelete: handleDelete,
        }}
      />
      <Dialog open={viewedCategory !== undefined} onOpenChange={(open) => { if (!open) setViewingId(null) }}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Kategori</DialogTitle>
            <DialogDescription>Ringkasan kategori yang dipilih.</DialogDescription>
          </DialogHeader>
          {viewedCategory && (
            <>
              <p className="min-w-0 font-semibold [overflow-wrap:anywhere]">{viewedCategory.name}</p>
              {viewedCategory.type === "EXPENSE" && (
                <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 border-t pt-4 text-sm [&>dt]:text-muted-foreground [&>dd]:text-right [&>dd]:[overflow-wrap:anywhere]">
                  <dt>Total Anggaran</dt>
                  <dd>{viewedCategory.budget === undefined ? "—" : categoryCurrency.format(viewedCategory.budget)}</dd>
                  <dt>Total Pengeluaran</dt>
                  <dd>{viewedCategory.totalExpense === undefined ? "—" : categoryCurrency.format(viewedCategory.totalExpense)}</dd>
                  <dt>Sisa Anggaran</dt>
                  <dd>{viewedCategory.remainingBudget === undefined ? "—" : categoryCurrency.format(viewedCategory.remainingBudget)}</dd>
                </dl>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={editing !== null} onOpenChange={(open) => { if (!open) reset() }}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
            <DialogDescription>Ubah pengaturan kategori {editing?.name}.</DialogDescription>
          </DialogHeader>
          {editing && <CategoryManagerContent manager={manager} showTable={false} />}
        </DialogContent>
      </Dialog>
    </section>
  )
}
