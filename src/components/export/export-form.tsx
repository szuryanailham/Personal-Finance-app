"use client"

import * as React from "react"
import { AlertCircleIcon, CalendarRange, FileSpreadsheet, FileText } from "lucide-react"

import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoSection } from "@/components/header/info-section"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type {
  ExportFormat,
  ExportRange,
  ExportTransactionsState,
} from "@/components/export/use-export-transactions"

const FORMAT_OPTIONS: { value: ExportFormat; label: string; description: string; icon: typeof FileText }[] = [
  { value: "xlsx", label: "Excel", description: "Spreadsheet .xlsx", icon: FileSpreadsheet },
  // Sementara hanya xlsx yang tersedia; aktifkan kembali saat export CSV sudah didukung
  // { value: "csv", label: "CSV", description: ".csv plain text", icon: FileText },
]

const RANGE_OPTIONS: { value: ExportRange; label: string; description: string }[] = [
  { value: "all", label: "Semua transaksi", description: "Semua transaksi yang pernah kamu catat" },
  { value: "yearly", label: "Tahunan", description: "Transaksi tahun ini" },
  { value: "monthly", label: "Bulanan", description: "Transaksi bulan ini" },
  { value: "weekly", label: "Mingguan", description: "Transaksi minggu ini" },
  { value: "custom", label: "Atur Sendiri", description: "Pilih rentang tanggal sendiri" },
]

const SELECT_TRIGGER_CLASS = "mt-2 h-11 w-full border-[#8C89B4] px-3"

type FormatOptionItem = (typeof FORMAT_OPTIONS)[number]

function FormatOption({ option: { label, description, icon: Icon } }: { option: FormatOptionItem }) {
  return (
    <>
      <Icon className="size-4 text-[#6359E9]" />
      <span>{label}</span>
      <span className="truncate text-xs text-muted-foreground">{description}</span>
    </>
  )
}

interface ExportFormProps {
  state: ExportTransactionsState
  className?: string
}

// Isi form export (format, rentang, tanggal, error) tanpa tombol aksi,
// supaya bisa dibungkus drawer maupun halaman penuh.
export function ExportForm({ state, className }: ExportFormProps) {
  // id unik: drawer desktop dan halaman mobile bisa ter-mount bersamaan
  const idPrefix = React.useId()
  const startDateId = `${idPrefix}-start-date`
  const endDateId = `${idPrefix}-end-date`
  const {
    format,
    range,
    startDate,
    endDate,
    isCustom,
    isRangeInvalid,
    exportError,
    setFormat,
    setRange,
    setStartDate,
    setEndDate,
  } = state

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* 1. Format file */}
      <InfoSection
        step={1}
        icon={FileSpreadsheet}
        title="Pilih format file"
        subtitle="Pilih jenis file yang ingin kamu pakai untuk export."
      >
        <Select
          value={format}
          onValueChange={(value) => value !== null && setFormat(value as ExportFormat)}
        >
          <SelectTrigger aria-label="Format file" className={SELECT_TRIGGER_CLASS}>
            <SelectValue>
              {(value: ExportFormat) => {
                const selected = FORMAT_OPTIONS.find((option) => option.value === value)
                return selected ? <FormatOption option={selected} /> : null
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {FORMAT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value} className="py-2">
                <FormatOption option={option} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </InfoSection>

      {/* 2. Rentang transaksi */}
      <InfoSection
        step={2}
        icon={CalendarRange}
        title="Pilih rentang transaksi"
        subtitle="Pilih transaksi mana yang ingin kamu export."
      >
        <Select
          value={range}
          onValueChange={(value) => value !== null && setRange(value as ExportRange)}
        >
          <SelectTrigger aria-label="Rentang transaksi" className={SELECT_TRIGGER_CLASS}>
            <SelectValue>
              {(value: ExportRange) =>
                RANGE_OPTIONS.find((option) => option.value === value)?.label ?? null
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {RANGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value} className="py-2">
                <span className="flex flex-col">
                  <span>{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isCustom && (
          // Layar sempit: tanggal ditumpuk; cukup lebar: berdampingan
          <div className="mt-3 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={startDateId}>Tanggal mulai</FieldLabel>
              <Input
                id={startDateId}
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={endDateId}>Tanggal akhir</FieldLabel>
              <Input
                id={endDateId}
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
                <AlertTitle>Rentang tanggal tidak valid</AlertTitle>
                <AlertDescription>Tanggal akhir harus sama atau setelah tanggal mulai.</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </InfoSection>

      {exportError && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Export gagal</AlertTitle>
          <AlertDescription>{exportError}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
