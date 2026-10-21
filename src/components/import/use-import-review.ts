"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTransactionRevision } from "@/components/header/transaction-revision-context"
import { useCategories } from "@/hooks/use-categories"
import { bulkCreateTransactions, MAX_BULK_SIZE, type ImportedTransaction } from "@/lib/api/transaction-import"
import { clearImportedTransactions, saveImportedTransactions } from "@/lib/import-store"
import { withMinLoading } from "@/lib/async"
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

const TRANSACTION_PATH = "/transaction"
// Jeda minimum agar loading import terlihat jelas walau request selesai cepat
const MIN_IMPORT_DELAY_MS = 1200
export const REVIEW_PAGE_SIZE_OPTIONS = [5, 10, 15, 100] as const
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

interface UseImportReviewOptions {
  importId: string
  initialRows: readonly ImportedTransaction[]
  /** Tujuan setelah batal / semua baris berhasil diimpor */
  exitPath?: string
}

// State & aksi halaman review import (edit, filter, paginasi, submit) yang dipakai
// bersama oleh tampilan tabel (desktop) dan kartu (mobile).
export function useImportReview({ importId, initialRows, exitPath = TRANSACTION_PATH }: UseImportReviewOptions) {
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

  function changeQuery(value: string) {
    setQuery(value)
    setPage(1)
  }

  function toggleErrorOnly() {
    setIsErrorOnly((prev) => !prev)
    setPage(1)
  }

  function changePageSize(size: number) {
    setPageSize(size)
    setPage(1)
  }

  function updateRows(next: ReviewRow[]) {
    setRows(next)
    saveImportedTransactions(next.map(toImportedTransaction), importId)
  }

  function changeRow(rowNumber: number, patch: ReviewPatch) {
    updateRows(rows.map((row) => (row.row === rowNumber ? applyPatch(row, patch) : row)))
  }

  function removeRow(rowNumber: number) {
    updateRows(rows.filter((row) => row.row !== rowNumber))
  }

  function cancel() {
    clearImportedTransactions()
    router.push(exitPath)
  }

  async function submit() {
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
        router.push(exitPath)
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

  return {
    categories,
    isLoadingCategories: isLoading,
    categoryError,
    reloadCategories: reload,
    errorsByRow,
    validCount: validRows.length,
    invalidCount,
    isOverBulkLimit,
    isSubmitting,
    submitError,
    query,
    isErrorOnly,
    currentPage,
    totalPage,
    pageSize,
    pagedRows,
    visibleCount: visibleRows.length,
    setPage,
    changeQuery,
    toggleErrorOnly,
    changePageSize,
    changeRow,
    removeRow,
    cancel,
    submit,
  }
}

export type ImportReviewState = ReturnType<typeof useImportReview>
