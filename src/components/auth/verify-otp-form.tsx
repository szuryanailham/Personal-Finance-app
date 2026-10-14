"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { OtpInput } from "@/components/auth/otp-input"
import { formatCountdown, useCountdown } from "@/hooks/use-countdown"
import { resendSignUpOtp, verifySignUpOtp } from "@/lib/api/auth"
import { ApiError } from "@/lib/api/client"
import { LOGIN_PATH } from "@/lib/auth"

export const OTP_EMAIL_PARAM = "email"
export const OTP_RESEND_PARAM = "resendIn"

const OTP_LENGTH = 6
const DEFAULT_RESEND_SECONDS = 60
const BRAND_BUTTON_CLASS = "h-11 w-full bg-[#6359E9] text-white hover:bg-[#6359E9]/90"

function toResendSeconds(value: string | null): number {
  const seconds = Number(value)
  return Number.isInteger(seconds) && seconds > 0 ? seconds : DEFAULT_RESEND_SECONDS
}

function toErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback
}

function toLockoutSeconds(err: unknown): number | null {
  return err instanceof ApiError ? err.retryAfterSeconds : null
}

export function VerifyOtpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get(OTP_EMAIL_PARAM)?.trim() ?? ""
  const { secondsLeft, isFinished, restart } = useCountdown(
    toResendSeconds(searchParams.get(OTP_RESEND_PARAM))
  )
  // Cooldown dari backend (HTTP 429) setelah terlalu banyak percobaan
  const lockout = useCountdown(0)
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!email) {
    return (
      <p className="text-sm text-muted-foreground">
        Email tidak ditemukan. Silakan{" "}
        <Link href="/sign-up" className="font-medium text-[#6359E9] hover:underline">
          sign up
        </Link>{" "}
        ulang.
      </p>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (otp.length !== OTP_LENGTH) {
      setErrorMessage(`OTP harus ${OTP_LENGTH} digit`)
      return
    }

    setErrorMessage(null)
    setIsVerifying(true)
    try {
      await verifySignUpOtp({ email, otp })
      toast.success("Akun berhasil dibuat, silakan login")
      router.replace(LOGIN_PATH)
    } catch (err) {
      handleError(err, "Gagal verifikasi OTP")
    } finally {
      setIsVerifying(false)
    }
  }

  async function handleResend() {
    setErrorMessage(null)
    setIsResending(true)
    try {
      const sent = await resendSignUpOtp(email)
      restart(sent.resendAvailableInSeconds || DEFAULT_RESEND_SECONDS)
      setOtp("")
      toast.success(`Kode OTP baru telah dikirim ke ${sent.email}`)
    } catch (err) {
      handleError(err, "Gagal mengirim ulang OTP")
    } finally {
      setIsResending(false)
    }
  }

  function handleError(err: unknown, fallback: string) {
    const lockoutSeconds = toLockoutSeconds(err)
    if (lockoutSeconds) {
      lockout.restart(lockoutSeconds)
      setOtp("")
      setErrorMessage(null)
      return
    }
    setErrorMessage(toErrorMessage(err, fallback))
  }

  const isLocked = !lockout.isFinished
  const isBusy = isVerifying || isResending || isLocked

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Kami telah mengirim kode {OTP_LENGTH} digit ke{" "}
        <span className="font-medium text-foreground">{email}</span>
      </p>
      <Field>
        <Label htmlFor="otp-code">Kode OTP</Label>
        <OtpInput
          id="otp-code"
          length={OTP_LENGTH}
          value={otp}
          onChange={setOtp}
          disabled={isBusy}
          autoFocus
        />
      </Field>
      {isLocked ? (
        <p role="alert" className="text-center text-sm text-destructive">
          Terlalu banyak percobaan. Coba lagi dalam{" "}
          <span className="font-medium tabular-nums">
            {formatCountdown(lockout.secondsLeft)}
          </span>
        </p>
      ) : (
        errorMessage && (
          <p role="alert" className="text-center text-sm text-destructive">
            {errorMessage}
          </p>
        )
      )}
      <Button
        type="submit"
        disabled={isBusy || otp.length !== OTP_LENGTH}
        className={BRAND_BUTTON_CLASS}
      >
        {isVerifying && <Spinner />}
        {isVerifying ? "Verifying..." : "Verify"}
      </Button>
      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
        <span>Tidak menerima kode?</span>
        {isFinished ? (
          <Button
            type="button"
            variant="link"
            onClick={handleResend}
            disabled={isBusy}
            className="h-auto p-0 text-[#6359E9]"
          >
            {isResending && <Spinner />}
            Kirim ulang
          </Button>
        ) : (
          <span>
            Kirim ulang dalam{" "}
            <span className="font-medium tabular-nums text-foreground">
              {formatCountdown(secondsLeft)}
            </span>
          </span>
        )}
      </div>
    </form>
  )
}
