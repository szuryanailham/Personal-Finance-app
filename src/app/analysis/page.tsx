"use client"

import * as React from "react"

import { CategoryStatisticFilterDrawer } from "@/components/chart/category-statistic-filter-drawer"
import { ExpenseCategoryChart } from "@/components/chart/expense-category-chart"
import { CategoryStatisticTable } from "@/components/table/category-statistic-table"
import { useCategoryStatistic } from "@/hooks/use-category-statistic"
import { DEFAULT_CATEGORY_STATISTIC_QUERY, type CategoryStatisticQuery } from "@/lib/api/category"

export default function AnalysisPage() {
  const [query, setQuery] = React.useState<CategoryStatisticQuery>(DEFAULT_CATEGORY_STATISTIC_QUERY)
  const categoryStatistic = useCategoryStatistic(query)

  return (
    <div className="mx-auto flex w-full flex-col gap-4 py-4">
      <div className="flex justify-end">
        <CategoryStatisticFilterDrawer value={query} onApply={setQuery} />
      </div>
      <ExpenseCategoryChart {...categoryStatistic} />
      <CategoryStatisticTable {...categoryStatistic} />
    </div>
  );
}
