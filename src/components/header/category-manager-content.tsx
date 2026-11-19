"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { CategoryForm } from "./category-form"
import { CategoryTable } from "./category-table"
import type { CategoryManager } from "./use-category-manager"

interface CategoryManagerContentProps {
  manager: CategoryManager
  tableClassName?: string
  showTable?: boolean
}

// Isi kelola kategori: pesan error, form tambah/edit, lalu tabel daftar kategori
export function CategoryManagerContent({ manager, tableClassName, showTable = true }: CategoryManagerContentProps) {
  const { categories, isLoading, error, editing, setEditing, handleSubmit, handleDelete } = manager

  return (
    <>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <CategoryForm key={editing?.id ?? "new"} editing={editing} onSubmit={handleSubmit} onCancelEdit={() => setEditing(null)} />

      {showTable && <CategoryTable
        categories={categories}
        isLoading={isLoading}
        editingId={editing?.id ?? null}
        onEdit={setEditing}
        onDelete={handleDelete}
        className={tableClassName}
      />}
    </>
  )
}
