import { BriefcaseBusiness, Car, CircleEllipsis, GraduationCap, HeartPulse, House, Plane, ShoppingBag, Smartphone, Ticket, Utensils, Wallet } from "lucide-react"

export const CATEGORY_ICON_OPTIONS = [
  { value: "utensils", label: "Makanan", icon: Utensils },
  { value: "car", label: "Transportasi", icon: Car },
  { value: "shopping-bag", label: "Belanja", icon: ShoppingBag },
  { value: "house", label: "Rumah", icon: House },
  { value: "ticket", label: "Hiburan", icon: Ticket },
  { value: "heart-pulse", label: "Kesehatan", icon: HeartPulse },
  { value: "graduation-cap", label: "Pendidikan", icon: GraduationCap },
  { value: "briefcase", label: "Pekerjaan", icon: BriefcaseBusiness },
  { value: "plane", label: "Perjalanan", icon: Plane },
  { value: "smartphone", label: "Tagihan", icon: Smartphone },
  { value: "wallet", label: "Keuangan", icon: Wallet },
  { value: "other", label: "Lainnya", icon: CircleEllipsis },
] as const

export type CategoryIconName = typeof CATEGORY_ICON_OPTIONS[number]["value"]
export interface CategoryAppearance {
  budget?: number
  icon?: CategoryIconName
  color?: string
}

export const DEFAULT_CATEGORY_ICON: CategoryIconName = "wallet"
export const DEFAULT_CATEGORY_COLOR = "#14864a"
export const CATEGORY_COLOR_OPTIONS = ["#14864a", "#2563eb", "#7c3aed", "#db2777", "#ea580c", "#dc2626", "#0891b2", "#475569"]
export const categoryCurrency = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
