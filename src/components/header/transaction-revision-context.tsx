"use client"

import * as React from "react"

interface TransactionRevisionContextValue {
  /** Naik setiap kali data transaksi berubah (create/update/delete) */
  revision: number
  /** Panggil setelah mutasi berhasil agar tabel, stat, dan chart fetch ulang */
  notifyTransactionsChanged: () => void
}

// Default aman di luar provider: revision tetap 0 dan notify tidak melakukan apa-apa
const TransactionRevisionContext = React.createContext<TransactionRevisionContextValue>({
  revision: 0,
  notifyTransactionsChanged: () => {},
})

// Dialog create ada di header, sedangkan data dipakai di halaman; revision dibagi lewat context
export function TransactionRevisionProvider({ children }: { children: React.ReactNode }) {
  const [revision, setRevision] = React.useState(0)
  const notifyTransactionsChanged = React.useCallback(() => setRevision((r) => r + 1), [])
  const value = React.useMemo(
    () => ({ revision, notifyTransactionsChanged }),
    [revision, notifyTransactionsChanged]
  )

  return (
    <TransactionRevisionContext.Provider value={value}>{children}</TransactionRevisionContext.Provider>
  )
}

export function useTransactionRevision(): TransactionRevisionContextValue {
  return React.useContext(TransactionRevisionContext)
}
