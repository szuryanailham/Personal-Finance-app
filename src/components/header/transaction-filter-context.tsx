"use client"

import * as React from "react"

import type { StatQuery } from "@/lib/api/transaction"

export type FilterPeriod = "yearly" | "monthly" | "weekly" | "custom"

export type TransactionFilter =
  | { period: Exclude<FilterPeriod, "custom"> }
  | { period: "custom"; startDate: string; endDate: string }

const DEFAULT_FILTER: TransactionFilter = { period: "monthly" }

// Ubah filter periode menjadi query `type` untuk /api/transaction/stat
export function toStatQuery(filter: TransactionFilter): StatQuery {
  if (filter.period === "custom") {
    return { type: "custom", startDate: filter.startDate, endDate: filter.endDate }
  }
  return { type: filter.period }
}

interface TransactionFilterContextValue {
  filter: TransactionFilter
  setFilter: (filter: TransactionFilter) => void
  /** true selama data yang memakai filter (mis. stat) sedang dimuat */
  isFilterLoading: boolean
  setIsFilterLoading: (isLoading: boolean) => void
}

const TransactionFilterContext = React.createContext<TransactionFilterContextValue | null>(null)

// Filter dipasang di header (drawer) tapi dipakai di halaman, jadi disimpan di context bersama
export function TransactionFilterProvider({ children }: { children: React.ReactNode }) {
  const [filter, setFilter] = React.useState<TransactionFilter>(DEFAULT_FILTER)
  const [isFilterLoading, setIsFilterLoading] = React.useState(false)
  const value = React.useMemo(
    () => ({ filter, setFilter, isFilterLoading, setIsFilterLoading }),
    [filter, isFilterLoading]
  )

  return (
    <TransactionFilterContext.Provider value={value}>{children}</TransactionFilterContext.Provider>
  )
}

export function useTransactionFilter(): TransactionFilterContextValue {
  const context = React.useContext(TransactionFilterContext)
  if (!context) {
    throw new Error("useTransactionFilter harus dipakai di dalam TransactionFilterProvider")
  }
  return context
}
