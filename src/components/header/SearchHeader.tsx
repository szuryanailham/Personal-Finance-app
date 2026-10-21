"use client"

import { CalendarIcon, SearchIcon, XIcon } from "lucide-react"
import { cn } from "cn"
import { Input } from "@/components/ui/input"
import { ACCENT_ICON_CLASS, ACCENT_OUTLINE_CLASS } from "@/lib/styles"
import { toLocalDateString } from "@/lib/date"
import { AddActionMenu } from "./add-action-menu"
import { Spinner } from "@/components/ui/spinner"
import { TransactionFilterDrawer } from "./transaction-filter-drawer"
import type { TransactionListFilter } from "@/lib/api/transaction"

interface SearchHeaderProps {
  query: string
  date?: Date
  onQueryChange?: (query: string) => void
  onDateChange?: (date: Date | undefined) => void
  isSearching?: boolean
  /** Tombol filter transaksi hanya tampil jika `filter` & `onFilterChange` diisi */
  filter?: TransactionListFilter
  onFilterChange?: (filter: TransactionListFilter) => void
}

// Date -> "YYYY-MM-DD" (format yang sama dengan parameter `date` di API)
function toInputValue(date?: Date): string {
  return date ? toLocalDateString(date) : ""
}

// Mobile: satu baris [Search | Date | Filter]; Add New jadi tombol float.
// sm ke atas: Add New di kiri, Filter/Search/Date di kanan.
const ACTION_BUTTON_CLASS = cn("min-w-28 px-5 max-sm:hidden sm:mr-auto", ACCENT_OUTLINE_CLASS)

// Di mobile input berbagi lebar sama rata; sm ke atas lebarnya tetap
const INPUT_WRAPPER_CLASS = "group/accent relative min-w-0 flex-1 sm:flex-none"

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
  filter,
  onFilterChange,
}: SearchHeaderProps) {
  return (
    // Urutan DOM mengikuti layout desktop; `max-sm:order-*` menyusun ulang untuk mobile
    <header className="flex w-full items-center gap-2 py-6 sm:gap-3">
      <AddActionMenu triggerClassName={ACTION_BUTTON_CLASS} />
      <AddActionMenu variant="floating" triggerClassName="sm:hidden" />

      {filter && onFilterChange && (
        <div className="flex shrink-0 max-sm:order-3">
          <TransactionFilterDrawer value={filter} onApply={onFilterChange} />
        </div>
      )}

      <div className={cn(INPUT_WRAPPER_CLASS, "max-sm:order-1 sm:w-64")}>
        {isSearching ? (
          <Spinner className={cn(INPUT_ICON_CLASS, "animate-spin")} />
        ) : (
          <SearchIcon className={INPUT_ICON_CLASS} />
        )}
        <Input
          type="search"
          placeholder="Cari transaksi..."
          value={query}
          onChange={(e) => onQueryChange?.(e.target.value)}
          className={ACCENT_INPUT_CLASS}
          aria-label="Cari transaksi"
        />
      </div>

      <div className={cn(INPUT_WRAPPER_CLASS, "max-sm:order-2 sm:w-48")}>
        <CalendarIcon className={INPUT_ICON_CLASS} />
        <Input
          type="date"
          value={toInputValue(date)}
          onChange={(e) => onDateChange?.(fromInputValue(e.target.value))}
          className={cn(ACCENT_INPUT_CLASS, date && "pr-14")}
          aria-label="Filter berdasarkan tanggal"
        />
        {date && (
          <button
            type="button"
            onClick={() => onDateChange?.(undefined)}
            className={RESET_BUTTON_CLASS}
            aria-label="Reset filter tanggal"
            title="Reset tanggal"
          >
            <XIcon className="size-3.5" />
          </button>
        )}
      </div>
    </header>
  )
}
