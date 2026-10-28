import Image, { type ImageProps } from "next/image"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

const ICON_SIZE = 44

const currencyFormatter = new Intl.NumberFormat("id-ID")
const HIDDEN_AMOUNT_MASK = "••••••"

interface MobileSummaryCardProps {
  title: string
  total: number
  percentage: number
  icon: ImageProps["src"]
  isLoading?: boolean
  isHidden?: boolean
  onToggleHidden?: () => void
  className?: string
}

function formatPercentage(value: number) {
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(2)}%`
}


export function MobileSummaryCard({
  title,
  total,
  percentage,
  icon,
  isLoading = false,
  isHidden = false,
  onToggleHidden,
  className,
}: MobileSummaryCardProps) {
  const hasPercentage = !isLoading && !isHidden && percentage !== 0
  const ToggleIcon = isHidden ? EyeOffIcon : EyeIcon
  const isNegative = percentage < 0

  return (
    <div
      className={cn(
        "relative isolate flex min-h-44 w-full flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#168D50] via-[#14864A] to-[#0D6738] p-5 mt-10 text-white shadow-[0_12px_28px_-14px_rgba(20,134,74,0.75)]",
        className
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-8 -top-12 size-40 rounded-full border border-white/10" />
        <div className="absolute -right-1 -top-5 size-26 rounded-full border border-white/10" />
        <div className="absolute right-8 top-7 size-3 rounded-full bg-white/15" />
        <div className="absolute -bottom-14 -left-10 size-36 rounded-full bg-emerald-200/10 blur-xl" />
        <div className="absolute bottom-5 right-5 size-1 rounded-full bg-white/35 shadow-[8px_-8px_0_rgba(255,255,255,0.2),16px_0_0_rgba(255,255,255,0.15),24px_-8px_0_rgba(255,255,255,0.2)]" />
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <Image src={icon} alt="" width={ICON_SIZE} height={ICON_SIZE} unoptimized />
        {hasPercentage && (
          <span
            className={cn(
              "rounded-lg bg-white/15 px-1.5 py-0.5 text-xs font-medium",
              isNegative ? "text-red-200" : "text-emerald-200"
            )}
          >
            {formatPercentage(percentage)}
          </span>
        )}
      </div>

      <div className="relative z-10 flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-white/70">{title}</span>
          {onToggleHidden && (
            <button
              type="button"
              onClick={onToggleHidden}
              aria-label={isHidden ? "Tampilkan nominal" : "Sembunyikan nominal"}
              aria-pressed={isHidden}
              className="p-1 text-white/70 active:opacity-60"
            >
              <ToggleIcon className="size-4" />
            </button>
          )}
        </div>
        {isLoading ? (
          <Spinner className="size-7 text-white" />
        ) : (
          <span className="truncate text-2xl font-bold text-white">
            Rp.{isHidden ? HIDDEN_AMOUNT_MASK : currencyFormatter.format(total)}
          </span>
        )}
      </div>
    </div>
  )
}
