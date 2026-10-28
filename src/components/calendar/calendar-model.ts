import type { TransactionType } from "@/components/table/TableComponent"
import { toLocalDateString } from "@/lib/date"

export interface TypeSummary {
  amount: number
  count: number
}

/** Ringkasan transaksi satu hari, dikelompokkan per tipe */
export type DaySummary = Record<TransactionType, TypeSummary>

/** Key = tanggal "YYYY-MM-DD" */
export type CalendarData = Record<string, DaySummary>

export interface CalendarDay {
  date: Date
  key: string
  isCurrentMonth: boolean
}

export const TRANSACTION_TYPES: readonly TransactionType[] = ["income", "expense", "saving"]

export const TYPE_CONFIG: Record<TransactionType, { label: string; dotClass: string; textClass: string }> = {
  income: { label: "Income", dotClass: "bg-emerald-500", textClass: "text-emerald-600" },
  expense: { label: "Expense", dotClass: "bg-rose-500", textClass: "text-rose-600" },
  saving: { label: "Saving", dotClass: "bg-[#14864A]", textClass: "text-[#14864A]" },
}

// Minggu dimulai hari Senin, konsisten dengan getWeekRange
export const WEEKDAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]

const DAYS_IN_WEEK = 7

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

// Format "YYYY-MM" sesuai parameter `month` di endpoint kalender
export function toMonthKey(date: Date): string {
  return toLocalDateString(date).slice(0, 7)
}

export function emptyDaySummary(): DaySummary {
  return {
    income: { amount: 0, count: 0 },
    expense: { amount: 0, count: 0 },
    saving: { amount: 0, count: 0 },
  }
}

// Semua sel grid satu bulan, termasuk sisa hari bulan sebelum/sesudah agar baris minggu penuh
export function buildMonthGrid(month: Date): CalendarDay[] {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  // getDay(): Minggu = 0, jadi geser agar Senin = 0
  const leadingDays = (new Date(year, monthIndex, 1).getDay() + DAYS_IN_WEEK - 1) % DAYS_IN_WEEK
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const totalCells = Math.ceil((leadingDays + daysInMonth) / DAYS_IN_WEEK) * DAYS_IN_WEEK

  return Array.from({ length: totalCells }, (_, index) => {
    const date = new Date(year, monthIndex, 1 - leadingDays + index)
    return { date, key: toLocalDateString(date), isCurrentMonth: date.getMonth() === monthIndex }
  })
}
