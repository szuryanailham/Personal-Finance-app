"use client"

import { usePathname } from "next/navigation"
import { MobileImportReviewPage } from "@/components/mobile/mobile-import-review-page"

const IMPORT_REVIEW_PATH = "/transaction/import-review"

// Layout /transaction dipakai bersama sub-route-nya, jadi konten mobile dipilih per pathname.
// Halaman /transaction sendiri belum punya versi mobile.
export function MobileTransactionRoutes() {
  const pathname = usePathname()

  if (pathname === IMPORT_REVIEW_PATH) return <MobileImportReviewPage />
  return null
}
