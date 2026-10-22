"use client"

import { toast } from "sonner"

import { ExportForm } from "@/components/export/export-form"
import { ExportSubmitButton } from "@/components/export/export-submit-button"
import { useExportTransactions } from "@/components/export/use-export-transactions"

// Halaman export versi mobile: form yang sama dengan drawer export desktop, tampil sebagai halaman penuh.
export function MobileExportPage() {
  const exportState = useExportTransactions({
    onExported: () => toast.success("Transaksi berhasil diexport"),
  })

  return (
    // Tinggi minimal = layar dikurangi header (4rem) dan ruang navbar bawah (5rem + safe area),
    // jadi card putih mengisi sisa layar dan tombol export berada tepat di atas navbar
    <div className="mx-auto flex min-h-[calc(100svh-9rem-env(safe-area-inset-bottom))] w-full max-w-xl flex-col gap-6 px-5 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-col gap-1 px-1">
        <h1 className="text-lg font-semibold text-slate-900">Export</h1>
        <p className="text-sm text-muted-foreground">Unduh transaksimu sebagai file.</p>
      </div>
      <section className="flex-1 rounded-2xl bg-white px-5 py-6 shadow-sm sm:p-8">
        <ExportForm state={exportState} className="gap-8" />
      </section>
      <ExportSubmitButton state={exportState} className="mt-2 h-12 w-full rounded-xl" />
    </div>
  )
}
