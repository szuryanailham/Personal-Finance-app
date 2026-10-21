"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { saveBlob } from "@/lib/download"
import { downloadImportTemplate } from "@/lib/api/transaction"
import { uploadImportFile } from "@/lib/api/transaction-import"
import { saveImportedTransactions } from "@/lib/import-store"

export const ACCEPTED_EXTENSIONS = [".csv", ".xlsx"]
export const MAX_FILE_SIZE_MB = 5
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
// Dipakai jika backend tidak mengirim nama file lewat Content-Disposition
const FALLBACK_TEMPLATE_FILE_NAME = "transaction-template.xlsx"
const IMPORT_REVIEW_PATH = "/transaction/import-review"

interface UseImportFileOptions {
  /** Override aksi import; default: upload ke backend lalu buka halaman review */
  onImport?: (file: File) => void
  /** Dipanggil setelah upload berhasil, sebelum pindah ke halaman review */
  onImported?: () => void
}

function validateFile(file: File): string | null {
  const name = file.name.toLowerCase()
  if (!ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext))) {
    return `Hanya file ${ACCEPTED_EXTENSIONS.join(" atau ")} yang didukung.`
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `Ukuran file maksimal ${MAX_FILE_SIZE_MB} MB.`
  }
  return null
}

// State & aksi import transaksi (pilih file, download template, upload) yang dipakai
// bersama oleh drawer import (desktop) dan halaman import (mobile).
export function useImportFile({ onImport, onImported }: UseImportFileOptions = {}) {
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [file, setFile] = React.useState<File | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)
  const [isDownloading, setIsDownloading] = React.useState(false)
  const [downloadError, setDownloadError] = React.useState<string | null>(null)

  async function downloadTemplate() {
    setIsDownloading(true)
    setDownloadError(null)
    try {
      const { blob, fileName } = await downloadImportTemplate()
      saveBlob(blob, fileName ?? FALLBACK_TEMPLATE_FILE_NAME)
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : "Gagal mengunduh template")
    } finally {
      setIsDownloading(false)
    }
  }

  function selectFile(nextFile: File | undefined) {
    if (!nextFile) return
    const validationError = validateFile(nextFile)
    setError(validationError)
    setUploadError(null)
    setFile(validationError ? null : nextFile)
  }

  function clearFile() {
    setFile(null)
    setError(null)
    setUploadError(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  function reset() {
    clearFile()
    setIsDragging(false)
    setDownloadError(null)
  }

  function handleDragOver(event: React.DragEvent<HTMLElement>) {
    event.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function handleDrop(event: React.DragEvent<HTMLElement>) {
    event.preventDefault()
    setIsDragging(false)
    selectFile(event.dataTransfer.files[0])
  }

  async function importFile() {
    if (!file) return
    if (onImport) {
      onImport(file)
      return
    }

    setIsUploading(true)
    setUploadError(null)
    try {
      const result = await uploadImportFile(file)
      saveImportedTransactions(result.data?.transactions ?? [])
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Gagal mengimpor file")
      return
    } finally {
      setIsUploading(false)
    }

    onImported?.()
    clearFile()
    router.push(IMPORT_REVIEW_PATH)
  }

  return {
    inputRef,
    file,
    error,
    isDragging,
    isUploading,
    uploadError,
    isDownloading,
    downloadError,
    downloadTemplate,
    selectFile,
    clearFile,
    reset,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    importFile,
  }
}

export type ImportFileState = ReturnType<typeof useImportFile>
