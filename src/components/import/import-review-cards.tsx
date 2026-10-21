"use client"

import type { ReactNode } from "react"
import { Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Category } from "@/lib/api/category"
import { cn } from "@/lib/utils"
import type { FieldErrors, ReviewPatch, ReviewRow } from "./import-review-model"
import { CategoryCell, countRowErrors, FieldError, RowStatusBadge } from "./import-review-table"

const LABEL_CLASS = "text-xs font-medium text-muted-foreground"

interface ImportReviewCardsProps {
  rows: readonly ReviewRow[]
  errorsByRow: ReadonlyMap<number, FieldErrors>
  categories: readonly Category[]
  disabled?: boolean
  onChange: (row: number, patch: ReviewPatch) => void
  onRemove: (row: number) => void
}

interface ReviewCardProps {
  row: ReviewRow
  errors: FieldErrors
  categories: readonly Category[]
  disabled?: boolean
  onChange: (patch: ReviewPatch) => void
  onRemove: () => void
}

function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={htmlFor} className={LABEL_CLASS}>
        {label}
      </label>
      {children}
    </div>
  )
}

function ReviewCard({ row, errors, categories, disabled, onChange, onRemove }: ReviewCardProps) {
  const errorCount = countRowErrors(row, errors)
  const idPrefix = `import-row-${row.row}`

  return (
    <li
      className={cn(
        "flex flex-col gap-3 rounded-2xl border bg-white p-4",
        errorCount > 0 ? "border-destructive/40 bg-destructive/5" : "border-transparent"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-slate-700">Baris {row.row}</span>
        <div className="flex items-center gap-1">
          <RowStatusBadge errorCount={errorCount} />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Hapus baris ${row.row}`}
            onClick={onRemove}
            disabled={disabled}
          >
            <Trash2Icon />
          </Button>
        </div>
      </div>
      <FieldError message={row.submitError ?? undefined} />

      <Field label="Name" htmlFor={`${idPrefix}-name`}>
        <Input
          id={`${idPrefix}-name`}
          value={row.name}
          onChange={(e) => onChange({ name: e.target.value })}
          aria-invalid={Boolean(errors.name)}
          disabled={disabled}
        />
        <FieldError message={errors.name} />
      </Field>

      <Field label="Category">
        <CategoryCell
          row={row}
          categories={categories}
          error={errors.category}
          disabled={disabled}
          triggerClassName="w-full"
          onChange={(categoryId) => onChange({ categoryId })}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Date" htmlFor={`${idPrefix}-date`}>
          <Input
            id={`${idPrefix}-date`}
            type="date"
            value={row.date}
            onChange={(e) => onChange({ date: e.target.value })}
            aria-invalid={Boolean(errors.date)}
            disabled={disabled}
          />
          <FieldError message={errors.date} />
        </Field>
        <Field label="Amount (Rp)" htmlFor={`${idPrefix}-amount`}>
          <Input
            id={`${idPrefix}-amount`}
            type="number"
            inputMode="numeric"
            min={0}
            value={row.amount ?? ""}
            onChange={(e) => onChange({ amount: e.target.value === "" ? null : Number(e.target.value) })}
            aria-invalid={Boolean(errors.amount)}
            className="text-right"
            disabled={disabled}
          />
          <FieldError message={errors.amount} />
        </Field>
      </div>
    </li>
  )
}

// Versi kartu dari tabel review untuk layar sempit: satu kartu per baris import
export function ImportReviewCards({
  rows,
  errorsByRow,
  categories,
  disabled,
  onChange,
  onRemove,
}: ImportReviewCardsProps) {
  if (rows.length === 0) {
    return (
      <p className="rounded-2xl bg-white py-8 text-center text-sm text-muted-foreground">
        Tidak ada baris yang cocok dengan filter.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {rows.map((row) => (
        <ReviewCard
          key={row.row}
          row={row}
          errors={errorsByRow.get(row.row) ?? {}}
          categories={categories}
          disabled={disabled}
          onChange={(patch) => onChange(row.row, patch)}
          onRemove={() => onRemove(row.row)}
        />
      ))}
    </ul>
  )
}
