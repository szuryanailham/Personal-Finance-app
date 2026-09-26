"use client"

import { cn } from "cn"
import { ChevronDown } from "lucide-react"
import { useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { buttonVariants } from "@/components/ui/button"
import { LoadingState } from "@/components/ui/spinner"
import { useTransactionStatistic } from "@/hooks/use-transaction-statistic"
import type { StatisticItem, StatisticPeriod } from "@/lib/api/transaction"
import { ACCENT_ICON_CLASS, ACCENT_OUTLINE_CLASS } from "@/lib/styles"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type FinanceDatum = {
  label: string
  income: number
  expense: number
}

const MIN_BAR_GROUP_WIDTH = 56

// Disamakan dengan style tombol Import/Export di HeadDashboard
const PERIOD_SELECT_CLASS = `min-w-28 cursor-pointer appearance-none pr-9 pl-5 ${ACCENT_OUTLINE_CLASS}`

const PERIOD_OPTIONS: { value: StatisticPeriod; label: string }[] = [
  { value: "Monthly", label: "Monthly" },
  { value: "Weekly", label: "Weekly" },
]

const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" })

// Contoh label: "Tue 22"
const toFinanceDatum = (item: StatisticItem): FinanceDatum => ({
  label: `${weekdayFormatter.format(item.date)} ${item.date.getDate()}`,
  income: item.income,
  expense: item.expense,
})

const chartConfig = {
  income: {
    label: "Income",
    color: "#64CFF6",
  },
  expense: {
    label: "Expense",
    color: "#6359E9",
  },
} satisfies ChartConfig

const compactNumber = new Intl.NumberFormat("id-ID", {
  notation: "compact",
  maximumFractionDigits: 1,
})

const CHART_HEIGHT = 360
const Y_AXIS_WIDTH = 56
const X_AXIS_HEIGHT = 30
const Y_TICK_COUNT = 6
const CHART_MARGIN = { top: 12, right: 8, bottom: 0, left: 0 }
// Tinggi area plot (tanpa margin & sumbu X) — dipakai untuk memposisikan label Y
const PLOT_HEIGHT =
  CHART_HEIGHT - CHART_MARGIN.top - CHART_MARGIN.bottom - X_AXIS_HEIGHT
const GRID_DASH = "4 4"
const GRID_OPACITY = 0.35

const formatYAxisTick = (value: number) => compactNumber.format(value)

// Tick Y dihitung manual supaya sumbu Y (fixed) dan grid (scroll) memakai skala yang sama
const buildYTicks = (data: FinanceDatum[]): number[] => {
  const maxValue = Math.max(1, ...data.flatMap((d) => [d.income, d.expense]))
  const rawStep = maxValue / (Y_TICK_COUNT - 1)
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const step = Math.ceil(rawStep / magnitude) * magnitude

  return Array.from({ length: Y_TICK_COUNT }, (_, i) => i * step)
}

export function ExampleChart() {
  const [period, setPeriod] = useState<StatisticPeriod>("Monthly")
  const { statistic, isLoading, error } = useTransactionStatistic(period)
  const data = useMemo(() => (statistic?.items ?? []).map(toFinanceDatum), [statistic])
  const yTicks = buildYTicks(data)
  const yMax = yTicks[yTicks.length - 1]
  const yDomain = [0, yMax]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <div className="group/accent relative">
          <select
            aria-label="Filter period"
            value={period}
            onChange={(event) => setPeriod(event.target.value as StatisticPeriod)}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              PERIOD_SELECT_CLASS
            )}
          >
            {PERIOD_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-background text-foreground"
              >
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            className={cn(
              "pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2",
              ACCENT_ICON_CLASS
            )}
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {isLoading && !statistic && <LoadingState label="Memuat statistik..." />}

      {/* Data lama tetap tampil (diredupkan) selama periode baru dimuat */}
      <div
        className={cn("flex w-full transition-opacity", isLoading && statistic ? "opacity-50" : "")}
        aria-busy={isLoading}
      >
        {/* Label sumbu Y tetap (tidak ikut scroll), sejajar dengan garis grid */}
        <div
          aria-hidden
          className="relative shrink-0 text-xs text-muted-foreground"
          style={{ width: Y_AXIS_WIDTH, height: CHART_HEIGHT }}
        >
          {yTicks.map((tick) => (
            <span
              key={tick}
              className="absolute right-2 -translate-y-1/2 tabular-nums"
              style={{
                top: CHART_MARGIN.top + (1 - tick / yMax) * PLOT_HEIGHT,
              }}
            >
              {formatYAxisTick(tick)}
            </span>
          ))}
        </div>

        {/* Area bar yang bisa di-scroll */}
        <div className="min-w-0 flex-1 overflow-x-auto">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto w-full"
            style={{
              height: CHART_HEIGHT,
              minWidth: data.length * MIN_BAR_GROUP_WIDTH,
            }}
          >
            <BarChart accessibilityLayer data={data} margin={CHART_MARGIN}>
              <CartesianGrid
                vertical={false}
                stroke="var(--muted-foreground)"
                strokeOpacity={GRID_OPACITY}
                strokeDasharray={GRID_DASH}
              />
              <YAxis hide domain={yDomain} ticks={yTicks} />
              <XAxis
                dataKey="label"
                height={X_AXIS_HEIGHT}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                interval={0}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="income" fill="var(--color-income)" radius={4} />
              <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      {/* Legend tetap (tidak ikut scroll) */}
      <div className="flex items-center justify-center gap-4 text-xs">
        {Object.entries(chartConfig).map(([key, item]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              className="size-2 shrink-0 rounded-[2px]"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}
