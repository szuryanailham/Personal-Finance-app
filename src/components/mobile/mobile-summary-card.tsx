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
  { key: "totalIncome", label: "Pemasukan" },
  { key: "totalExpense", label: "Pengeluaran" },
  { key: "totalSaving", label: "Tabungan" },
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
      className="flex flex-col gap-3 px-4 pt-4"
    >
      <PersonalizedGreeting />

      <div className="rounded-2xl bg-linear-to-br from-[#168D50] via-[#14864A] to-[#0D6738] p-4 text-white shadow-sm">
        <MobileBudgetCard isHidden={isHidden} />
      </div>

      <section aria-label="Saldo, pemasukan, pengeluaran, dan tabungan" className="rounded-2xl border border-border bg-background p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-muted-foreground">Total Saldo</h2>
          <button
            type="button"
            onClick={toggleHidden}
            aria-label={isHidden ? "Tampilkan semua nominal" : "Sembunyikan semua nominal"}
            className="grid size-10 shrink-0 place-items-center rounded-lg hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
          >
            <ToggleIcon aria-hidden="true" className="size-5" />
          </button>
        </div>
        <p className="text-2xl font-bold break-words tabular-nums">
          {renderAmount("totalBalance")}
        </p>

        <dl className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
          {summaryMetrics.map(({ key, label }) => (
            <div key={key} className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="min-w-0 text-right font-semibold break-words tabular-nums">{renderAmount(key)}</dd>
            </div>
          ))}
        </dl>
      </section>

      {!isLoading && error && <p className="text-sm text-destructive">{error}</p>}
    </section>
  )
}
