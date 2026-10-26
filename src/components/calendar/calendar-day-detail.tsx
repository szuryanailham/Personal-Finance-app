import { cn } from "@/lib/utils"
import { TRANSACTION_TYPES, TYPE_CONFIG, type DaySummary } from "./calendar-model"

const currencyFormatter = new Intl.NumberFormat("id-ID")

interface CalendarDayDetailProps {
  title: string
  summary: DaySummary
  emptyText?: string
}

// Rincian nominal & jumlah transaksi per tipe untuk hari terpilih
export function CalendarDayDetail({ title, summary, emptyText = "Tidak ada transaksi" }: CalendarDayDetailProps) {
  const hasTransaction = TRANSACTION_TYPES.some((type) => summary[type].count > 0)

  return (
    <section className="flex flex-col gap-3 rounded-2xl bg-white p-4">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      {!hasTransaction && <p className="text-sm text-slate-500">{emptyText}</p>}
      {hasTransaction && (
        <ul className="flex flex-col gap-2">
          {TRANSACTION_TYPES.map((type) => (
            <li key={type} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 text-slate-700">
                <span className={cn("size-2 rounded-full", TYPE_CONFIG[type].dotClass)} />
                {TYPE_CONFIG[type].label}
                <span className="text-xs text-slate-400">({summary[type].count} transaksi)</span>
              </span>
              <span className={cn("font-semibold", TYPE_CONFIG[type].textClass)}>
                Rp {currencyFormatter.format(summary[type].amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
