import * as React from "react"

import { useTransactionRevision } from "@/components/header/transaction-revision-context"
import {
  categoryStatisticQueryKey,
  fetchCategoryStatistic,
  type CategoryStatistic,
  type CategoryStatisticQuery,
} from "@/lib/api/category"

export interface UseCategoryStatisticResult {
  statistic: CategoryStatistic | null
  isLoading: boolean
  error: string | null
}

interface CategoryStatisticState {
  statistic: CategoryStatistic | null
  error: string | null
  // Key (revision + periode) dari request terakhir yang sudah selesai (sukses maupun gagal)
  settledKey: string | null
}

// `query` sebaiknya disimpan di state pemanggil agar referensinya stabil antar render
export function useCategoryStatistic(query: CategoryStatisticQuery): UseCategoryStatisticResult {
  // revision dipakai agar chart di-fetch ulang setelah transaksi dibuat/diubah
  const { revision } = useTransactionRevision()
  const queryKey = categoryStatisticQueryKey(query)
  const requestKey = `${revision}|${queryKey}`
  const [state, setState] = React.useState<CategoryStatisticState>({
    statistic: null,
    error: null,
    settledKey: null,
  })

  React.useEffect(() => {
    const controller = new AbortController()

    fetchCategoryStatistic(query, controller.signal)
      .then((statistic) => setState({ statistic, error: null, settledKey: requestKey }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const message = err instanceof Error ? err.message : "Terjadi kesalahan"
        setState((prev) => ({ ...prev, error: message, settledKey: requestKey }))
      })

    return () => controller.abort()
  }, [query, requestKey])

  const isLoading = state.settledKey !== requestKey

  return {
    statistic: state.statistic,
    isLoading,
    error: isLoading ? null : state.error,
  }
}
