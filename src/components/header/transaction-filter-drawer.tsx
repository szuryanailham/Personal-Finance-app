"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronDownIcon } from "lucide-react"

import filterIcon from "@/components/images/icons/filter-horizontal.svg"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useCategories } from "@/hooks/use-categories"
import type { Category } from "@/lib/api/category"
import {
  DEFAULT_TRANSACTION_LIST_FILTER,
  type TransactionDateFilter,
  type TransactionDatePreset,
  type TransactionListFilter,
  type TransactionSortValue,
} from "@/lib/api/transaction"
import { FilterSection, type FilterSectionOption } from "./filter-section"

interface FilterOption<T extends string> {
  value: T
  label: string
  description: string
}

const TYPE_OPTIONS: FilterOption<TransactionListFilter["type"]>[] = [
  { value: "all", label: "Semua", description: "Tampilkan semua transaksi" },
  { value: "income", label: "Income", description: "Hanya transaksi income" },
  { value: "expense", label: "Expense", description: "Hanya transaksi expense" },
  { value: "saving", label: "Saving", description: "Hanya transaksi saving" },
]

const SORT_OPTIONS: FilterOption<TransactionSortValue>[] = [
  { value: "date", label: "Terbaru", description: "Tanggal terbaru dulu" },
  { value: "-date", label: "Terlama", description: "Tanggal terlama dulu" },
  { value: "amount", label: "Jumlah tertinggi", description: "Jumlah terbesar dulu" },
  { value: "-amount", label: "Jumlah terendah", description: "Jumlah terkecil dulu" },
  { value: "name", label: "Nama A–Z", description: "Urut abjad berdasarkan nama" },
  { value: "-name", label: "Nama Z–A", description: "Urut abjad terbalik berdasarkan nama" },
]

const DATE_OPTIONS: FilterOption<TransactionDateFilter["preset"]>[] = [
  { value: "all", label: "Kapan saja", description: "Tanpa batas tanggal" },
  { value: "today", label: "Hari Ini", description: "Transaksi dari hari ini" },
  { value: "last7", label: "7 hari terakhir", description: "Termasuk hari ini" },
  { value: "last14", label: "14 hari terakhir", description: "Termasuk hari ini" },
  { value: "custom", label: "Rentang sendiri", description: "Pilih tanggal mulai dan akhir" },
]

const ALL_CATEGORIES = "all"

// Sisa jarak scroll (px) yang masih dianggap "sudah di bawah"
const SCROLL_END_THRESHOLD = 8

