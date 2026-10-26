import type { TransactionType } from "@/components/table/TableComponent"
import { emptyDaySummary, type CalendarData, type DaySummary } from "@/components/calendar/calendar-model"
import { apiGet } from "./client"

interface CalendarTypeSummaryResponse {
  type: "INCOME" | "EXPENSE" | "SAVING"
  amount: number
  count: number
}

interface CalendarDayResponse {
  date: string // format "YYYY-MM-DD"
  summaries: CalendarTypeSummaryResponse[] | null
}

// `days` hanya berisi tanggal yang punya transaksi; `totals` (total sebulan) tidak dipakai di UI
interface TransactionCalendarResponse {
  month: string // format "YYYY-MM"
  startDate: string
  endDate: string
  totals: CalendarTypeSummaryResponse[] | null
  days: CalendarDayResponse[] | null
}

function toDaySummary(summaries: CalendarTypeSummaryResponse[] | null): DaySummary {
  const summary = emptyDaySummary()
  for (const item of summaries ?? []) {
    const type = item.type.toLowerCase() as TransactionType
    summary[type] = { amount: Number(item.amount), count: Number(item.count) }
  }
  return summary
}

/** Ringkasan transaksi per tanggal untuk satu bulan; `month` berformat "YYYY-MM" */
export async function fetchTransactionCalendar(month: string, signal?: AbortSignal): Promise<CalendarData> {
  const params = new URLSearchParams({ month })
  const body = await apiGet<TransactionCalendarResponse>("/api/transaction/calendar", params, "kalender", signal)

  return Object.fromEntries((body.data?.days ?? []).map((day) => [day.date, toDaySummary(day.summaries)]))
}
