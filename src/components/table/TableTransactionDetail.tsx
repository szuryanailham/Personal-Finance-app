"use client"

import { MoreHorizontalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
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

export default function TableTransactionDetail({
  transactions,
  onEdit,
  onDelete,
  className,
}: TableTransactionDetailProps) {
  const { sort, sorted: sortedTransactions, handleSort } = useTransactionSort(transactions)
  const isEmpty = transactions.length === 0

  return (
    <div className={cn("w-full rounded-[14px] bg-white px-3 py-4", className)}>
      <Table className="min-w-[900px] table-fixed">
        {isEmpty && <TableCaption>No transactions found.</TableCaption>}
        <TableHeader>
          <TableRow className="bg-[#D1CFEB] hover:bg-[#D1CFEB]">
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
            <TableRow key={trx.transactionCode}>
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
