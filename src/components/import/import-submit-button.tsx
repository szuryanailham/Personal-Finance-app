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
      className={cn("bg-[#14864A] text-white hover:bg-[#10733e]", className)}
    >
      {state.isUploading && <Loader2 data-icon="inline-start" className="animate-spin" />}
      {state.isUploading ? "Mengupload..." : "Upload File"}
    </Button>
  )
}
