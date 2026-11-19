"use client"

import type { ReactElement } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import createTransactionIcon from "@/components/images/icons/icon-create-transaction.svg"
import { CategoryManagerContent } from "./category-manager-content"
import { useCategoryManager } from "./use-category-manager"

interface AddCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger?: ReactElement
  closeOnSuccess?: boolean
}

// Modal form kategori tanpa tabel daftar kategori.
export function AddCategoryDialog({ open, onOpenChange, trigger, closeOnSuccess }: AddCategoryDialogProps) {
  const manager = useCategoryManager(open)

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) manager.reset()
    onOpenChange(nextOpen)
  }

  const handleSubmit: typeof manager.handleSubmit = async (input) => {
    const saved = await manager.handleSubmit(input)
    if (saved && closeOnSuccess) handleOpenChange(false)
    return saved
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl p-6">
        <div className="flex flex-col gap-4">
          <DialogHeader>
            <div className="mb-2">
              <Image src={createTransactionIcon} alt="" width={52} height={53} />
            </div>
            <DialogTitle>{manager.editing ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
            <DialogDescription>Kelola kategori untuk transaksi kamu</DialogDescription>
          </DialogHeader>

          <CategoryManagerContent manager={{ ...manager, handleSubmit }} showTable={false} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
