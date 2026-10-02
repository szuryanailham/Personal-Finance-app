"use client"

import Image from "next/image"
import { AlertCircleIcon } from "lucide-react"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { useCategories } from "@/hooks/use-categories"
import type { Category } from "@/lib/api/category"
import { CATEGORY_OPTIONS } from "./category-type-field"

// Dropdown cukup menampilkan 10 kategori pertama (skip=0&limit=10)
const DROPDOWN_CATEGORY_LIMIT = 10

// Ikon kategori mengikuti tipenya (INCOME/EXPENSE/SAVING)
const TYPE_ICON = Object.fromEntries(CATEGORY_OPTIONS.map((o) => [o.value, o.icon]))

interface TransactionCategoryFieldProps {
  // Fetch hanya berjalan saat dialog terbuka
  enabled: boolean
  idPrefix: string
  label?: string
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
  label = "Category",
}: TransactionCategoryFieldProps) {
  const { categories, isLoading, error, reload } = useCategories(enabled, DROPDOWN_CATEGORY_LIMIT)
  const triggerId = `${idPrefix}-select`

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
              Retry
            </Button>
          </AlertAction>
        </Alert>
      ) : categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada kategori. Tambahkan kategori terlebih dahulu.</p>
      ) : (
        <Select name="categoryId" defaultValue={categories[0].id}>
          <SelectTrigger id={triggerId} className="h-11 w-full px-3">
            <SelectValue>
              {(value: string) => {
                const selected = categories.find((c) => c.id === value)
                return selected ? <CategoryOption category={selected} /> : null
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id} className="py-2">
                <CategoryOption category={category} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </Field>
  )
}
