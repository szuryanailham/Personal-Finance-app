"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { cn } from "cn"
import { Input } from "@/components/ui/input"

const rupiahFormatter = new Intl.NumberFormat("id-ID")

interface RupiahAmountInputProps {
  id: string
  /** Nama field angka mentah yang dibaca FormData (mis. "amount") */
  name: string
  defaultValue?: number
  className?: string
  required?: boolean
}

function toDigits(value: string): string {
  return value.replace(/\D/g, "").replace(/^0+(?=\d)/, "")
}

function formatDigits(digits: string): string {
  return digits ? rupiahFormatter.format(Number(digits)) : ""
}

// Posisi kursor setelah digit ke-n pada teks yang sudah diformat
function caretAfterDigits(formatted: string, digitCount: number): number {
  if (digitCount === 0) return 0
  let seen = 0
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i]) && ++seen === digitCount) return i + 1
  }
  return formatted.length
}

// Input nominal format Rupiah (1.500.000); nilai angka mentah dikirim lewat hidden input
export function RupiahAmountInput({ id, name, defaultValue, className, required }: RupiahAmountInputProps) {
  const [digits, setDigits] = useState(() =>
    defaultValue === undefined ? "" : toDigits(String(Math.round(defaultValue)))
  )
  const inputRef = useRef<HTMLInputElement>(null)
  // Jumlah digit di kiri kursor, agar kursor tidak lompat ke akhir saat titik ditambahkan
  const pendingCaretDigits = useRef<number | null>(null)
  const formatted = formatDigits(digits)

  useLayoutEffect(() => {
    const input = inputRef.current
    if (!input || pendingCaretDigits.current === null || document.activeElement !== input) return
    const caret = caretAfterDigits(formatted, pendingCaretDigits.current)
    input.setSelectionRange(caret, caret)
    pendingCaretDigits.current = null
  }, [formatted])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, selectionStart } = e.target
    const digitsBeforeCaret = value.slice(0, selectionStart ?? value.length).replace(/\D/g, "").length
    const nextDigits = toDigits(value)
    // Nol di depan dibuang, jadi batasi agar tidak melebihi jumlah digit yang tersisa
    pendingCaretDigits.current = Math.min(digitsBeforeCaret, nextDigits.length)
    setDigits(nextDigits)
  }

  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
        Rp
      </span>
      <Input
        ref={inputRef}
        id={id}
        value={formatted}
        onChange={handleChange}
        className={cn(className, "pl-10")}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="0"
        required={required}
      />
      <input type="hidden" name={name} value={digits} />
    </div>
  )
}
