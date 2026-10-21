"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { type CurrentUser, getFullName } from "@/lib/api/user"
import { toLocalDateString } from "@/lib/date"
import { ProfileAvatarField } from "./profile-avatar-field"

const INPUT_CLASS = "h-11 px-3"
const NAME_MAX_LENGTH = 100
const MIN_BIRTH_DATE = "1900-01-01"

interface SettingsFormProps {
  user: CurrentUser
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [firstName, setFirstName] = React.useState(user.firstName ?? "")
  const [lastName, setLastName] = React.useState(user.lastName ?? "")
  const [, setAvatarFile] = React.useState<File | null>(null)
  const today = React.useMemo(() => toLocalDateString(new Date()), [])

  const previewName = getFullName({ ...user, firstName, lastName }) || user.email

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO: sambungkan ke endpoint update profil setelah tersedia di backend
    toast.info("Fitur simpan profil belum tersedia")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Profil</CardTitle>
        <CardDescription>Kelola foto dan informasi pribadi akun kamu.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <ProfileAvatarField name={previewName} onChange={setAvatarFile} />

          <Separator />

          <FieldGroup>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <Label htmlFor="settings-first-name">Nama Depan</Label>
                <Input
                  id="settings-first-name"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  maxLength={NAME_MAX_LENGTH}
                  className={INPUT_CLASS}
                  required
                />
              </Field>
              <Field>
                <Label htmlFor="settings-last-name">Nama Belakang</Label>
                <Input
                  id="settings-last-name"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  maxLength={NAME_MAX_LENGTH}
                  className={INPUT_CLASS}
                />
              </Field>
            </div>

            <Field>
              <Label htmlFor="settings-email">Email</Label>
              <Input
                id="settings-email"
                name="email"
                type="email"
                value={user.email}
                readOnly
                className={`${INPUT_CLASS} bg-muted text-muted-foreground`}
              />
              <FieldDescription>Email digunakan untuk login dan tidak bisa diubah.</FieldDescription>
            </Field>

            <Field>
              <Label htmlFor="settings-birth-date">Tanggal Lahir</Label>
              <Input
                id="settings-birth-date"
                name="birthDate"
                type="date"
                min={MIN_BIRTH_DATE}
                max={today}
                className={`${INPUT_CLASS} sm:max-w-xs`}
              />
            </Field>
          </FieldGroup>

          <div className="flex justify-end">
            <Button type="submit" size="lg" className="bg-[#6359E9] px-6 text-white hover:bg-[#6359E9]/90">
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export function SettingsSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="size-24 rounded-full" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Skeleton className="h-11" />
          <Skeleton className="h-11" />
        </div>
        <Skeleton className="h-11" />
        <Skeleton className="h-11 sm:max-w-xs" />
      </CardContent>
    </Card>
  )
}
