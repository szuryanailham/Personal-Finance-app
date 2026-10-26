"use client"

import { useState } from "react"
import { PencilIcon } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { RupiahAmountInput } from "@/components/header/rupiah-amount-input"
import { TransactionCategoryField } from "@/components/header/transaction-category-field"
import { toTransactionInput } from "@/components/header/transaction-form"
import { useTransactionRevision } from "@/components/header/transaction-revision-context"
import type { Transaction } from "@/components/table/TableComponent"
import type { Category, CategoryType } from "@/lib/api/category"
import { updateTransaction, type TransactionInput, type TransactionPatch } from "@/lib/api/transaction"
import { withMinLoading } from "@/lib/async"
import { toLocalDateString } from "@/lib/date"
import { cn } from "@/lib/utils"

const INPUT_CLASS = "h-10 px-3 sm:h-11"
const BUTTON_CLASS = "h-10 w-full px-3 sm:h-11 sm:px-6"

interface EditTransactionDialogProps {
  /** Transaksi yang sedang diedit; null = dialog tertutup */
  transaction: Transaction | null
  onClose: () => void
}

function toErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Terjadi kesalahan"
}

function toFormValues(trx: Transaction): TransactionInput {
  return {
    transactionName: trx.description,
    amount: trx.amount,
    description: trx.note,
    categoryId: trx.categoryId,
    date: toLocalDateString(trx.date),
  }
}

function toCategory(trx: Transaction): Category {
  return { id: trx.categoryId, name: trx.category, type: trx.type.toUpperCase() as CategoryType }
}

// PATCH parsial: hanya field yang berbeda dari nilai awal yang dikirim
function diffTransaction(initial: TransactionInput, next: TransactionInput): TransactionPatch {
  const keys = Object.keys(next) as (keyof TransactionInput)[]
  return Object.fromEntries(keys.filter((key) => next[key] !== initial[key]).map((key) => [key, next[key]]))
}

// Form edit satu transaksi; tabel, stat, dan chart di-refresh setelah berhasil
export function EditTransactionDialog({ transaction, onClose }: EditTransactionDialogProps) {
  const { notifyTransactionsChanged } = useTransactionRevision()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isOpen = transaction !== null

  function handleOpenChange(nextOpen: boolean) {
    // Jangan tutup selama request berjalan agar hasilnya tetap terlihat
    if (nextOpen || isSubmitting) return
    setError(null)
    onClose()
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!transaction) return
    const input = toTransactionInput(e.currentTarget)
    if (!input) {
      setError("Lengkapi form: nama, kategori, tanggal, dan jumlah lebih dari 0")
      return
    }

    const patch = diffTransaction(toFormValues(transaction), input)
    if (Object.keys(patch).length === 0) {
      toast.info("Tidak ada perubahan")
      onClose()
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      await withMinLoading(updateTransaction(transaction.transactionCode, patch))
    } catch (err: unknown) {
      setError(toErrorMessage(err))
      return
    } finally {
      setIsSubmitting(false)
    }

    toast.success("Transaksi berhasil diperbarui")
    notifyTransactionsChanged()
    onClose()
  }

  const initial = transaction ? toFormValues(transaction) : null

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* Mobile: padding lebih kecil dan bisa di-scroll agar form tidak terpotong di layar pendek */}
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto p-4 sm:max-w-xl sm:p-6">
        {/* key memaksa form di-reset (defaultValue baru) saat transaksi yang diedit berganti */}
        {transaction && initial && (
          <form key={transaction.transactionCode} onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
            <DialogHeader>
              <div className="mb-1 flex size-10 items-center justify-center rounded-full bg-[#6359E9]/10 text-[#6359E9] sm:mb-2 sm:size-[52px]">
                <PencilIcon />
              </div>
              <DialogTitle>Edit Transaksi</DialogTitle>
              <DialogDescription>{transaction.transactionCode}</DialogDescription>
            </DialogHeader>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <fieldset disabled={isSubmitting} className="contents">
              <FieldGroup>
                <Field>
                  <Label htmlFor="edit-transaction-name">Judul Transaksi</Label>
                  <Input
                    id="edit-transaction-name"
                    name="transactionName"
                    defaultValue={initial.transactionName}
                    className={INPUT_CLASS}
                    required
                  />
                </Field>
                <TransactionCategoryField
                  enabled={isOpen}
                  idPrefix="edit-transaction-category"
                  selected={toCategory(transaction)}
                />
                <Field>
                  <Label htmlFor="edit-transaction-amount">Jumlah</Label>
                  <RupiahAmountInput
                    id="edit-transaction-amount"
                    name="amount"
                    defaultValue={initial.amount}
                    className={INPUT_CLASS}
                    required
                  />
                </Field>
                <Field>
                  <Label htmlFor="edit-transaction-date">Tanggal</Label>
                  <Input
                    id="edit-transaction-date"
                    name="date"
                    type="date"
                    defaultValue={initial.date}
                    className={INPUT_CLASS}
                    required
                  />
                </Field>
                <Field>
                  <Label htmlFor="edit-transaction-description">Deskripsi</Label>
                  <Textarea
                    id="edit-transaction-description"
                    name="description"
                    defaultValue={initial.description}
                    rows={3}
                    className="min-h-20 px-3 py-2 sm:min-h-24"
                  />
                </Field>
              </FieldGroup>
            </fieldset>
            <DialogFooter className="-mx-4 -mb-4 mt-1 grid grid-cols-2 gap-3 px-4 py-4 sm:-mx-6 sm:-mb-6 sm:mt-2 sm:gap-4 sm:px-6 sm:py-5">
              <DialogClose
                disabled={isSubmitting}
                render={<Button type="button" variant="outline" className={BUTTON_CLASS}>Batal</Button>}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className={cn(BUTTON_CLASS, "gap-2 bg-[#6359E9] text-white hover:bg-[#6359E9]/90")}
              >
                {isSubmitting && <Spinner className="animate-spin text-white" />}
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
