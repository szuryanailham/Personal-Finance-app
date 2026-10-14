import type { TransactionInput } from "@/lib/api/transaction"

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

// Dipakai dialog tambah & edit transaksi; null = form belum valid
export function toTransactionInput(form: HTMLFormElement): TransactionInput | null {
  const data = new FormData(form)
  const transactionName = String(data.get("transactionName") ?? "").trim()
  const categoryId = String(data.get("categoryId") ?? "")
  const date = String(data.get("date") ?? "")
  const amount = Number(data.get("amount"))
  const description = String(data.get("description") ?? "").trim()

  if (!transactionName || !categoryId || !DATE_PATTERN.test(date)) return null
  if (!Number.isFinite(amount) || amount <= 0) return null
  return { transactionName, amount, description, categoryId, date }
}
