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
      className={cn("bg-[#6359E9] text-white hover:bg-[#6359E9]/90", className)}
    >
      {state.isExporting && <Loader2 data-icon="inline-start" className="animate-spin" />}
      {state.isExporting ? "Mengexport..." : "Export"}
    </Button>
  )
}
