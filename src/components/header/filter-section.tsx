"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export interface FilterSectionOption {
  value: string
  label: string
  description?: string
}

const RADIO_ITEM_CLASS =
  "data-checked:border-[#6359E9] data-checked:bg-[#6359E9] dark:data-checked:bg-[#6359E9]"

const OPTION_ROW_CLASS =
  "flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted/50 has-data-checked:border-[#6359E9] has-data-checked:bg-[#6359E9]/10"

interface FilterSectionProps {
  id: string
  title: string
  searchPlaceholder: string
  options: FilterSectionOption[]
  value: string
  onChange: (value: string) => void
  /** Konten tambahan di bawah daftar, mis. input tanggal custom atau status loading */
  children?: React.ReactNode
}

// Satu section filter: judul, pencarian lokal, dan daftar radio yang bisa di-scroll sendiri
export function FilterSection({
  id,
  title,
  searchPlaceholder,
  options,
  value,
  onChange,
  children,
}: FilterSectionProps) {
  const [query, setQuery] = React.useState("")
  const keyword = query.trim().toLowerCase()
  const visibleOptions = keyword
    ? options.filter((option) => option.label.toLowerCase().includes(keyword))
    : options
  const titleId = `${id}-title`

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-2">
      <h3 id={titleId} className="text-sm font-medium">
        {title}
      </h3>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={`Search ${title.toLowerCase()}`}
          className="h-9 pl-8"
        />
      </div>
      <RadioGroup
        aria-labelledby={titleId}
        value={value}
        onValueChange={(next) => onChange(String(next))}
        className="max-h-96 gap-1.5 overflow-y-auto overscroll-contain pr-1"
      >
        {visibleOptions.map((option) => {
          const itemId = `${id}-${option.value}`
          return (
            <label key={option.value} htmlFor={itemId} className={OPTION_ROW_CLASS}>
              <span className="flex min-w-0 flex-col">
                <span className="truncate">{option.label}</span>
                {option.description && (
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                )}
              </span>
              <RadioGroupItem id={itemId} value={option.value} className={RADIO_ITEM_CLASS} />
            </label>
          )
        })}
        {visibleOptions.length === 0 && (
          <p className="py-3 text-center text-xs text-muted-foreground">
            No results for &ldquo;{query.trim()}&rdquo;
          </p>
        )}
      </RadioGroup>
      {children}
    </section>
  )
}
