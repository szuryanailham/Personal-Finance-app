"use client"

import * as React from "react"
import {
  AlertCircleIcon,
  CloudUpload,
  Download,
  FileSpreadsheet,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { InfoSection } from "@/components/header/info-section"
import {
  ACCEPTED_EXTENSIONS,
  MAX_FILE_SIZE_MB,
  type ImportFileState,
} from "@/components/import/use-import-file"

interface ImportFormProps {
  state: ImportFileState
  className?: string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function ErrorAlert({ title, message }: { title: string; message: string | null }) {
  if (!message) return null
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

// Isi form import (langkah, dropzone, error, file terpilih) tanpa tombol aksi,
// supaya bisa dibungkus drawer maupun halaman penuh.
export function ImportForm({ state, className }: ImportFormProps) {
  // id unik: drawer desktop dan halaman mobile bisa ter-mount bersamaan
  const inputId = React.useId()
  const {
    inputRef,
    file,
    error,
    isDragging,
    uploadError,
    isDownloading,
    downloadError,
    downloadTemplate,
    selectFile,
    clearFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = state

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div className="mb-3 flex flex-col gap-4">
        <InfoSection
          step={1}
          icon={FileSpreadsheet}
          title="Unduh template dan isi sesuai data transaksi kamu"
          subtitle="Pakai template kami supaya setiap kolom sesuai format yang diharapkan."
        >
          <Button
            type="button"
            variant="link"
            onClick={downloadTemplate}
            disabled={isDownloading}
            className="h-auto self-start p-0 text-[#6359E9]"
          >
            {isDownloading ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : (
              <Download data-icon="inline-start" />
            )}
            {isDownloading ? "Mengunduh..." : "Unduh template"}
          </Button>
        </InfoSection>

        <InfoSection
          step={2}
          icon={ShieldCheck}
          title="Review datamu sebelum import"
          subtitle="Pastikan tanggal, jumlah, dan kategori sudah terisi dengan benar."
        />
      </div>

      <ErrorAlert title="Gagal mengunduh" message={downloadError} />

      <label
        htmlFor={inputId}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex h-56 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#8C89B4]/60 bg-muted/30 px-4 text-center transition-colors",
          "hover:border-[#6359E9] hover:bg-[#6359E9]/5",
          "has-[:focus-visible]:border-[#6359E9] has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-[#6359E9]/30",
          isDragging && "border-[#6359E9] bg-[#6359E9]/10",
          error && "border-destructive/60"
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-[#6359E9]/10 text-[#6359E9]">
          <CloudUpload className="size-6" />
        </div>
        <p className="text-sm">
          <span className="font-semibold text-[#6359E9]">Klik untuk upload</span> atau seret dan lepas
        </p>
        <p className="text-xs text-muted-foreground">
          {ACCEPTED_EXTENSIONS.map((ext) => ext.slice(1).toUpperCase()).join(" atau ")} (maks.{" "}
          {MAX_FILE_SIZE_MB} MB)
        </p>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(",")}
          className="sr-only"
          onChange={(event) => selectFile(event.target.files?.[0])}
        />
      </label>

      <ErrorAlert title="File tidak valid" message={error} />
      <ErrorAlert title="Import gagal" message={uploadError} />

      {file && (
        <div className="flex items-center gap-3 rounded-lg border border-[#8C89B4]/40 p-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#6359E9]/10 text-[#6359E9]">
            <FileSpreadsheet className="size-4" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium">{file.name}</span>
            <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Hapus file"
            onClick={clearFile}
          >
            <X />
          </Button>
        </div>
      )}
    </div>
  )
}
