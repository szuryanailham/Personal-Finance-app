"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { OTP_EMAIL_PARAM, OTP_RESEND_PARAM } from "@/components/auth/verify-otp-form"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { signUp, type SignUpRequest } from "@/lib/api/auth"
import { isValidPassword, NEW_PASSWORD_INPUT_PROPS, PASSWORD_HINT } from "@/lib/password-validation"

const INPUT_CLASS = "h-11 px-3"
const NAME_MAX_LENGTH = 100
const LINK_CLASS = "font-medium text-[#14864A] underline-offset-4 hover:underline"

type SignUpResult = { input: SignUpRequest } | { error: string }

function toSignUpInput(form: HTMLFormElement): SignUpResult {
  const data = new FormData(form)
  const firstName = String(data.get("firstName") ?? "").trim()
  const lastName = String(data.get("lastName") ?? "").trim()
  const email = String(data.get("email") ?? "").trim()
  const password = String(data.get("password") ?? "")
  const confirmPassword = String(data.get("confirmPassword") ?? "")

  if (!firstName || !lastName || !email || !password) {
    return { error: "Semua field wajib diisi" }
  }
  if (!isValidPassword(password)) return { error: PASSWORD_HINT }
  if (password !== confirmPassword) return { error: "Konfirmasi Password tidak sama" }
  return { input: { firstName, lastName, email, password } }
}

export function SignUpForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasAgreed, setHasAgreed] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const result = toSignUpInput(e.currentTarget)
    if ("error" in result) {
      setErrorMessage(result.error)
      return
    }

    setErrorMessage(null)
    setIsSubmitting(true)
    try {
      const otp = await signUp(result.input)
      toast.success(`Kode OTP telah dikirim ke ${otp.email}`)
      const params = new URLSearchParams({
        [OTP_EMAIL_PARAM]: otp.email,
        [OTP_RESEND_PARAM]: String(otp.resendAvailableInSeconds),
      })
      router.push(`/sign-up/verify?${params}`)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Gagal mendaftar")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <fieldset disabled={isSubmitting} className="contents">
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <Label htmlFor="sign-up-first-name">Nama Depan</Label>
              <Input
                id="sign-up-first-name"
                name="firstName"
                autoComplete="given-name"
                placeholder="John"
                maxLength={NAME_MAX_LENGTH}
                className={INPUT_CLASS}
                required
              />
            </Field>
            <Field>
              <Label htmlFor="sign-up-last-name">Nama Belakang</Label>
              <Input
                id="sign-up-last-name"
                name="lastName"
                autoComplete="family-name"
                placeholder="Doe"
                maxLength={NAME_MAX_LENGTH}
                className={INPUT_CLASS}
                required
              />
            </Field>
          </div>
          <Field>
            <Label htmlFor="sign-up-email">Email</Label>
            <Input
              id="sign-up-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nama@email.com"
              maxLength={NAME_MAX_LENGTH}
              className={INPUT_CLASS}
              required
            />
          </Field>
          <Field>
            <Label htmlFor="sign-up-password">Password</Label>
            <PasswordInput
              id="sign-up-password"
              aria-describedby="sign-up-password-hint"
              name="password"
              {...NEW_PASSWORD_INPUT_PROPS}
              className={INPUT_CLASS}
              required
            />
            <FieldDescription id="sign-up-password-hint">{PASSWORD_HINT}</FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="sign-up-confirm-password">Konfirmasi Password</Label>
            <PasswordInput
              id="sign-up-confirm-password"
              name="confirmPassword"
              {...NEW_PASSWORD_INPUT_PROPS}
              className={INPUT_CLASS}
              required
            />
          </Field>
          <div className="flex items-start gap-3">
            <Checkbox
              id="sign-up-agree"
              checked={hasAgreed}
              onCheckedChange={setHasAgreed}
              className="mt-0.5 data-checked:border-[#14864A] data-checked:bg-[#14864A]"
            />
            <Label htmlFor="sign-up-agree" className="text-sm font-normal leading-snug">
              <span>
                Saya setuju dengan{" "}
                <Link href="/syarat-ketentuan" className={LINK_CLASS}>
                  Syarat Layanan
                </Link>{" "}
                dan{" "}
                <Link href="/kebijakan-pivasi" className={LINK_CLASS}>
                  Kebijakan Privasi
                </Link>
              </span>
            </Label>
          </div>
        </FieldGroup>
        {errorMessage && (
          <p role="alert" className="text-center text-sm text-destructive">
            {errorMessage}
          </p>
        )}
        <Button
          type="submit"
          disabled={!hasAgreed}
          className="h-11 w-full bg-[#14864A] text-white hover:bg-[#10733e]"
        >
          {isSubmitting && <Spinner />}
          {isSubmitting ? "Membuat akun..." : "Daftar"}
        </Button>
      </fieldset>
    </form>
  )
}
