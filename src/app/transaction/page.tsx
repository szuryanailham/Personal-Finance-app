"use client"

import { SearchHeader } from '@/components/header/SearchHeader'
import { TransactionTable } from '@/components/table/TableComponent';
import { TablePagination } from '@/components/table/TablePagination';
import TableTransactionDetail from '@/components/table/TableTransactionDetail';
import { LoadingState } from '@/components/ui/spinner';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useTransactions } from '@/hooks/use-transactions';
import { toLocalDateString } from '@/lib/date';
import { cn } from '@/lib/utils';
import React, { useState } from 'react'

// Jumlah baris per halaman yang diminta ke backend (?limit=)
const PAGE_SIZE = 10;

export default function TransactionPage() {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [page, setPage] = useState(1);
  const trimmedQuery = query.trim();
  const debouncedQuery = useDebouncedValue(trimmedQuery);
  const dateFilter = date ? toLocalDateString(date) : "";
  // Backend memakai skip sebagai offset baris: halaman 2 -> skip=10
  const skip = (page - 1) * PAGE_SIZE;
  const { transactions, paging, isLoading, isFetching, error } = useTransactions(
    PAGE_SIZE,
    skip,
    debouncedQuery,
    dateFilter
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

  const isSearching = trimmedQuery !== debouncedQuery || isFetching;

  return (
    <div className="mx-auto w-full pb-4">
      {/* Search & filter */}
      <section className="mt-8">
        <SearchHeader
          query={query}
          date={date}
          onQueryChange={handleQueryChange}
          onDateChange={handleDateChange}
          isSearching={isSearching}
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
                />

            <TablePagination
              currentPage={paging?.currentPage ?? page}
              totalPage={paging?.totalPage ?? 1}
              onPageChange={setPage}
              disabled={isSearching}
            />
          </div>
        )}
      </section>
    </div>
  )
}
