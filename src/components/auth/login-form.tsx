"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { login } from "@/lib/api/auth"
import { REDIRECT_PARAM, safeRedirectPath, saveSession } from "@/lib/auth"

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

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  )
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
      const session = await login(input)
      saveSession(session)
      router.replace(safeRedirectPath(searchParams.get(REDIRECT_PARAM)))
    } catch {
      setHasLoginFailed(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleGoogleLogin() {
    toast.info("Login dengan Google belum terhubung ke backend")
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
            Failed login
          </p>
        )}
        <Button
          type="submit"
          className="h-11 w-full bg-[#6359E9] text-white hover:bg-[#6359E9]/90"
        >
          {isSubmitting && <Spinner />}
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
        <FieldSeparator>or</FieldSeparator>
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full"
          onClick={handleGoogleLogin}
        >
          <GoogleIcon />
          Login with Google
        </Button>
      </fieldset>
    </form>
  )
}
