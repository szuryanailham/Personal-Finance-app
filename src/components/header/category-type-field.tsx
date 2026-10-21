"use client"

import Image from "next/image"
import { Field, FieldLabel, FieldTitle } from "@/components/ui/field"
import IncomeIcon from "@/components/images/icons/incomeIcon.svg"
import ExpenseIcon from "@/components/images/icons/ExpenseIcon.svg"
import SavingIcon from "@/components/images/icons/SavingIcon.svg"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { CategoryType } from "@/lib/api/category"

// Nilai mengikuti tipe kategori di backend
export const CATEGORY_OPTIONS = [
  { value: "INCOME", label: "Income", icon: IncomeIcon },
  { value: "EXPENSE", label: "Expense", icon: ExpenseIcon },
  { value: "SAVING", label: "Saving", icon: SavingIcon },
] as const satisfies readonly { value: CategoryType; label: string; icon: unknown }[]

interface CategoryTypeFieldProps {
  // Prefix id agar tidak bentrok bila dua dialog memakai field ini
  idPrefix: string
  label?: string
  defaultValue?: CategoryType
}

export function CategoryTypeField({
  idPrefix,
  label = "Category",
  defaultValue = CATEGORY_OPTIONS[0].value,
}: CategoryTypeFieldProps) {
  return (
    <Field>
      <Label>{label}</Label>
      <RadioGroup
        name="categoryType"
        defaultValue={defaultValue}
        className="grid-cols-3 gap-2"
      >
        {CATEGORY_OPTIONS.map((option) => {
          const id = `${idPrefix}-${option.value}`
          return (
            <FieldLabel key={option.value} htmlFor={id} className="border-[#8C89B4]">
              {/* Mobile: icon & teks diperkecil agar 3 kolom tetap muat di layar sempit */}
              <Field orientation="horizontal" className="items-center gap-1.5 sm:gap-3">
                <Image src={option.icon} alt="" width={32} height={32} className="size-6 shrink-0 sm:size-8" />
                <FieldTitle className="block min-w-0 flex-1 truncate text-xs sm:text-sm">{option.label}</FieldTitle>
                <RadioGroupItem
                  value={option.value}
                  id={id}
                  className="data-checked:border-[#6359E9] data-checked:bg-[#6359E9] dark:data-checked:bg-[#6359E9] group-has-[:focus-visible]/field-label:data-checked:border-[#6359E9]"
                />
              </Field>
            </FieldLabel>
          )
        })}
      </RadioGroup>
    </Field>
  )
}
