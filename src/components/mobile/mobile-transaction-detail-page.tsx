"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeftIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteTransactionDialog } from "@/components/table/delete-transaction-dialog"
import { EditTransactionDialog } from "@/components/table/edit-transaction-dialog"
import type { Transaction } from "@/components/table/TableComponent"
import { TransactionDetail } from "@/components/transaction/transaction-detail"
import { useIsMobile } from "@/hooks/use-mobile"

const TRANSACTION_PATH = "/transaction"

interface MobileTransactionActionsProps {
  transaction: Transaction
}

// Tombol edit/hapus khusus mobile. Setelah edit, detail di-fetch ulang lewat revision;
// setelah hapus, kembali ke daftar karena transaksinya sudah tidak ada.
function MobileTransactionActions({ transaction }: MobileTransactionActionsProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  return (
    <>
      <div className="flex gap-3">
        <Button
          className="h-11 flex-1 gap-2 bg-[#6359E9] text-white hover:bg-[#6359E9]/90"
          onClick={() => setIsEditing(true)}
        >
          <PencilIcon />
          Edit
        </Button>
        <Button variant="destructive" className="h-11 flex-1 gap-2" onClick={() => setIsDeleting(true)}>
          <Trash2Icon />
          Hapus
        </Button>
      </div>
      <EditTransactionDialog transaction={isEditing ? transaction : null} onClose={() => setIsEditing(false)} />
      <DeleteTransactionDialog
        transactions={isDeleting ? [transaction] : []}
        onClose={() => setIsDeleting(false)}
        onDeleted={() => router.replace(TRANSACTION_PATH)}
      />
    </>
  )
}

interface MobileTransactionDetailPageProps {
  transactionCode: string
}

// Halaman detail transaksi versi mobile. Detail hanya dirender saat layar mobile
// agar fetch-nya tidak dobel dengan halaman desktop.
export function MobileTransactionDetailPage({ transactionCode }: MobileTransactionDetailPageProps) {
  const isMobile = useIsMobile()

  return (
    <div className="flex flex-col gap-4 px-4 pt-5 pb-6">
      <Link
        href={TRANSACTION_PATH}
        className="flex w-fit items-center gap-1 text-sm font-medium text-[#6359E9]"
      >
        <ChevronLeftIcon className="size-4" />
        Kembali ke Transaksi
      </Link>
      {isMobile && (
        <TransactionDetail
          transactionCode={transactionCode}
          renderActions={(trx) => <MobileTransactionActions transaction={trx} />}
        />
      )}
    </div>
  )
}
