import { PasswordRecoveryLayout } from "@/components/auth/password-recovery-layout"
import { ForgotPasswordForm } from "@/components/auth/password-recovery-form"

export const metadata = { title: "Lupa password? | Artoku", robots: { index: false, follow: false }, referrer: "no-referrer" as const }

export default function Page() {
  return <PasswordRecoveryLayout title="Lupa password?" description="Masukkan email yang terdaftar. Kami akan mengirimkan tautan untuk membuat password baru."><ForgotPasswordForm /></PasswordRecoveryLayout>
}
