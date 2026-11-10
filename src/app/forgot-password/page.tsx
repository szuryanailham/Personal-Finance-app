import { createPageMetadata } from "@/lib/page-metadata";
import { PasswordRecoveryLayout } from "@/components/auth/password-recovery-layout"
import { ForgotPasswordForm } from "@/components/auth/password-recovery-form"

export const metadata = {
  ...createPageMetadata({
    title: "Lupa password? | Artoku",
    description: "Ajukan tautan pemulihan password melalui email yang terdaftar di akun Artoku kamu.",
    path: "/forgot-password",
  }),
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
};

export default function Page() {
  return <PasswordRecoveryLayout title="Lupa password?" description="Masukkan email yang terdaftar. Kami akan mengirimkan tautan untuk membuat password baru."><ForgotPasswordForm /></PasswordRecoveryLayout>
}
