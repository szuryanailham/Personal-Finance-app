"use client"

import { useId, useState } from "react"
import { Pencil, Plus, SearchIcon, Trash2 } from "lucide-react"
import { CategoryManagerContent } from "@/components/header/category-manager-content"
import { useCategoryManager } from "@/components/header/use-category-manager"
import type { Category } from "@/lib/api/category"
import { categoryCurrency as currency } from "@/lib/category-appearance"
import { TablePagination } from "@/components/table/TablePagination"
import { CategoryIcon } from "@/components/table/category-icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

const PAGE_SIZE_OPTIONS = [5, 10, 20] as const

const mobileRowClass = "max-md:grid max-md:grid-cols-[minmax(0,1fr)_auto] max-md:gap-y-2 max-md:p-3"

function BudgetAmount({ label, amount, className, overBudget, desktopOnly }: { label: string; amount?: number; className?: string; overBudget?: boolean; desktopOnly?: boolean }) {
  return (
    <td role="cell" className={cn("text-right tabular-nums md:px-6 md:py-4 md:whitespace-nowrap", desktopOnly ? "max-md:hidden" : "max-md:col-span-2 max-md:flex max-md:justify-between max-md:gap-2", className)}>
      <span className="text-left text-xs font-normal text-muted-foreground md:hidden">{label}</span>
      <span className="min-w-0 [overflow-wrap:anywhere]">
        {amount === undefined ? "—" : currency.format(amount)}
        {overBudget && (
          <span className="mt-0.5 block text-xs font-normal">Melebihi anggaran</span>
        )}
      </span>
    </td>
  )
}

