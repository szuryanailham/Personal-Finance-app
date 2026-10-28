"use client"

import { useState } from "react"
import Image from "next/image"
import { AlertCircleIcon, Check, ChevronDown, Search } from "lucide-react"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { useCategories } from "@/hooks/use-categories"
import type { Category } from "@/lib/api/category"
import { CATEGORY_OPTIONS } from "./category-type-field"

// Ikon kategori mengikuti tipenya (INCOME/EXPENSE/SAVING)
const TYPE_ICON = Object.fromEntries(CATEGORY_OPTIONS.map((o) => [o.value, o.icon]))
// Ambil seluruh kategori dalam satu request jika backend menerapkan pagination.
const CATEGORY_PICKER_LIMIT = 9999

interface TransactionCategoryFieldProps {
  // Fetch hanya berjalan saat dialog terbuka
  enabled: boolean
  idPrefix: string
  label?: string
  /** Kategori yang terpilih di awal (form edit); default kategori pertama */
  selected?: Category
}

// Kategori terpilih disisipkan jika tidak ikut termuat dari API.
function withSelected(categories: Category[], selected?: Category): Category[] {
  if (!selected || categories.some((c) => c.id === selected.id)) return categories
  return [selected, ...categories]
}

function CategoryOption({ category }: { category: Category }) {
  return (
    <>
      <Image src={TYPE_ICON[category.type]} alt="" width={24} height={24} />
      <span className="truncate">{category.name}</span>
    </>
  )
}

export function TransactionCategoryField({
  enabled,
  idPrefix,
  label = "Kategori",
  selected,
}: TransactionCategoryFieldProps) {
  const [search, setSearch] = useState("")
  const [pickerOpen, setPickerOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState(selected?.id ?? "")
  const { categories: fetched, isLoading, error, reload } = useCategories(enabled, CATEGORY_PICKER_LIMIT)
  const categories = withSelected(fetched, selected)
  const filteredCategories = categories.filter((category) =>
    category.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())
  )
  const effectiveCategoryId = selectedCategoryId || selected?.id || categories[0]?.id || ""
  const selectedCategory = categories.find((category) => category.id === effectiveCategoryId)
  const triggerId = `${idPrefix}-picker`

  function openPicker() {
    setSearch("")
    setPickerOpen(true)
  }

  return (
    <Field>
      <Label htmlFor={triggerId}>{label}</Label>
      {isLoading ? (
        <div className="flex h-11 items-center justify-center">
          <Spinner className="size-6 animate-spin" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Gagal memuat kategori</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <AlertAction>
            <Button type="button" size="sm" variant="outline" onClick={reload}>
              Coba Lagi
            </Button>
          </AlertAction>
        </Alert>
      ) : categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada kategori. Tambahkan kategori terlebih dahulu.</p>
      ) : (
        <>
          <input type="hidden" name="categoryId" value={effectiveCategoryId} />
          <Button
            id={triggerId}
            type="button"
            variant="outline"
            aria-haspopup="dialog"
            aria-expanded={pickerOpen}
            onClick={openPicker}
            className="h-11 w-full justify-between border-input bg-transparent px-3 font-normal hover:bg-muted/50"
          >
            {selectedCategory ? (
              <CategoryOption category={selectedCategory} />
            ) : (
              <span className="text-muted-foreground">Pilih kategori</span>
            )}
            <ChevronDown aria-hidden="true" className="size-4 text-muted-foreground" />
          </Button>
          <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
            <DialogContent className="max-h-[calc(100svh-2rem)] gap-4 overflow-hidden sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Pilih Kategori</DialogTitle>
                <DialogDescription>Cari lalu pilih kategori untuk transaksi ini.</DialogDescription>
              </DialogHeader>
              <div className="relative">
                <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  aria-label="Cari kategori"
                  placeholder="Cari kategori..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="h-10 pl-9"
                  autoFocus
                />
              </div>
              <ul className="-mx-1 flex max-h-[min(55vh,24rem)] flex-col gap-1 overflow-y-auto px-1">
                {filteredCategories.length > 0 ? filteredCategories.map((category) => (
                  <li key={category.id}>
                    <Button
                      type="button"
                      variant="ghost"
                      aria-pressed={category.id === effectiveCategoryId}
                      onClick={() => {
                        setSelectedCategoryId(category.id)
                        setPickerOpen(false)
                      }}
                      className="h-11 w-full justify-start gap-3 px-3"
                    >
                      <CategoryOption category={category} />
                      {category.id === effectiveCategoryId && <Check aria-hidden="true" className="ml-auto size-4 text-[#14864A]" />}
                    </Button>
                  </li>
                )) : (
                  <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                    Kategori tidak ditemukan.
                  </li>
                )}
              </ul>
            </DialogContent>
          </Dialog>
        </>
      )}
    </Field>
  )
}
