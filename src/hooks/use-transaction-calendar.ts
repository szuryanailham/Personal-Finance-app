import * as React from "react"

import type { CalendarData } from "@/components/calendar/calendar-model"
import { useTransactionRevision } from "@/components/header/transaction-revision-context"
import { fetchTransactionCalendar } from "@/lib/api/transaction-calendar"

interface UseTransactionCalendarResult {
  data: CalendarData
  isLoading: boolean
  error: string | null
}

interface CalendarState {
  /** key request terakhir yang sudah selesai; null = belum pernah selesai */
  settledKey: string | null
  data: CalendarData
  error: string | null
}

const EMPTY_CALENDAR_DATA: CalendarData = {}

/** Ringkasan transaksi per tanggal untuk `month` (format "YYYY-MM") */
export function useTransactionCalendar(month: string): UseTransactionCalendarResult {
  // revision ikut di key agar kalender di-fetch ulang setelah transaksi dibuat/diubah/dihapus
  const { revision } = useTransactionRevision()
  const requestKey = `${month}|${revision}`
  const [state, setState] = React.useState<CalendarState>({
    settledKey: null,
    data: EMPTY_CALENDAR_DATA,
    error: null,
  })

  React.useEffect(() => {
    const controller = new AbortController()

    fetchTransactionCalendar(month, controller.signal)
      .then((data) => setState({ settledKey: requestKey, data, error: null }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const message = err instanceof Error ? err.message : "Terjadi kesalahan"
        setState({ settledKey: requestKey, data: EMPTY_CALENDAR_DATA, error: message })
      })

    return () => controller.abort()
  }, [month, requestKey])

  const isLoading = state.settledKey !== requestKey
  // Data bulan lama tidak ditampilkan saat bulan baru masih dimuat
  return { data: isLoading ? EMPTY_CALENDAR_DATA : state.data, isLoading, error: state.error }
}
