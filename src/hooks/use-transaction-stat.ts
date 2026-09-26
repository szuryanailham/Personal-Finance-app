import * as React from "react"

import { fetchTransactionStat, type TransactionStat } from "@/lib/api/transaction"

interface UseTransactionStatResult {
  stat: TransactionStat | null
  isLoading: boolean
  error: string | null
}

export function useTransactionStat(startDate: string, endDate: string): UseTransactionStatResult {
  const [state, setState] = React.useState<UseTransactionStatResult>({
    stat: null,
    isLoading: true,
    error: null,
  })

  React.useEffect(() => {
    const controller = new AbortController()

    fetchTransactionStat({ startDate, endDate, signal: controller.signal })
      .then((stat) => setState({ stat, isLoading: false, error: null }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const message = err instanceof Error ? err.message : "Terjadi kesalahan"
        setState((prev) => ({ ...prev, isLoading: false, error: message }))
      })

    return () => controller.abort()
  }, [startDate, endDate])

  return state
}
