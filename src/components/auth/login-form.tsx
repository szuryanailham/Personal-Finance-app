"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { GoogleLoginButton } from "@/components/auth/google-login-button"
import type { AuthSession } from "@/lib/auth"
import { login, loginWithGoogle } from "@/lib/api/auth"
import { REDIRECT_PARAM, safeRedirectPath, saveSession } from "@/lib/auth"
import { ApiError } from "@/lib/api/client"

const INPUT_CLASS = "h-11 px-3"
const PASSWORD_MIN_LENGTH = 8

interface LoginInput {
  email: string
  password: string
}

function toLoginInput(form: HTMLFormElement): LoginInput | null {
  const data = new FormData(form)
  const email = String(data.get("email") ?? "").trim()
  const password = String(data.get("password") ?? "")
  if (!email || !password) return null
  return { email, password }
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasLoginFailed, setHasLoginFailed] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const input = toLoginInput(e.currentTarget)
    if (!input) return

    setHasLoginFailed(false)
    setIsSubmitting(true)
    try {
      completeLogin(await login(input))
    } catch {
      setHasLoginFailed(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  function completeLogin(session: AuthSession) {
    saveSession(session)
    router.replace(safeRedirectPath(searchParams.get(REDIRECT_PARAM)))
  }

  async function handleGoogleCredential(idToken: string) {
    setHasLoginFailed(false)
    setIsSubmitting(true)
    try {
      completeLogin(await loginWithGoogle(idToken))
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Login dengan Google gagal")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <fieldset disabled={isSubmitting} className="contents">
        <FieldGroup>
          <Field>
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nama@email.com"
              className={INPUT_CLASS}
              required
            />
          </Field>
          <Field>
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              minLength={PASSWORD_MIN_LENGTH}
              className={INPUT_CLASS}
              required
            />
          </Field>
        </FieldGroup>
        {hasLoginFailed && (
          <p role="alert" className="text-center text-sm text-destructive">
            Login gagal
          </p>
        )}
        <Button
          type="submit"
          className="h-11 w-full bg-[#6359E9] text-white hover:bg-[#6359E9]/90"
        >
          {isSubmitting && <Spinner />}
          {isSubmitting ? "Memproses..." : "Login"}
        </Button>
        <FieldSeparator>atau</FieldSeparator>
        <GoogleLoginButton onCredential={handleGoogleCredential} onError={toast.error} />
      </fieldset>
    </form>
  )
}
