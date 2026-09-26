"use client"

import { useMemo, useState } from "react"
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md"
import { TableHead } from "@/components/ui/table"
import type { Transaction } from "@/components/table/TableComponent"
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
  align?: "center" | "right"
}

export const HEAD_CLASS = "px-4 text-slate-400 text-center"

function compareTransactions(a: Transaction, b: Transaction, key: SortKey): number {
  if (key === "date") return a.date.getTime() - b.date.getTime()
  if (key === "amount") return a.amount - b.amount
  return a[key].localeCompare(b[key], "id-ID", { sensitivity: "base", numeric: true })
}

function sortTransactions(
  transactions: readonly Transaction[],
  sort: SortState | null
): readonly Transaction[] {
  if (!sort) return transactions
  const factor = sort.direction === "asc" ? 1 : -1
  return [...transactions].sort((a, b) => compareTransactions(a, b, sort.key) * factor)
}

// Klik pertama: asc, klik kedua: desc, klik ketiga: kembali ke urutan awal
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
          "inline-flex w-full items-center gap-1.5 hover:text-[#282458]",
          align === "right" ? "justify-end" : "justify-center",
          isActive && "text-[#282458]"
        )}
      >
        <span>{label}</span>
        <span className="flex flex-col leading-none" aria-hidden="true">
          <MdArrowDropUp
            className={cn("-mb-2 size-4", direction === "asc" ? "text-[#282458]" : "text-[#716EC9]")}
          />
          <MdArrowDropDown
            className={cn("size-4", direction === "desc" ? "text-[#282458]" : "text-[#716EC9]")}
          />
        </span>
        <span className="sr-only">Sort by {label}</span>
      </button>
    </TableHead>
  )
}
