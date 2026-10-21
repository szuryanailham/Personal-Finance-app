"use client"

import * as React from "react"
import { Download } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { ExportForm } from "@/components/export/export-form"
import { ExportSubmitButton } from "@/components/export/export-submit-button"
import { useExportTransactions, type ExportOptions } from "@/components/export/use-export-transactions"
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

interface ExportDrawerProps {
  triggerClassName?: string
  /** Override aksi export; default: unduh file dari endpoint export backend */
  onExport?: (options: ExportOptions) => void
}

export function ExportDrawer({ triggerClassName, onExport }: ExportDrawerProps) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const exportState = useExportTransactions({ onExport, onExported: () => handleOpenChange(false) })

  // Drawer ditutup → pilihan direset supaya tidak terbawa ke pembukaan berikutnya
  function handleOpenChange(nextOpen: boolean) {
    if (exportState.isExporting) return
    setOpen(nextOpen)
    if (!nextOpen) exportState.reset()
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

        <ExportForm state={exportState} className="flex-1 overflow-y-auto p-4 py-5 scroll-fade" />

        <DrawerFooter className="flex-row gap-3">
          <DrawerClose render={<Button variant="outline" className="h-[34px] flex-1 border-[#8C89B4]">Tutup</Button>} />
          <ExportSubmitButton state={exportState} className="h-[34px] flex-1" />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
