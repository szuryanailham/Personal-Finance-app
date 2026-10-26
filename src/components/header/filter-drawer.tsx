"use client"

import * as React from "react"
import Image from "next/image"
import {
  AlertCircleIcon,
  CalendarDaysIcon,
  CalendarRangeIcon,
  CalendarIcon,
  SlidersHorizontalIcon,
  type LucideIcon,
} from "lucide-react"

import filterIcon from "@/components/images/icons/filter-horizontal.svg"
import { useIsMobile } from "@/hooks/use-mobile"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Spinner } from "@/components/ui/spinner"
import type { FilterPeriod, TransactionFilter } from "@/components/header/transaction-filter-context"

type FilterDrawerVariant = "default" | "mobile"

interface FilterOption {
  value: FilterPeriod
  label: string
  description: string
}

interface FilterCopy {
  title: string
  description?: string
  options: FilterOption[]
  startDate: string
  endDate: string
  invalidRangeTitle: string
  invalidRangeDescription: string
  cancel: string
  apply: string
}

const FILTER_ICONS: Record<FilterPeriod, LucideIcon> = {
  yearly: CalendarRangeIcon,
  monthly: CalendarDaysIcon,
  weekly: CalendarIcon,
  custom: SlidersHorizontalIcon,
}

const FILTER_COPY: Record<FilterDrawerVariant, FilterCopy> = {
  default: {
    title: "Filter Ringkasan & Transaksi",
    description: "Pilih filter untuk menyesuaikan data keuanganmu.",
    options: [
      { value: "yearly", label: "Tahunan", description: "Transaksi tahun ini" },
      { value: "monthly", label: "Bulanan", description: "Transaksi bulan ini" },
      { value: "weekly", label: "Mingguan", description: "Transaksi minggu ini" },
      { value: "custom", label: "Atur Sendiri", description: "Pilih rentang tanggal sendiri" },
    ],
    startDate: "Tanggal mulai",
    endDate: "Tanggal akhir",
    invalidRangeTitle: "Rentang tanggal tidak valid",
    invalidRangeDescription: "Tanggal akhir harus sama atau setelah tanggal mulai.",
    cancel: "Batal",
    apply: "Terapkan Filter",
  },
  mobile: {
    title: "Filter Ringkasan & Transaksi",
    options: [
      { value: "yearly", label: "Tahunan", description: "Transaksi tahun ini" },
      { value: "monthly", label: "Bulanan", description: "Transaksi bulan ini" },
      { value: "weekly", label: "Mingguan", description: "Transaksi minggu ini" },
      { value: "custom", label: "Atur Sendiri", description: "Pilih rentang tanggal sendiri" },
    ],
    startDate: "Tanggal mulai",
    endDate: "Tanggal akhir",
    invalidRangeTitle: "Rentang tanggal tidak valid",
    invalidRangeDescription: "Tanggal akhir harus sama atau setelah tanggal mulai.",
    cancel: "Batal",
    apply: "Terapkan",
  },
}

interface FilterDrawerProps {
  value: TransactionFilter
  onApply: (filter: TransactionFilter) => void
  isLoading?: boolean
  // Tombol pemicu kustom (mis. di header mobile); default memakai tombol ikon filter
  trigger?: React.ReactElement
  // "mobile": teks bahasa Indonesia, ikon per opsi, tanpa deskripsi drawer
  variant?: FilterDrawerVariant
}

export function FilterDrawer({
  value,
  onApply,
  isLoading = false,
  trigger,
  variant = "default",
}: FilterDrawerProps) {
  const copy = FILTER_COPY[variant]
  const showIcons = variant === "mobile"
  const [open, setOpen] = React.useState(false)
  const [period, setPeriod] = React.useState<FilterPeriod>(value.period)
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const isMobile = useIsMobile()

  // Setiap drawer dibuka, form diisi ulang dari filter yang sedang aktif (pilihan yang di-cancel dibuang)
  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setPeriod(value.period)
      setStartDate(value.period === "custom" ? value.startDate : "")
      setEndDate(value.period === "custom" ? value.endDate : "")
    }
    setOpen(nextOpen)
  }

  const isCustom = period === "custom"
  const isRangeInvalid = Boolean(startDate && endDate && startDate > endDate)
  const isApplyDisabled = isCustom && (!startDate || !endDate || isRangeInvalid)

  function handleApply() {
    if (isApplyDisabled) return
    setOpen(false)
    onApply(isCustom ? { period, startDate, endDate } : { period })
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
          trigger ?? (
            <Button variant="ghost" size="icon-lg" aria-label="Filter" aria-busy={isLoading}>
              {isLoading ? (
                <Spinner className="size-6" />
              ) : (
                <Image src={filterIcon} alt="" width={24} height={24} />
              )}
            </Button>
          )
        }
      />
      <DrawerContent className="py-5 px-3">
        <DrawerHeader>
          <DrawerTitle>{copy.title}</DrawerTitle>
          {copy.description && <DrawerDescription>{copy.description}</DrawerDescription>}
        </DrawerHeader>
        <div className="flex-1 scroll-fade overflow-y-auto p-4 py-5">
          <RadioGroup
            value={period}
            onValueChange={(value) => setPeriod(value as FilterPeriod)}
            className="gap-1"
          >
            {copy.options.map((option) => {
              const id = `filter-${option.value}`
              const OptionIcon = FILTER_ICONS[option.value]
              // Baris opsi polos (tanpa kotak/border), cukup highlight saat hover
              return (
                <label
                  key={option.value}
                  htmlFor={id}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2.5 hover:bg-muted/50"
                >
                  {showIcons && (
                    <OptionIcon className="size-5 shrink-0 text-[#6359E9]" aria-hidden />
                  )}
                  <span className="flex flex-1 flex-col">
                    <span className="text-sm font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  </span>
                  <RadioGroupItem
                    value={option.value}
                    id={id}
                    className="data-checked:border-[#6359E9] data-checked:bg-[#6359E9] dark:data-checked:bg-[#6359E9]"
                  />
                </label>
              )
            })}
          </RadioGroup>

          {isCustom && (
            // Mobile: tanggal ditumpuk vertikal; desktop: berdampingan
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="filter-start-date">{copy.startDate}</FieldLabel>
                <Input
                  id="filter-start-date"
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(event) => setStartDate(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="filter-end-date">{copy.endDate}</FieldLabel>
                <Input
                  id="filter-end-date"
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  aria-invalid={isRangeInvalid}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </Field>
              {isRangeInvalid && (
                <Alert variant="destructive" className="col-span-full">
                  <AlertCircleIcon />
                  <AlertTitle>{copy.invalidRangeTitle}</AlertTitle>
                  <AlertDescription>{copy.invalidRangeDescription}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
        <DrawerFooter className="flex-row gap-3">
          <DrawerClose render={<Button variant="outline" className="h-[34px] flex-1 border-[#8C89B4]">{copy.cancel}</Button>} />
          <Button onClick={handleApply} disabled={isApplyDisabled}
            className="h-[34px] flex-1 bg-[#6359E9] text-white hover:bg-[#6359E9]/90">
            {copy.apply}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
