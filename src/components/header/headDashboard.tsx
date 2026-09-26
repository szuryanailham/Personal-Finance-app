"use client"

import { Download, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ACCENT_OUTLINE_CLASS } from "@/lib/styles"

const ACTION_BUTTON_CLASS = `min-w-28 px-5 ${ACCENT_OUTLINE_CLASS}`

interface HeadDashboardProps {
  title: string
  onImport?: () => void
  onExport?: () => void
}

export function HeadDashboard({ title, onImport, onExport }: HeadDashboardProps) {
  return (
    <header className="flex w-full items-center justify-between gap-4 px-7 py-6">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>

      <div className="flex items-center gap-2">
        <Button className={ACTION_BUTTON_CLASS} variant="outline" size="lg" onClick={onImport}>
          <Upload data-icon="inline-start" />
          Import
        </Button>
        <Button className={ACTION_BUTTON_CLASS} variant="outline" size="lg" onClick={onExport}>
          <Download data-icon="inline-start" />
          Export
        </Button>
      </div>
    </header>
  )
}
