"use client"

import { useState } from "react"
import { ChevronDownIcon, FolderPlusIcon, PlusIcon, ReceiptIcon } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddTransactionDialog } from "./add-transaction-dialog"
import { AddCategoryDialog } from "./add-category-dialog"

type ActiveDialog = "transaction" | "category" | null

interface AddActionMenuProps {
  triggerClassName?: string
  /** `floating`: tombol bulat melayang di pojok kanan bawah (untuk mobile) */
  variant?: "button" | "floating"
}

const FLOATING_TRIGGER_CLASS =
  "fixed right-5 bottom-5 z-40 size-14 rounded-full bg-[#6359E9] text-white shadow-lg hover:bg-[#6359E9]/90 [&_svg:not([class*='size-'])]:size-6"

// Tombol "Add" dengan dropdown; tiap item membuka dialog masing-masing.
// Dialog dirender di luar menu agar tetap terbuka setelah menu tertutup.
export function AddActionMenu({ triggerClassName, variant = "button" }: AddActionMenuProps) {
  const isFloating = variant === "floating"
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null)

  function handleOpenChange(dialog: Exclude<ActiveDialog, null>) {
    return (open: boolean) => setActiveDialog(open ? dialog : null)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            isFloating ? (
              <Button className={cn(FLOATING_TRIGGER_CLASS, triggerClassName)} aria-label="Add new">
                <PlusIcon />
              </Button>
            ) : (
              <Button className={cn("gap-2", triggerClassName)} variant="outline" size="lg">
                Add New
                <ChevronDownIcon className="size-4" />
              </Button>
            )
          }
        />
        <DropdownMenuContent
          align={isFloating ? "end" : "start"}
          side={isFloating ? "top" : "bottom"}
          sideOffset={isFloating ? 8 : 4}
          className="min-w-44"
        >
          <DropdownMenuItem onClick={() => setActiveDialog("transaction")}>
            <ReceiptIcon />
            Add Transaction
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveDialog("category")}>
            <FolderPlusIcon />
            Add Category
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddTransactionDialog
        open={activeDialog === "transaction"}
        onOpenChange={handleOpenChange("transaction")}
      />
      <AddCategoryDialog
        open={activeDialog === "category"}
        onOpenChange={handleOpenChange("category")}
      />
    </>
  )
}
