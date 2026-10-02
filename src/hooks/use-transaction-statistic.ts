import * as React from "react"

import { useTransactionRevision } from "@/components/header/transaction-revision-context"
import {
  fetchTransactionStatistic,
  type StatisticPeriod,
  type TransactionStatistic,
} from "@/lib/api/transaction"

interface UseTransactionStatisticResult {
  statistic: TransactionStatistic | null
  isLoading: boolean
  error: string | null
}

interface StatisticState {
  statistic: TransactionStatistic | null
  error: string | null
  // Key (periode + revision) dari request terakhir yang sudah selesai (sukses maupun gagal)
  settledKey: string | null
}

export function useTransactionStatistic(period: StatisticPeriod): UseTransactionStatisticResult {
  // revision ikut di key agar chart di-fetch ulang setelah transaksi dibuat/diubah
  const { revision } = useTransactionRevision()
  const requestKey = `${period}|${revision}`
  const [state, setState] = React.useState<StatisticState>({
    statistic: null,
    error: null,
    settledKey: null,
  })

  React.useEffect(() => {
    const controller = new AbortController()

    fetchTransactionStatistic({ period, signal: controller.signal })
      .then((statistic) => setState({ statistic, error: null, settledKey: requestKey }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const message = err instanceof Error ? err.message : "Terjadi kesalahan"
        setState((prev) => ({ ...prev, error: message, settledKey: requestKey }))
      })

    return () => controller.abort()
  }, [period, requestKey])

  const isLoading = state.settledKey !== requestKey

  return {
    statistic: state.statistic,
    isLoading,
    error: isLoading ? null : state.error,
  }
}
