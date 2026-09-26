"use client"

import { CalendarIcon, SearchIcon, XIcon } from "lucide-react"
import { cn } from "cn"
import { Input } from "@/components/ui/input"
import { ACCENT_ICON_CLASS, ACCENT_OUTLINE_CLASS } from "@/lib/styles"
import { toLocalDateString } from "@/lib/date"
import { Button } from "../ui/button"
import { Spinner } from "@/components/ui/spinner"


interface SearchHeaderProps {
  query: string
  date?: Date
  onQueryChange?: (query: string) => void
  onDateChange?: (date: Date | undefined) => void
  isSearching?: boolean
}

// Date -> "YYYY-MM-DD" (format yang sama dengan parameter `date` di API)
function toInputValue(date?: Date): string {
  return date ? toLocalDateString(date) : ""
}

const ACTION_BUTTON_CLASS = `min-w-28 px-5 ${ACCENT_OUTLINE_CLASS}`

// Input search & date disamakan dengan tombol Export (outline ungu, tinggi h-9)
const ACCENT_INPUT_CLASS = cn(
  "h-9 pl-8 transition-colors placeholder:text-[#716EC9]/70 hover:placeholder:text-[#9A97F0]/70",
  ACCENT_OUTLINE_CLASS
)

const INPUT_ICON_CLASS = cn(
  "pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2",
  ACCENT_ICON_CLASS
)

const RESET_BUTTON_CLASS = cn(
  "absolute top-1/2 right-8 flex size-5 -translate-y-1/2 items-center justify-center rounded-sm transition-colors hover:bg-[#716EC9]/15 focus-visible:ring-2 focus-visible:ring-[#716EC9] focus-visible:outline-none",
  ACCENT_ICON_CLASS
)

// "YYYY-MM-DD" -> Date (local time)
function fromInputValue(value: string): Date | undefined {
  if (!value) return undefined
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export function SearchHeader({
  query,
  date,
  onQueryChange,
  onDateChange,
  isSearching = false,
}: SearchHeaderProps) {
  return (
    <header className="flex w-full flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between px-7 py-6">
      <Button className={ACTION_BUTTON_CLASS} variant="outline" size="lg">
            Add Transaction
        </Button>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <div className="group/accent relative w-full sm:w-64">
          {/* Ikon search berganti spinner selama jeda ketik / request berjalan */}
          {isSearching ? (
            <Spinner className={cn(INPUT_ICON_CLASS, "animate-spin")} />
          ) : (
            <SearchIcon className={INPUT_ICON_CLASS} />
          )}
          <Input
            type="search"
            placeholder="Search transaction..."
            value={query}
            onChange={(e) => onQueryChange?.(e.target.value)}
            className={ACCENT_INPUT_CLASS}
            aria-label="Search transaction"
          />
        </div>

        <div className="group/accent relative w-full sm:w-48">
          <CalendarIcon className={INPUT_ICON_CLASS} />
          <Input
            type="date"
            value={toInputValue(date)}
            onChange={(e) => onDateChange?.(fromInputValue(e.target.value))}
            className={cn(ACCENT_INPUT_CLASS, date && "pr-14")}
            aria-label="Filter by date"
          />
          {/* Tombol reset hanya muncul saat tanggal terisi; diletakkan di kiri ikon picker bawaan browser */}
          {date && (
            <button
              type="button"
              onClick={() => onDateChange?.(undefined)}
              className={RESET_BUTTON_CLASS}
              aria-label="Reset date filter"
              title="Reset date"
            >
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
