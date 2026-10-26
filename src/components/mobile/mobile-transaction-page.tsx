"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { SearchIcon } from "lucide-react"
import { CATEGORY_OPTIONS } from "@/components/header/category-type-field"
import { TransactionFilterDrawer } from "@/components/header/transaction-filter-drawer"
import { formatAmount, type Transaction, type TransactionType } from "@/components/table/TableComponent"
import { SortableHead, fromServerSort, nextServerSort, type SortKey } from "@/components/table/SortableHead"
import { DEFAULT_PAGE_SIZE, TablePagination } from "@/components/table/TablePagination"
import { Input } from "@/components/ui/input"
import { Spinner, LoadingState } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useIsMobile } from "@/hooks/use-mobile"
import { useTransactions } from "@/hooks/use-transactions"
import {
  DEFAULT_TRANSACTION_LIST_FILTER,
  type TransactionListFilter,
  type TransactionSortValue,
} from "@/lib/api/transaction"
import { ACCENT_ICON_CLASS, ACCENT_OUTLINE_CLASS } from "@/lib/styles"
import { cn } from "@/lib/utils"

// Tipe transaksi (lowercase) -> icon tipe kategori (uppercase di backend)
const TYPE_ICON = Object.fromEntries(
  CATEGORY_OPTIONS.map((o) => [o.value.toLowerCase(), o.icon])
) as Record<TransactionType, (typeof CATEGORY_OPTIONS)[number]["icon"]>

const AMOUNT_CLASS: Record<TransactionType, string> = {
  income: "text-emerald-600",
  expense: "text-[#282458]",
  saving: "text-[#6359E9]",
}

const INPUT_ICON_CLASS = cn(
  "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2",
  ACCENT_ICON_CLASS
)

const MOBILE_HEAD_CLASS = "px-4 font-semibold text-[#282458]"

interface MobileTransactionTableProps {
  transactions: readonly Transaction[]
  sort: TransactionSortValue
  onSortChange: (sort: TransactionSortValue) => void
}

function MobileTransactionTable({ transactions, sort: serverSort, onSortChange }: MobileTransactionTableProps) {
  const sort = fromServerSort(serverSort)
  const handleSort = (key: SortKey) => onSortChange(nextServerSort(serverSort, key))
  const router = useRouter()
  const openDetail = (code: string) => router.push(`/transaction/${encodeURIComponent(code)}`)

  return (
    <div className="overflow-hidden rounded-2xl bg-white mt-5">
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
          {transactions.map((trx) => (
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
                  <Image
                    src={TYPE_ICON[trx.type]}
                    alt={trx.category}
                    title={trx.category}
                    width={32}
                    height={32}
                    className="size-8 shrink-0"
                  />
                  <span className="truncate text-sm font-medium text-[#282458]">{trx.description}</span>
                </div>
              </TableCell>
              <TableCell className={cn("px-4 py-3 text-right text-sm font-semibold", AMOUNT_CLASS[trx.type])}>
                <span className="block truncate">{formatAmount(trx.type, trx.amount)}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function MobileTransactionList() {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE)
  const [filter, setFilter] = useState<TransactionListFilter>(DEFAULT_TRANSACTION_LIST_FILTER)
  const trimmedQuery = query.trim()
  const debouncedQuery = useDebouncedValue(trimmedQuery)
  const skip = (page - 1) * pageSize
  const { transactions, paging, isLoading, isFetching, error } = useTransactions(
    pageSize,
    skip,
    debouncedQuery,
    "",
    filter
  )
  const isSearching = trimmedQuery !== debouncedQuery || isFetching

  // Filter/ukuran halaman berubah -> hasil berbeda, jadi kembali ke halaman pertama
  const handleQueryChange = (value: string) => {
    setQuery(value)
    setPage(1)
  }
  const handleFilterChange = (value: TransactionListFilter) => {
    setFilter(value)
    setPage(1)
  }
  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setPage(1)
  }

  return (
    <>
      <header className="flex items-center gap-2 mt-5">
        <div className="group/accent relative min-w-0 flex-1">
          {isSearching ? (
            <Spinner className={cn(INPUT_ICON_CLASS, "animate-spin")} />
          ) : (
            <SearchIcon className={INPUT_ICON_CLASS} />
          )}
          <Input
            type="search"
            placeholder="Cari transaksi..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            className={cn("h-11 rounded-xl bg-white pl-9 placeholder:text-[#716EC9]/70", ACCENT_OUTLINE_CLASS)}
            aria-label="Cari transaksi"
          />
        </div>
        <div className="shrink-0 rounded-xl bg-white">
          <TransactionFilterDrawer value={filter} onApply={handleFilterChange} />
        </div>
      </header>

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : isLoading ? (
        <LoadingState label="Memuat transaksi..." />
      ) : (
        // Data lama tetap tampil (diredupkan) selama hasil baru dimuat
        <div
          className={cn("flex flex-col gap-3 transition-opacity", isSearching && "pointer-events-none opacity-50")}
          aria-busy={isSearching}
        >
          <MobileTransactionTable
            transactions={transactions}
            sort={filter.sort}
            onSortChange={(sort) => handleFilterChange({ ...filter, sort })}
          />
          <TablePagination
            currentPage={paging?.currentPage ?? page}
            totalPage={paging?.totalPage ?? 1}
            pageSize={pageSize}
            itemCount={transactions.length}
            totalItem={paging?.totalItem}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            disabled={isSearching}
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
