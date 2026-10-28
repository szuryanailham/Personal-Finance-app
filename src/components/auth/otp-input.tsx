"use client"

import { useRef } from "react"
import { cn } from "@/lib/utils"

const NON_DIGIT = /\D/g

interface OtpInputProps {
  id?: string
  length: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  autoFocus?: boolean
}

export function OtpInput({ id, length, value, onChange, disabled, autoFocus }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  function focusBox(index: number) {
    const target = inputRefs.current[Math.min(Math.max(index, 0), length - 1)]
    target?.focus()
    target?.select()
  }

  // Digits are kept contiguous, so typing into a box past the filled ones lands on the first empty box.
  function insertAt(index: number, digits: string) {
    const start = Math.min(index, value.length)
    const next = (value.slice(0, start) + digits + value.slice(start + digits.length)).slice(0, length)
    onChange(next)
    focusBox(start + digits.length)
  }

  function removeAt(index: number) {
    onChange(value.slice(0, index) + value.slice(index + 1))
    focusBox(index)
  }

  function handleChange(index: number, raw: string) {
    const digits = raw.replace(NON_DIGIT, "")
    if (!digits) {
      if (value[index]) removeAt(index)
      return
    }
    if (digits.length >= length) {
      insertAt(0, digits.slice(-length))
      return
    }
    const current = value[index] ?? ""
    insertAt(index, current && digits.length === 2 ? digits.replace(current, "") : digits)
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault()
      if (value[index]) removeAt(index)
      else if (index > 0) removeAt(index - 1)
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      focusBox(index - 1)
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      focusBox(Math.min(index + 1, value.length))
    }
  }

  function handlePaste(index: number, e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const digits = e.clipboardData.getData("text").replace(NON_DIGIT, "")
    if (!digits) return
    insertAt(digits.length >= length ? 0 : index, digits.slice(0, length))
  }

  function handlePointerDown(index: number, e: React.PointerEvent<HTMLInputElement>) {
    if (index <= value.length) return
    e.preventDefault()
    focusBox(value.length)
  }

  return (
    <div role="group" className="flex items-center justify-between gap-2">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          id={index === 0 ? id : undefined}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${index + 1} dari ${length}`}
          value={value[index] ?? ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={(e) => handlePaste(index, e)}
          onPointerDown={(e) => handlePointerDown(index, e)}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          className={cn(
            "size-12 min-w-0 rounded-xl border border-input bg-transparent text-center text-xl font-semibold tabular-nums transition-colors outline-none sm:size-14",
            "focus-visible:border-[#14864A] focus-visible:ring-3 focus-visible:ring-[#14864A]/30",
            "disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
            value[index] && "border-[#14864A]/60"
          )}
        />
      ))}
    </div>
  )
}
