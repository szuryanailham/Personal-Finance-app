import * as React from "react"

import { useTransactionRevision } from "@/components/header/transaction-revision-context"
import type { Transaction } from "@/components/table/TableComponent"
import { fetchTransaction } from "@/lib/api/transaction"

interface UseTransactionResult {
  transaction: Transaction | null
  isLoading: boolean
  error: string | null
}

interface SettledState {
  transaction: Transaction | null
  error: string | null
  /** key request terakhir yang sudah selesai; null = belum pernah selesai */
  settledKey: string | null
}

/** Detail satu transaksi berdasarkan kode, mis. "TRX-20261025-206" */
export function useTransaction(transactionCode: string): UseTransactionResult {
  // revision ikut di key agar detail di-fetch ulang setelah transaksi diubah
  const { revision } = useTransactionRevision()
  const requestKey = `${transactionCode}|${revision}`
  const [state, setState] = React.useState<SettledState>({
    transaction: null,
    error: null,
    settledKey: null,
  })

  React.useEffect(() => {
    const controller = new AbortController()

    fetchTransaction(transactionCode, controller.signal)
      .then((transaction) => setState({ transaction, error: null, settledKey: requestKey }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const message = err instanceof Error ? err.message : "Terjadi kesalahan"
        setState({ transaction: null, error: message, settledKey: requestKey })
      })

    return () => controller.abort()
  }, [transactionCode, requestKey])

  return {
    transaction: state.transaction,
    isLoading: state.settledKey !== requestKey,
    error: state.error,
  }
}
