"use client"

import { useMemo, useState } from "react"
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { dateFormatter, formatAmount, type Transaction } from "@/components/table/TableComponent"
import { HEAD_CLASS, SortableHead, useTransactionSort } from "@/components/table/SortableHead"
import { cn } from "@/lib/utils"

interface TableTransactionDetailProps {
  transactions: readonly Transaction[]
  onEdit?: (transaction: Transaction) => void
  onDelete?: (transaction: Transaction) => void
  onBulkUpdate?: (transactions: readonly Transaction[]) => void
  onBulkDelete?: (transactions: readonly Transaction[]) => void
  className?: string
}

interface TransactionActionsProps {
  transaction: Transaction
  onEdit?: (transaction: Transaction) => void
  onDelete?: (transaction: Transaction) => void
}

function TransactionActions({ transaction, onEdit, onDelete }: TransactionActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit?.(transaction)}>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => onDelete?.(transaction)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const CHECKBOX_CLASS =
  "border-[#B9B6E6] data-checked:border-[#D7D6F7] data-checked:bg-[#D7D6F7] data-checked:text-[#282458] data-indeterminate:border-[#D7D6F7] data-indeterminate:bg-[#D7D6F7] data-indeterminate:text-[#282458] dark:data-checked:bg-[#D7D6F7]"

function signedAmount(trx: Transaction): number {
  return trx.type === "expense" ? -Math.abs(trx.amount) : Math.abs(trx.amount)
}

interface SelectionSummaryProps {
  selected: readonly Transaction[]
  onClear: () => void
  onBulkUpdate?: (transactions: readonly Transaction[]) => void
  onBulkDelete?: (transactions: readonly Transaction[]) => void
}

function SelectionSummary({ selected, onClear, onBulkUpdate, onBulkDelete }: SelectionSummaryProps) {
  const total = selected.reduce((sum, trx) => sum + signedAmount(trx), 0)

  return (
    <div className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-[10px] bg-[#F3F2FB] px-4 py-2 text-sm">
      <span className="font-medium text-[#282458]">
        {selected.length} transaction{selected.length > 1 ? "s" : ""} selected
      </span>
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-slate-500">
          Total amount:{" "}
          <span className="font-semibold text-[#282458]">
            {formatAmount(total < 0 ? "expense" : "income", total)}
          </span>
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-[#6359E9] text-white hover:bg-[#6359E9]/80"
            onClick={() => onBulkUpdate?.(selected)}
          >
            <PencilIcon />
            Bulk Update
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onBulkDelete?.(selected)}>
            <Trash2Icon />
            Bulk Delete
          </Button>
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function TableTransactionDetail({
  transactions,
  onEdit,
  onDelete,
  onBulkUpdate,
  onBulkDelete,
  className,
}: TableTransactionDetailProps) {
  const { sort, sorted: sortedTransactions, handleSort } = useTransactionSort(transactions)
  const [selectedCodes, setSelectedCodes] = useState<ReadonlySet<string>>(() => new Set())
  const isEmpty = transactions.length === 0

  // Only count codes still present in the current list, so filtered-out rows drop out of the total.
  const selected = useMemo(
    () => transactions.filter((trx) => selectedCodes.has(trx.transactionCode)),
    [transactions, selectedCodes]
  )
  const isAllSelected = !isEmpty && selected.length === transactions.length
  const isSomeSelected = selected.length > 0 && !isAllSelected

  const toggleAll = (checked: boolean) => {
    setSelectedCodes(
      checked ? new Set(transactions.map((trx) => trx.transactionCode)) : new Set()
    )
  }

  const toggleRow = (code: string, checked: boolean) => {
    setSelectedCodes((prev) => {
      const next = new Set(prev)
      if (checked) next.add(code)
      else next.delete(code)
      return next
    })
  }

  return (
    <div className={cn("w-full rounded-[14px] bg-white px-3 py-2", className)}>
      {selected.length > 0 && (
        <SelectionSummary
          selected={selected}
          onClear={() => toggleAll(false)}
          onBulkUpdate={onBulkUpdate}
          onBulkDelete={onBulkDelete}
        />
      )}
      <Table className="min-w-[900px] table-fixed">
        {isEmpty && <TableCaption>No transactions found.</TableCaption>}
        <TableHeader>
          <TableRow className="bg-[#D1CFEB] hover:bg-[#D1CFEB]">
            <TableHead className="w-[48px] px-4">
              <Checkbox
                checked={isAllSelected}
                indeterminate={isSomeSelected}
                disabled={isEmpty}
                className={CHECKBOX_CLASS}
                onCheckedChange={(checked) => toggleAll(checked)}
                aria-label="Select all"
              />
            </TableHead>
            <SortableHead label="Transaction Code" sortKey="transactionCode" sort={sort} onSort={handleSort} className="w-[160px]" />
            <SortableHead label="Name" sortKey="description" sort={sort} onSort={handleSort} className="w-[260px]" />
            <SortableHead label="Category" sortKey="category" sort={sort} onSort={handleSort} className="w-[200px]" />
            <SortableHead label="Date" sortKey="date" sort={sort} onSort={handleSort} className="w-[160px]" />
            <SortableHead label="Amount" sortKey="amount" sort={sort} onSort={handleSort} className="w-[200px] text-right" align="right" />
            <TableHead className={cn(HEAD_CLASS, "w-[100px] text-right")}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.map((trx) => (
            <TableRow
              key={trx.transactionCode}
              data-state={selectedCodes.has(trx.transactionCode) ? "selected" : undefined}
            >
              <TableCell className="px-4">
                <Checkbox
                  checked={selectedCodes.has(trx.transactionCode)}
                  className={CHECKBOX_CLASS}
                  onCheckedChange={(checked) => toggleRow(trx.transactionCode, checked)}
                  aria-label={`Select ${trx.description}`}
                />
              </TableCell>
              <TableCell className="truncate px-4 text-center text-slate-500">
                {trx.transactionCode}
              </TableCell>
              <TableCell className="truncate px-4 text-center font-medium text-[#282458]">
                {trx.description}
              </TableCell>
              <TableCell className="truncate px-4 text-center text-slate-500">
                {trx.category}
              </TableCell>
              <TableCell className="px-4 text-center text-slate-500">
                {dateFormatter.format(trx.date)}
              </TableCell>
              <TableCell className="px-4 text-right font-semibold text-slate-500">
                {formatAmount(trx.type, trx.amount)}
              </TableCell>
              <TableCell className="px-4 text-right">
                <TransactionActions transaction={trx} onEdit={onEdit} onDelete={onDelete} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}