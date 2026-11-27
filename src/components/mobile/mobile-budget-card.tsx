"use client"

import { useCategories } from "@/hooks/use-categories"
import { useIsMobile } from "@/hooks/use-mobile"
import { categoryCurrency } from "@/lib/category-appearance"

const percentageFormatter = new Intl.NumberFormat("id-ID", { style: "percent", maximumFractionDigits: 1 })

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
  const usage = budget > 0 ? expense / budget : 0

  return (
    <section
      aria-labelledby="mobile-budget-title"
      aria-busy={!isMobile || isLoading}
      className="min-w-0 md:hidden"
    >
      <h2 id="mobile-budget-title" className="text-sm font-semibold">
        Sisa anggaran pengeluaran
      </h2>
      {!isMobile || isLoading ? (
        <p className="mt-1 text-sm text-emerald-50">Memuat anggaran…</p>
      ) : error ? (
        <p className="mt-1 text-sm text-red-100">Anggaran gagal dimuat.</p>
      ) : (
        <>
          <p className="mt-1 text-4xl font-bold tracking-tight tabular-nums [overflow-wrap:anywhere]">
            {isHidden ? "••••••" : categoryCurrency.format(remaining)}
          </p>
          {!isHidden && (
            <>
              {budget > 0 && (
                <div aria-hidden="true" className="mt-3 grid grid-cols-4 gap-1">
                  {[0, 1, 2, 3].map(segment => (
                    <div key={segment} className="h-2.5 overflow-hidden rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-amber-300"
                        style={{ width: `${Math.min(1, Math.max(0, usage * 4 - segment)) * 100}%` }}
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-2 flex items-baseline justify-between gap-2 text-xs text-emerald-50">
                <p className="min-w-0 [overflow-wrap:anywhere]">
                  {categoryCurrency.format(expense)} terpakai dari {categoryCurrency.format(budget)}
                </p>
                {budget > 0 && <span className="shrink-0 font-bold text-amber-300">{percentageFormatter.format(usage)}</span>}
              </div>
              {overBudget && <p className="mt-1 text-sm font-medium text-red-100">Melebihi anggaran</p>}
              {budget === 0 && <p className="mt-1 text-sm text-emerald-50">Belum ada anggaran.</p>}
            </>
          )}
        </>
      )}
    </section>
  )
}
