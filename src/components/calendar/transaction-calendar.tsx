"use client"

import { useMemo, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useTransactionCalendar } from "@/hooks/use-transaction-calendar"
import { toLocalDateString } from "@/lib/date"
import { cn } from "@/lib/utils"
import { CalendarDayCell } from "./calendar-day-cell"
import { CalendarDayDetail } from "./calendar-day-detail"
import {
  TRANSACTION_TYPES,
  TYPE_CONFIG,
  WEEKDAY_LABELS,
  addMonths,
  buildMonthGrid,
  emptyDaySummary,
  startOfMonth,
  toMonthKey,
} from "./calendar-model"

const monthFormatter = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" })
const dayFormatter = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })

interface TransactionCalendarProps {
  className?: string
}

// Kalender bulanan yang menampilkan ringkasan income, expense, dan saving per tanggal
export function TransactionCalendar({ className }: TransactionCalendarProps) {
  const [today] = useState(() => new Date())
  const todayKey = toLocalDateString(today)
  const [month, setMonth] = useState(() => startOfMonth(today))
  const [selectedKey, setSelectedKey] = useState(todayKey)

  const days = useMemo(() => buildMonthGrid(month), [month])
  const { data, isLoading, error } = useTransactionCalendar(toMonthKey(month))

  const selectedDay = days.find((day) => day.key === selectedKey)
  const changeMonth = (amount: number) => setMonth((current) => addMonths(current, amount))
  const goToToday = () => {
    setMonth(startOfMonth(today))
    setSelectedKey(todayKey)
  }

  return (
    <div className={cn("flex w-full flex-col gap-4 lg:flex-row lg:items-start", className)}>
      <section data-guidance="calendar" aria-busy={isLoading} className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl bg-white p-3 sm:p-4">
        <header className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-base font-semibold capitalize text-slate-900">
            {monthFormatter.format(month)}
            {isLoading && <Spinner className="size-4 text-slate-400" aria-label="Memuat kalender" />}
          </h2>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Hari ini
            </Button>
            <Button variant="ghost" size="icon" aria-label="Bulan sebelumnya" onClick={() => changeMonth(-1)}>
              <ChevronLeftIcon />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Bulan berikutnya" onClick={() => changeMonth(1)}>
              <ChevronRightIcon />
            </Button>
          </div>
        </header>

        <ul className="flex flex-wrap gap-3 text-xs text-slate-600">
          {TRANSACTION_TYPES.map((type) => (
            <li key={type} className="flex items-center gap-1.5">
              <span className={cn("size-2 rounded-full", TYPE_CONFIG[type].dotClass)} />
              {TYPE_CONFIG[type].label}
            </li>
          ))}
        </ul>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {WEEKDAY_LABELS.map((label) => (
            <span key={label} className="py-1 text-center text-xs font-medium text-slate-500">
              {label}
            </span>
          ))}
          {days.map((day) => (
            <CalendarDayCell
              key={day.key}
              day={day}
              summary={data[day.key]}
              isToday={day.key === todayKey}
              isSelected={day.key === selectedKey}
              onSelect={setSelectedKey}
            />
          ))}
        </div>
      </section>

      <aside className="flex flex-col gap-4 lg:w-80">
        {selectedDay && (
          <CalendarDayDetail
            title={dayFormatter.format(selectedDay.date)}
            summary={data[selectedDay.key] ?? emptyDaySummary()}
            emptyText={isLoading ? "Memuat transaksi…" : undefined}
          />
        )}
      </aside>
    </div>
  )
}
