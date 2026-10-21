"use client"

import * as React from "react"

import { exportTransactions, type ExportPeriod } from "@/lib/api/transaction"
import { saveBlob } from "@/lib/download"

export type ExportFormat = "xlsx" | "csv"
export type ExportRange = ExportPeriod

export type ExportOptions =
  | { format: ExportFormat; range: Exclude<ExportRange, "custom"> }
  | { format: ExportFormat; range: "custom"; startDate: string; endDate: string }

const DEFAULT_FORMAT: ExportFormat = "xlsx"
const DEFAULT_RANGE: ExportRange = "all"
// Dipakai jika backend tidak mengirim nama file lewat Content-Disposition
const FALLBACK_EXPORT_FILE_NAME = "transactions.xlsx"

interface UseExportTransactionsOptions {
  /** Override aksi export; default: unduh file dari endpoint export backend */
  onExport?: (options: ExportOptions) => void
  /** Dipanggil setelah export berhasil (atau setelah onExport dipanggil) */
  onExported?: () => void
}

// State & aksi export transaksi (format, rentang, unduh) yang dipakai
// bersama oleh drawer export (desktop) dan halaman export (mobile).
export function useExportTransactions({ onExport, onExported }: UseExportTransactionsOptions = {}) {
  const [format, setFormat] = React.useState<ExportFormat>(DEFAULT_FORMAT)
  const [range, setRange] = React.useState<ExportRange>(DEFAULT_RANGE)
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [isExporting, setIsExporting] = React.useState(false)
  const [exportError, setExportError] = React.useState<string | null>(null)

  const isCustom = range === "custom"
  const isRangeInvalid = Boolean(startDate && endDate && startDate > endDate)
  const isExportDisabled = isExporting || (isCustom && (!startDate || !endDate || isRangeInvalid))

  function reset() {
    setFormat(DEFAULT_FORMAT)
    setRange(DEFAULT_RANGE)
    setStartDate("")
    setEndDate("")
    setExportError(null)
  }

  async function exportFile() {
    if (isExportDisabled) return
    const options: ExportOptions =
      range === "custom" ? { format, range, startDate, endDate } : { format, range }

    if (onExport) {
      onExport(options)
      onExported?.()
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
    } catch (err) {
      setExportError(err instanceof Error ? err.message : "Gagal mengekspor transaksi")
      return
    } finally {
      setIsExporting(false)
    }

    onExported?.()
  }

  return {
    format,
    range,
    startDate,
    endDate,
    isCustom,
    isRangeInvalid,
    isExporting,
    isExportDisabled,
    exportError,
    setFormat,
    setRange,
    setStartDate,
    setEndDate,
    reset,
    exportFile,
  }
}

export type ExportTransactionsState = ReturnType<typeof useExportTransactions>
