"use client"

import * as React from "react"
import Image from "next/image"

import filterIcon from "@/components/images/icons/filter-horizontal.svg"
import { FilterSection, type FilterSectionOption } from "@/components/header/filter-section"
import { CustomDateRange } from "@/components/header/transaction-filter-drawer"
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
import { useIsMobile } from "@/hooks/use-mobile"
import {
  DEFAULT_CATEGORY_STATISTIC_QUERY,
  type CategoryStatPeriod,
  type CategoryStatisticQuery,
} from "@/lib/api/category"

const PERIOD_OPTIONS: FilterSectionOption[] = [
  { value: "today", label: "Today", description: "Expenses from today" },
  { value: "weekly", label: "This week", description: "Monday to Sunday" },
  { value: "monthly", label: "This month", description: "From the 1st to the end of month" },
  { value: "yearly", label: "This year", description: "January to December" },
  { value: "custom", label: "Custom range", description: "Pick a start and end date" },
]

function isQueryComplete(query: CategoryStatisticQuery): boolean {
  if (query.period !== "custom") return true
  return Boolean(query.startDate && query.endDate && query.startDate <= query.endDate)
}

interface CategoryStatisticFilterDrawerProps {
  value: CategoryStatisticQuery
  onApply: (query: CategoryStatisticQuery) => void
}

export function CategoryStatisticFilterDrawer({ value, onApply }: CategoryStatisticFilterDrawerProps) {
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<CategoryStatisticQuery>(value)
  const isMobile = useIsMobile()
  const isActive = value.period !== DEFAULT_CATEGORY_STATISTIC_QUERY.period

  // Setiap drawer dibuka, form diisi ulang dari filter aktif (pilihan yang di-cancel dibuang)
  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) setDraft(value)
    setOpen(nextOpen)
  }

  function handleApply() {
    setOpen(false)
    onApply(draft)
  }

  function handlePeriodChange(next: string) {
    const period = next as CategoryStatPeriod
    setDraft((prev) => {
      if (period !== "custom") return { period }
      // Tanggal custom yang sudah diisi tetap dipertahankan
      return prev.period === "custom" ? prev : { period: "custom", startDate: "", endDate: "" }
    })
  }

  function handleCustomDateChange(field: "startDate" | "endDate", date: string) {
    setDraft((prev) => (prev.period === "custom" ? { ...prev, [field]: date } : prev))
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
          <Button variant="ghost" size="icon-lg" aria-label="Filter period" className="relative">
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
      <DrawerContent className="px-3 py-5 data-[swipe-axis=x]:sm:[--drawer-content-width:28rem]">
        <DrawerHeader>
          <DrawerTitle>Filter period</DrawerTitle>
          <DrawerDescription>Choose the period for expense by category.</DrawerDescription>
        </DrawerHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          <FilterSection
            id="category-stat-period"
            title="Period"
            options={PERIOD_OPTIONS}
            value={draft.period}
            onChange={handlePeriodChange}
          >
            {draft.period === "custom" && (
              <CustomDateRange
                idPrefix="category-stat"
                startDate={draft.startDate}
                endDate={draft.endDate}
                onChange={handleCustomDateChange}
              />
            )}
          </FilterSection>
        </div>

        <DrawerFooter className="flex-row justify-end gap-2">
          {/* mr-auto mendorong Reset ke kiri, Cancel & Apply tetap di kanan */}
          <Button
            variant="ghost"
            onClick={() => setDraft(DEFAULT_CATEGORY_STATISTIC_QUERY)}
            className="mr-auto"
          >
            Reset
          </Button>
          <DrawerClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            onClick={handleApply}
            disabled={!isQueryComplete(draft)}
            className="bg-[#6359E9] text-white hover:bg-[#6359E9]/90"
          >
            Apply
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
