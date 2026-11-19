"use client"

import { useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { CategoryManagerContent } from "@/components/header/category-manager-content"
import { useCategoryManager } from "@/components/header/use-category-manager"
import type { Category } from "@/lib/api/category"
import { categoryCurrency as currency } from "@/lib/category-appearance"
import { CategoryIcon } from "@/components/table/category-icon"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

export function CategoryBudgetTable() {
  const manager = useCategoryManager(true)
  const { setEditing, reset, isLoading, error } = manager
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState<Category | null>(null)
  const categories = manager.categories.filter(category => category.type === "EXPENSE")
  const totals = categories.reduce((total, category) => ({
    expense: total.expense + (category.totalExpense ?? 0),
    budget: total.budget + (category.budget ?? 0),
    remaining: total.remaining + (category.remainingBudget ?? 0),
  }), { expense: 0, budget: 0, remaining: 0 })

  return (
    <div className="overflow-hidden rounded-[14px] border border-border bg-background">
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="category-budget-title" className="text-lg font-semibold">Anggaran Kategori</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Pantau pengeluaran dan sisa anggaran setiap kategori.</p>
        </div>
        <Button size="lg" className="bg-[#14864A] px-4 text-white hover:bg-[#10733e]" onClick={() => { reset(); setOpen(true) }}>
          <Plus aria-hidden="true" /> Add Category
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table aria-labelledby="category-budget-title" className="w-full min-w-[800px] text-sm">
          <thead className="border-y border-border bg-muted/40 text-muted-foreground">
            <tr>
              <th scope="col" className="px-6 py-4 text-left font-medium">Nama Kategori</th>
              <th scope="col" className="px-6 py-4 text-right font-medium">Total Pengeluaran</th>
              <th scope="col" className="px-6 py-4 text-right font-medium">Total Anggaran</th>
              <th scope="col" className="px-6 py-4 text-right font-medium">Sisa Anggaran</th>
              <th scope="col" className="px-6 py-4 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map(category => {
              const remaining = category.remainingBudget
              return (
                <tr key={category.id} className="hover:bg-muted/20">
                  <th scope="row" className="px-6 py-4 text-left font-medium">
                    <span className="flex items-center gap-3">
                      <CategoryIcon category={category} />
                      {category.name}
                    </span>
                  </th>
                  <td className="px-6 py-4 text-right whitespace-nowrap tabular-nums">{category.totalExpense === undefined ? "—" : currency.format(category.totalExpense)}</td>
                  <td className="px-6 py-4 text-right whitespace-nowrap tabular-nums">{category.budget === undefined ? "—" : currency.format(category.budget)}</td>
                  <td className={cn("px-6 py-4 text-right whitespace-nowrap tabular-nums font-medium", remaining !== undefined && remaining < 0 ? "text-red-600" : "text-[#14864A]")}>
                    {remaining === undefined ? "—" : currency.format(remaining)}
                    {remaining !== undefined && remaining < 0 && <span className="mt-0.5 block text-xs font-normal">Melebihi anggaran</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" size="icon" aria-label={`Edit kategori ${category.name}`} title="Edit" onClick={() => { reset(); setEditing(category); setOpen(true) }}>
                        <Pencil aria-hidden="true" />
                      </Button>
                      <Button type="button" variant="destructive" size="icon" aria-label={`Delete kategori ${category.name}`} title="Delete" onClick={() => setDeleting(category)}>
                        <Trash2 aria-hidden="true" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {categories.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">{isLoading ? "Memuat anggaran kategori..." : error ?? "Belum ada kategori pengeluaran."}</td></tr>
            )}
          </tbody>
          <tfoot className="border-t border-border bg-muted/40 font-semibold">
            <tr>
              <th scope="row" className="px-6 py-4 text-left">Total</th>
              <td className="px-6 py-4 text-right whitespace-nowrap tabular-nums">{currency.format(totals.expense)}</td>
              <td className="px-6 py-4 text-right whitespace-nowrap tabular-nums">{currency.format(totals.budget)}</td>
              <td className={cn("px-6 py-4 text-right whitespace-nowrap tabular-nums", totals.remaining < 0 ? "text-red-600" : "text-[#14864A]")}>{currency.format(totals.remaining)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
      {error && !open && categories.length > 0 && <p role="alert" className="p-4 text-sm text-destructive">{error}</p>}
      <Dialog open={open} onOpenChange={nextOpen => { if (!nextOpen) reset(); setOpen(nextOpen) }}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{manager.editing ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
            <DialogDescription>Kelola kategori untuk transaksi kamu.</DialogDescription>
          </DialogHeader>
          <CategoryManagerContent manager={manager} showTable={false} />
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleting !== null} onOpenChange={nextOpen => { if (!nextOpen) setDeleting(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus kategori?</AlertDialogTitle>
            <AlertDialogDescription>Kategori “{deleting?.name}” akan dihapus.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={() => {
              if (!deleting) return
              void manager.handleDelete(deleting)
              setDeleting(null)
            }}>Hapus Kategori</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
