import Image, { type ImageProps } from "next/image"

import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

const ICON_SIZE = 45

const currencyFormatter = new Intl.NumberFormat("id-ID")

interface SummaryCardProps {
  title: string
  total: number
  percentage: number
  /** Image file (.svg / .jpg / .png): a static import or a path under /public, e.g. "/icons/wallet.svg". */
  icon: ImageProps["src"]
  isLoading?: boolean
  className?: string
}

function formatPercentage(value: number) {
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(2)}%`
}

export function SummaryCard({ title, total, percentage, icon, isLoading = false, className }: SummaryCardProps) {
  const hasPercentage = !isLoading && percentage !== 0
  const isNegative = percentage < 0

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-6 rounded-[14px] border border-violet-200 bg-white px-5 py-6",
        className
      )}
    >
      <Image src={icon} alt="" width={ICON_SIZE} height={ICON_SIZE} unoptimized />

      <div className="flex flex-col gap-1">
        <span className="text-base text-slate-400">{title}</span>
        <div className="flex items-center justify-between gap-2">
          {isLoading ? (
            <Spinner className="size-9" />
          ) : (
            <span className="text-3xl font-bold text-[#282458]">
              Rp.{currencyFormatter.format(total)}
            </span>
          )}
          {hasPercentage && (
            <span
              className={cn(
                "rounded-[10px] px-1.5 py-1 text-xs",
                isNegative ? "bg-red-50 text-red-600" : "bg-emerald-50 text-green-600"
              )}
            >
              {formatPercentage(percentage)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
