"use client"

import * as React from "react"
import Image from "next/image"
import { AlertCircleIcon } from "lucide-react"

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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Spinner } from "@/components/ui/spinner"
import type { FilterPeriod, TransactionFilter } from "@/components/header/transaction-filter-context"

const FILTER_OPTIONS: { value: FilterPeriod; label: string; description: string }[] = [
  { value: "yearly", label: "Yearly", description: "Transactions this year" },
  { value: "monthly", label: "Monthly", description: "Transactions this month" },
  { value: "weekly", label: "Weekly", description: "Transactions this week" },
  { value: "custom", label: "Custom", description: "Pick your own date range" },
]

interface FilterDrawerProps {
  value: TransactionFilter
  onApply: (filter: TransactionFilter) => void
  isLoading?: boolean
}

export function FilterDrawer({ value, onApply, isLoading = false }: FilterDrawerProps) {
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
          <Button variant="ghost" size="icon-lg" aria-label="Filter" aria-busy={isLoading}>
            {isLoading ? (
              <Spinner className="size-6" />
            ) : (
              <Image src={filterIcon} alt="" width={24} height={24} />
            )}
          </Button>
        }
      />
      <DrawerContent className="py-5 px-3">
        <DrawerHeader>
        <DrawerTitle>Filter Summary & Transactions</DrawerTitle>
        <DrawerDescription>
          Select filters to customize your financial data.
        </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 scroll-fade overflow-y-auto p-4 py-5">
          <RadioGroup
            value={period}
            onValueChange={(value) => setPeriod(value as FilterPeriod)}
            className="gap-2"
          >
            {FILTER_OPTIONS.map((option) => {
              const id = `filter-${option.value}`
              return (
                <FieldLabel
                  key={option.value}
                  htmlFor={id}
                  className="border-[#8C89B4]"
                >
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>{option.label}</FieldTitle>
                      <FieldDescription>{option.description}</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem
                      value={option.value}
                      id={id}
                      className="data-checked:border-[#6359E9] data-checked:bg-[#6359E9] dark:data-checked:bg-[#6359E9] group-has-[:focus-visible]/field-label:data-checked:border-[#6359E9]"
                    />
                  </Field>
                </FieldLabel>
              )
            })}
          </RadioGroup>

          {isCustom && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="filter-start-date">Start date</FieldLabel>
                <Input
                  id="filter-start-date"
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(event) => setStartDate(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="filter-end-date">End date</FieldLabel>
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
                <Alert variant="destructive" className="col-span-2">
                  <AlertCircleIcon />
                  <AlertTitle>Invalid date range</AlertTitle>
                  <AlertDescription>End date must be on or after start date.</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
        <DrawerFooter className="flex-row gap-3">
          <DrawerClose render={<Button variant="outline" className="h-[34px] flex-1 border-[#8C89B4]">Cancel</Button>} />
          <Button onClick={handleApply} disabled={isApplyDisabled}
            className="h-[34px] flex-1 bg-[#6359E9] text-white hover:bg-[#6359E9]/90">
            Apply Filter
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
