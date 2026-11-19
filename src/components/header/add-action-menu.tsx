"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { AddTransactionDialog } from "./add-transaction-dialog"

interface AddActionMenuProps {
  triggerClassName?: string
  /** `floating`: tombol bulat melayang di pojok kanan bawah (untuk mobile) */
  variant?: "button" | "floating"
}

const PRIMARY_TRIGGER_CLASS =
  "bg-[#14864A] text-white hover:bg-[#10733e]"
const FLOATING_TRIGGER_CLASS =
  "fixed right-5 bottom-5 z-40 size-14 rounded-full [&_svg:not([class*='size-'])]:size-6"

export function AddActionMenu({ triggerClassName, variant = "button" }: AddActionMenuProps) {
  const isFloating = variant === "floating"
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        type="button"
        data-guidance="add-transaction"
        aria-label="Add Transaction"
        size="lg"
        className={cn(PRIMARY_TRIGGER_CLASS, isFloating ? FLOATING_TRIGGER_CLASS : "px-4", triggerClassName)}
        onClick={() => setOpen(true)}
      >
        <PlusIcon aria-hidden="true" />
        {!isFloating && "Add Transaction"}
      </Button>
      <AddTransactionDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
