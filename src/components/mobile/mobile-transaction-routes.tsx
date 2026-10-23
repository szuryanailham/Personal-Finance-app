"use client"

import { usePathname } from "next/navigation"
import { MobileImportReviewPage } from "@/components/mobile/mobile-import-review-page"
import { MobileTransactionPage } from "@/components/mobile/mobile-transaction-page"

const TRANSACTION_PATH = "/transaction"
const IMPORT_REVIEW_PATH = "/transaction/import-review"

// Layout /transaction dipakai bersama sub-route-nya, jadi konten mobile dipilih per pathname.
export function MobileTransactionRoutes() {
  const pathname = usePathname()

  if (pathname === TRANSACTION_PATH) return <MobileTransactionPage />
  if (pathname === IMPORT_REVIEW_PATH) return <MobileImportReviewPage />
  return null
}
