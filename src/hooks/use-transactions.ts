import * as React from "react"

import { useTransactionRevision } from "@/components/header/transaction-revision-context"
import type { Transaction } from "@/components/table/TableComponent"
import { fetchTransactions, type Paging } from "@/lib/api/transaction"

interface UseTransactionsResult {
  transactions: Transaction[]
  paging: Paging | null
  /** true hanya saat load pertama (belum ada data sama sekali) */
  isLoading: boolean
  /** true setiap kali request sedang berjalan, termasuk refetch saat search */
  isFetching: boolean
  error: string | null
}

interface SettledState {
  transactions: Transaction[]
  paging: Paging | null
  error: string | null
  /** key request terakhir yang sudah selesai; null = belum pernah selesai */
  settledKey: string | null
}

/** `date` berformat "YYYY-MM-DD"; string kosong = tanpa filter tanggal */
export function useTransactions(
  limit: number,
  skip = 0,
  search = "",
  date = ""
): UseTransactionsResult {
  // revision ikut di key agar data di-fetch ulang setelah transaksi dibuat/diubah
  const { revision } = useTransactionRevision()
  const requestKey = `${limit}|${skip}|${search}|${date}|${revision}`
  const [state, setState] = React.useState<SettledState>({
    transactions: [],
    paging: null,
    error: null,
    settledKey: null,
  })

  React.useEffect(() => {
    const controller = new AbortController()

    fetchTransactions({ limit, skip, search, date, signal: controller.signal })
      .then(({ transactions, paging }) =>
        setState({ transactions, paging, error: null, settledKey: requestKey })
      )
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const message = err instanceof Error ? err.message : "Terjadi kesalahan"
        setState((prev) => ({ ...prev, error: message, settledKey: requestKey }))
      })

    return () => controller.abort()
  }, [limit, skip, search, date, requestKey])

  // Diturunkan dari key agar tidak perlu setState sinkron di dalam effect
  const isFetching = state.settledKey !== requestKey

  return {
    transactions: state.transactions,
    paging: state.paging,
    isLoading: state.settledKey === null,
    isFetching,
    error: state.error,
  }
}
