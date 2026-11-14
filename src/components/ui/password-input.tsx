"use client"

import { useId, useState, type ComponentProps } from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "cn"
import { Input } from "@/components/ui/input"

type PasswordInputProps = ComponentProps<typeof Input> & {
  wrapperClassName?: string
}

export function PasswordInput({ className, wrapperClassName, id, disabled, ...props }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)
  const generatedId = useId()
  const inputId = id ?? generatedId
  const label = isVisible ? "Sembunyikan password" : "Tampilkan password"
  const Icon = isVisible ? EyeOff : Eye

  return (
    <div className={cn("relative w-full", wrapperClassName)}>
      <Input
        {...props}
        id={inputId}
        disabled={disabled}
        type={isVisible ? "text" : "password"}
        className={cn(className, "pr-11")}
      />
      <button
        type="button"
        aria-label={label}
        aria-controls={inputId}
        title={label}
        disabled={disabled}
        onClick={() => setIsVisible((visible) => !visible)}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        <Icon className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}
