"use client"

import * as React from "react"
import { Upload } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { ImportForm } from "@/components/import/import-form"
import { ImportSubmitButton } from "@/components/import/import-submit-button"
import { useImportFile } from "@/components/import/use-import-file"
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

interface ImportDrawerProps {
  triggerClassName?: string
  /** Override aksi import; default: upload ke backend lalu buka halaman review */
  onImport?: (file: File) => void
}

export function ImportDrawer({ triggerClassName, onImport }: ImportDrawerProps) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const importState = useImportFile({ onImport, onImported: () => setOpen(false) })

  // Drawer ditutup → pilihan file dibuang supaya tidak terbawa ke pembukaan berikutnya
  function handleOpenChange(nextOpen: boolean) {
    if (importState.isUploading) return
    setOpen(nextOpen)
    if (!nextOpen) importState.reset()
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
            <Upload data-icon="inline-start" />
            Import
          </Button>
        }
      />
      <DrawerContent className="py-5 px-3">
        <DrawerHeader>
          <DrawerTitle>Import Transaksi</DrawerTitle>
          <DrawerDescription>Ikuti 3 langkah berikut untuk mengimpor transaksimu.</DrawerDescription>
        </DrawerHeader>

        <ImportForm
          state={importState}
          onNavigate={() => handleOpenChange(false)}
          className="flex-1 overflow-y-auto p-4 py-5 scroll-fade"
        />

        <DrawerFooter className="flex-row gap-3">
          <DrawerClose render={<Button variant="outline" className="h-[34px] flex-1 border-[#8C89B4]">Tutup</Button>} />
          <ImportSubmitButton state={importState} className="h-[34px] flex-1" />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
