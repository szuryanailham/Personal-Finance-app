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
