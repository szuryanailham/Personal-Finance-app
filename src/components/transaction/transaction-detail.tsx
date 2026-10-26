"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { CATEGORY_OPTIONS } from "@/components/header/category-type-field"
import { formatAmount, type Transaction, type TransactionType } from "@/components/table/TableComponent"
import { LoadingState } from "@/components/ui/spinner"
import { useTransaction } from "@/hooks/use-transaction"
import { cn } from "@/lib/utils"

// Tipe transaksi (lowercase) -> icon & label tipe kategori (uppercase di backend)
const TYPE_OPTION = Object.fromEntries(
  CATEGORY_OPTIONS.map((o) => [o.value.toLowerCase(), o])
) as Record<TransactionType, (typeof CATEGORY_OPTIONS)[number]>

const AMOUNT_CLASS: Record<TransactionType, string> = {
  income: "text-emerald-600",
  expense: "text-[#282458]",
  saving: "text-[#6359E9]",
}

const longDateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
})

interface DetailRowProps {
  label: string
  value: string
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <dt className="shrink-0 text-sm text-slate-500">{label}</dt>
      <dd className="min-w-0 text-right text-sm font-medium break-words text-[#282458]">{value}</dd>
    </div>
  )
}

function TransactionDetailCard({ transaction: trx }: { transaction: Transaction }) {
  const typeOption = TYPE_OPTION[trx.type]

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-5">
      <div className="flex flex-col items-center gap-2 text-center">
        <Image src={typeOption.icon} alt={typeOption.label} width={48} height={48} className="size-12" />
        <h2 className="text-base font-semibold break-words text-[#282458]">{trx.description}</h2>
        <p className={cn("text-2xl font-bold", AMOUNT_CLASS[trx.type])}>{formatAmount(trx.type, trx.amount)}</p>
      </div>
      <dl className="divide-y divide-[#ECEAF8] border-t border-[#ECEAF8]">
        <DetailRow label="Kode Transaksi" value={trx.transactionCode} />
        <DetailRow label="Tipe" value={typeOption.label} />
        <DetailRow label="Kategori" value={trx.category} />
        <DetailRow label="Tanggal" value={longDateFormatter.format(trx.date)} />
        <DetailRow label="Catatan" value={trx.note || "-"} />
      </dl>
    </div>
  )
}

interface TransactionDetailProps {
  transactionCode: string
  /** Aksi tambahan di bawah kartu (mis. tombol edit/hapus di mobile) */
  renderActions?: (transaction: Transaction) => ReactNode
}

// Detail satu transaksi dari GET /api/transaction/{transactionCode}
export function TransactionDetail({ transactionCode, renderActions }: TransactionDetailProps) {
  const { transaction, isLoading, error } = useTransaction(transactionCode)

  if (isLoading) return <LoadingState label="Memuat detail transaksi..." />
  if (error || !transaction) {
    return <p className="rounded-2xl bg-white p-5 text-sm text-destructive">{error ?? "Transaksi tidak ditemukan"}</p>
  }
  return (
    <>
      <TransactionDetailCard transaction={transaction} />
      {renderActions?.(transaction)}
    </>
  )
}
