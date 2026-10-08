"use client"

import Link from "next/link"
import { FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoadingState } from "@/components/ui/spinner"
import { ImportReview } from "@/components/import/import-review"
import { useImportedTransactions } from "@/lib/import-store"

export default function ImportReviewPage() {
  const { stored, isReady } = useImportedTransactions()

  if (!isReady) return <LoadingState label="Memuat hasil import..." className="mt-4" />

  if (!stored || stored.rows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#6359E9]/10 text-[#6359E9]">
          <FileSpreadsheet className="size-6" />
        </div>
        <h2 className="text-lg font-semibold">Belum ada data import</h2>
        <p className="text-sm text-muted-foreground">Upload file lewat tombol Import untuk mereview transaksi.</p>
        <Button variant="outline" nativeButton={false} render={<Link href="/transaction" />}>
          Kembali ke Transaction
        </Button>
      </div>
    )
  }

  // key = id import: upload baru mereset editor, sedangkan hasil edit (id sama) tidak
  return <ImportReview key={stored.id} importId={stored.id} initialRows={stored.rows} />
}
