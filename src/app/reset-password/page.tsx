import { createPageMetadata } from "@/lib/page-metadata";
import { Suspense } from "react"
import { PasswordRecoveryLayout } from "@/components/auth/password-recovery-layout"
import { ResetPasswordForm } from "@/components/auth/password-recovery-form"

export const metadata = {
  ...createPageMetadata({
    title: "Buat password baru | Artoku",
    description: "Buat password baru untuk memulihkan akses dan menjaga keamanan akun Artoku kamu.",
    path: "/reset-password",
  }),
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
};

export default function Page() {
  return <PasswordRecoveryLayout title="Buat password baru" description="Gunakan password baru yang aman untuk melindungi akun Artoku kamu."><Suspense fallback={<p className="text-sm text-slate-600">Memuat form...</p>}><ResetPasswordForm /></Suspense></PasswordRecoveryLayout>
}
