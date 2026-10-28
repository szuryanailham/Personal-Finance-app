"use client"

import * as React from "react"
import Link from "next/link"
import {
  AlertCircleIcon,
  ArrowRight,
  CloudUpload,
  Download,
  FileSpreadsheet,
  Loader2,
  PencilLine,
  Tags,
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

const CATEGORY_PATH = "/category"

interface ImportFormProps {
  state: ImportFileState
  className?: string
  /** Dipanggil saat user pindah halaman dari form (mis. ke kategori), supaya drawer bisa ditutup */
  onNavigate?: () => void
}

const acceptedFormats = ACCEPTED_EXTENSIONS.map((ext) => ext.slice(1).toUpperCase()).join(" atau ")

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
export function ImportForm({ state, className, onNavigate }: ImportFormProps) {
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
      <div className="flex flex-col gap-4">
        <InfoSection
          step={1}
          icon={Tags}
          title="Siapkan kategori transaksi"
          subtitle="Buat dulu kategori yang akan kamu pakai di Artoku. Nama kategori di file harus sama dengan kategori di akunmu."
        >
          <Link
            href={CATEGORY_PATH}
            onClick={onNavigate}
            className="inline-flex items-center gap-1 self-start text-sm font-medium text-[#14864A] hover:underline"
          >
            Kelola kategori
            <ArrowRight className="size-3.5" />
          </Link>
        </InfoSection>

        <InfoSection
          step={2}
          icon={FileSpreadsheet}
          title="Download template"
          subtitle="Gunakan template dari Artoku sebagai format untuk mengisi data transaksi."
        >
          <Button
            type="button"
            variant="outline"
            onClick={downloadTemplate}
            disabled={isDownloading}
            className="mt-1 self-start border-[#14864A]/40 text-[#14864A] hover:bg-[#14864A]/5 hover:text-[#14864A]"
          >
            {isDownloading ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : (
              <Download data-icon="inline-start" />
            )}
            {isDownloading ? "Mengunduh..." : "Download Template"}
          </Button>
        </InfoSection>

        <ErrorAlert title="Gagal mengunduh template" message={downloadError} />

        <InfoSection
          step={3}
          icon={PencilLine}
          title="Isi data transaksi lalu upload file"
          subtitle={`Isi template, periksa kembali nama transaksi, jumlah, tanggal, tipe transaksi, dan kategori, lalu upload di bawah ini. Format yang didukung: ${acceptedFormats} (maks. ${MAX_FILE_SIZE_MB} MB).`}
        />
      </div>

      <label
        htmlFor={inputId}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex h-56 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#14864A]/40 bg-[#14864A]/5 px-4 text-center transition-colors",
          "hover:border-[#14864A] hover:bg-[#14864A]/5",
          "has-[:focus-visible]:border-[#14864A] has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-[#14864A]/30",
          isDragging && "border-[#14864A] bg-[#14864A]/10",
          error && "border-destructive/60"
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-[#14864A]/10 text-[#14864A]">
          <CloudUpload className="size-6" />
        </div>
        <p className="text-sm">
          <span className="font-semibold text-[#14864A]">Klik untuk upload</span> atau seret dan lepas
        </p>
        <p className="text-xs text-muted-foreground">
          {acceptedFormats} (maks. {MAX_FILE_SIZE_MB} MB)
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
      <ErrorAlert title="Upload gagal" message={uploadError} />

      <p className="text-xs text-muted-foreground">
        Setelah upload, kamu akan melihat halaman review. Baris dengan kategori yang tidak ditemukan
        atau data yang tidak valid akan ditandai beserta penjelasannya, supaya bisa kamu perbaiki.
      </p>

      {file && (
        <div className="flex items-center gap-3 rounded-lg border border-[#14864A]/40 p-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#14864A]/10 text-[#14864A]">
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
