"use client"

import Image from "next/image"
import { CheckCircle2Icon, CircleAlertIcon, Trash2Icon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CATEGORY_OPTIONS } from "@/components/header/category-type-field"
import type { Category } from "@/lib/api/category"
import { cn } from "@/lib/utils"
import type { FieldErrors, ReviewPatch, ReviewRow } from "./import-review-model"

const TYPE_ICON = Object.fromEntries(CATEGORY_OPTIONS.map((o) => [o.value, o.icon]))
const CELL_CLASS = "align-top"

const COLUMNS = [
  { key: "row", label: "#", className: "w-12" },
  { key: "name", label: "Name", className: "min-w-44" },
  { key: "category", label: "Category", className: "w-48" },
  { key: "date", label: "Date", className: "w-40" },
  { key: "amount", label: "Amount (Rp)", className: "w-36 text-right" },
  { key: "status", label: "Status", className: "w-28" },
  { key: "actions", label: "", className: "w-12" },
] as const

interface ImportReviewTableProps {
  rows: readonly ReviewRow[]
  errorsByRow: ReadonlyMap<number, FieldErrors>
  categories: readonly Category[]
  disabled?: boolean
  onChange: (row: number, patch: ReviewPatch) => void
  onRemove: (row: number) => void
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs whitespace-normal text-destructive">{message}</p>
}

interface CategoryCellProps {
  row: ReviewRow
  categories: readonly Category[]
  error?: string
  disabled?: boolean
  onChange: (categoryId: string | null) => void
}

function CategoryCell({ row, categories, error, disabled, onChange }: CategoryCellProps) {
  return (
    <>
      <Select value={row.categoryId} onValueChange={(value) => onChange(value as string | null)} disabled={disabled}>
        <SelectTrigger className="w-48" aria-invalid={Boolean(error)} aria-label={`Kategori baris ${row.row}`}>
          <SelectValue>
            {(value: string | null) => {
              const selected = categories.find((c) => c.id === value)
              if (!selected) return <span className="truncate text-muted-foreground">{row.categoryLabel || "Pilih kategori"}</span>
              return (
                <>
                  <Image src={TYPE_ICON[selected.type]} alt="" width={18} height={18} />
                  <span className="truncate">{selected.name}</span>
                </>
              )
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-64">
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              <Image src={TYPE_ICON[category.type]} alt="" width={18} height={18} />
              <span className="truncate">{category.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError message={error} />
    </>
  )
}

interface ReviewRowItemProps {
  row: ReviewRow
  errors: FieldErrors
  categories: readonly Category[]
  disabled?: boolean
  onChange: (patch: ReviewPatch) => void
  onRemove: () => void
}

function ReviewRowItem({ row, errors, categories, disabled, onChange, onRemove }: ReviewRowItemProps) {
  const errorCount = Object.keys(errors).length + (row.submitError ? 1 : 0)
  const isValid = errorCount === 0

  return (
    <TableRow className={cn(!isValid && "bg-destructive/5 hover:bg-destructive/10")}>
      <TableCell className={cn(CELL_CLASS, "pt-3.5 text-muted-foreground")}>{row.row}</TableCell>
      <TableCell className={CELL_CLASS}>
        <Input
          value={row.name}
          onChange={(e) => onChange({ name: e.target.value })}
          aria-invalid={Boolean(errors.name)}
          aria-label={`Nama baris ${row.row}`}
          className="min-w-44"
          disabled={disabled}
        />
        <FieldError message={errors.name} />
      </TableCell>
      <TableCell className={CELL_CLASS}>
        <CategoryCell
          row={row}
          categories={categories}
          error={errors.category}
          disabled={disabled}
          onChange={(categoryId) => onChange({ categoryId })}
        />
      </TableCell>
      <TableCell className={CELL_CLASS}>
        <Input
          type="date"
          value={row.date}
          onChange={(e) => onChange({ date: e.target.value })}
          aria-invalid={Boolean(errors.date)}
          aria-label={`Tanggal baris ${row.row}`}
          className="w-40"
          disabled={disabled}
        />
        <FieldError message={errors.date} />
      </TableCell>
      <TableCell className={CELL_CLASS}>
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          value={row.amount ?? ""}
          onChange={(e) => onChange({ amount: e.target.value === "" ? null : Number(e.target.value) })}
          aria-invalid={Boolean(errors.amount)}
          aria-label={`Amount baris ${row.row}`}
          className="ml-auto w-36 text-right"
          disabled={disabled}
        />
        <FieldError message={errors.amount} />
      </TableCell>
      <TableCell className={cn(CELL_CLASS, "pt-3")}>
        {isValid ? (
          <Badge variant="secondary" className="text-emerald-600 dark:text-emerald-400">
            <CheckCircle2Icon data-icon="inline-start" />
            Valid
          </Badge>
        ) : (
          <Badge variant="destructive">
            <CircleAlertIcon data-icon="inline-start" />
            {errorCount} error
          </Badge>
        )}
        <FieldError message={row.submitError ?? undefined} />
      </TableCell>
      <TableCell className={cn(CELL_CLASS, "text-right")}>
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
      </TableCell>
    </TableRow>
  )
}

export function ImportReviewTable({
  rows,
  errorsByRow,
  categories,
  disabled,
  onChange,
  onRemove,
}: ImportReviewTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {COLUMNS.map((column) => (
            <TableHead
              key={column.key}
              className={cn("text-xs font-semibold tracking-wide text-muted-foreground uppercase", column.className)}
            >
              {column.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 && (
          <TableRow>
            <TableCell colSpan={COLUMNS.length} className="py-8 text-center text-muted-foreground">
              Tidak ada baris yang cocok dengan filter.
            </TableCell>
          </TableRow>
        )}
        {rows.map((row) => (
          <ReviewRowItem
            key={row.row}
            row={row}
            errors={errorsByRow.get(row.row) ?? {}}
            categories={categories}
            disabled={disabled}
            onChange={(patch) => onChange(row.row, patch)}
            onRemove={() => onRemove(row.row)}
          />
        ))}
      </TableBody>
    </Table>
  )
}
