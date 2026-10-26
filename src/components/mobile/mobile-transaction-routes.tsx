"use client"

import { usePathname } from "next/navigation"
import { MobileImportReviewPage } from "@/components/mobile/mobile-import-review-page"
import { MobileTransactionDetailPage } from "@/components/mobile/mobile-transaction-detail-page"
import { MobileTransactionPage } from "@/components/mobile/mobile-transaction-page"

const TRANSACTION_PATH = "/transaction"
const IMPORT_REVIEW_PATH = "/transaction/import-review"

// Layout /transaction dipakai bersama sub-route-nya, jadi konten mobile dipilih per pathname.
export function MobileTransactionRoutes() {
  const pathname = usePathname()

  if (pathname === TRANSACTION_PATH) return <MobileTransactionPage />
  if (pathname === IMPORT_REVIEW_PATH) return <MobileImportReviewPage />
  // Sisa sub-route satu segmen = /transaction/[transactionCode]
  const transactionCode = pathname.slice(TRANSACTION_PATH.length + 1)
  if (pathname.startsWith(`${TRANSACTION_PATH}/`) && transactionCode && !transactionCode.includes("/")) {
    return <MobileTransactionDetailPage transactionCode={decodeURIComponent(transactionCode)} />
  }
  return null
}
