"use client"

import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { ImportFileState } from "@/components/import/use-import-file"

interface ImportSubmitButtonProps {
  state: ImportFileState
  className?: string
}

export function ImportSubmitButton({ state, className }: ImportSubmitButtonProps) {
  return (
    <Button
      onClick={state.importFile}
      disabled={!state.file || state.isUploading}
      className={cn("bg-[#6359E9] text-white hover:bg-[#6359E9]/90", className)}
    >
      {state.isUploading && <Loader2 data-icon="inline-start" className="animate-spin" />}
      {state.isUploading ? "Mengimpor..." : "Import"}
    </Button>
  )
}
