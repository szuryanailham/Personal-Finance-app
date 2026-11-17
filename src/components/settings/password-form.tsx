"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { isValidPassword, NEW_PASSWORD_INPUT_PROPS, PASSWORD_HINT } from "@/lib/password-validation"

const INPUT_CLASS = "h-11 px-3 sm:max-w-md"

interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
}

type ChangePasswordResult = { input: ChangePasswordInput } | { error: string }

function toChangePasswordInput(form: HTMLFormElement): ChangePasswordResult {
  const data = new FormData(form)
  const currentPassword = String(data.get("currentPassword") ?? "")
  const newPassword = String(data.get("newPassword") ?? "")
  const confirmPassword = String(data.get("confirmPassword") ?? "")

  if (!currentPassword || !newPassword) return { error: "Semua field wajib diisi" }
  if (!isValidPassword(newPassword)) {
    return { error: PASSWORD_HINT }
  }
  if (newPassword === currentPassword) {
    return { error: "Password baru harus berbeda dari password saat ini" }
  }
  if (newPassword !== confirmPassword) return { error: "Konfirmasi Password tidak sama" }
  return { input: { currentPassword, newPassword } }
}

export function PasswordForm() {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const result = toChangePasswordInput(e.currentTarget)
    if ("error" in result) {
      setErrorMessage(result.error)
      return
    }

    setErrorMessage(null)
    // TODO: sambungkan ke endpoint ganti password setelah tersedia di backend
    toast.info("Fitur ganti Password belum tersedia")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Password</CardTitle>
        <CardDescription>Ganti password yang kamu gunakan untuk login.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <FieldGroup>
            <Field>
              <Label htmlFor="settings-current-password">Password Saat Ini</Label>
              <PasswordInput
                id="settings-current-password"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                className={INPUT_CLASS}
                wrapperClassName="sm:max-w-md"
                required
              />
            </Field>

            <Field>
              <Label htmlFor="settings-new-password">Password Baru</Label>
              <PasswordInput
                id="settings-new-password"
                aria-describedby="settings-password-hint"
                name="newPassword"
                {...NEW_PASSWORD_INPUT_PROPS}
                className={INPUT_CLASS}
                wrapperClassName="sm:max-w-md"
                required
              />
              <FieldDescription id="settings-password-hint">{PASSWORD_HINT}</FieldDescription>
            </Field>

            <Field>
              <Label htmlFor="settings-confirm-password">Konfirmasi Password Baru</Label>
              <PasswordInput
                id="settings-confirm-password"
                name="confirmPassword"
                {...NEW_PASSWORD_INPUT_PROPS}
                className={INPUT_CLASS}
                wrapperClassName="sm:max-w-md"
                required
              />
            </Field>
          </FieldGroup>

          {errorMessage && (
            <p role="alert" className="text-sm text-destructive">
              {errorMessage}
            </p>
          )}

          <div className="flex justify-end">
            <Button type="submit" size="lg" className="h-11 w-full bg-[#14864A] px-6 text-white hover:bg-[#10733e] sm:w-auto">
              Ganti Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