// True selama konten `element` masih bisa di-scroll ke bawah; ikut update saat ukuran konten berubah
function useHasMoreBelow(element: HTMLElement | null): boolean {
  const [hasMoreBelow, setHasMoreBelow] = React.useState(false)

  React.useEffect(() => {
    if (!element) return
    const update = () =>
      setHasMoreBelow(element.scrollHeight - element.scrollTop - element.clientHeight > SCROLL_END_THRESHOLD)

    update()
    element.addEventListener("scroll", update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(element)
    Array.from(element.children).forEach((child) => observer.observe(child))
    return () => {
      element.removeEventListener("scroll", update)
      observer.disconnect()
    }
  }, [element])

  return hasMoreBelow
}

function matchesType(category: Category, type: TransactionListFilter["type"]): boolean {
  return type === "all" || category.type.toLowerCase() === type
}

function isDateFilterComplete(range: TransactionDateFilter): boolean {
  if (range.preset !== "custom") return true
  return Boolean(range.startDate && range.endDate && range.startDate <= range.endDate)
}

function isDefaultFilter(filter: TransactionListFilter): boolean {
  return (
    filter.type === DEFAULT_TRANSACTION_LIST_FILTER.type &&
    filter.categoryId === DEFAULT_TRANSACTION_LIST_FILTER.categoryId &&
    filter.dateRange.preset === DEFAULT_TRANSACTION_LIST_FILTER.dateRange.preset &&
    filter.sort === DEFAULT_TRANSACTION_LIST_FILTER.sort
  )
}

interface CustomDateRangeProps {
  /** Prefix id input supaya unik jika dipakai di lebih dari satu drawer */
  idPrefix?: string
  startDate: string
  endDate: string
  onChange: (field: "startDate" | "endDate", value: string) => void
}

export function CustomDateRange({
  idPrefix = "trx-filter",
  startDate,
  endDate,
  onChange,
}: CustomDateRangeProps) {
  const isRangeInvalid = Boolean(startDate && endDate && startDate > endDate)

  return (
    // Mobile: tanggal ditumpuk vertikal; desktop: berdampingan
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <Field>
        <FieldLabel htmlFor={`${idPrefix}-start-date`}>Tanggal mulai</FieldLabel>
        <Input
          id={`${idPrefix}-start-date`}
          type="date"
          value={startDate}
          max={endDate || undefined}
          onChange={(event) => onChange("startDate", event.target.value)}
          className="h-9"
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={`${idPrefix}-end-date`}>Tanggal akhir</FieldLabel>
        <Input
          id={`${idPrefix}-end-date`}
          type="date"
          value={endDate}
          min={startDate || undefined}
          aria-invalid={isRangeInvalid}
          onChange={(event) => onChange("endDate", event.target.value)}
          className="h-9"
        />
      </Field>
      {isRangeInvalid && (
        <p className="col-span-full text-xs text-destructive">Tanggal akhir harus sama atau setelah tanggal mulai.</p>
      )}
    </div>
  )
}

interface TransactionFilterDrawerProps {
  value: TransactionListFilter
  onApply: (filter: TransactionListFilter) => void
}

export function TransactionFilterDrawer({ value, onApply }: TransactionFilterDrawerProps) {
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<TransactionListFilter>(value)
  const isMobile = useIsMobile()
  const isActive = !isDefaultFilter(value)
  const { categories, isLoading, error, reload } = useCategories(open)
  // Callback ref via state supaya hook ikut jalan saat konten drawer baru di-mount
  const [bodyElement, setBodyElement] = React.useState<HTMLDivElement | null>(null)
  const hasMoreBelow = useHasMoreBelow(bodyElement)

  // Kategori mengikuti tipe terpilih supaya kombinasi tipe + kategori tidak pernah kosong
  const categoryOptions: FilterSectionOption[] = [
    { value: ALL_CATEGORIES, label: "Semua kategori" },
    ...categories
      .filter((category) => matchesType(category, draft.type))
      .map((category) => ({ value: category.id, label: category.name })),
  ]

  // Setiap drawer dibuka, form diisi ulang dari filter aktif (pilihan yang di-cancel dibuang)
  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) setDraft(value)
    setOpen(nextOpen)
  }

  function handleApply() {
    setOpen(false)
    onApply(draft)
  }

  function handleCategoryChange(next: string) {
    setDraft((prev) => ({ ...prev, categoryId: next === ALL_CATEGORIES ? null : next }))
  }

  // Kategori yang tidak cocok dengan tipe baru dikosongkan
  function handleTypeChange(next: string) {
    const type = next as TransactionListFilter["type"]
    setDraft((prev) => {
      const selected = categories.find((category) => category.id === prev.categoryId)
      const keepCategory = !selected || matchesType(selected, type)
      return { ...prev, type, categoryId: keepCategory ? prev.categoryId : null }
    })
  }

  function handleDatePresetChange(next: string) {
    setDraft((prev) => {
      if (next !== "custom") {
        return { ...prev, dateRange: { preset: next as TransactionDatePreset } }
      }
      // Tanggal custom yang sudah diisi tetap dipertahankan
      const dateRange: TransactionDateFilter =
        prev.dateRange.preset === "custom"
          ? prev.dateRange
          : { preset: "custom", startDate: "", endDate: "" }
      return { ...prev, dateRange }
    })
  }

  function handleCustomDateChange(field: "startDate" | "endDate", date: string) {
    setDraft((prev) =>
      prev.dateRange.preset === "custom"
        ? { ...prev, dateRange: { ...prev.dateRange, [field]: date } }
        : prev
    )
  }

  return (
    <Drawer
      open={open}
      onOpenChange={handleOpenChange}
      showSwipeHandle={isMobile}
      swipeDirection={isMobile ? "down" : "right"}
    >
      <DrawerTrigger
        render={
          <Button variant="ghost" size="icon-lg" aria-label="Filter transaksi" className="relative">
            <Image src={filterIcon} alt="" width={24} height={24} />
            {isActive && (
              <span
                aria-hidden
                className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[#6359E9]"
              />
            )}
          </Button>
        }
      />
      <DrawerContent className="px-3 py-5 data-[swipe-axis=x]:sm:[--drawer-content-width:70vw]">
        {/* Judul tetap ada untuk screen reader, tapi tidak ditampilkan */}
        <DrawerTitle className="sr-only">Filter transaksi</DrawerTitle>

        <div className="relative flex min-h-0 flex-1 flex-col">
          {/* Body: 3 section sejajar di layar lebar, bertumpuk di mobile */}
          <div
            ref={setBodyElement}
            className="scroll-fade grid min-h-0 flex-1 grid-cols-1 gap-6 overflow-y-auto px-4 pb-10 md:grid-cols-3 md:gap-8 md:pb-0"
          >
            <FilterSection
              id="trx-filter-category"
              title="Kategori"
              searchPlaceholder="Cari kategori"
              options={categoryOptions}
              value={draft.categoryId ?? ALL_CATEGORIES}
              onChange={handleCategoryChange}
            >
              {isLoading && <p className="text-xs text-muted-foreground">Memuat kategori…</p>}
              {error && (
                <p className="text-xs text-destructive">
                  Gagal memuat kategori.{" "}
                  <button type="button" onClick={reload} className="underline">
                    Coba Lagi
                  </button>
                </p>
              )}
            </FilterSection>

            <FilterSection
              id="trx-filter-type"
              title="Type transaksi"
              searchPlaceholder="Cari type"
              options={TYPE_OPTIONS}
              value={draft.type}
              onChange={handleTypeChange}
            />

            <FilterSection
              id="trx-filter-date"
              title="Tanggal"
              searchPlaceholder="Cari rentang tanggal"
              options={DATE_OPTIONS}
              value={draft.dateRange.preset}
              onChange={handleDatePresetChange}
            >
              {draft.dateRange.preset === "custom" && (
                <CustomDateRange
                  startDate={draft.dateRange.startDate}
                  endDate={draft.dateRange.endDate}
                  onChange={handleCustomDateChange}
                />
              )}
            </FilterSection>
          </div>

          {/* Tanda scroll khusus mobile; hilang saat sudah sampai bawah */}
          {hasMoreBelow && (
            <button
              type="button"
              onClick={() => bodyElement?.scrollBy({ top: bodyElement.clientHeight * 0.8, behavior: "smooth" })}
              className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-[#6359E9] px-3 py-1 text-xs font-medium text-white shadow-md md:hidden mb-4"
            >
              Geser ke bawah
              <ChevronDownIcon className="size-4 animate-bounce" aria-hidden />
            </button>
          )}
        </div>

        <DrawerFooter className="flex-row justify-end gap-2">
          {/* mr-auto mendorong Reset ke kiri, Cancel & Apply tetap di kanan */}
          <Button
            variant="ghost"
            onClick={() => setDraft(DEFAULT_TRANSACTION_LIST_FILTER)}
            className="mr-auto"
          >
            Reset
          </Button>
          <DrawerClose render={<Button variant="outline">Batal</Button>} />
          <Button
            onClick={handleApply}
            disabled={!isDateFilterComplete(draft.dateRange)}
            className="bg-[#6359E9] text-white hover:bg-[#6359E9]/90"
          >
            Terapkan
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
