"use client"

import { usePathname } from "next/navigation"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FilterDrawer } from "@/components/header/filter-drawer"
import { ImportDrawer } from "@/components/header/import-drawer"
import { useTransactionFilter } from "@/components/header/transaction-filter-context"
import { ACCENT_OUTLINE_CLASS } from "@/lib/styles"

const ACTION_BUTTON_CLASS = `min-w-28 px-5 ${ACCENT_OUTLINE_CLASS}`
const DASHBOARD_PATH = "/dashboard"

interface HeadDashboardProps {
  title: string
  onExport?: () => void
}

export function HeadDashboard({ title, onExport }: HeadDashboardProps) {
  const isDashboard = usePathname() === DASHBOARD_PATH
  const { filter, setFilter, isFilterLoading } = useTransactionFilter()
  return (
    <header className="flex w-full items-center justify-between gap-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>

      <div className="flex items-center gap-4">
        {isDashboard && <FilterDrawer value={filter} onApply={setFilter} isLoading={isFilterLoading} />}
        <ImportDrawer triggerClassName={ACTION_BUTTON_CLASS} />
        <Button className={ACTION_BUTTON_CLASS} variant="outline" size="lg" onClick={onExport}>
          <Download data-icon="inline-start" />
          Export
        </Button>
      </div>
    </header>
  )
}
