import { LoaderIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin text-[#6359E9]", className)}
      {...props}
    />
  )
}

interface LoadingStateProps {
  label?: string
  className?: string
}

function LoadingState({ label = "Memuat...", className }: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 rounded-[14px] border border-violet-200 bg-violet-50 py-10",
        className
      )}
    >
      <Spinner className="size-6" />
      <span className="text-sm font-medium text-[#6359E9]">{label}</span>
    </div>
  )
}

export { Spinner, LoadingState }