function BudgetUsage({ expense, budget }: { expense?: number; budget?: number }) {
  const canCalculateUsage = expense !== undefined && budget !== undefined && budget > 0
  const overBudget = canCalculateUsage && expense > budget
  const usage = canCalculateUsage ? Math.max(0, Math.min(100, (expense / budget) * 100)) : 0

  return (
    <td role="cell" className="col-span-2 min-w-0 md:hidden">
      <p className="text-sm font-medium tabular-nums [overflow-wrap:anywhere]">
        <span className="sr-only">Pengeluaran / Total Anggaran: </span>
        {expense === undefined ? "—" : currency.format(expense)}
        {" / "}
        {budget === undefined ? "—" : currency.format(budget)}
      </p>
      <div aria-hidden="true" className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", overBudget ? "bg-red-600" : "bg-[#14864A]")}
          style={{ width: `${usage}%` }}
        />
      </div>
    </td>
  )
}

export function CategoryBudgetTable({ compact = false }: { compact?: boolean }) {
  const titleId = useId()
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0])
  const manager = useCategoryManager(true)
  const { setEditing, reset, isLoading, error } = manager
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState<Category | null>(null)
  const categories = manager.categories.filter(category => category.type === "EXPENSE")
  const searchTerm = query.trim().toLocaleLowerCase()
  const filteredCategories = categories
    .filter(category => category.name.toLocaleLowerCase().includes(searchTerm))
    .sort((a, b) => (b.totalExpense ?? 0) - (a.totalExpense ?? 0))
  const totalPage = Math.max(1, Math.ceil(filteredCategories.length / pageSize))
  const currentPage = Math.min(page, totalPage)
  if (page !== currentPage) setPage(currentPage)
  const start = (currentPage - 1) * pageSize
  const visibleCategories = filteredCategories.slice(start, start + pageSize)
  const totals = categories.reduce((total, category) => ({
    expense: total.expense + (category.totalExpense ?? 0),
    budget: total.budget + (category.budget ?? 0),
    remaining: total.remaining + (category.remainingBudget ?? 0),
  }), { expense: 0, budget: 0, remaining: 0 })

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) reset()
    setOpen(nextOpen)
  }

  const handleSubmit: typeof manager.handleSubmit = async (input) => {
    const closeAfterSave = compact && manager.editing !== null
    const saved = await manager.handleSubmit(input)
    if (saved && closeAfterSave) handleOpenChange(false)
    return saved
  }

  return (
    <div className="overflow-hidden rounded-[14px] border border-border bg-background">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 p-3 sm:p-6">
        <h2 id={titleId} className="text-base font-semibold sm:text-lg">Anggaran Kategori</h2>
        <Button
          size="lg"
          aria-label="Tambah kategori"
          className="bg-[#14864A] px-2.5 text-white hover:bg-[#10733e] md:row-span-2 md:px-4"
          onClick={() => { reset(); setOpen(true) }}
        >
          <Plus aria-hidden="true" />
          <span className="md:hidden">Tambah</span>
          <span className="hidden md:inline">Add Category</span>
        </Button>
        <p className="hidden text-sm text-muted-foreground md:block">
          Pantau pengeluaran dan sisa anggaran setiap kategori.
        </p>
      </div>
      <div className="px-3 pb-3 sm:px-6 sm:pb-4">
        <div className="relative sm:max-w-xs">
          <SearchIcon aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            aria-label="Cari kategori anggaran berdasarkan nama"
            placeholder="Cari kategori..."
            value={query}
            onChange={(event) => { setQuery(event.target.value); setPage(1) }}
            className="h-10 pl-9"
          />
        </div>
      </div>
      <div className="md:overflow-x-auto">
        <table role="table" aria-labelledby={titleId} className="w-full text-sm max-md:block md:min-w-[800px]">
          <thead className="border-y border-border bg-muted/40 text-muted-foreground max-md:hidden">
            <tr>
              <th scope="col" className="px-3 py-3 md:px-6 md:py-4 text-left font-medium">Nama Kategori</th>
              <th scope="col" aria-sort="descending" className="px-3 py-3 md:px-6 md:py-4 text-right font-medium">Total Pengeluaran</th>
              <th scope="col" className="px-3 py-3 md:px-6 md:py-4 text-right font-medium">Total Anggaran</th>
              <th scope="col" className="px-3 py-3 md:px-6 md:py-4 text-right font-medium">Sisa Anggaran</th>
              <th scope="col" className="px-3 py-3 md:px-6 md:py-4 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody role="rowgroup" className="divide-y divide-border max-md:block">
            {visibleCategories.map(category => {
              const remaining = category.remainingBudget
              return (
                <tr role="row" key={category.id} className={cn(mobileRowClass, "hover:bg-muted/20")}>
                  <th role="rowheader" scope="row" className="min-w-0 text-left font-medium md:px-6 md:py-4">
                    <span className="flex items-center gap-3">
                      <CategoryIcon category={category} />
                      <span className="min-w-0 [overflow-wrap:anywhere]">{category.name}</span>
                    </span>
                  </th>
                  <BudgetUsage expense={category.totalExpense} budget={category.budget} />
                  <BudgetAmount label="Total Pengeluaran" amount={category.totalExpense} desktopOnly />
                  <BudgetAmount label="Total Anggaran" amount={category.budget} desktopOnly />
                  <BudgetAmount
                    label="Sisa Anggaran"
                    amount={remaining}
                    overBudget={remaining !== undefined && remaining < 0}
                    className={cn("font-medium", remaining !== undefined && remaining < 0 ? "text-red-600" : "text-[#14864A]")}
                  />
                  <td role="cell" className="max-md:col-start-2 max-md:row-start-1 md:px-6 md:py-4">
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
            {filteredCategories.length === 0 && (
              <tr role="row" className="max-md:block">
                <td role="cell" colSpan={5} className="px-6 py-10 text-center text-muted-foreground max-md:block">
                  {categories.length > 0
                    ? "Kategori tidak ditemukan. Coba kata kunci lain."
                    : isLoading ? "Memuat anggaran kategori..." : error ?? "Belum ada kategori pengeluaran."}
                </td>
              </tr>
            )}
          </tbody>
          <tfoot role="rowgroup" className="border-t border-border bg-muted/40 font-semibold max-md:hidden">
            <tr role="row" className={mobileRowClass}>
              <th role="rowheader" scope="row" className="text-left max-md:col-span-2 md:px-6 md:py-4">{searchTerm ? "Total semua kategori" : "Total"}</th>
              <BudgetAmount label="Total Pengeluaran" amount={totals.expense} />
              <BudgetAmount label="Total Anggaran" amount={totals.budget} />
              <BudgetAmount label="Sisa Anggaran" amount={totals.remaining} className={totals.remaining < 0 ? "text-red-600" : "text-[#14864A]"} />
              <td className="max-md:hidden" />
            </tr>
          </tfoot>
        </table>
      </div>
      {filteredCategories.length > PAGE_SIZE_OPTIONS[0] && (
        <TablePagination
          currentPage={currentPage}
          totalPage={totalPage}
          pageSize={pageSize}
          itemCount={visibleCategories.length}
          totalItem={filteredCategories.length}
          onPageChange={setPage}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1) }}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          disabled={isLoading}
          className="mt-0 flex-wrap border-t border-border p-3 sm:px-6"
        />
      )}
      {error && !open && categories.length > 0 && <p role="alert" className="p-4 text-sm text-destructive">{error}</p>}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{manager.editing ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
            <DialogDescription>Kelola kategori untuk transaksi kamu.</DialogDescription>
          </DialogHeader>
          <CategoryManagerContent manager={{ ...manager, handleSubmit }} showTable={false} />
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
