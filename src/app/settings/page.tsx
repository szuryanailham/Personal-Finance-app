"use client"

import * as React from "react"

import { AccountSection } from "@/components/settings/account-section"
import { type SettingsSection, SettingsNav } from "@/components/settings/settings-nav"

export default function SettingsPage() {
  const [activeSection, setActiveSection] = React.useState<SettingsSection>("account")

  return (
    <div className="grid w-full gap-4 py-4 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      <SettingsNav active={activeSection} onSelect={setActiveSection} />

      <section aria-label="Isi pengaturan" className="min-w-0">
        {activeSection === "account" && <AccountSection />}
      </section>
    </div>
  );
}
