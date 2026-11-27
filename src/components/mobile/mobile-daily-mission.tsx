"use client"

import { useId, useState } from "react"
import Image from "next/image"
import { AddTransactionDialog } from "@/components/header/add-transaction-dialog"
import mascot from "@/components/images/icons/mascot.png"
import { Button } from "@/components/ui/button"

export function MobileDailyMission() {
  const titleId = useId()
  const [open, setOpen] = useState(false)

  return (
    <section
      aria-labelledby={titleId}
      className="mt-6 flex items-end gap-2 rounded-[20px] bg-[#e9dff9] p-4"
    >
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold tracking-wide text-[#6d28d9] uppercase">Misi hari ini</p>
        <h2 id={titleId} className="mt-1 text-left text-base leading-tight font-bold text-slate-900">
          Catat satu
          <br />
          pengeluaran hari ini
        </h2>
        <p className="mt-1 text-xs text-slate-700">Satu catatan cukup buat mulai.</p>
        <Button
          type="button"
          className="mt-3 h-10 rounded-full bg-[#6d28d9] px-3 text-xs font-semibold text-white hover:bg-[#5b21b6]"
          onClick={() => setOpen(true)}
        >
          Catat pengeluaran
        </Button>
      </div>
      <Image src={mascot} alt="" width={88} height={99} className="h-auto w-16 shrink-0 min-[360px]:w-[88px]" />
      <AddTransactionDialog open={open} onOpenChange={setOpen} />
    </section>
  )
}
