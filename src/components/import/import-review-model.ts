import type { BulkTransactionItem, ImportedTransaction } from "@/lib/api/transaction-import"

export type ReviewField = "name" | "category" | "date" | "amount"

export type FieldErrors = Partial<Record<ReviewField, string>>

// Baris yang bisa diedit di tabel review
export interface ReviewRow {
  row: number
  name: string
  /** Nama kategori dari file, ditampilkan bila belum cocok dengan kategori mana pun */
  categoryLabel: string
  categoryId: string | null
  date: string // format "YYYY-MM-DD"
  amount: number | null
  /** Error dari backend; hilang per field begitu field itu diedit user */
  serverErrors: FieldErrors
  /** Error saat menyimpan ke backend; hilang begitu baris diedit */
  submitError: string | null
}

export type ReviewPatch = Partial<Pick<ReviewRow, "name" | "categoryId" | "date" | "amount">>

const REVIEW_FIELDS: readonly ReviewField[] = ["name", "category", "date", "amount"]
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const PATCH_FIELD: Record<keyof ReviewPatch, ReviewField> = {
  name: "name",
  categoryId: "category",
  date: "date",
  amount: "amount",
}

function isReviewField(value: string): value is ReviewField {
  return (REVIEW_FIELDS as readonly string[]).includes(value)
}

export function toReviewRow(item: ImportedTransaction): ReviewRow {
  const serverErrors: FieldErrors = {}
  for (const { fieldName, error } of item.errors ?? []) {
    if (isReviewField(fieldName) && !serverErrors[fieldName]) serverErrors[fieldName] = error
  }
  return {
    row: item.row,
    name: item.name ?? "",
    categoryLabel: item.category ?? "",
    categoryId: item.categoryId,
    date: item.date ?? "",
    amount: Number.isFinite(item.amount) ? item.amount : null,
    serverErrors,
    submitError: null,
  }
}

// Return baris baru; error backend untuk field yang diedit dibuang karena sudah tidak relevan
export function applyPatch(row: ReviewRow, patch: ReviewPatch): ReviewRow {
  const editedFields = new Set(
    (Object.keys(patch) as (keyof ReviewPatch)[]).map((key) => PATCH_FIELD[key])
  )
  const serverErrors = Object.fromEntries(
    Object.entries(row.serverErrors).filter(([field]) => !editedFields.has(field as ReviewField))
  ) as FieldErrors
  return { ...row, ...patch, serverErrors, submitError: null }
}

function validateClient(row: ReviewRow, categoryIds: ReadonlySet<string>): FieldErrors {
  const errors: FieldErrors = {}
  if (!row.name.trim()) errors.name = "Nama wajib diisi"
  if (!row.categoryId) errors.category = "Pilih kategori"
  else if (categoryIds.size > 0 && !categoryIds.has(row.categoryId)) errors.category = "Kategori tidak ditemukan"
  if (!DATE_PATTERN.test(row.date) || Number.isNaN(Date.parse(row.date))) errors.date = "Tanggal tidak valid"
  if (row.amount === null || !(row.amount > 0)) errors.amount = "Jumlah harus lebih dari 0"
  return errors
}

// Error backend diprioritaskan karena pesannya lebih spesifik
export function getRowErrors(row: ReviewRow, categoryIds: ReadonlySet<string>): FieldErrors {
  return { ...validateClient(row, categoryIds), ...row.serverErrors }
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0
}

// Hanya dipanggil untuk baris tanpa error, jadi categoryId & amount sudah pasti terisi
export function toBulkTransactionItem(row: ReviewRow): BulkTransactionItem {
  return {
    name: row.name.trim(),
    categoryId: row.categoryId ?? "",
    date: row.date,
    amount: row.amount ?? 0,
  }
}
