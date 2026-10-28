"use client"

import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { ExportTransactionsState } from "@/components/export/use-export-transactions"

interface ExportSubmitButtonProps {
  state: ExportTransactionsState
  className?: string
}

export function ExportSubmitButton({ state, className }: ExportSubmitButtonProps) {
  return (
    <Button
      onClick={state.exportFile}
      disabled={state.isExportDisabled}
      className={cn("bg-[#14864A] text-white hover:bg-[#10733e]", className)}
    >
      {state.isExporting && <Loader2 data-icon="inline-start" className="animate-spin" />}
      {state.isExporting ? "Mengexport..." : "Export"}
    </Button>
  )
}
