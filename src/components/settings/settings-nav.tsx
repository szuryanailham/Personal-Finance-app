"use client"

import { Bell, Globe, UserRound, type LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type SettingsSection = "account" | "notification" | "language"

interface SettingsNavItem {
  id: SettingsSection
  label: string
  icon: LucideIcon
  isAvailable: boolean
}

const SETTINGS_NAV_ITEMS: readonly SettingsNavItem[] = [
  { id: "account", label: "Akun", icon: UserRound, isAvailable: true },
  { id: "notification", label: "Notifikasi", icon: Bell, isAvailable: false },
  { id: "language", label: "Bahasa", icon: Globe, isAvailable: false },
]

interface SettingsNavProps {
  active: SettingsSection
  onSelect: (section: SettingsSection) => void
}

export function SettingsNav({ active, onSelect }: SettingsNavProps) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-base">Pengaturan Umum</CardTitle>
      </CardHeader>

      <CardContent>
        <nav aria-label="Pengaturan umum" className="flex flex-col gap-1">
          {SETTINGS_NAV_ITEMS.map(({ id, label, icon: Icon, isAvailable }) => {
            const isActive = id === active

            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelect(id)}
                disabled={!isAvailable}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  "hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent",
                  isActive && "bg-[#14864A]/10 text-[#14864A] hover:bg-[#14864A]/10",
                )}
              >
                <Icon className="size-5 shrink-0" aria-hidden="true" />
                <span className="flex-1">{label}</span>
                {!isAvailable && (
                  <Badge variant="secondary" className="text-xs">
                    Segera
                  </Badge>
                )}
              </button>
            )
          })}
        </nav>
      </CardContent>
    </Card>
  )
}
