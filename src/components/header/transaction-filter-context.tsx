"use client"

import * as React from "react"

import type { StatQuery } from "@/lib/api/transaction"

export type FilterPeriod = "yearly" | "monthly" | "weekly" | "custom"

export type TransactionFilter =
  | { period: Exclude<FilterPeriod, "custom"> }
  | { period: "custom"; startDate: string; endDate: string }

const DEFAULT_FILTER: TransactionFilter = { period: "monthly" }
const FILTER_STORAGE_KEY = "transaction-filter"
const PRESET_PERIODS: readonly FilterPeriod[] = ["yearly", "monthly", "weekly"]
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

// Data di localStorage tidak bisa dipercaya (bisa rusak/diubah manual), jadi divalidasi dulu
function parseStoredFilter(raw: string | null): TransactionFilter {
  if (!raw) return DEFAULT_FILTER
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== "object" || parsed === null) return DEFAULT_FILTER
    const { period, startDate, endDate } = parsed as Record<string, unknown>

    if (PRESET_PERIODS.includes(period as FilterPeriod)) {
      return { period: period as Exclude<FilterPeriod, "custom"> }
    }
    const isValidRange =
      typeof startDate === "string" &&
      typeof endDate === "string" &&
      DATE_PATTERN.test(startDate) &&
      DATE_PATTERN.test(endDate) &&
      startDate <= endDate
    if (period === "custom" && isValidRange) {
      return { period: "custom", startDate, endDate }
    }
  } catch {
    // JSON rusak -> pakai default
  }
  return DEFAULT_FILTER
}

// Listener untuk perubahan di tab yang sama (event "storage" hanya terpicu dari tab lain)
const filterListeners = new Set<() => void>()

function subscribeFilter(onChange: () => void): () => void {
  filterListeners.add(onChange)
  window.addEventListener("storage", onChange)
  return () => {
    filterListeners.delete(onChange)
    window.removeEventListener("storage", onChange)
  }
}

function readStoredFilter(): string | null {
  try {
    return window.localStorage.getItem(FILTER_STORAGE_KEY)
  } catch {
    return null // storage diblokir (mis. private mode)
  }
}

function writeStoredFilter(filter: TransactionFilter): void {
  try {
    window.localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filter))
  } catch {
    // storage penuh/diblokir: filter tetap tidak tersimpan, tapi aplikasi tetap jalan
  }
  filterListeners.forEach((listener) => listener())
}

// Saat SSR belum ada localStorage, jadi server & hydration awal selalu memakai default
const getServerFilterSnapshot = (): string | null => null

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

// Filter dipasang di header (drawer) tapi dipakai di halaman, jadi disimpan di context bersama.
// Filter juga disimpan di localStorage agar tetap sama setelah halaman di-refresh.
export function TransactionFilterProvider({ children }: { children: React.ReactNode }) {
  const storedFilter = React.useSyncExternalStore(
    subscribeFilter,
    readStoredFilter,
    getServerFilterSnapshot
  )
  const filter = React.useMemo(() => parseStoredFilter(storedFilter), [storedFilter])
  const setFilter = React.useCallback((next: TransactionFilter) => writeStoredFilter(next), [])
  const [isFilterLoading, setIsFilterLoading] = React.useState(false)
  const value = React.useMemo(
    () => ({ filter, setFilter, isFilterLoading, setIsFilterLoading }),
    [filter, setFilter, isFilterLoading]
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
