"use client"

import { useState } from "react"
import { PencilIcon, SearchIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TablePagination } from "@/components/table/TablePagination"
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
import { withMinLoading } from "@/lib/async"
import { cn } from "@/lib/utils"
import { CATEGORY_OPTIONS } from "./category-type-field"

const TYPE_LABEL = Object.fromEntries(CATEGORY_OPTIONS.map((o) => [o.value, o.label]))

interface CategoryTableProps {
  categories: readonly Category[]
  isLoading: boolean
  editingId: string | null
  onEdit: (category: Category) => void
  onDelete: (category: Category) => Promise<void>
  className?: string
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
      await withMinLoading(onDelete(category))
    } finally {
      setIsDeleting(false)
      setIsConfirming(false)
    }
  }

  return (
    <TableRow data-state={isEditing ? "selected" : undefined}>
      <TableCell className="max-w-40 whitespace-normal break-words font-medium sm:max-w-xs">{category.name}</TableCell>
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
              Batal
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              aria-busy={isDeleting}
              className="gap-2"
            >
              {isDeleting && <Spinner className="text-current" />}
              {isDeleting ? "Menghapus..." : "Hapus"}
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
              aria-label={`Hapus ${category.name}`}
            >
              <Trash2Icon />
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  )
}

export function CategoryTable({
  categories,
  isLoading,
  editingId,
  onEdit,
  onDelete,
  className,
}: CategoryTableProps) {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const filtered = categories
    .filter((category) => category.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
    .sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name, "id"))
  const totalPage = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPage)
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <section className="flex min-w-0 flex-col gap-3" aria-label="Daftar kategori">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium" role="status">
          {isLoading ? "Memuat kategori..." : `${filtered.length} dari ${categories.length} kategori`}
        </p>
        <div className="relative sm:w-64">
          <SearchIcon aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            aria-label="Cari kategori berdasarkan nama"
            placeholder="Cari kategori..."
            value={query}
            onChange={(event) => { setQuery(event.target.value); setPage(1) }}
            className="h-10 pl-9"
          />
        </div>
      </div>
      <div className={cn("max-h-96 overflow-y-auto rounded-lg border", className)}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-20 text-center text-muted-foreground">
                  <Spinner className="mx-auto" />
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-20 text-center text-muted-foreground">
                  {categories.length === 0 ? "Belum ada kategori" : "Kategori tidak ditemukan. Coba kata kunci lain."}
                </TableCell>
              </TableRow>
            ) : (
              visible.map((category) => (
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
      <TablePagination
        currentPage={currentPage}
        totalPage={totalPage}
        pageSize={pageSize}
        itemCount={visible.length}
        totalItem={filtered.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => { setPageSize(size); setPage(1) }}
        pageSizeOptions={[10, 20, 50]}
        disabled={isLoading}
        className="mt-0 flex-wrap"
      />
    </section>
  )
}
