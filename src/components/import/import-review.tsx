"use client"

import { LoadingState } from "@/components/ui/spinner"
import type { ImportedTransaction } from "@/lib/api/transaction-import"
import { ImportReviewTable } from "./import-review-table"
import {
  ImportingOverlay,
  ImportReviewActions,
  ImportReviewAlerts,
  ImportReviewFilters,
  ImportReviewPagination,
} from "./import-review-parts"
import { useImportReview } from "./use-import-review"

interface ImportReviewProps {
  importId: string
  initialRows: readonly ImportedTransaction[]
}

export function ImportReview({ importId, initialRows }: ImportReviewProps) {
  const review = useImportReview({ importId, initialRows })

  if (review.isLoadingCategories) return <LoadingState label="Memuat kategori..." className="mt-4" />

  return (
    <div className="flex flex-col gap-4 pb-8">
      {review.isSubmitting && <ImportingOverlay count={review.validCount} />}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <ImportReviewFilters review={review} />
        <ImportReviewActions review={review} />
      </div>

      <ImportReviewAlerts review={review} />

      <ImportReviewTable
        rows={review.pagedRows}
        errorsByRow={review.errorsByRow}
        categories={review.categories}
        disabled={review.isSubmitting}
        onChange={review.changeRow}
        onRemove={review.removeRow}
      />

      <ImportReviewPagination review={review} />
    </div>
  )
}
