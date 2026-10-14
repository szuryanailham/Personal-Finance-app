"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AlertCircleIcon, CheckCircle2Icon, CircleAlertIcon, Loader2, SearchIcon } from "lucide-react"
import { cn } from "cn"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingState, Spinner } from "@/components/ui/spinner"
import { TablePagination } from "@/components/table/TablePagination"
import { useTransactionRevision } from "@/components/header/transaction-revision-context"
import { useCategories } from "@/hooks/use-categories"
import { ACCENT_ICON_CLASS, ACCENT_OUTLINE_CLASS } from "@/lib/styles"
import { bulkCreateTransactions, MAX_BULK_SIZE, type ImportedTransaction } from "@/lib/api/transaction-import"
import { clearImportedTransactions, saveImportedTransactions } from "@/lib/import-store"
import {
  applyPatch,
  getRowErrors,
  hasErrors,
  toBulkTransactionItem,
  toReviewRow,
  type FieldErrors,
  type ReviewPatch,
  type ReviewRow,
} from "./import-review-model"
import { withMinLoading } from "@/lib/async"
import { ImportReviewTable } from "./import-review-table"

const TRANSACTION_PATH = "/transaction"
// Jeda minimum agar loading import terlihat jelas walau request selesai cepat
const MIN_IMPORT_DELAY_MS = 1200
const REVIEW_PAGE_SIZE_OPTIONS = [5, 10, 15, 100] as const
const DEFAULT_REVIEW_PAGE_SIZE = REVIEW_PAGE_SIZE_OPTIONS[1]

const MISSING_CATEGORY_PREFIX = "Category not found:"
const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi

// Backend all-or-nothing menolak seluruh batch dengan "Category not found: <id>, <id>".
// Tandai baris dengan kategori tersebut agar terlihat di filter "Error only"
function markMissingCategories(rows: readonly ReviewRow[], message: string): ReviewRow[] {
  if (!message.startsWith(MISSING_CATEGORY_PREFIX)) return [...rows]
  const missingIds = new Set((message.match(UUID_PATTERN) ?? []).map((id) => id.toLowerCase()))
  return rows.map((row) =>
    row.categoryId && missingIds.has(row.categoryId.toLowerCase())
      ? { ...row, submitError: "Kategori tidak ditemukan" }
      : row
  )
}

// Simpan kembali hasil edit agar tidak hilang saat halaman di-refresh
function toImportedTransaction(row: ReviewRow): ImportedTransaction {
  return {
    row: row.row,
    name: row.name,
    category: row.categoryLabel,
    categoryId: row.categoryId,
    categoryType: null,
    date: row.date,
    amount: row.amount ?? Number.NaN,
    valid: !hasErrors(row.serverErrors),
    errors: Object.entries(row.serverErrors).map(([fieldName, error]) => ({ fieldName, error: error ?? "" })),
  }
}

// Cocokkan kata kunci dengan nama transaksi atau kategori (nama terpilih / label dari file)
function matchesQuery(row: ReviewRow, query: string, categoryNames: ReadonlyMap<string, string>): boolean {
  if (!query) return true
  const categoryName = (row.categoryId && categoryNames.get(row.categoryId)) || row.categoryLabel
  return [row.name, categoryName].some((value) => value.toLowerCase().includes(query))
}

