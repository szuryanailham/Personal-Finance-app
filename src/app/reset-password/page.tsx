import { Suspense } from "react"
import { PasswordRecoveryLayout } from "@/components/auth/password-recovery-layout"
import { ResetPasswordForm } from "@/components/auth/password-recovery-form"

export const metadata = { title: "Buat password baru | Artoku", robots: { index: false, follow: false }, referrer: "no-referrer" as const }

export default function Page() {
  return <PasswordRecoveryLayout title="Buat password baru" description="Gunakan password baru yang aman untuk melindungi akun Artoku kamu."><Suspense fallback={<p className="text-sm text-slate-600">Memuat form...</p>}><ResetPasswordForm /></Suspense></PasswordRecoveryLayout>
}
