"use client"

import { TransactionCalendar } from "@/components/calendar/transaction-calendar"
import { useIsMobile } from "@/hooks/use-mobile"

// Halaman kalender versi mobile. Tree mobile tetap ter-mount di desktop (hanya disembunyikan CSS),
// jadi konten hanya dirender saat layar mobile agar tidak dobel dengan halaman desktop.
export function MobileCalendarPage() {
  const isMobile = useIsMobile()

  return (
    <div className="flex min-w-0 flex-col gap-4 px-4 pb-6">
      <h1 className="text-lg font-semibold text-slate-900">Kalender</h1>
      {isMobile && <TransactionCalendar />}
    </div>
  )
}
