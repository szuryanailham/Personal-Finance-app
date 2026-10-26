"use client"

import { useState } from "react"
import { Trash2Icon } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"
import { useTransactionRevision } from "@/components/header/transaction-revision-context"
import type { Transaction } from "@/components/table/TableComponent"
import { deleteTransaction, deleteTransactions } from "@/lib/api/transaction"
import { withMinLoading } from "@/lib/async"

interface DeleteTransactionDialogProps {
  /** Transaksi yang akan dihapus; array kosong = dialog tertutup */
  transactions: readonly Transaction[]
  onClose: () => void
  /** Dipanggil setelah hapus berhasil (mis. kembali ke daftar dari halaman detail) */
  onDeleted?: () => void
}

function toErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Terjadi kesalahan"
}

// Satu transaksi pakai endpoint biasa, lebih dari satu pakai endpoint bulk
function removeTransactions(transactions: readonly Transaction[]): Promise<string | null> {
  if (transactions.length === 1) return deleteTransaction(transactions[0].transactionCode)
  return deleteTransactions(transactions.map((trx) => trx.transactionCode))
}

// Konfirmasi sebelum menghapus satu/banyak transaksi; tabel, stat, dan chart di-refresh setelah berhasil
export function DeleteTransactionDialog({ transactions, onClose, onDeleted }: DeleteTransactionDialogProps) {
  const { notifyTransactionsChanged } = useTransactionRevision()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const count = transactions.length
  const isOpen = count > 0
  const isBulk = count > 1

  function handleOpenChange(nextOpen: boolean) {
    // Jangan tutup selama request berjalan agar hasilnya tetap terlihat
    if (nextOpen || isDeleting) return
    setError(null)
    onClose()
  }

  async function handleConfirm() {
    if (transactions.length === 0) return
    setIsDeleting(true)
    setError(null)
    try {
      const message = await withMinLoading(removeTransactions(transactions))
      // Fallback jika backend tidak mengirim `message`
      toast.success(message ?? `${count} transaksi berhasil dihapus`)
      onDeleted?.()
      notifyTransactionsChanged()
      onClose()
    } catch (err) {
      setError(toErrorMessage(err))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="rounded-full bg-[#6359E9]/10 text-[#6359E9]">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>{isBulk ? `Hapus ${count} transaksi?` : "Hapus transaksi ini?"}</AlertDialogTitle>
          <AlertDialogDescription>
            {isBulk ? (
              <>
                <span className="font-medium text-foreground">{count} transaksi</span> yang dipilih
              </>
            ) : (
              <>
                Transaksi <span className="font-medium text-foreground">{transactions[0]?.description}</span>
              </>
            )}{" "}
            akan dihapus dan tidak lagi ditampilkan di daftar transaksi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} className="border-[#8C89B4]">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="gap-2 bg-[#6359E9] text-white hover:bg-[#6359E9]/90"
          >
            {isDeleting ? <Spinner className="text-white" /> : <Trash2Icon />}
            {isDeleting ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
