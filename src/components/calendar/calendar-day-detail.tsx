"use client"

import { useState } from "react"
import Link from "next/link"
import { useTransactions } from "@/hooks/use-transactions"
import { formatAmount } from "@/components/table/TableComponent"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TRANSACTION_TYPES, TYPE_CONFIG, type DaySummary } from "./calendar-model"

const currencyFormatter = new Intl.NumberFormat("id-ID")

interface CalendarDayDetailProps {
  date: string
  title: string
  summary: DaySummary
  emptyText?: string
}

// Rincian nominal & jumlah transaksi per tipe untuk hari terpilih
export function CalendarDayDetail({ date, title, summary, emptyText = "Tidak ada transaksi" }: CalendarDayDetailProps) {
  const [page, setPage] = useState(0)
  const pageSize = 10
  const { transactions, paging, isFetching, error } = useTransactions(pageSize, page * pageSize, "", date)
  const hasTransaction = TRANSACTION_TYPES.some((type) => summary[type].count > 0)

  return (
    <section className="flex flex-col gap-3 rounded-2xl bg-white p-4">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      {hasTransaction && (
        <ul className="flex flex-col gap-2">
          {TRANSACTION_TYPES.map((type) => (
            <li key={type} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 text-slate-700">
                <span className={cn("size-2 rounded-full", TYPE_CONFIG[type].dotClass)} />
                {TYPE_CONFIG[type].label}
                <span className="text-xs text-slate-400">({summary[type].count} transaksi)</span>
              </span>
              <span className={cn("font-semibold", TYPE_CONFIG[type].textClass)}>
                Rp {currencyFormatter.format(summary[type].amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="border-t border-slate-100 pt-3" aria-busy={isFetching}>
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Daftar transaksi</h3>
        {isFetching ? (
          <p role="status" className="text-sm text-slate-500">Memuat transaksi…</p>
        ) : error ? (
          <p role="alert" className="text-sm text-destructive">{error}</p>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-slate-500">{emptyText}</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {transactions.map((transaction) => (
              <li key={transaction.transactionCode}>
                <Link
                  href={`/transaction/${encodeURIComponent(transaction.transactionCode)}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg py-3 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-emerald-600"
                >
                  <span className="min-w-0 flex-1 basis-32">
                    <span className="block break-words text-sm font-medium text-slate-800">{transaction.description}</span>
                    <span className="mt-1 block text-xs text-slate-500">{transaction.category}</span>
                  </span>
                  <span className={cn("text-sm font-semibold", TYPE_CONFIG[transaction.type].textClass)}>
                    {formatAmount(transaction.type, transaction.amount)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex items-center justify-between gap-2">
          <Button variant="outline" size="sm" disabled={page === 0 || isFetching} onClick={() => setPage((current) => current - 1)}>Sebelumnya</Button>
          <span className="text-xs text-slate-500">{page + 1}</span>
          <Button variant="outline" size="sm" disabled={isFetching || !!error || (paging ? page + 1 >= paging.totalPage : transactions.length < pageSize)} onClick={() => setPage((current) => current + 1)}>Berikutnya</Button>
        </div>
      </div>
    </section>
  )
}
