"use client"

import * as React from "react"

import { PasswordForm } from "@/components/settings/password-form"
import { SettingsForm, SettingsSkeleton } from "@/components/settings/settings-form"
import { type SettingsSection, SettingsNav } from "@/components/settings/settings-nav"
import { PageStatus } from "@/components/status/page-status"
import { useCurrentUser } from "@/hooks/use-current-user"

function AccountSection() {
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

export default function SettingsPage() {
  const [activeSection, setActiveSection] = React.useState<SettingsSection>("account")

  return (
    <div className="grid w-full gap-4 py-4 md:grid-cols-[280px_1fr]">
      <SettingsNav active={activeSection} onSelect={setActiveSection} />

      <section aria-label="Isi pengaturan" className="min-w-0">
        {activeSection === "account" && <AccountSection />}
      </section>
    </div>
  );
}
