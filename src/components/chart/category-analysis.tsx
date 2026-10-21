"use client"

import * as React from "react"

import { CategoryStatisticFilterDrawer } from "@/components/chart/category-statistic-filter-drawer"
import { ExpenseCategoryChart } from "@/components/chart/expense-category-chart"
import { CategoryStatisticTable } from "@/components/table/category-statistic-table"
import { useCategoryStatistic } from "@/hooks/use-category-statistic"
import { DEFAULT_CATEGORY_STATISTIC_QUERY, type CategoryStatisticQuery } from "@/lib/api/category"

// Konten analisis (filter, chart, tabel) yang dipakai halaman desktop dan mobile
export function CategoryAnalysis({ className }: { className?: string }) {
  const [query, setQuery] = React.useState<CategoryStatisticQuery>(DEFAULT_CATEGORY_STATISTIC_QUERY)
  const categoryStatistic = useCategoryStatistic(query)

  return (
    <div className={`flex w-full flex-col gap-4 ${className ?? ""}`}>
      <div className="flex justify-end">
        <CategoryStatisticFilterDrawer value={query} onApply={setQuery} />
      </div>
      <ExpenseCategoryChart {...categoryStatistic} />
      <CategoryStatisticTable {...categoryStatistic} />
    </div>
  )
}
