import { CATEGORY_ICON_OPTIONS, DEFAULT_CATEGORY_COLOR, DEFAULT_CATEGORY_ICON, type CategoryAppearance } from "@/lib/category-appearance"

export function CategoryIcon({ category }: { category: CategoryAppearance }) {
  const Icon = (CATEGORY_ICON_OPTIONS.find(option => option.value === category.icon)
    ?? CATEGORY_ICON_OPTIONS.find(option => option.value === DEFAULT_CATEGORY_ICON))?.icon
  const color = category.color ?? DEFAULT_CATEGORY_COLOR
  return (
    <span aria-hidden="true" className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg" style={{ color, backgroundColor: `${color}1a` }}>
      {Icon && <Icon className="size-4" />}
    </span>
  )
}
