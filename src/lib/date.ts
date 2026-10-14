export interface DateRange {
  startDate: string // format "YYYY-MM-DD"
  endDate: string // format "YYYY-MM-DD"
}

// Format pakai komponen tanggal lokal agar tidak bergeser karena timezone (toISOString pakai UTC)
export function toLocalDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// Tanggal 1 s/d tanggal terakhir dari bulan milik `date`
export function getMonthRange(date: Date = new Date()): DateRange {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  // Hari ke-0 bulan berikutnya = hari terakhir bulan ini
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  return { startDate: toLocalDateString(firstDay), endDate: toLocalDateString(lastDay) }
}

// 1 Januari s/d 31 Desember dari tahun milik `date`
export function getYearRange(date: Date = new Date()): DateRange {
  const firstDay = new Date(date.getFullYear(), 0, 1)
  const lastDay = new Date(date.getFullYear(), 11, 31)
  return { startDate: toLocalDateString(firstDay), endDate: toLocalDateString(lastDay) }
}

const DAYS_IN_WEEK = 7

// Senin s/d Minggu dari minggu milik `date`
export function getWeekRange(date: Date = new Date()): DateRange {
  // getDay(): Minggu = 0, jadi geser agar Senin = 0
  const daysSinceMonday = (date.getDay() + DAYS_IN_WEEK - 1) % DAYS_IN_WEEK
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - daysSinceMonday)
  const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + DAYS_IN_WEEK - 1)
  return { startDate: toLocalDateString(monday), endDate: toLocalDateString(sunday) }
}
