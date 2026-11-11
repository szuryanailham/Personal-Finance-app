interface SummaryPeriodProps {
  startDate?: string
  endDate?: string
  isLoading: boolean
  error?: string | null
}

function formatDate(value?: string) {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/)
  if (!match) return null
  const [, year, month, day] = match
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
  if (date.getUTCFullYear() !== Number(year) || date.getUTCMonth() !== Number(month) - 1 || date.getUTCDate() !== Number(day)) return null
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date)
}

export function SummaryPeriod({ startDate, endDate, isLoading, error }: SummaryPeriodProps) {
  if (isLoading) return <div aria-label="Memuat periode ringkasan" className="mb-3 h-5 w-64 max-w-full animate-pulse rounded bg-slate-100" />
  const start = formatDate(startDate)
  const end = formatDate(endDate)
  if (error || !start || !end) return null
  return <p className="mb-3 px-1 text-sm text-slate-500">Periode: {start} – {end}</p>
}
