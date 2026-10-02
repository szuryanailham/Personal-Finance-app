"use client"

import { useState } from "react"
import Image from "next/image"
import { CircleCheckIcon } from "lucide-react"
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
import createTransactionIcon from "@/components/images/icons/icon-create-transaction.svg"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { createTransaction, type TransactionInput } from "@/lib/api/transaction"
import { TransactionCategoryField } from "./transaction-category-field"
import { useTransactionRevision } from "./transaction-revision-context"

const INPUT_CLASS = "h-11 px-3"
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const MIN_LOADING_MS = 600
const SUCCESS_ALERT_MS = 1500

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function toTransactionInput(form: HTMLFormElement): TransactionInput | null {
  const data = new FormData(form)
  const transactionName = String(data.get("transactionName") ?? "").trim()
  const categoryId = String(data.get("categoryId") ?? "")
  const date = String(data.get("date") ?? "")
  const amount = Number(data.get("amount"))
  const description = String(data.get("description") ?? "").trim()

  if (!transactionName || !categoryId || !DATE_PATTERN.test(date)) return null
  if (!Number.isFinite(amount) || amount <= 0) return null
  return { transactionName, amount, description, categoryId, date }
}

function toErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Terjadi kesalahan"
}

interface AddTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Dialog dikontrol dari luar (dibuka lewat menu AddActionMenu)
export function AddTransactionDialog({ open, onOpenChange }: AddTransactionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const { notifyTransactionsChanged } = useTransactionRevision()
  // Form tetap terkunci selama request berjalan dan selama alert sukses tampil
  const isLocked = isSubmitting || isSuccess

  function closeDialog() {
    setError(null)
    setIsSuccess(false)
    onOpenChange(false)
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isLocked) return // jangan tutup dialog saat request berjalan / alert sukses tampil
    if (!nextOpen) setError(null)
    onOpenChange(nextOpen)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const input = toTransactionInput(e.currentTarget)
    if (!input) {
      setError("Lengkapi form: nama, kategori, tanggal, dan amount lebih dari 0")
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      await Promise.all([createTransaction(input), wait(MIN_LOADING_MS)])
    } catch (err: unknown) {
      setError(toErrorMessage(err))
      return
    } finally {
      setIsSubmitting(false)
    }

    // Tabel, stat, dan chart langsung fetch ulang di belakang dialog
    notifyTransactionsChanged()
    // Tampilkan alert sukses sesaat, baru tutup dialog
    setIsSuccess(true)
    await wait(SUCCESS_ALERT_MS)
    closeDialog()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl p-6">
        {/* Form diletakkan di dalam DialogContent karena konten dirender lewat portal */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <div className="mb-2">
              <Image src={createTransactionIcon} alt="" width={52} height={53} />
            </div>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>
             Fill Out the Transaction Form Below
            </DialogDescription>
          </DialogHeader>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {isSuccess && (
            <Alert role="status" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
              <CircleCheckIcon />
              <AlertDescription className="text-inherit">Transaksi berhasil ditambahkan</AlertDescription>
            </Alert>
          )}
          {/* fieldset mengunci semua input selama request berjalan */}
          <fieldset disabled={isLocked} className="contents">
            <FieldGroup>
              <Field>
                {/* title transaction */}
                <Label htmlFor="transaction-name">Title Transaction</Label>
                <Input id="transaction-name" name="transactionName" className={INPUT_CLASS} required />
              </Field>
              {/* select category */}
              <TransactionCategoryField enabled={open} idPrefix="transaction-category" />
  
              <Field>
                <Label htmlFor="transaction-amount">Amount</Label>
                <Input
                  id="transaction-amount"
                  name="amount"
                  className={INPUT_CLASS}
                  type="number"
                  min={0}
                  step="any"
                  required
                />
              </Field>
              <Field>
                <Label htmlFor="transaction-date">Date</Label>
                <Input id="transaction-date" name="date" type="date" className={INPUT_CLASS} required />
              </Field>
              <Field>
                <Label htmlFor="transaction-description">Description</Label>
                <Textarea id="transaction-description" name="description" rows={4} className="min-h-24 px-3 py-2" />
              </Field>
            </FieldGroup>
          </fieldset>
          <DialogFooter className="-mx-6 -mb-6 mt-2 grid grid-cols-2 gap-4 px-6 py-5">
            <DialogClose
              disabled={isLocked}
              render={<Button type="button" variant="outline" className="h-11 w-full px-6">Cancel</Button>}
            />
            <Button
              type="submit"
              disabled={isLocked}
              aria-busy={isSubmitting}
              className="h-11 w-full gap-2 bg-[#6359E9] px-6 text-white hover:bg-[#6359E9]/90"
            >
              {isSubmitting && <Spinner className="animate-spin text-white" />}
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
