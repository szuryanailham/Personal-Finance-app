"use client"

import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import createTransactionIcon from "@/components/images/icons/icon-create-transaction.svg"
import { CategoryManagerContent } from "./category-manager-content"
import { useCategoryManager } from "./use-category-manager"

interface AddCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Dialog kelola kategori: form tambah/edit di atas, tabel daftar kategori di bawah
export function AddCategoryDialog({ open, onOpenChange }: AddCategoryDialogProps) {
  const manager = useCategoryManager(open)

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) manager.reset()
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl p-6">
        <div className="flex flex-col gap-4">
          <DialogHeader>
            <div className="mb-2">
              <Image src={createTransactionIcon} alt="" width={52} height={53} />
            </div>
            <DialogTitle>{manager.editing ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
            <DialogDescription>Kelola kategori untuk transaksi Anda</DialogDescription>
          </DialogHeader>

          <CategoryManagerContent manager={manager} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
