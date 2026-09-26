"use client"

import { SummaryCard } from "@/components/cards/summaryCard";
import { ExampleChart } from "@/components/chart/chartComponent";
import WalletIcon from "@/components/images/icons/Wallet.svg";
import IncomeIcon from "@/components/images/icons/incomeIcon.svg";
import SavingIcon from "@/components/images/icons/SavingIcon.svg";
import ExpenseIcon from "@/components/images/icons/ExpenseIcon.svg";
import { SearchHeader } from "@/components/header/SearchHeader";
import { TransactionTable } from "@/components/table/TableComponent";
import { LoadingState } from "@/components/ui/spinner";
import { useTransactions } from "@/hooks/use-transactions";
import { useTransactionStat } from "@/hooks/use-transaction-stat";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { TransactionStat } from "@/lib/api/transaction";
import { getMonthRange, toLocalDateString } from "@/lib/date";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

const HOME_TRANSACTION_LIMIT = 10;

const SUMMARY_CONFIG: { title: string; key: keyof TransactionStat; icon: typeof WalletIcon }[] = [
  { title: "Total Balance", key: "totalBalance", icon: WalletIcon },
  { title: "Total Income", key: "totalIncome", icon: IncomeIcon },
  { title: "Total Saving", key: "totalSaving", icon: SavingIcon },
  { title: "Total Expense", key: "totalExpense", icon: ExpenseIcon },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const trimmedQuery = query.trim();
  const debouncedQuery = useDebouncedValue(trimmedQuery);
  const dateFilter = date ? toLocalDateString(date) : "";
  const { transactions, isLoading, isFetching, error } = useTransactions(
    HOME_TRANSACTION_LIMIT,
    0,
    debouncedQuery,
    dateFilter
  );

  const isSearching = trimmedQuery !== debouncedQuery || isFetching;
  const { startDate, endDate } = useMemo(() => getMonthRange(), []);
  const { stat, isLoading: isStatLoading, error: statError } = useTransactionStat(startDate, endDate);

  return (
    <div className="mx-auto w-full py-4">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-8">
        {SUMMARY_CONFIG.map(({ title, key, icon }) => (
          <SummaryCard
            key={key}
            title={title}
            icon={icon}
            total={stat?.[key].amount ?? 0}
            percentage={stat?.[key].changePercentage ?? 0}
            isLoading={isStatLoading}
          />
        ))}
      </section>
      {statError && <p className="mt-2 text-sm text-destructive">{statError}</p>}

      {/* Chart */}
      <section className="mt-8 min-w-0 overflow-hidden">
        <ExampleChart />
      </section>

      {/* Search & filter */}
      <section className="mt-8">
        <SearchHeader
          query={query}
          date={date}
          onQueryChange={setQuery}
          onDateChange={setDate}
          isSearching={isSearching}
        />
        {error ? (
          <p className="mt-4 text-sm text-destructive">{error}</p>
        ) : isLoading ? (
          <LoadingState label="Memuat transaksi..." className="mt-4" />
        ) : (
          // Data lama tetap tampil (diredupkan) selama hasil search baru dimuat
          <div
            className={cn("transition-opacity", isSearching && "pointer-events-none opacity-50")}
            aria-busy={isSearching}
          >
            <TransactionTable
              transactions={transactions}
              limit={HOME_TRANSACTION_LIMIT}
              detailHref="/transaction"
            />
          </div>
        )}
      </section>
    </div>
  );
}
