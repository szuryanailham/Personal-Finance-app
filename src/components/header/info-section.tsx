import * as React from "react"
import type { LucideIcon } from "lucide-react"

interface InfoSectionProps {
  step: number
  icon: LucideIcon
  title: string
  subtitle: string
  children?: React.ReactNode
}

export function InfoSection({ step, icon: Icon, title, subtitle, children }: InfoSectionProps) {
  return (
    <section className="flex items-start gap-3">
      <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-[#6359E9]/10 text-[#6359E9]">
        <Icon className="size-5" />
        <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-[#6359E9] text-[10px] font-semibold text-white ring-2 ring-background">
          {step}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
        {children}
      </div>
    </section>
  )
}
