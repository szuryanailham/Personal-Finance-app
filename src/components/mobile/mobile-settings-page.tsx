"use client"

import { LogOutIcon } from "lucide-react"

import { AccountSection } from "@/components/settings/account-section"
import { Button } from "@/components/ui/button"
import { useLogout } from "@/hooks/use-logout"

// Halaman pengaturan versi mobile: form akun ditumpuk satu kolom, tombol logout di paling bawah
// (di desktop logout ada di menu user sidebar, yang tidak tersedia di mobile)
export function MobileSettingsPage() {
  const handleLogout = useLogout()

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-col gap-1 px-1">
        <h1 className="text-lg font-semibold text-slate-900">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">Kelola profil dan keamanan akun kamu.</p>
      </div>

      <AccountSection />

      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={handleLogout}
        className="h-12 w-full rounded-xl border-red-200 bg-white text-red-600 hover:bg-red-50 hover:text-red-600"
      >
        <LogOutIcon aria-hidden="true" />
        Logout
      </Button>
    </div>
  )
}
