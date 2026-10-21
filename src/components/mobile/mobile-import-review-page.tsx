"use client"

import Link from "next/link"
import { FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoadingState } from "@/components/ui/spinner"
import { ImportReviewCards } from "@/components/import/import-review-cards"
import {
  ImportingOverlay,
  ImportReviewActions,
  ImportReviewAlerts,
  ImportReviewFilters,
  ImportReviewPagination,
} from "@/components/import/import-review-parts"
import { useImportReview } from "@/components/import/use-import-review"
import { useIsMobile } from "@/hooks/use-mobile"
import type { ImportedTransaction } from "@/lib/api/transaction-import"
import { useImportedTransactions } from "@/lib/import-store"

const IMPORT_PATH = "/import"
// Halaman transaksi belum punya versi mobile, jadi setelah selesai kembali ke beranda
const EXIT_PATH = "/dashboard"

interface MobileImportReviewProps {
  importId: string
  initialRows: readonly ImportedTransaction[]
}

function MobileImportReview({ importId, initialRows }: MobileImportReviewProps) {
  const review = useImportReview({ importId, initialRows, exitPath: EXIT_PATH })

  if (review.isLoadingCategories) return <LoadingState label="Memuat kategori..." className="mt-4" />

  return (
    <div className="flex flex-col gap-4">
      {review.isSubmitting && <ImportingOverlay count={review.validCount} />}
      <ImportReviewFilters review={review} />
      <ImportReviewAlerts review={review} />
      <ImportReviewCards
        rows={review.pagedRows}
        errorsByRow={review.errorsByRow}
        categories={review.categories}
        disabled={review.isSubmitting}
        onChange={review.changeRow}
        onRemove={review.removeRow}
      />
      <ImportReviewPagination review={review} />
      <ImportReviewActions review={review} className="[&>button]:h-11 [&>button]:flex-1" />
    </div>
  )
}

function EmptyImport() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-4 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-[#6359E9]/10 text-[#6359E9]">
        <FileSpreadsheet className="size-6" />
      </div>
      <h2 className="text-base font-semibold">Belum ada data import</h2>
      <p className="text-sm text-muted-foreground">Upload file lewat menu Import untuk mereview transaksi.</p>
      <Button variant="outline" nativeButton={false} render={<Link href={IMPORT_PATH} />}>
        Ke halaman Import
      </Button>
    </div>
  )
}

// Halaman review import versi mobile. Tree mobile tetap ter-mount di desktop (hanya disembunyikan CSS),
// jadi review hanya dirender saat layar mobile agar fetch kategori tidak dobel dengan halaman desktop.
export function MobileImportReviewPage() {
  const isMobile = useIsMobile()
  const { stored, isReady } = useImportedTransactions()

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-slate-900">Review Import</h1>
        <p className="text-sm text-muted-foreground">Periksa dan perbaiki data sebelum diimpor.</p>
      </div>
      {!isMobile ? null : !isReady ? (
        <LoadingState label="Memuat hasil import..." className="mt-4" />
      ) : !stored || stored.rows.length === 0 ? (
        <EmptyImport />
      ) : (
        // key = id import: upload baru mereset editor, sedangkan hasil edit (id sama) tidak
        <MobileImportReview key={stored.id} importId={stored.id} initialRows={stored.rows} />
      )}
    </div>
  )
}
