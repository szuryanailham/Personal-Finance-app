"use client"

import * as React from "react"
import Image from "next/image"

import filterIcon from "@/components/images/icons/filter-horizontal.svg"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
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
  { value: "all", label: "All", description: "Show every transaction" },
  { value: "income", label: "Income", description: "Only income transactions" },
  { value: "expense", label: "Expense", description: "Only expense transactions" },
  { value: "saving", label: "Saving", description: "Only saving transactions" },
]

const SORT_OPTIONS: FilterOption<TransactionSortValue>[] = [
  { value: "date", label: "Newest", description: "Latest date first" },
  { value: "-date", label: "Oldest", description: "Earliest date first" },
  { value: "amount", label: "Highest amount", description: "Largest amount first" },
  { value: "-amount", label: "Lowest amount", description: "Smallest amount first" },
  { value: "name", label: "Name A–Z", description: "Alphabetical by name" },
  { value: "-name", label: "Name Z–A", description: "Reverse alphabetical by name" },
]

const DATE_OPTIONS: FilterOption<TransactionDateFilter["preset"]>[] = [
  { value: "all", label: "Any time", description: "No date limit" },
  { value: "today", label: "Today", description: "Transactions from today" },
  { value: "last7", label: "Last 7 days", description: "Including today" },
  { value: "last14", label: "Last 14 days", description: "Including today" },
  { value: "custom", label: "Custom range", description: "Pick a start and end date" },
]

const ALL_CATEGORIES = "all"

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
  startDate: string
  endDate: string
  onChange: (field: "startDate" | "endDate", value: string) => void
}

function CustomDateRange({ startDate, endDate, onChange }: CustomDateRangeProps) {
  const isRangeInvalid = Boolean(startDate && endDate && startDate > endDate)

  return (
    <div className="grid grid-cols-2 gap-3">
      <Field>
        <FieldLabel htmlFor="trx-filter-start-date">Start date</FieldLabel>
        <Input
          id="trx-filter-start-date"
          type="date"
          value={startDate}
          max={endDate || undefined}
          onChange={(event) => onChange("startDate", event.target.value)}
          className="h-9"
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="trx-filter-end-date">End date</FieldLabel>
        <Input
          id="trx-filter-end-date"
          type="date"
          value={endDate}
          min={startDate || undefined}
          aria-invalid={isRangeInvalid}
          onChange={(event) => onChange("endDate", event.target.value)}
          className="h-9"
        />
      </Field>
      {isRangeInvalid && (
        <p className="col-span-2 text-xs text-destructive">End date must be on or after start date.</p>
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

  // Kategori mengikuti tipe terpilih supaya kombinasi tipe + kategori tidak pernah kosong
  const categoryOptions: FilterSectionOption[] = [
    { value: ALL_CATEGORIES, label: "All categories" },
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
          <Button variant="ghost" size="icon-lg" aria-label="Filter transactions" className="relative">
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
        <DrawerHeader>
          <DrawerTitle>Filter transactions</DrawerTitle>
          <DrawerDescription>Narrow the list by category, type, and date.</DrawerDescription>
        </DrawerHeader>

        {/* Body: 3 section sejajar di layar lebar, bertumpuk di mobile */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 md:gap-8 overflow-y-auto px-4 md:grid-cols-3">
          <FilterSection
            id="trx-filter-category"
            title="Category"
            searchPlaceholder="Search category"
            options={categoryOptions}
            value={draft.categoryId ?? ALL_CATEGORIES}
            onChange={handleCategoryChange}
          >
            {isLoading && <p className="text-xs text-muted-foreground">Loading categories…</p>}
            {error && (
              <p className="text-xs text-destructive">
                Failed to load categories.{" "}
                <button type="button" onClick={reload} className="underline">
                  Retry
                </button>
              </p>
            )}
          </FilterSection>

          <FilterSection
            id="trx-filter-type"
            title="Transaction type"
            searchPlaceholder="Search type"
            options={TYPE_OPTIONS}
            value={draft.type}
            onChange={handleTypeChange}
          />

          <FilterSection
            id="trx-filter-date"
            title="Date"
            searchPlaceholder="Search date range"
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

        <DrawerFooter className="flex-row justify-end gap-2">
          {/* mr-auto mendorong Reset ke kiri, Cancel & Apply tetap di kanan */}
          <Button
            variant="ghost"
            onClick={() => setDraft(DEFAULT_TRANSACTION_LIST_FILTER)}
            className="mr-auto"
          >
            Reset
          </Button>
          <DrawerClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            onClick={handleApply}
            disabled={!isDateFilterComplete(draft.dateRange)}
            className="bg-[#6359E9] text-white hover:bg-[#6359E9]/90"
          >
            Apply
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
