"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import type { Category, CategoryInput, CategoryType } from "@/lib/api/category"
import { CATEGORY_OPTIONS, CategoryTypeField } from "./category-type-field"

const INPUT_CLASS = "h-11 px-3"
const NAME_MAX_LENGTH = 100 // sama dengan validasi @Size di backend
// Jeda minimum agar spinner tidak berkedip saat response backend sangat cepat
const MIN_LOADING_MS = 600

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const CATEGORY_TYPES: readonly string[] = CATEGORY_OPTIONS.map((option) => option.value)

function isCategoryType(value: unknown): value is CategoryType {
  return typeof value === "string" && CATEGORY_TYPES.includes(value)
}

function toCategoryInput(form: HTMLFormElement): CategoryInput | null {
  const data = new FormData(form)
  const name = String(data.get("name") ?? "").trim()
  const type = data.get("categoryType")
  if (!name || !isCategoryType(type)) return null
  return { name, type }
}

function submitLabel(isEditing: boolean, isSubmitting: boolean): string {
  if (isSubmitting) return isEditing ? "Updating..." : "Saving..."
  return isEditing ? "Update Category" : "Add Category"
}

interface CategoryFormProps {
  // Kategori yang sedang diedit; null berarti mode tambah
  editing: Category | null
  onSubmit: (input: CategoryInput) => Promise<boolean> // true bila tersimpan
  onCancelEdit: () => void
}

export function CategoryForm({ editing, onSubmit, onCancelEdit }: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const input = toCategoryInput(form)
    if (!input) return

    setIsSubmitting(true)
    try {
      const [isSaved] = await Promise.all([onSubmit(input), wait(MIN_LOADING_MS)])
      if (isSaved && !editing) form.reset()
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
            <Label htmlFor="category-name">Category Name</Label>
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
            defaultValue={editing?.type}
          />
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
            Cancel Edit
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}  
          className="h-11 min-w-40 gap-2 bg-[#6359E9] px-6 text-white hover:bg-[#6359E9]/90"
        >
          {isSubmitting && <Spinner className="animate-spin" />}
          {submitLabel(Boolean(editing), isSubmitting)}
        </Button>
      </div>
    </form>
  )
}
