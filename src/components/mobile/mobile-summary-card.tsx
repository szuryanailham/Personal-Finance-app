"use client"

import { useMemo } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { toStatQuery, useTransactionFilter } from "@/components/header/transaction-filter-context"
import { PersonalizedGreeting } from "@/components/home/personalized-greeting"
import { MobileBudgetCard } from "@/components/mobile/mobile-budget-card"
import { useHiddenAmounts } from "@/hooks/use-hidden-amounts"
import { useTransactionStat } from "@/hooks/use-transaction-stat"
import type { SummaryMetricKey } from "@/lib/api/transaction"

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
})

const summaryMetrics = [
  { key: "totalIncome", label: "Pemasukan", color: "text-[#08783e]" },
  { key: "totalExpense", label: "Pengeluaran", color: "text-[#c43825]" },
  { key: "totalSaving", label: "Tabungan", color: "text-[#6d28d9]" },
] as const

export function MobileSummaryCard() {
  const { filter } = useTransactionFilter()
  const statQuery = useMemo(() => toStatQuery(filter), [filter])
  const { stat, isLoading, error } = useTransactionStat(statQuery)
  const { isHidden, toggleHidden } = useHiddenAmounts()
  const ToggleIcon = isHidden ? EyeOffIcon : EyeIcon

  function renderAmount(key: SummaryMetricKey) {
    if (isLoading) return "…"
    if (error || !stat) return "—"
    if (isHidden) return "••••••"
    return currencyFormatter.format(stat[key].amount)
  }

  return (
    <section
      data-guidance="summary"
      aria-busy={isLoading}
      aria-label="Ringkasan transaksi"
      className="flex flex-col"
    >
      <div className="rounded-b-[28px] bg-[#0d4e31] bg-[radial-gradient(circle_at_84%_35%,#386537_0_32px,transparent_33px),radial-gradient(circle_at_8%_55%,#12643c_0_68px,transparent_69px)] px-4 pt-4 pb-20 text-white">
        <PersonalizedGreeting compact />
        <MobileBudgetCard isHidden={isHidden} />
      </div>

      <section aria-label="Saldo, pemasukan, pengeluaran, dan tabungan" className="relative mx-4 -mt-12 rounded-[20px] border border-slate-100 bg-white p-4 text-slate-900 shadow-md">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-xs font-semibold text-slate-500">Total saldo</h2>
            <p className="text-xl font-bold break-words tabular-nums">
              {renderAmount("totalBalance")}
            </p>
          </div>
          <button
            type="button"
            onClick={toggleHidden}
            aria-label={isHidden ? "Tampilkan semua nominal" : "Sembunyikan semua nominal"}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-[#daf3e4] text-[#08783e] hover:bg-[#c9ebd7] focus-visible:outline-2 focus-visible:outline-ring"
          >
            <ToggleIcon aria-hidden="true" className="size-5" />
          </button>
        </div>

        <dl className="mt-3 grid grid-cols-3 divide-x divide-slate-100 text-center text-[11px] leading-tight">
          {summaryMetrics.map(({ key, label, color }) => (
            <div key={key} className="min-w-0 space-y-1 px-1">
              <dt className="text-slate-600 [overflow-wrap:anywhere]">{label}</dt>
              <dd className={`font-bold tabular-nums [overflow-wrap:anywhere] ${color}`}>{renderAmount(key)}</dd>
            </div>
          ))}
        </dl>
      </section>

      {!isLoading && error && <p className="mx-4 mt-2 text-sm text-destructive">{error}</p>}
    </section>
  )
}
