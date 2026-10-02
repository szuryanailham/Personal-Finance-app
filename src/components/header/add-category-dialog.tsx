"use client"

import { useState } from "react"
import Image from "next/image"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import createTransactionIcon from "@/components/images/icons/icon-create-transaction.svg"
import { useCategories } from "@/hooks/use-categories"
import {
  createCategory,
  deleteCategory,
  updateCategory,
  type Category,
  type CategoryInput,
} from "@/lib/api/category"
import { CategoryForm } from "./category-form"
import { CategoryTable } from "./category-table"

interface AddCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function toErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Terjadi kesalahan"
}

// Dialog kelola kategori: form tambah/edit di atas, tabel daftar kategori di bawah
export function AddCategoryDialog({ open, onOpenChange }: AddCategoryDialogProps) {
  const { categories, isLoading, error: loadError, reload } = useCategories(open)
  const [editing, setEditing] = useState<Category | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setEditing(null)
      setActionError(null)
    }
    onOpenChange(nextOpen)
  }

  // Mengembalikan true bila berhasil, agar pemanggil tahu kapan boleh reset form
  async function runAction(action: () => Promise<void>): Promise<boolean> {
    setActionError(null)
    try {
      await action()
      reload()
      return true
    } catch (err: unknown) {
      setActionError(toErrorMessage(err))
      return false
    }
  }

  function handleSubmit(input: CategoryInput) {
    return runAction(async () => {
      if (editing) {
        await updateCategory(editing.id, input)
        setEditing(null)
      } else {
        await createCategory(input)
      }
    })
  }

  async function handleDelete(category: Category) {
    await runAction(async () => {
      await deleteCategory(category.id)
      if (editing?.id === category.id) setEditing(null)
    })
  }

  const error = actionError ?? loadError

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl p-6">
        <div className="flex flex-col gap-4">
          <DialogHeader>
            <div className="mb-2">
              <Image src={createTransactionIcon} alt="" width={52} height={53} />
            </div>
            <DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogDescription>Manage Categories for Your Transactions</DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <CategoryForm editing={editing} onSubmit={handleSubmit} onCancelEdit={() => setEditing(null)} />

          <CategoryTable
            categories={categories}
            isLoading={isLoading}
            editingId={editing?.id ?? null}
            onEdit={setEditing}
            onDelete={handleDelete}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
