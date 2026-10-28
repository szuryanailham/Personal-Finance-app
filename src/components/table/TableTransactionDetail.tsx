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
import {
  HEAD_CLASS,
  SortableHead,
  fromServerSort,
  nextServerSort,
  type SortKey,
} from "@/components/table/SortableHead"
import type { TransactionSortValue } from "@/lib/api/transaction"
import { cn } from "@/lib/utils"

interface TableTransactionDetailProps {
  transactions: readonly Transaction[]
  // Sort dilakukan di backend agar berlaku ke semua halaman, bukan hanya baris yang sedang tampil
  sort: TransactionSortValue
  onSortChange: (sort: TransactionSortValue) => void
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
            <span className="sr-only">Buka menu</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit?.(transaction)}>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => onDelete?.(transaction)}>
          Hapus
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
        {selected.length} transaksi dipilih
      </span>
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-slate-500">
          Total jumlah:{" "}
          <span className="font-semibold text-[#282458]">
            {formatAmount(total < 0 ? "expense" : "income", total)}
          </span>
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-[#14864A] text-white hover:bg-[#10733e]"
            onClick={() => onBulkUpdate?.(selected)}
          >
            <PencilIcon />
            Update Massal
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onBulkDelete?.(selected)}>
            <Trash2Icon />
            Hapus Massal
          </Button>
          <Button variant="ghost" size="sm" onClick={onClear}>
            Bersihkan
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function TableTransactionDetail({
  transactions,
  sort: serverSort,
  onSortChange,
  onEdit,
  onDelete,
  onBulkUpdate,
  onBulkDelete,
  className,
}: TableTransactionDetailProps) {
  const sort = fromServerSort(serverSort)
  const handleSort = (key: SortKey) => onSortChange(nextServerSort(serverSort, key))
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
        {isEmpty && <TableCaption>Tidak ada transaksi.</TableCaption>}
        <TableHeader>
          <TableRow className="bg-[#DCF8E6] hover:bg-[#DCF8E6]">
            <TableHead className="w-[48px] bg-[#DCF8E6] px-4">
              <Checkbox
                checked={isAllSelected}
                indeterminate={isSomeSelected}
                disabled={isEmpty}
                className={CHECKBOX_CLASS}
                onCheckedChange={(checked) => toggleAll(checked)}
                aria-label="Pilih semua"
              />
            </TableHead>
            <SortableHead label="Kode Transaksi" sortKey="transactionCode" sort={sort} onSort={handleSort} className="w-[160px]" />
            <SortableHead label="Nama" sortKey="description" sort={sort} onSort={handleSort} className="w-[260px]" />
            <SortableHead label="Kategori" sortKey="category" sort={sort} onSort={handleSort} className="w-[200px]" />
            <SortableHead label="Tanggal" sortKey="date" sort={sort} onSort={handleSort} className="w-[160px]" />
            <SortableHead label="Jumlah" sortKey="amount" sort={sort} onSort={handleSort} className="w-[200px] text-right" align="right" />
            <TableHead className={cn(HEAD_CLASS, "w-[100px] text-right")}>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((trx) => (
            <TableRow
              key={trx.transactionCode}
              data-state={selectedCodes.has(trx.transactionCode) ? "selected" : undefined}
            >
              <TableCell className="px-4">
                <Checkbox
                  checked={selectedCodes.has(trx.transactionCode)}
                  className={CHECKBOX_CLASS}
                  onCheckedChange={(checked) => toggleRow(trx.transactionCode, checked)}
                  aria-label={`Pilih ${trx.description}`}
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
