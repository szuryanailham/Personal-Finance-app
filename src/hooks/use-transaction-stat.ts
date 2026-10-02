import * as React from "react"

import { useTransactionRevision } from "@/components/header/transaction-revision-context"
import { fetchTransactionStat, type StatQuery, type TransactionStat } from "@/lib/api/transaction"

interface UseTransactionStatResult {
  stat: TransactionStat | null
  isLoading: boolean
  error: string | null
}

interface StatState {
  queryKey: string | null // filter milik hasil terakhir
  stat: TransactionStat | null
  error: string | null
}

function toQueryKey(query: StatQuery): string {
  return query.type === "custom" ? `custom_${query.startDate}_${query.endDate}` : query.type
}

export function useTransactionStat(query: StatQuery): UseTransactionStatResult {
  // revision ikut di key agar stat di-fetch ulang setelah transaksi dibuat/diubah
  const { revision } = useTransactionRevision()
  const queryKey = `${toQueryKey(query)}|${revision}`
  const [state, setState] = React.useState<StatState>({ queryKey: null, stat: null, error: null })

  React.useEffect(() => {
    const controller = new AbortController()

    fetchTransactionStat({ ...query, signal: controller.signal })
      .then((stat) => setState({ queryKey, stat, error: null }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const message = err instanceof Error ? err.message : "Terjadi kesalahan"
        setState((prev) => ({ ...prev, queryKey, error: message }))
      })

    return () => controller.abort()
    // `query` diwakili `queryKey` agar objek baru dengan isi sama tidak memicu fetch ulang
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey])

  // Loading selama hasil yang tersimpan belum sesuai dengan filter terbaru
  return { stat: state.stat, isLoading: state.queryKey !== queryKey, error: state.error }
}
