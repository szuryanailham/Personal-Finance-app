"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowDownLeftIcon, ArrowUpRightIcon, ArrowRightIcon } from "lucide-react"
import { CATEGORY_OPTIONS } from "@/components/header/category-type-field"
import { dateFormatter, formatAmount, type TransactionType } from "@/components/table/TableComponent"
import { compareNewestFirst } from "@/components/table/SortableHead"
import { useTransactions } from "@/hooks/use-transactions"
import { toLocalDateString } from "@/lib/date"

const TYPE_ICON = Object.fromEntries(
  CATEGORY_OPTIONS.map((option) => [option.value.toLowerCase(), option.icon])
) as Record<TransactionType, (typeof CATEGORY_OPTIONS)[number]["icon"]>

const TYPE_STYLE: Record<TransactionType, { icon: typeof ArrowDownLeftIcon; amount: string; label: string }> = {
  income: { icon: ArrowDownLeftIcon, amount: "text-emerald-700", label: "Pemasukan" },
  expense: { icon: ArrowUpRightIcon, amount: "text-rose-600", label: "Pengeluaran" },
  saving: { icon: ArrowRightIcon, amount: "text-[#14864A]", label: "Tabungan" },
}

export function MobileTodayTransactions() {
  const [today, setToday] = useState(() => toLocalDateString(new Date()))

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    function syncDate() {
      const now = new Date()
      setToday(toLocalDateString(now))

      // Use the next local midnight so timezone offsets and DST are respected.
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      clearTimeout(timer)
      timer = setTimeout(syncDate, midnight.getTime() - now.getTime())
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible") syncDate()
    }

    syncDate()
    window.addEventListener("focus", syncDate)
    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("focus", syncDate)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [])

  const { transactions, isLoading, error } = useTransactions(5, 0, "", today)
  // The shared hook retains previous results while fetching the new day.
  const latestTransactions = transactions
    .filter((transaction) => toLocalDateString(transaction.date) === today)

  return (
    <section aria-labelledby="latest-transactions-title" className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 id="latest-transactions-title" className="text-base font-bold text-slate-900">
            Transaksi terbaru
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">Aktivitas keuangan terbaru</p>
        </div>
        <Link
          href="/transaction"
          className="inline-flex items-center gap-1 rounded-full bg-[#14864A]/10 px-3 py-1.5 text-xs font-semibold text-[#14864A] transition-colors active:bg-[#14864A]/20"
        >
          Semua <ArrowRightIcon className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-100 bg-white px-4 py-5 text-center text-sm text-rose-600">
          Gagal memuat transaksi terbaru.
        </div>
      ) : isLoading ? (
        <div className="flex flex-col gap-2.5" aria-label="Memuat transaksi terbaru" aria-busy="true">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-[74px] animate-pulse rounded-2xl bg-emerald-50" />
          ))}
        </div>
      ) : latestTransactions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-emerald-200 bg-white px-4 py-6 text-center">
          <p className="text-sm font-medium text-slate-700">Belum ada transaksi</p>
          <p className="mt-1 text-xs text-slate-500">Transaksi yang kamu catat akan muncul di sini.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {latestTransactions.map((transaction) => {
            const style = TYPE_STYLE[transaction.type]
            const TypeIcon = style.icon

            return (
              <li key={transaction.transactionCode}>
                <Link
                  href={`/transaction/${encodeURIComponent(transaction.transactionCode)}`}
                  className="flex min-w-0 items-center gap-3 rounded-2xl border border-emerald-100/80 bg-white p-3.5 shadow-[0_4px_14px_-12px_rgba(15,75,45,0.5)] transition-colors active:bg-emerald-50"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                    <Image
                      src={TYPE_ICON[transaction.type]}
                      alt=""
                      width={28}
                      height={28}
                      unoptimized
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-800">
                      {transaction.description}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                      <TypeIcon className="size-3.5" aria-hidden="true" />
                      {transaction.category || style.label}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className={`block text-sm font-bold ${style.amount}`}>
                      {formatAmount(transaction.type, transaction.amount)}
                    </span>
                    <time dateTime={toLocalDateString(transaction.date)} className="mt-1 block text-[11px] text-slate-400">
                      {dateFormatter.format(transaction.date)}
                    </time>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
