"use client"

import Link from "next/link"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SortableHead, useTransactionSort } from "@/components/table/SortableHead"
import { cn } from "@/lib/utils"

export type TransactionType = "income" | "expense" | "saving"

export interface Transaction {
  transactionCode: string
  date: Date
  /** Nama transaksi (transactionName di backend) */
  description: string
  /** Catatan tambahan (description di backend) */
  note: string
  category: string
  categoryId: string
  type: TransactionType
  amount: number
}

interface TransactionTableProps {
  transactions: readonly Transaction[]
  query?: string
  date?: Date
  className?: string
  // Batasi jumlah baris yang tampil (mis. 10 di dashboard home)
  limit?: number
  // Jika diisi, tampilkan link "See detail transaction" di bawah tabel
  detailHref?: string
}

const currencyFormatter = new Intl.NumberFormat("id-ID")

export const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

const CELL_CLASS = "px-4 text-slate-500 text-center"

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

// Filter berdasarkan kata kunci (deskripsi/kategori) dan tanggal dari SearchHeader
function filterTransactions(
  transactions: readonly Transaction[],
  query: string,
  date?: Date
): Transaction[] {
  const keyword = query.trim().toLowerCase()

  return transactions.filter((trx) => {
    const matchesQuery =
      !keyword ||
      trx.description.toLowerCase().includes(keyword) ||
      trx.category.toLowerCase().includes(keyword)
    const matchesDate = !date || isSameDay(trx.date, date)
    return matchesQuery && matchesDate
  })
}

export function formatAmount(type: TransactionType, amount: number): string {
  const sign = type === "expense" ? "-" : "+"
  return `${sign}Rp.${currencyFormatter.format(Math.abs(amount))}`
}

export function TransactionTable({
  transactions,
  query = "",
  date,
  className,
  limit,
  detailHref,
}: TransactionTableProps) {
  const filtered = filterTransactions(transactions, query, date)
  // Urutkan dulu sebelum dibatasi, supaya limit mengambil baris teratas hasil sort
  const { sort, sorted, handleSort } = useTransactionSort(filtered)
  const rows = limit === undefined ? sorted : sorted.slice(0, limit)
  const isEmpty = rows.length === 0

  return (
    <div
      className={cn(
        "w-full rounded-[14px] bg-white px-3 py-4",
        className
      )}
    >
      <Table className="min-w-[900px] table-fixed">
        {isEmpty && <TableCaption>No transactions found.</TableCaption>}
        <TableHeader>
          <TableRow className="bg-[#D1CFEB] hover:bg-[#D1CFEB]">
            <SortableHead label="Transaction Code" sortKey="transactionCode" sort={sort} onSort={handleSort} className="w-[160px]" />
            <SortableHead label="Name" sortKey="description" sort={sort} onSort={handleSort} className="w-[260px]" />
            <SortableHead label="Category" sortKey="category" sort={sort} onSort={handleSort} className="w-[200px]" />
            <SortableHead label="Date" sortKey="date" sort={sort} onSort={handleSort} className="w-[160px]" />
            <SortableHead label="Amount" sortKey="amount" sort={sort} onSort={handleSort} className="w-[200px] text-right" align="right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((trx) => (
            <TableRow key={trx.transactionCode}>
              <TableCell className={cn(CELL_CLASS, "truncate")}>
                {trx.transactionCode}
              </TableCell>
              <TableCell className={cn(CELL_CLASS, "truncate font-medium text-[#282458]")}>
                {trx.description}
              </TableCell>
              <TableCell className={cn(CELL_CLASS, "truncate")}>
                {trx.category}
              </TableCell>
              <TableCell className={CELL_CLASS}>
                {dateFormatter.format(trx.date)}
              </TableCell>
              <TableCell className={cn(CELL_CLASS, "text-right font-semibold")}>
                {formatAmount(trx.type, trx.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {detailHref && (
        <div className="mt-4 flex justify-center">
          <Link
            href={detailHref}
            className="text-sm font-medium text-[#282458] hover:underline"
          >
            See detail transaction
          </Link>
        </div>
      )}
    </div>
  )
}
