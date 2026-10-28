"use client"

import * as React from "react"
import { Avatar } from "@base-ui/react/avatar"
import { CameraIcon, Trash2Icon, UserRoundIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"]
const MAX_SIZE_MB = 2
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

function validateImage(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) return "Format foto harus PNG, JPG, atau WEBP"
  if (file.size > MAX_SIZE_BYTES) return `Ukuran foto maksimal ${MAX_SIZE_MB}MB`
  return null
}

interface ProfileAvatarFieldProps {
  name: string
  onChange: (file: File | null) => void
}

export function ProfileAvatarField({ name, onChange }: ProfileAvatarFieldProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)

  // Lepas object URL lama agar tidak bocor memori
  React.useEffect(() => {
    if (!previewUrl) return
    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = "" // izinkan memilih file yang sama lagi
    if (!file) return

    const error = validateImage(file)
    if (error) {
      toast.error(error)
      return
    }
    setPreviewUrl(URL.createObjectURL(file))
    onChange(file)
  }

  function handleRemove() {
    setPreviewUrl(null)
    onChange(null)
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <Avatar.Root className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#14864A]/10">
        {previewUrl && (
          <Avatar.Image src={previewUrl} alt={name} className="size-full object-cover" />
        )}
        {/* Avatar kosong sementara sampai foto profil tersimpan di backend */}
        <Avatar.Fallback className="flex size-full items-center justify-center bg-slate-100 text-slate-400">
          <UserRoundIcon aria-hidden="true" className="size-12" />
        </Avatar.Fallback>
      </Avatar.Root>

      <div className="flex flex-col items-center gap-2 sm:items-start">
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
            <CameraIcon aria-hidden="true" />
            {previewUrl ? "Ganti Foto" : "Upload Foto"}
          </Button>
          {previewUrl && (
            <Button type="button" variant="ghost" onClick={handleRemove} className="text-red-600">
              <Trash2Icon aria-hidden="true" />
              Hapus
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          PNG, JPG, atau WEBP. Maksimal {MAX_SIZE_MB}MB.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
