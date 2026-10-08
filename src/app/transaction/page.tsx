"use client"

import { SearchHeader } from '@/components/header/SearchHeader'
import { TransactionTable } from '@/components/table/TableComponent';
import { DEFAULT_PAGE_SIZE, TablePagination } from '@/components/table/TablePagination';
import TableTransactionDetail from '@/components/table/TableTransactionDetail';
import { LoadingState } from '@/components/ui/spinner';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useTransactions } from '@/hooks/use-transactions';
import { DEFAULT_TRANSACTION_LIST_FILTER, type TransactionListFilter } from '@/lib/api/transaction';
import { toLocalDateString } from '@/lib/date';
import { cn } from '@/lib/utils';
import React, { useState } from 'react'

export default function TransactionPage() {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [page, setPage] = useState(1);
  // Jumlah baris per halaman yang diminta ke backend (?limit=)
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [filter, setFilter] = useState<TransactionListFilter>(DEFAULT_TRANSACTION_LIST_FILTER);
  const trimmedQuery = query.trim();
  const debouncedQuery = useDebouncedValue(trimmedQuery);
  const dateFilter = date ? toLocalDateString(date) : "";
  // Backend memakai skip sebagai offset baris: halaman 2 -> skip=10
  const skip = (page - 1) * pageSize;
  const { transactions, paging, isLoading, isFetching, error } = useTransactions(
    pageSize,
    skip,
    debouncedQuery,
    dateFilter,
    filter
  );

  // Filter berubah -> hasil berbeda, jadi kembali ke halaman pertama
  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const handleDateChange = (value: Date | undefined) => {
    setDate(value);
    setPage(1);
  };
  const handleFilterChange = (value: TransactionListFilter) => {
    setFilter(value);
    setPage(1);
  };
  // Ukuran halaman berubah -> offset lama tidak lagi valid
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const isSearching = trimmedQuery !== debouncedQuery || isFetching;

  return (
    <div className="mx-auto w-full pb-8">
      {/* Search & filter */}
      <section>
        <SearchHeader
          query={query}
          date={date}
          onQueryChange={handleQueryChange}
          onDateChange={handleDateChange}
          isSearching={isSearching}
          filter={filter}
          onFilterChange={handleFilterChange}
        />
        {error ? (
          <p className="mt-4 text-sm text-destructive">{error}</p>
        ) : isLoading ? (
          <LoadingState label="Memuat transaksi..." className="mt-4" />
        ) : (
          // Data lama tetap tampil (diredupkan) selama halaman/hasil search baru dimuat
          <div
            className={cn("transition-opacity", isSearching && "pointer-events-none opacity-50")}
            aria-busy={isSearching}
          >
            <TableTransactionDetail
              transactions={transactions}
              onEdit={(trx) => { /* buka form edit */ }}
              onDelete={(trx) => { /* konfirmasi & hapus */ }}
              onBulkUpdate={(selected) => { /* buka form bulk update */ }}
              onBulkDelete={(selected) => { /* konfirmasi & hapus massal */ }}
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
      </section>
    </div>
  )
}
