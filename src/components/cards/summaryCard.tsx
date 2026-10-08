import Image, { type ImageProps } from "next/image"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

const ICON_SIZE = 45

const currencyFormatter = new Intl.NumberFormat("id-ID")
const HIDDEN_AMOUNT_MASK = "••••••"

interface SummaryCardProps {
  title: string
  total: number
  percentage: number
  /** Image file (.svg / .jpg / .png): a static import or a path under /public, e.g. "/icons/wallet.svg". */
  icon: ImageProps["src"]
  isLoading?: boolean
  /** Nominal & persentase disamarkan; state dibagi ke semua card lewat useHiddenAmounts */
  isHidden?: boolean
  onToggleHidden?: () => void
  className?: string
}

function formatPercentage(value: number) {
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(2)}%`
}

export function SummaryCard({
  title,
  total,
  percentage,
  icon,
  isLoading = false,
  isHidden = false,
  onToggleHidden,
  className,
}: SummaryCardProps) {
  const hasPercentage = !isLoading && !isHidden && percentage !== 0
  const ToggleIcon = isHidden ? EyeOffIcon : EyeIcon
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
        <div className="flex items-center gap-2">
          <span className="text-base text-slate-400">{title}</span>
          {onToggleHidden && (
            <button
              type="button"
              onClick={onToggleHidden}
              aria-label={isHidden ? "Tampilkan nominal" : "Sembunyikan nominal"}
              aria-pressed={isHidden}
              className="rounded-md p-1 text-slate-400 transition-colors hover:bg-violet-50 hover:text-[#282458] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            >
              <ToggleIcon className="size-4" />
            </button>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          {isLoading ? (
            <Spinner className="size-9" />
          ) : (
            <span className="text-3xl font-bold text-[#282458]">
              Rp.{isHidden ? HIDDEN_AMOUNT_MASK : currencyFormatter.format(total)}
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
