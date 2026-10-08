import type { CategoryType } from "./category"
import { apiRequest, apiUpload } from "./client"

// Endpoint upload file import (multipart, field "file")
const IMPORT_PATH = "/api/transaction/import"

export interface ImportFieldError {
  fieldName: string
  error: string
}

// Satu baris hasil parsing file import dari backend
export interface ImportedTransaction {
  row: number
  name: string
  category: string
  categoryId: string | null
  categoryType: CategoryType | null
  date: string // format "YYYY-MM-DD"
  amount: number
  valid: boolean
  errors: ImportFieldError[]
}

export interface ImportSummaryCount {
  totalRows: number
  valid: number
  invalid: number
}

export interface ImportResult {
  code: number
  message: string
  summary: ImportSummaryCount & { transactions: ImportSummaryCount }
  data: { transactions: ImportedTransaction[] }
}

export function uploadImportFile(file: File): Promise<ImportResult> {
  const formData = new FormData()
  formData.append("file", file)
  return apiUpload<ImportResult>(IMPORT_PATH, formData, "mengimpor file")
}

// Endpoint simpan hasil review import. All-or-nothing: bila satu item gagal, tidak ada yang tersimpan
const BULK_PATH = "/api/transaction/bulk"
// Sama dengan batas BulkCreateTransactionRequest.MAX_BULK_SIZE di backend
export const MAX_BULK_SIZE = 500

export interface BulkTransactionItem {
  name: string
  categoryId: string
  date: string // format "YYYY-MM-DD"
  amount: number
  description?: string
}

// Return jumlah transaksi yang tersimpan
export async function bulkCreateTransactions(items: readonly BulkTransactionItem[]): Promise<number> {
  const body = await apiRequest<unknown[]>(BULK_PATH, "mengimpor transaksi", {
    method: "POST",
    body: { transactions: items },
  })
  return body.data?.length ?? items.length
}
