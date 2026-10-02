"use client"

import { useState } from "react"
import { ChevronDownIcon, FolderPlusIcon, ReceiptIcon } from "lucide-react"
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
}

// Tombol "Add" dengan dropdown; tiap item membuka dialog masing-masing.
// Dialog dirender di luar menu agar tetap terbuka setelah menu tertutup.
export function AddActionMenu({ triggerClassName }: AddActionMenuProps) {
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null)

  function handleOpenChange(dialog: Exclude<ActiveDialog, null>) {
    return (open: boolean) => setActiveDialog(open ? dialog : null)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button className={cn("gap-2", triggerClassName)} variant="outline" size="lg">
              Add New
              <ChevronDownIcon className="size-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="start" className="min-w-44">
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
