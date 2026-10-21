"use client"

import { AlertCircleIcon, CheckCircle2Icon, CircleAlertIcon, Loader2, SearchIcon } from "lucide-react"
import { cn } from "cn"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { TablePagination } from "@/components/table/TablePagination"
import { ACCENT_ICON_CLASS, ACCENT_OUTLINE_CLASS } from "@/lib/styles"
import { MAX_BULK_SIZE } from "@/lib/api/transaction-import"
import { REVIEW_PAGE_SIZE_OPTIONS, type ImportReviewState } from "./use-import-review"

// Bagian UI halaman review import yang dipakai bersama tampilan desktop & mobile

interface ReviewPartProps {
  review: ImportReviewState
  className?: string
}

export function ImportingOverlay({ count }: { count: number }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 supports-backdrop-filter:backdrop-blur-xs"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3 rounded-[14px] border border-violet-200 bg-background px-8 py-6 shadow-lg">
        <Spinner className="size-8" />
        <span className="text-sm font-medium text-[#6359E9]">Mengimpor {count} transaksi...</span>
      </div>
    </div>
  )
}

export function ImportReviewFilters({ review, className }: ReviewPartProps) {
  const { query, isErrorOnly, invalidCount } = review

  return (
    <div className={cn("flex w-full flex-col gap-3 sm:w-auto sm:flex-row", className)}>
      <div className="group/accent relative w-full sm:w-64">
        <SearchIcon
          className={cn("pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2", ACCENT_ICON_CLASS)}
        />
        <Input
          type="search"
          placeholder="Cari nama atau kategori..."
          value={query}
          onChange={(e) => review.changeQuery(e.target.value)}
          className={cn("h-[34px] pl-8 placeholder:text-[#716EC9]/70", ACCENT_OUTLINE_CLASS)}
          aria-label="Cari baris import"
        />
      </div>
      <Button
        type="button"
        variant="outline"
        aria-pressed={isErrorOnly}
        onClick={review.toggleErrorOnly}
        disabled={invalidCount === 0 && !isErrorOnly}
        className={cn(
          "h-[34px]",
          isErrorOnly ? "border-destructive bg-destructive/10 text-destructive hover:bg-destructive/15" : ACCENT_OUTLINE_CLASS
        )}
      >
        <CircleAlertIcon data-icon="inline-start" />
        Hanya Error ({invalidCount})
      </Button>
    </div>
  )
}

export function ImportReviewActions({ review, className }: ReviewPartProps) {
  const { isSubmitting, validCount, isOverBulkLimit } = review

  return (
    <div className={cn("flex gap-3", className)}>
      <Button variant="outline" className="h-[34px] border-[#8C89B4]" onClick={review.cancel} disabled={isSubmitting}>
        Batal
      </Button>
      <Button
        onClick={review.submit}
        disabled={isSubmitting || validCount === 0 || isOverBulkLimit}
        title={isOverBulkLimit ? `Maksimal ${MAX_BULK_SIZE} transaksi per import` : undefined}
        className="h-[34px] bg-[#6359E9] text-white hover:bg-[#6359E9]/90"
      >
        {isSubmitting && <Loader2 data-icon="inline-start" className="animate-spin" />}
        Import {validCount} transaksi
      </Button>
    </div>
  )
}

export function ImportReviewAlerts({ review }: ReviewPartProps) {
  const { categoryError, submitError, invalidCount } = review

  return (
    <>
      {categoryError && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Gagal memuat kategori</AlertTitle>
          <AlertDescription>{categoryError}</AlertDescription>
          <AlertAction>
            <Button type="button" size="sm" variant="outline" onClick={review.reloadCategories}>
              Coba Lagi
            </Button>
          </AlertAction>
        </Alert>
      )}

      {submitError ? (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Import belum selesai</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      ) : invalidCount > 0 ? (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>{invalidCount} baris perlu diperbaiki</AlertTitle>
          <AlertDescription>
            Perbaiki field yang ditandai atau hapus barisnya. Hanya baris valid yang akan diimpor.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <CheckCircle2Icon />
          <AlertTitle>Semua baris valid</AlertTitle>
          <AlertDescription>Data siap diimpor.</AlertDescription>
        </Alert>
      )}
    </>
  )
}

export function ImportReviewPagination({ review }: ReviewPartProps) {
  return (
    <TablePagination
      currentPage={review.currentPage}
      totalPage={review.totalPage}
      pageSize={review.pageSize}
      itemCount={review.pagedRows.length}
      totalItem={review.visibleCount}
      onPageChange={review.setPage}
      onPageSizeChange={review.changePageSize}
      pageSizeOptions={REVIEW_PAGE_SIZE_OPTIONS}
      disabled={review.isSubmitting}
      className="mt-0"
    />
  )
}
