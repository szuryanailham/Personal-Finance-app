"use client"

import { ImportForm } from "@/components/import/import-form"
import { ImportSubmitButton } from "@/components/import/import-submit-button"
import { useImportFile } from "@/components/import/use-import-file"

// Halaman import versi mobile: form yang sama dengan drawer import desktop, tampil sebagai halaman penuh.
export function MobileImportPage() {
  const importState = useImportFile()

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-1 p-4">
        <h1 className="text-lg font-semibold text-slate-900">Import</h1>
        <p className="text-sm text-muted-foreground">Upload file untuk mengimpor transaksi kamu.</p>
      </div>
      <section className="rounded-2xl bg-white p-6">
        <ImportForm state={importState} />
      </section>
      <ImportSubmitButton state={importState} className="h-11 w-full" />
    </div>
  )
}
