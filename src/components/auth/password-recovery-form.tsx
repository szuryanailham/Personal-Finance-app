"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { forgotPassword, resetPassword } from "@/lib/api/auth"
import { ApiError } from "@/lib/api/client"
import { clearSession } from "@/lib/auth"
import { isValidPassword, NEW_PASSWORD_INPUT_PROPS, PASSWORD_HINT } from "@/lib/password-validation"

const BUTTON_CLASS = "h-11 w-full bg-[#14864A] text-white hover:bg-[#10733e]"

export function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sentEmail, setSentEmail] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim().toLowerCase()
    setError("")
    setIsSubmitting(true)
    try {
      await forgotPassword(email)
      setSentEmail(email)
    } catch (error) {
      setError(error instanceof ApiError ? error.message : "Tautan belum berhasil dikirim. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (sentEmail) return (
    <div role="status" className="flex flex-col gap-5">
      <CheckCircle2 aria-hidden="true" className="size-10 text-[#14864A]" />
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-950">Periksa email kamu</h2>
        <p className="text-sm leading-6 text-slate-600">Tautan reset password telah dikirim ke <span className="font-semibold break-all">{sentEmail}</span>. Periksa juga folder spam. Tautan berlaku selama 15 menit dan hanya dapat digunakan sekali.</p>
      </div>
      <Button type="button" variant="outline" className="h-11" onClick={() => setSentEmail("")}>Gunakan email lain atau kirim ulang</Button>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <fieldset disabled={isSubmitting} className="contents">
        <Field>
          <Label htmlFor="recovery-email">Email</Label>
          <Input id="recovery-email" name="email" type="email" autoComplete="email" placeholder="nama@email.com" maxLength={100} required className="h-11 px-3" />
        </Field>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className={BUTTON_CLASS}>{isSubmitting && <Spinner />}{isSubmitting ? "Mengirim..." : "Kirim tautan reset"}</Button>
      </fieldset>
    </form>
  )
}

export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")?.trim() ?? ""
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting || !token) return
    const data = new FormData(event.currentTarget)
    const newPassword = String(data.get("newPassword") ?? "")
    const confirmation = String(data.get("confirmPassword") ?? "")
    setError("")
    if (!isValidPassword(newPassword)) {
      setError(PASSWORD_HINT)
      return
    }
    if (new TextEncoder().encode(newPassword).length > 72) {
      setError("Password terlalu panjang. Gunakan maksimal 72 byte (karakter khusus dapat memakai lebih dari satu byte).")
      return
    }
    if (newPassword !== confirmation) {
      setError("Konfirmasi Password tidak sama.")
      return
    }
    setIsSubmitting(true)
    try {
      await resetPassword(token, newPassword)
      clearSession()
      window.history.replaceState(null, "", "/reset-password")
      setIsComplete(true)
    } catch (error) {
      setError(error instanceof ApiError ? error.message : "Password belum berhasil direset. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isComplete) return (
    <div role="status" className="flex flex-col gap-4">
      <CheckCircle2 aria-hidden="true" className="size-10 text-[#14864A]" />
      <h2 className="text-xl font-semibold text-slate-950">Password berhasil direset</h2>
      <p className="text-sm leading-6 text-slate-600">Akun kamu siap digunakan kembali. Silakan login dengan password baru.</p>
      <Link href="/login" className="flex h-11 items-center justify-center rounded-lg bg-[#14864A] text-sm font-medium text-white hover:bg-[#10733e]">Login sekarang</Link>
    </div>
  )

  if (!token) return (
    <div className="flex flex-col gap-4">
      <p role="alert" className="text-sm leading-6 text-destructive">Tautan reset tidak lengkap. Buka tautan dari email atau minta tautan reset yang baru.</p>
      <Link href="/forgot-password" className="text-sm font-semibold text-[#14864A] underline underline-offset-4">Minta tautan baru</Link>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <fieldset disabled={isSubmitting} className="contents">
        <FieldGroup>
          <Field>
            <Label htmlFor="reset-password">Password baru</Label>
            <PasswordInput id="reset-password" name="newPassword" {...NEW_PASSWORD_INPUT_PROPS} maxLength={100} required aria-describedby="password-hint" className="h-11 px-3" />
            <FieldDescription id="password-hint">{PASSWORD_HINT}</FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="confirm-password">Konfirmasi Password baru</Label>
            <PasswordInput id="confirm-password" name="confirmPassword" {...NEW_PASSWORD_INPUT_PROPS} maxLength={100} required className="h-11 px-3" />
          </Field>
        </FieldGroup>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className={BUTTON_CLASS}>{isSubmitting && <Spinner />}{isSubmitting ? "Menyimpan..." : "Simpan password baru"}</Button>
        <p className="text-center text-sm text-slate-600">Tautan kedaluwarsa atau sudah digunakan? <Link href="/forgot-password" className="font-semibold text-[#14864A] underline-offset-4 hover:underline">Minta tautan baru</Link></p>
      </fieldset>
    </form>
  )
}
