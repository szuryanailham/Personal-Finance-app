"use client"

import { PageStatus } from "@/components/status/page-status"
import { useCurrentUser } from "@/hooks/use-current-user"
import { PasswordForm } from "./password-form"
import { SettingsForm, SettingsSkeleton } from "./settings-form"

// Bagian "Akun" pada pengaturan: form profil + ganti password, dipakai desktop & mobile
export function AccountSection() {
  const { user, isLoading, error } = useCurrentUser()

  if (isLoading) return <SettingsSkeleton />
  if (!user) {
    return <PageStatus title="Gagal Memuat Profil" description={error ?? "Data profil tidak ditemukan."} />
  }
  return (
    <div className="flex flex-col gap-4">
      <SettingsForm user={user} />
      <PasswordForm />
    </div>
  )
}
