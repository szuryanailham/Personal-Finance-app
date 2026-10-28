import { cn } from "@/lib/utils"
import { TRANSACTION_TYPES, TYPE_CONFIG, type CalendarDay, type DaySummary } from "./calendar-model"

const compactFormatter = new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 })

interface CalendarDayCellProps {
  day: CalendarDay
  summary?: DaySummary
  isToday: boolean
  isSelected: boolean
  onSelect: (key: string) => void
}

export function CalendarDayCell({ day, summary, isToday, isSelected, onSelect }: CalendarDayCellProps) {
  const activeTypes = summary ? TRANSACTION_TYPES.filter((type) => summary[type].count > 0) : []

  return (
    <button
      type="button"
      onClick={() => onSelect(day.key)}
      aria-pressed={isSelected}
      aria-label={day.date.toLocaleDateString("id-ID", { dateStyle: "full" })}
      className={cn(
        "flex min-h-16 flex-col gap-1 rounded-xl border p-1.5 text-left transition-colors sm:min-h-24 sm:p-2",
        "hover:border-[#14864A]/60",
        day.isCurrentMonth ? "bg-white" : "bg-slate-50 text-slate-400",
        isSelected ? "border-[#14864A] ring-1 ring-[#14864A]" : "border-slate-100"
      )}
    >
      <span
        className={cn(
          "flex size-6 items-center justify-center rounded-full text-xs font-semibold",
          isToday && "bg-[#14864A] text-white"
        )}
      >
        {day.date.getDate()}
      </span>

      {/* Layar kecil: titik warna saja; layar lebar: nominal ringkas per tipe */}
      <div className="flex gap-1 sm:hidden">
        {activeTypes.map((type) => (
          <span key={type} className={cn("size-1.5 rounded-full", TYPE_CONFIG[type].dotClass)} />
        ))}
      </div>
      <ul className="hidden flex-col gap-0.5 sm:flex">
        {activeTypes.map((type) => (
          <li key={type} className={cn("truncate text-[11px] font-medium", TYPE_CONFIG[type].textClass)}>
            {type === "expense" ? "-" : "+"}
            {compactFormatter.format(summary![type].amount)}
          </li>
        ))}
      </ul>
    </button>
  )
}
