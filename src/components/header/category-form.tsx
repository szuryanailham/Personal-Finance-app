"use client"

import { useState } from "react"
import { CATEGORY_ICON_OPTIONS, CATEGORY_COLOR_OPTIONS, DEFAULT_CATEGORY_ICON, DEFAULT_CATEGORY_COLOR } from "@/lib/category-appearance"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { withMinLoading } from "@/lib/async"
import type { Category, CategoryInput, CategoryType } from "@/lib/api/category"
import { CATEGORY_OPTIONS, CategoryTypeField } from "./category-type-field"
import { RupiahAmountInput } from "./rupiah-amount-input"

const MAX_BUDGET = 1_000_000_000_000
const INPUT_CLASS = "h-11 px-3"
const NAME_MAX_LENGTH = 100 // sama dengan validasi @Size di backend
const CATEGORY_TYPES: readonly string[] = CATEGORY_OPTIONS.map((option) => option.value)

function isCategoryType(value: unknown): value is CategoryType {
  return typeof value === "string" && CATEGORY_TYPES.includes(value)
}

function toCategoryInput(form: HTMLFormElement): CategoryInput | null {
  const data = new FormData(form)
  const name = String(data.get("name") ?? "").trim()
  const type = data.get("categoryType")
  if (!name || !isCategoryType(type)) return null
  const budget = type === "EXPENSE" ? Number(data.get("budget")) : undefined
  const icon = CATEGORY_ICON_OPTIONS.find(option => option.value === data.get("icon"))?.value
  const color = String(data.get("color") ?? "")
  if (budget !== undefined && (!Number.isSafeInteger(budget) || budget < 0 || budget > MAX_BUDGET)) return null
  if (!icon || !/^#[0-9a-f]{6}$/i.test(color)) return null
  return { name, type, budget, icon, color }
}

function submitLabel(isEditing: boolean, isSubmitting: boolean): string {
  if (isSubmitting) return isEditing ? "Memperbarui..." : "Menyimpan..."
  return isEditing ? "Perbarui Kategori" : "Tambah Kategori"
}

interface CategoryFormProps {
  // Kategori yang sedang diedit; null berarti mode tambah
  editing: Category | null
  onSubmit: (input: CategoryInput) => Promise<boolean> // true bila tersimpan
  onCancelEdit: () => void
}

export function CategoryForm({ editing, onSubmit, onCancelEdit }: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categoryType, setCategoryType] = useState<CategoryType>(editing?.type ?? CATEGORY_OPTIONS[0].value)
  const [icon, setIcon] = useState(editing?.icon ?? DEFAULT_CATEGORY_ICON)
  const [color, setColor] = useState(editing?.color ?? DEFAULT_CATEGORY_COLOR)
  const PreviewIcon = (CATEGORY_ICON_OPTIONS.find(option => option.value === icon) ?? CATEGORY_ICON_OPTIONS[10]).icon

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const input = toCategoryInput(form)
    if (!input) return

    setIsSubmitting(true)
    try {
      const isSaved = await withMinLoading(onSubmit(input))
      if (isSaved && !editing) {
        form.reset()
        setCategoryType(CATEGORY_OPTIONS[0].value)
        setIcon(DEFAULT_CATEGORY_ICON)
        setColor(DEFAULT_CATEGORY_COLOR)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form key={editing?.id ?? "new"} onSubmit={handleSubmit} className="flex flex-col gap-4 mb-5">
      {/* fieldset mengunci semua input selama request berjalan */}
      <fieldset disabled={isSubmitting} className="contents">
        <FieldGroup>
          <Field>
            <Label htmlFor="category-name">Nama Kategori</Label>
            <Input
              id="category-name"
              name="name"
              defaultValue={editing?.name}
              maxLength={NAME_MAX_LENGTH}
              className={INPUT_CLASS}
              required
            />
          </Field>
          <CategoryTypeField
            idPrefix="new-category-type"
            label="Type"
            value={categoryType}
            onValueChange={setCategoryType}
          />
          {categoryType === "EXPENSE" && <Field>
            <Label htmlFor="category-budget">Anggaran (Rp)</Label>
            <RupiahAmountInput
              id="category-budget"
              name="budget"
              defaultValue={editing?.budget ?? 0}
              max={MAX_BUDGET}
              className={INPUT_CLASS}
              aria-describedby="category-budget-note"
              required
            />
            <p id="category-budget-note" className="text-xs text-muted-foreground">Isi 0 jika belum menetapkan anggaran.</p>
          </Field>}
          <fieldset className="grid gap-2">
            <legend className="mb-2 text-sm font-medium">Ikon kategori</legend>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {CATEGORY_ICON_OPTIONS.map(option => {
                const Icon = option.icon
                return (
                  <label key={option.value} className="relative cursor-pointer">
                    <input type="radio" name="icon" value={option.value} checked={icon === option.value} onChange={() => setIcon(option.value)} className="peer sr-only" />
                    <span className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg border border-input p-2 peer-checked:border-[#14864A] peer-checked:bg-[#14864A]/5 peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
                      <Icon aria-hidden="true" className="size-5" style={{ color }} />
                      <span className="text-xs">{option.label}</span>
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>
          <Field>
            <Label htmlFor="category-color">Warna kategori</Label>
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORY_COLOR_OPTIONS.map(option => (
                <button key={option} type="button" aria-label={`Pilih warna ${option}`} aria-pressed={color === option} onClick={() => setColor(option)} className="size-8 rounded-full border-2 border-background ring-offset-2 aria-pressed:ring-2 aria-pressed:ring-ring focus-visible:outline-2 focus-visible:outline-offset-2" style={{ backgroundColor: option }} />
              ))}
              <input id="category-color" name="color" type="color" value={color} onChange={event => setColor(event.target.value)} className="h-10 w-12 cursor-pointer rounded border border-input bg-background p-1" />
            </div>
          </Field>
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <span className="flex size-10 items-center justify-center rounded-xl" style={{ color, backgroundColor: `${color}1a` }}><PreviewIcon aria-hidden="true" className="size-5" /></span>
            <div><p className="text-sm font-medium">Preview ikon kategori</p><p className="text-xs text-muted-foreground">Budget, ikon, dan warna disimpan sementara sampai halaman dimuat ulang.</p></div>
          </div>
        </FieldGroup>
      </fieldset>
      <div className="flex justify-end gap-3">
        {editing && (
          <Button
            type="button"
            variant="outline"
            className="h-11 px-6"
            onClick={onCancelEdit}
            disabled={isSubmitting}
          >
            Batal Edit
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="h-11 min-w-40 gap-2 bg-[#14864A] px-6 text-white hover:bg-[#10733e]"
        >
          {isSubmitting && <Spinner className="text-white" />}
          {submitLabel(Boolean(editing), isSubmitting)}
        </Button>
      </div>
    </form>
  )
}
