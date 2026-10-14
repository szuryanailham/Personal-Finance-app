"use client"

import * as React from "react"
import { Pie, PieChart, type PieLabelRenderProps } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { UseCategoryStatisticResult } from "@/hooks/use-category-statistic"
import type { CategoryStatisticItem } from "@/lib/api/category"

// Warna ditentukan FE; dipakai berurutan dan berulang jika kategori lebih banyak dari palet
export const CATEGORY_COLORS = ["#6359E9", "#64CFF6", "#282458", "#9A97F0", "#8C89B4"] as const

const currencyFormatter = new Intl.NumberFormat("id-ID")
const periodFormatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" })

interface ChartDatum {
  key: string
  amount: number
  percentage: number
  fill: string
}

// Key chart harus aman dipakai sebagai nama CSS variable, jadi pakai index bukan nama kategori
const toChartKey = (index: number) => `category-${index}`

function buildChart(categories: readonly CategoryStatisticItem[]) {
  const config: ChartConfig = { amount: { label: "Amount" } }
  const data: ChartDatum[] = categories.map((item, index) => {
    const key = toChartKey(index)
    config[key] = {
      label: item.categoryName,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }
    return { key, amount: item.totalAmount, percentage: item.percentage, fill: `var(--color-${key})` }
  })
  return { config, data }
}

// Tanggal "YYYY-MM-DD" diparse sebagai tanggal lokal agar tidak bergeser karena timezone
function formatDate(value: string): string {
  const [year, month, day] = value.split("-").map(Number)
  return periodFormatter.format(new Date(year, month - 1, day))
}

const renderPercentageLabel = ({ payload }: PieLabelRenderProps) =>
  `${(payload as ChartDatum).percentage}%`

// Data di-fetch di level halaman agar chart dan tabel berbagi satu request
export function ExpenseCategoryChart({ statistic, isLoading, error }: UseCategoryStatisticResult) {
  const { config, data } = React.useMemo(() => buildChart(statistic?.categories ?? []), [statistic])

  const description = statistic
    ? `${formatDate(statistic.period.startDate)} - ${formatDate(statistic.period.endDate)}`
    : " "

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Expense by Category</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {error ? (
          <p className="flex h-[400px] items-center justify-center text-sm text-destructive">{error}</p>
        ) : isLoading && !statistic ? (
          <p className="flex h-[400px] items-center justify-center text-sm text-muted-foreground">
            Memuat statistik...
          </p>
        ) : data.length === 0 ? (
          <p className="flex h-[400px] items-center justify-center text-sm text-muted-foreground">
            Belum ada pengeluaran pada periode ini
          </p>
        ) : (
          <ChartContainer
            config={config}
            className="mx-auto aspect-auto h-[400px] w-full pb-0 [&_.recharts-pie-label-text]:fill-foreground"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={data} dataKey="amount" label={renderPercentageLabel} nameKey="key" />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      {statistic && (
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="leading-none font-medium">
            Total pengeluaran Rp {currencyFormatter.format(statistic.totalExpense)}
          </div>
          <div className="leading-none text-muted-foreground">
            Dari {statistic.categories.length} kategori
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
