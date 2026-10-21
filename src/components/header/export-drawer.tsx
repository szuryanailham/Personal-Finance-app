"use client"

import * as React from "react"
import { AlertCircleIcon, CalendarRange, Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react"

import { exportTransactions, type ExportPeriod } from "@/lib/api/transaction"
import { saveBlob } from "@/lib/download"
import { useIsMobile } from "@/hooks/use-mobile"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { InfoSection } from "@/components/header/info-section"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type ExportFormat = "xlsx" | "csv"
export type ExportRange = ExportPeriod

export type ExportOptions =
  | { format: ExportFormat; range: Exclude<ExportRange, "custom"> }
  | { format: ExportFormat; range: "custom"; startDate: string; endDate: string }

const DEFAULT_FORMAT: ExportFormat = "xlsx"
const DEFAULT_RANGE: ExportRange = "all"
// Dipakai jika backend tidak mengirim nama file lewat Content-Disposition
const FALLBACK_EXPORT_FILE_NAME = "transactions.xlsx"

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
      <span className="text-xs text-muted-foreground">{description}</span>
    </>
  )
}

interface ExportDrawerProps {
  triggerClassName?: string
  /** Override aksi export; default: unduh file dari endpoint export backend */
  onExport?: (options: ExportOptions) => void
}

export function ExportDrawer({ triggerClassName, onExport }: ExportDrawerProps) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const [format, setFormat] = React.useState<ExportFormat>(DEFAULT_FORMAT)
  const [range, setRange] = React.useState<ExportRange>(DEFAULT_RANGE)
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [isExporting, setIsExporting] = React.useState(false)
  const [exportError, setExportError] = React.useState<string | null>(null)

  const isCustom = range === "custom"
  const isRangeInvalid = Boolean(startDate && endDate && startDate > endDate)
  const isExportDisabled = isExporting || (isCustom && (!startDate || !endDate || isRangeInvalid))

  // Drawer ditutup → pilihan direset supaya tidak terbawa ke pembukaan berikutnya
  function handleOpenChange(nextOpen: boolean) {
    if (isExporting) return
    setOpen(nextOpen)
    if (!nextOpen) {
      setFormat(DEFAULT_FORMAT)
      setRange(DEFAULT_RANGE)
      setStartDate("")
      setEndDate("")
      setExportError(null)
    }
  }

  async function handleExport() {
    if (isExportDisabled) return
    const options: ExportOptions =
      range === "custom" ? { format, range, startDate, endDate } : { format, range }

    if (onExport) {
      onExport(options)
      handleOpenChange(false)
      return
    }

    setIsExporting(true)
    setExportError(null)
    try {
      const { blob, fileName } = await exportTransactions(
        options.range === "custom"
          ? { period: "custom", startDate: options.startDate, endDate: options.endDate }
          : { period: options.range }
      )
      saveBlob(blob, fileName ?? FALLBACK_EXPORT_FILE_NAME)
      setIsExporting(false)
      handleOpenChange(false)
    } catch (err) {
      setExportError(err instanceof Error ? err.message : "Gagal mengekspor transaksi")
      setIsExporting(false)
    }
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
          <Button className={triggerClassName} variant="outline" size="lg">
            <Download data-icon="inline-start" />
            Export
          </Button>
        }
      />
      <DrawerContent className="py-5 px-3">
        <DrawerHeader>
          <DrawerTitle>Export Transaksi</DrawerTitle>
          <DrawerDescription>Unduh transaksimu sebagai file.</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 py-5 scroll-fade">
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
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="export-start-date">Tanggal mulai</FieldLabel>
                  <Input
                    id="export-start-date"
                    type="date"
                    value={startDate}
                    max={endDate || undefined}
                    onChange={(event) => setStartDate(event.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="export-end-date">Tanggal akhir</FieldLabel>
                  <Input
                    id="export-end-date"
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

        <DrawerFooter className="flex-row gap-3">
          <DrawerClose render={<Button variant="outline" className="h-[34px] flex-1 border-[#8C89B4]">Tutup</Button>} />
          <Button
            onClick={handleExport}
            disabled={isExportDisabled}
            className="h-[34px] flex-1 bg-[#6359E9] text-white hover:bg-[#6359E9]/90"
          >
            {isExporting && <Loader2 data-icon="inline-start" className="animate-spin" />}
            {isExporting ? "Mengexport..." : "Export"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
