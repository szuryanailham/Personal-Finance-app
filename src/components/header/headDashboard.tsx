"use client"

import { usePathname } from "next/navigation"
import { FilterDrawer } from "@/components/header/filter-drawer"
import { ImportDrawer } from "@/components/header/import-drawer"
import { ExportDrawer } from "@/components/header/export-drawer"
import { useTransactionFilter } from "@/components/header/transaction-filter-context"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ACCENT_OUTLINE_CLASS } from "@/lib/styles"

const ACTION_BUTTON_CLASS = `min-w-28 px-5 ${ACCENT_OUTLINE_CLASS}`
const DASHBOARD_PATH = "/dashboard"

interface HeadDashboardProps {
  title: string
}

export function HeadDashboard({ title }: HeadDashboardProps) {
  const isDashboard = usePathname() === DASHBOARD_PATH
  const { filter, setFilter, isFilterLoading } = useTransactionFilter()
  return (
    <header className="flex w-full items-center justify-between gap-4 py-10">
      <div className="flex items-center gap-2">
        {/* Sidebar menjadi Sheet di bawah breakpoint md, jadi butuh tombol pemicu */}
        <SidebarTrigger className="md:hidden" aria-label="Buka sidebar" />
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {isDashboard && <FilterDrawer value={filter} onApply={setFilter} isLoading={isFilterLoading} />}
        {/* Import/Export hanya tersedia di layar md ke atas */}
        <div className="hidden items-center gap-4 md:flex">
          <ImportDrawer triggerClassName={ACTION_BUTTON_CLASS} />
          <ExportDrawer triggerClassName={ACTION_BUTTON_CLASS} />
        </div>
      </div>
    </header>
  )
}
