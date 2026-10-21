"use client"

import { useState } from "react"
import { useCategories } from "@/hooks/use-categories"
import {
  createCategory,
  deleteCategory,
  updateCategory,
  type Category,
  type CategoryInput,
} from "@/lib/api/category"
import { useTransactionRevision } from "./transaction-revision-context"

export interface CategoryManager {
  categories: Category[]
  isLoading: boolean
  error: string | null
  editing: Category | null
  setEditing: (category: Category | null) => void
  handleSubmit: (input: CategoryInput) => Promise<boolean>
  handleDelete: (category: Category) => Promise<void>
  reset: () => void
}

function toErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Terjadi kesalahan"
}

// State & aksi kelola kategori; dipakai bersama oleh dialog (desktop) dan halaman /category (mobile)
export function useCategoryManager(enabled: boolean): CategoryManager {
  const { categories, isLoading, error: loadError, reload } = useCategories(enabled)
  const { notifyTransactionsChanged } = useTransactionRevision()
  const [editing, setEditing] = useState<Category | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  // Mengembalikan true bila berhasil, agar pemanggil tahu kapan boleh reset form
  async function runAction(action: () => Promise<void>): Promise<boolean> {
    setActionError(null)
    try {
      await action()
      reload()
      // Nama/tipe kategori ikut tampil di tabel, stat, dan pie diagram, jadi semuanya perlu fetch ulang
      notifyTransactionsChanged()
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

  function reset() {
    setEditing(null)
    setActionError(null)
  }

  return {
    categories,
    isLoading,
    error: actionError ?? loadError,
    editing,
    setEditing,
    handleSubmit,
    handleDelete,
    reset,
  }
}