function ImportingOverlay({ count }: { count: number }) {
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

interface ImportReviewProps {
  importId: string
  initialRows: readonly ImportedTransaction[]
}

export function ImportReview({ importId, initialRows }: ImportReviewProps) {
  const router = useRouter()
  const { notifyTransactionsChanged } = useTransactionRevision()
  const { categories, isLoading, error: categoryError, reload } = useCategories(true)
  const [rows, setRows] = React.useState<ReviewRow[]>(() => initialRows.map(toReviewRow))
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [query, setQuery] = React.useState("")
  const [isErrorOnly, setIsErrorOnly] = React.useState(false)
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_REVIEW_PAGE_SIZE)

  const categoryIds = React.useMemo(() => new Set(categories.map((c) => c.id)), [categories])
  const errorsByRow = React.useMemo(
    () => new Map<number, FieldErrors>(rows.map((row) => [row.row, getRowErrors(row, categoryIds)])),
    [rows, categoryIds]
  )
  const categoryNames = React.useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories])
  const isRowValid = (row: ReviewRow) => !row.submitError && !hasErrors(errorsByRow.get(row.row) ?? {})
  const validRows = rows.filter(isRowValid)
  const invalidCount = rows.length - validRows.length
  const isOverBulkLimit = validRows.length > MAX_BULK_SIZE
  const normalizedQuery = query.trim().toLowerCase()
  const visibleRows = rows.filter(
    (row) => (!isErrorOnly || !isRowValid(row)) && matchesQuery(row, normalizedQuery, categoryNames)
  )
  const totalPage = Math.max(1, Math.ceil(visibleRows.length / pageSize))
  // Jaga halaman tetap valid saat baris dihapus/difilter
  const currentPage = Math.min(page, totalPage)
  const pagedRows = visibleRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function handlePageSizeChange(size: number) {
    setPageSize(size)
    setPage(1)
  }

  function updateRows(next: ReviewRow[]) {
    setRows(next)
    saveImportedTransactions(next.map(toImportedTransaction), importId)
  }

  function handleChange(rowNumber: number, patch: ReviewPatch) {
    updateRows(rows.map((row) => (row.row === rowNumber ? applyPatch(row, patch) : row)))
  }

  function handleRemove(rowNumber: number) {
    updateRows(rows.filter((row) => row.row !== rowNumber))
  }

  function handleCancel() {
    clearImportedTransactions()
    router.push(TRANSACTION_PATH)
  }

  async function handleSubmit() {
    if (validRows.length === 0) return
    if (isOverBulkLimit) {
      setSubmitError(`Maksimal ${MAX_BULK_SIZE} transaksi per import. Hapus sebagian baris lalu coba lagi.`)
      return
    }
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await withMinLoading(bulkCreateTransactions(validRows.map(toBulkTransactionItem)), MIN_IMPORT_DELAY_MS)
      notifyTransactionsChanged()

      const submitted = new Set(validRows.map((row) => row.row))
      const remaining = rows.filter((row) => !submitted.has(row.row))

      if (remaining.length === 0) {
        // Overlay tetap tampil sampai pindah halaman
        clearImportedTransactions()
        router.push(TRANSACTION_PATH)
        return
      }
      updateRows(remaining)
      setIsSubmitting(false)
    } catch (error) {
      // All-or-nothing: tidak ada transaksi yang tersimpan, semua baris tetap di tabel
      const message = error instanceof Error ? error.message : "Gagal mengimpor transaksi"
      updateRows(markMissingCategories(rows, message))
      setSubmitError(`Tidak ada transaksi yang tersimpan. ${message}`)
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <LoadingState label="Memuat kategori..." className="mt-4" />

  return (
    <div className="flex flex-col gap-4 pb-8">
      {isSubmitting && <ImportingOverlay count={validRows.length} />}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <div className="group/accent relative w-full sm:w-64">
            <SearchIcon
              className={cn("pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2", ACCENT_ICON_CLASS)}
            />
            <Input
              type="search"
              placeholder="Search name or category..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              className={cn("h-[34px] pl-8 placeholder:text-[#716EC9]/70", ACCENT_OUTLINE_CLASS)}
              aria-label="Search imported rows"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            aria-pressed={isErrorOnly}
            onClick={() => {
              setIsErrorOnly((prev) => !prev)
              setPage(1)
            }}
            disabled={invalidCount === 0 && !isErrorOnly}
            className={cn(
              "h-[34px]",
              isErrorOnly ? "border-destructive bg-destructive/10 text-destructive hover:bg-destructive/15" : ACCENT_OUTLINE_CLASS
            )}
          >
            <CircleAlertIcon data-icon="inline-start" />
            Error only ({invalidCount})
          </Button>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-[34px] border-[#8C89B4]" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || validRows.length === 0 || isOverBulkLimit}
            title={isOverBulkLimit ? `Maksimal ${MAX_BULK_SIZE} transaksi per import` : undefined}
            className="h-[34px] bg-[#6359E9] text-white hover:bg-[#6359E9]/90"
          >
            {isSubmitting && <Loader2 data-icon="inline-start" className="animate-spin" />}
            Import {validRows.length} transaksi
          </Button>
        </div>
      </div>

      {categoryError && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Gagal memuat kategori</AlertTitle>
          <AlertDescription>{categoryError}</AlertDescription>
          <AlertAction>
            <Button type="button" size="sm" variant="outline" onClick={reload}>
              Retry
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

      <ImportReviewTable
        rows={pagedRows}
        errorsByRow={errorsByRow}
        categories={categories}
        disabled={isSubmitting}
        onChange={handleChange}
        onRemove={handleRemove}
      />

      <TablePagination
        currentPage={currentPage}
        totalPage={totalPage}
        pageSize={pageSize}
        itemCount={pagedRows.length}
        totalItem={visibleRows.length}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={REVIEW_PAGE_SIZE_OPTIONS}
        disabled={isSubmitting}
        className="mt-0"
      />
    </div>
  )
}
