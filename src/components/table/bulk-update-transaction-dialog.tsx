"use client"

import { useState } from "react"
import { PencilIcon } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { TransactionCategoryField } from "@/components/header/transaction-category-field"
import { useTransactionRevision } from "@/components/header/transaction-revision-context"
import type { Transaction } from "@/components/table/TableComponent"
import { runBulk, updateTransaction, type TransactionPatch } from "@/lib/api/transaction"
import { withMinLoading } from "@/lib/async"

const INPUT_CLASS = "h-11 px-3"
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

interface BulkUpdateTransactionDialogProps {
  /** Transaksi yang akan diubah; array kosong = dialog tertutup */
  transactions: readonly Transaction[]
  onClose: () => void
}

interface BulkFieldToggles {
  category: boolean
  date: boolean
}

const NO_TOGGLES: BulkFieldToggles = { category: false, date: false }

// Hanya field yang dicentang yang ikut dikirim; null = form belum valid
function toBulkPatch(form: HTMLFormElement, toggles: BulkFieldToggles): TransactionPatch | null {
  const data = new FormData(form)
  const categoryId = String(data.get("categoryId") ?? "")
  const date = String(data.get("date") ?? "")

  if (toggles.category && !categoryId) return null
  if (toggles.date && !DATE_PATTERN.test(date)) return null
  return {
    ...(toggles.category && { categoryId }),
    ...(toggles.date && { date }),
  }
}

interface ToggleFieldProps {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  children: React.ReactNode
}

// Field baru bisa diisi setelah checkbox "ubah" dicentang
function ToggleField({ id, label, checked, onCheckedChange, children }: ToggleFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
        <Label htmlFor={id}>Ubah {label}</Label>
      </div>
      {checked && children}
    </div>
  )
}

// Form ubah kategori/tanggal banyak transaksi sekaligus; tabel, stat, dan chart di-refresh setelah selesai
export function BulkUpdateTransactionDialog({ transactions, onClose }: BulkUpdateTransactionDialogProps) {
  const { notifyTransactionsChanged } = useTransactionRevision()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toggles, setToggles] = useState<BulkFieldToggles>(NO_TOGGLES)
  const count = transactions.length
  const isOpen = count > 0
  const hasSelectedField = toggles.category || toggles.date

  function close() {
    setError(null)
    setToggles(NO_TOGGLES)
    onClose()
  }

  function handleOpenChange(nextOpen: boolean) {
    // Jangan tutup selama request berjalan agar hasilnya tetap terlihat
    if (nextOpen || isSubmitting) return
    close()
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const patch = toBulkPatch(e.currentTarget, toggles)
    if (!patch || Object.keys(patch).length === 0) {
      setError("Pilih minimal satu kolom dan isi nilainya dengan benar")
      return
    }

    setError(null)
    setIsSubmitting(true)
    const codes = transactions.map((trx) => trx.transactionCode)
    const result = await withMinLoading(runBulk(codes, (code) => updateTransaction(code, patch)))
    setIsSubmitting(false)

    if (result.succeeded > 0) notifyTransactionsChanged()
    if (result.failed > 0) {
      setError(`${result.failed} dari ${count} transaksi gagal diperbarui: ${result.firstError}`)
      return
    }

    toast.success(`${result.succeeded} transaksi berhasil diperbarui`)
    close()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <div className="mb-2 flex size-[52px] items-center justify-center rounded-full bg-[#14864A]/10 text-[#14864A]">
              <PencilIcon />
            </div>
            <DialogTitle>Update Massal Transaksi</DialogTitle>
            <DialogDescription>
              {count} transaksi dipilih. Kolom yang tidak dicentang tidak akan diubah.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <fieldset disabled={isSubmitting} className="contents">
            <FieldGroup>
              <ToggleField
                id="bulk-update-toggle-category"
                label="Kategori"
                checked={toggles.category}
                onCheckedChange={(category) => setToggles((prev) => ({ ...prev, category }))}
              >
                <TransactionCategoryField
                  enabled={isOpen && toggles.category}
                  idPrefix="bulk-update-category"
                />
              </ToggleField>
              <ToggleField
                id="bulk-update-toggle-date"
                label="Tanggal"
                checked={toggles.date}
                onCheckedChange={(date) => setToggles((prev) => ({ ...prev, date }))}
              >
                <Field>
                  <Label htmlFor="bulk-update-date">Tanggal</Label>
                  <Input id="bulk-update-date" name="date" type="date" className={INPUT_CLASS} required />
                </Field>
              </ToggleField>
            </FieldGroup>
          </fieldset>
          <DialogFooter className="-mx-6 -mb-6 mt-2 grid grid-cols-2 gap-4 px-6 py-5">
            <DialogClose
              disabled={isSubmitting}
              render={<Button type="button" variant="outline" className="h-11 w-full px-6">Batal</Button>}
            />
            <Button
              type="submit"
              disabled={isSubmitting || !hasSelectedField}
              aria-busy={isSubmitting}
              className="h-11 w-full gap-2 bg-[#14864A] px-6 text-white hover:bg-[#10733e]"
            >
              {isSubmitting && <Spinner className="animate-spin text-white" />}
              {isSubmitting ? "Menyimpan..." : `Update ${count} Transaksi`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
