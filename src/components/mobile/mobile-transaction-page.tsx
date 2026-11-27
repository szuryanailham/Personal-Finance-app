"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { PencilIcon } from "lucide-react"
import { CATEGORY_OPTIONS } from "@/components/header/category-type-field"
import { getMonthYearRange, useTransactionFilter } from "@/components/header/transaction-filter-context"
import { formatAmount, type Transaction, type TransactionType } from "@/components/table/TableComponent"
import { SortableHead, fromServerSort, nextServerSort, type SortKey } from "@/components/table/SortableHead"
import { DEFAULT_PAGE_SIZE, TablePagination } from "@/components/table/TablePagination"
import { EditTransactionDialog } from "@/components/table/edit-transaction-dialog"
import { Button } from "@/components/ui/button"
import { LoadingState } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useIsMobile } from "@/hooks/use-mobile"
import { useTransactions } from "@/hooks/use-transactions"
import { useCategoriesById } from "@/hooks/use-categories"
import { CategoryIcon } from "@/components/table/category-icon"
import {
  dateFilterKey,
  DEFAULT_TRANSACTION_LIST_FILTER,
  type TransactionDateFilter,
  type TransactionSortValue,
} from "@/lib/api/transaction"
import { cn } from "@/lib/utils"

// Tipe transaksi (lowercase) -> icon tipe kategori (uppercase di backend)
const TYPE_ICON = Object.fromEntries(
  CATEGORY_OPTIONS.map((o) => [o.value.toLowerCase(), o.icon])
) as Record<TransactionType, (typeof CATEGORY_OPTIONS)[number]["icon"]>

const AMOUNT_CLASS: Record<TransactionType, string> = {
  income: "text-emerald-600",
  expense: "text-[#282458]",
  saving: "text-[#14864A]",
}

const MOBILE_HEAD_CLASS = "px-4 font-semibold text-[#282458]"

interface MobileTransactionTableProps {
  transactions: readonly Transaction[]
  sort: TransactionSortValue
  onSortChange: (sort: TransactionSortValue) => void
}

function MobileTransactionTable({ transactions, sort: serverSort, onSortChange }: MobileTransactionTableProps) {
  const categories = useCategoriesById()
  const [editing, setEditing] = useState<Transaction | null>(null)
  const sort = fromServerSort(serverSort)
  const handleSort = (key: SortKey) => onSortChange(nextServerSort(serverSort, key))
  const router = useRouter()
  const openDetail = (code: string) => router.push(`/transaction/${encodeURIComponent(code)}`)

  return (
    <div data-guidance="transaction-history" className="overflow-hidden rounded-2xl bg-white mt-5">
      <Table className="table-fixed">
        {transactions.length === 0 && <TableCaption className="pb-4">Tidak ada transaksi.</TableCaption>}
        <TableHeader>
          <TableRow className="bg-[#D1CFEB] hover:bg-[#D1CFEB]">
            {/* Kolom Transaksi diurutkan berdasarkan tanggal (terbaru/terlama) */}
            <SortableHead
              label="Transaksi"
              sortKey="date"
              sort={sort}
              onSort={handleSort}
              className={cn(MOBILE_HEAD_CLASS, "text-left")}
              align="left"
            />
            <SortableHead
              label="Total"
              sortKey="amount"
              sort={sort}
              onSort={handleSort}
              className={cn(MOBILE_HEAD_CLASS, "w-[40%] text-right")}
              align="right"
            />
          </TableRow>
        </TableHeader>
        <TableBody >
          {transactions.map((trx) => {
            const category = categories.get(trx.categoryId)
            return (
              <TableRow
                key={trx.transactionCode}
                role="link"
                tabIndex={0}
                aria-label={`Lihat detail ${trx.description}`}
                className="cursor-pointer active:bg-[#F3F2FB]"
                onClick={() => openDetail(trx.transactionCode)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") openDetail(trx.transactionCode)
                }}
              >
                <TableCell className="px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    {category?.icon || category?.color ? <CategoryIcon category={category} /> : <Image
                      src={TYPE_ICON[trx.type]}
                      alt=""
                      width={32}
                      height={32}
                      className="size-8 shrink-0"
                    />}
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-[#282458]">{trx.description}</span>
                      <span className="block truncate text-xs text-muted-foreground">{category?.name ?? trx.category}</span>
                    </span>
                  </div>
                </TableCell>
                <TableCell className={cn("px-4 py-3 text-right text-sm font-semibold", AMOUNT_CLASS[trx.type])}>
                  <span className="block truncate">{formatAmount(trx.type, trx.amount)}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={`Edit ${trx.description}`}
                    onClick={(event) => { event.stopPropagation(); setEditing(trx) }}
                    onKeyDown={(event) => event.stopPropagation()}
                    className="mt-1"
                  >
                    <PencilIcon aria-hidden="true" /> Edit
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <EditTransactionDialog transaction={editing} onClose={() => setEditing(null)} />
    </div>
  )
}

function MobileTransactionList() {
  const { filter } = useTransactionFilter()
  const now = new Date()
  const range = filter.period === "custom" ? filter : getMonthYearRange(
    now.getFullYear(),
    filter.period === "monthly" ? String(now.getMonth() + 1).padStart(2, "0") : ""
  )
  const dateRange: TransactionDateFilter = filter.period === "weekly"
    ? { preset: "last7" }
    : { preset: "custom", startDate: range.startDate, endDate: range.endDate }
  const periodKey = dateFilterKey(dateRange)
  const [pagination, setPagination] = useState({ periodKey, page: 1 })
  if (pagination.periodKey !== periodKey) setPagination({ periodKey, page: 1 })
  const page = pagination.periodKey === periodKey ? pagination.page : 1
  const setPage = (page: number) => setPagination({ periodKey, page })
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE)
  const [sort, setSort] = useState(DEFAULT_TRANSACTION_LIST_FILTER.sort)
  const skip = (page - 1) * pageSize
  const { transactions, paging, isLoading, isFetching, error } = useTransactions(
    pageSize,
    skip,
    "",
    "",
    { ...DEFAULT_TRANSACTION_LIST_FILTER, sort, dateRange }
  )

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setPage(1)
  }

  return (
    <>
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : isLoading ? (
        <LoadingState label="Memuat transaksi..." />
      ) : (
        // Data lama tetap tampil (diredupkan) selama hasil baru dimuat
        <div
          className={cn("flex flex-col gap-3 transition-opacity", isFetching && "pointer-events-none opacity-50")}
          aria-busy={isFetching}
        >
          <MobileTransactionTable
            transactions={transactions}
            sort={sort}
            onSortChange={(value) => {
              setSort(value)
              setPage(1)
            }}
          />
          <TablePagination
            currentPage={paging?.currentPage ?? page}
            totalPage={paging?.totalPage ?? 1}
            pageSize={pageSize}
            itemCount={transactions.length}
            totalItem={paging?.totalItem}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            disabled={isFetching}
          />
        </div>
      )}
    </>
  )
}

// Halaman transaksi versi mobile. Tree mobile tetap ter-mount di desktop (hanya disembunyikan CSS),
// jadi list (beserta fetch-nya) hanya dirender saat layar mobile agar tidak dobel dengan desktop.
export function MobileTransactionPage() {
  const isMobile = useIsMobile()

  return <div className="flex flex-col gap-4 px-4 pb-6">{isMobile && <MobileTransactionList />}</div>
}
