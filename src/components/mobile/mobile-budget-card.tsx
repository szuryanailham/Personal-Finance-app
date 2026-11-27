"use client"

import { useCategories } from "@/hooks/use-categories"
import { useIsMobile } from "@/hooks/use-mobile"
import { categoryCurrency } from "@/lib/category-appearance"

export function MobileBudgetCard({ isHidden }: { isHidden: boolean }) {
  const isMobile = useIsMobile()
  const { categories, isLoading, error } = useCategories(isMobile, null)
  const { expense, budget } = categories.reduce((total, category) => {
    if (category.type === "EXPENSE") {
      total.expense += category.totalExpense ?? 0
      total.budget += category.budget ?? 0
    }
    return total
  }, { expense: 0, budget: 0 })

  const remaining = budget - expense
  const overBudget = remaining < 0
  const usage = budget > 0 ? Math.min(100, Math.max(0, (expense / budget) * 100)) : 0

  return (
    <section
      aria-labelledby="mobile-budget-title"
      aria-busy={!isMobile || isLoading}
      className="min-w-0 md:hidden"
    >
      <h2 id="mobile-budget-title" className="text-sm font-medium text-emerald-50">
        Sisa Anggaran Pengeluaran
      </h2>
      {!isMobile || isLoading ? (
        <p className="mt-1 text-sm text-emerald-50">Memuat anggaran…</p>
      ) : error ? (
        <p className="mt-1 text-sm text-red-100">Anggaran gagal dimuat.</p>
      ) : (
        <>
          <p className="mt-1 break-words text-2xl font-bold tabular-nums">
            {isHidden ? "••••••" : categoryCurrency.format(remaining)}
          </p>
          {!isHidden && (
            <>
              {budget > 0 && (
                <div aria-hidden="true" className="mt-3 h-2 overflow-hidden rounded-full bg-black/20">
                  <div
                    className="h-full bg-amber-300"
                    style={{ width: `${usage}%` }}
                  />
                </div>
              )}
              <p className="mt-2 text-sm text-emerald-50 [overflow-wrap:anywhere]">
                {categoryCurrency.format(expense)} terpakai dari {categoryCurrency.format(budget)}
              </p>
              {overBudget && <p className="mt-1 text-sm font-medium text-red-100">Melebihi anggaran</p>}
              {budget === 0 && <p className="mt-1 text-sm text-emerald-50">Belum ada anggaran.</p>}
            </>
          )}
        </>
      )}
    </section>
  )
}
