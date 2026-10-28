"use client"

import { useMemo, useState } from "react"
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md"
import { TableHead } from "@/components/ui/table"
import type { Transaction } from "@/components/table/TableComponent"
import type { TransactionSortValue } from "@/lib/api/transaction"
import { cn } from "@/lib/utils"

export type SortKey = "transactionCode" | "description" | "category" | "date" | "amount"
type SortDirection = "asc" | "desc"

export interface SortState {
  key: SortKey
  direction: SortDirection
}

interface SortableHeadProps {
  label: string
  sortKey: SortKey
  sort: SortState | null
  onSort: (key: SortKey) => void
  className?: string
  align?: "left" | "center" | "right"
}

export const HEAD_CLASS = "bg-[#DCF8E6] px-4 text-slate-700 text-center"

const JUSTIFY_CLASS: Record<NonNullable<SortableHeadProps["align"]>, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
}

function compareTransactions(a: Transaction, b: Transaction, key: SortKey): number {
  if (key === "date") return a.date.getTime() - b.date.getTime()
  if (key === "amount") return a.amount - b.amount
  return a[key].localeCompare(b[key], "id-ID", { sensitivity: "base", numeric: true })
}

// Urutan default: tanggal terbaru dulu; di tanggal yang sama, kode transaksi
// (TRX-yyyyMMdd-NNN, berurutan saat dibuat) terbesar = yang paling baru dibuat
function compareNewestFirst(a: Transaction, b: Transaction): number {
  return (
    compareTransactions(b, a, "date") || compareTransactions(b, a, "transactionCode")
  )
}

function sortTransactions(
  transactions: readonly Transaction[],
  sort: SortState | null
): readonly Transaction[] {
  if (!sort) return [...transactions].sort(compareNewestFirst)
  const factor = sort.direction === "asc" ? 1 : -1
  return [...transactions].sort((a, b) => compareTransactions(a, b, sort.key) * factor)
}

// Klik pertama: asc, klik kedua: desc, klik ketiga: kembali ke urutan default (terbaru dulu)
export function useTransactionSort(transactions: readonly Transaction[]) {
  const [sort, setSort] = useState<SortState | null>(null)
  const sorted = useMemo(() => sortTransactions(transactions, sort), [transactions, sort])

  const handleSort = (key: SortKey) => {
    setSort((prev) => {
      if (prev?.key !== key) return { key, direction: "asc" }
      if (prev.direction === "asc") return { key, direction: "desc" }
      return null
    })
  }

  return { sort, sorted, handleSort }
}

// Pasangan nilai `sort` backend per kolom. Catatan: di backend "date" = terbaru dulu (desc)
// dan "amount" = terbesar dulu (desc), sedangkan kolom teks "name" = A–Z (asc)
const SERVER_SORT: Record<SortKey, Record<SortDirection, TransactionSortValue>> = {
  transactionCode: { asc: "transactionCode", desc: "-transactionCode" },
  description: { asc: "name", desc: "-name" },
  category: { asc: "category", desc: "-category" },
  date: { asc: "-date", desc: "date" },
  amount: { asc: "-amount", desc: "amount" },
}

// Klik pertama pada Tanggal/Jumlah langsung ke terbaru/terbesar; kolom teks mulai dari A–Z
const FIRST_DIRECTION: Record<SortKey, SortDirection> = {
  transactionCode: "asc",
  description: "asc",
  category: "asc",
  date: "desc",
  amount: "desc",
}

export function fromServerSort(value: TransactionSortValue): SortState {
  for (const key of Object.keys(SERVER_SORT) as SortKey[]) {
    const { asc, desc } = SERVER_SORT[key]
    if (value === asc) return { key, direction: "asc" }
    if (value === desc) return { key, direction: "desc" }
  }
  return { key: "date", direction: "desc" }
}

// Klik kolom yang sama membalik arah; klik kolom lain mulai dari arah default kolom itu
export function nextServerSort(current: TransactionSortValue, key: SortKey): TransactionSortValue {
  const state = fromServerSort(current)
  const direction =
    state.key === key ? (state.direction === "asc" ? "desc" : "asc") : FIRST_DIRECTION[key]
  return SERVER_SORT[key][direction]
}

export function SortableHead({ label, sortKey, sort, onSort, className, align = "center" }: SortableHeadProps) {
  const isActive = sort?.key === sortKey
  const direction = isActive ? sort.direction : null
  const ariaSort = direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none"

  return (
    <TableHead className={cn(HEAD_CLASS, className)} aria-sort={ariaSort}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "inline-flex w-full items-center gap-1.5 hover:text-[#14864A]",
          JUSTIFY_CLASS[align],
          isActive && "text-[#14864A]"
        )}
      >
        <span>{label}</span>
        <span className="flex flex-col leading-none" aria-hidden="true">
          <MdArrowDropUp
            className={cn("-mb-2 size-4", direction === "asc" ? "text-[#14864A]" : "text-slate-400")}
          />
          <MdArrowDropDown
            className={cn("size-4", direction === "desc" ? "text-[#14864A]" : "text-slate-400")}
          />
        </span>
        <span className="sr-only">Urutkan berdasarkan {label}</span>
      </button>
    </TableHead>
  )
}
