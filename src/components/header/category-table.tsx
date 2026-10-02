"use client"

import { useState } from "react"
import { PencilIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Category } from "@/lib/api/category"
import { CATEGORY_OPTIONS } from "./category-type-field"

const TYPE_LABEL = Object.fromEntries(CATEGORY_OPTIONS.map((o) => [o.value, o.label]))

interface CategoryTableProps {
  categories: readonly Category[]
  isLoading: boolean
  editingId: string | null
  onEdit: (category: Category) => void
  onDelete: (category: Category) => Promise<void>
}

interface CategoryRowProps {
  category: Category
  isEditing: boolean
  onEdit: (category: Category) => void
  onDelete: (category: Category) => Promise<void>
}

// Delete butuh klik kedua (konfirmasi) agar tidak terhapus tanpa sengaja
function CategoryRow({ category, isEditing, onEdit, onDelete }: CategoryRowProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleConfirmDelete() {
    setIsDeleting(true)
    try {
      await onDelete(category)
    } finally {
      setIsDeleting(false)
      setIsConfirming(false)
    }
  }

  return (
    <TableRow data-state={isEditing ? "selected" : undefined}>
      <TableCell className="font-medium">{category.name}</TableCell>
      <TableCell>{TYPE_LABEL[category.type] ?? category.type}</TableCell>
      <TableCell className="text-right">
        {isConfirming ? (
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsConfirming(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button size="sm" variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? <Spinner className="animate-spin" /> : "Delete"}
            </Button>
          </div>
        ) : (
          <div className="flex justify-end gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="size-8"
              onClick={() => onEdit(category)}
              aria-label={`Edit ${category.name}`}
            >
              <PencilIcon />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="size-8 text-destructive hover:text-destructive"
              onClick={() => setIsConfirming(true)}
              aria-label={`Delete ${category.name}`}
            >
              <Trash2Icon />
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  )
}

export function CategoryTable({ categories, isLoading, editingId, onEdit, onDelete }: CategoryTableProps) {
  return (
    <div className="max-h-72 overflow-y-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={3} className="h-20 text-center text-muted-foreground">
                <Spinner className="mx-auto animate-spin" />
              </TableCell>
            </TableRow>
          ) : categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-20 text-center text-muted-foreground">
                No categories yet
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                isEditing={category.id === editingId}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
