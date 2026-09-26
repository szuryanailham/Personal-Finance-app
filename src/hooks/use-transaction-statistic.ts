import * as React from "react"

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
  // Periode dari request terakhir yang sudah selesai (sukses maupun gagal)
  settledPeriod: StatisticPeriod | null
}

export function useTransactionStatistic(period: StatisticPeriod): UseTransactionStatisticResult {
  const [state, setState] = React.useState<StatisticState>({
    statistic: null,
    error: null,
    settledPeriod: null,
  })

  React.useEffect(() => {
    const controller = new AbortController()

    fetchTransactionStatistic({ period, signal: controller.signal })
      .then((statistic) => setState({ statistic, error: null, settledPeriod: period }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const message = err instanceof Error ? err.message : "Terjadi kesalahan"
        setState((prev) => ({ ...prev, error: message, settledPeriod: period }))
      })

    return () => controller.abort()
  }, [period])

  const isLoading = state.settledPeriod !== period

  return {
    statistic: state.statistic,
    isLoading,
    error: isLoading ? null : state.error,
  }
}
