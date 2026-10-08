"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  AlertCircleIcon,
  CloudUpload,
  Download,
  FileSpreadsheet,
  Loader2,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { saveBlob } from "@/lib/download"
import { downloadImportTemplate } from "@/lib/api/transaction"
import { uploadImportFile } from "@/lib/api/transaction-import"
import { saveImportedTransactions } from "@/lib/import-store"
import { useIsMobile } from "@/hooks/use-mobile"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { InfoSection } from "@/components/header/info-section"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const ACCEPTED_EXTENSIONS = [".csv", ".xlsx"]
const MAX_FILE_SIZE_MB = 5
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
// Dipakai jika backend tidak mengirim nama file lewat Content-Disposition
const FALLBACK_TEMPLATE_FILE_NAME = "transaction-template.xlsx"
const IMPORT_REVIEW_PATH = "/transaction/import-review"

interface ImportDrawerProps {
  triggerClassName?: string
  /** Override aksi import; default: upload ke backend lalu buka halaman review */
  onImport?: (file: File) => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function validateFile(file: File): string | null {
  const name = file.name.toLowerCase()
  if (!ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext))) {
    return `Only ${ACCEPTED_EXTENSIONS.join(" or ")} files are supported.`
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File size must be ${MAX_FILE_SIZE_MB} MB or less.`
  }
  return null
}

export function ImportDrawer({ triggerClassName, onImport }: ImportDrawerProps) {
  const isMobile = useIsMobile()
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [file, setFile] = React.useState<File | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [isDownloading, setIsDownloading] = React.useState(false)
  const [downloadError, setDownloadError] = React.useState<string | null>(null)

  async function handleDownloadTemplate() {
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

  // Drawer ditutup → pilihan file dibuang supaya tidak terbawa ke pembukaan berikutnya
  function handleOpenChange(nextOpen: boolean) {
    if (isUploading) return
    setOpen(nextOpen)
    if (!nextOpen) {
      clearFile()
      setIsDragging(false)
      setDownloadError(null)
    }
  }

  function handleDragOver(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setIsDragging(true)
  }

  function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setIsDragging(false)
    selectFile(event.dataTransfer.files[0])
  }

  async function handleImport() {
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

    setOpen(false)
    clearFile()
    router.push(IMPORT_REVIEW_PATH)
  }

  return (
    <Drawer
      open={open}
      onOpenChange={handleOpenChange}
      showSwipeHandle={isMobile}
      swipeDirection={isMobile ? "down" : "right"}
    >
      <DrawerTrigger
        render={
          <Button className={triggerClassName} variant="outline" size="lg">
            <Upload data-icon="inline-start" />
            Import
          </Button>
        }
      />
      <DrawerContent className="py-5 px-3">
        <DrawerHeader>
          <DrawerTitle>Import Transactions</DrawerTitle>
          <DrawerDescription>Upload a file to import your transactions.</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4 py-5 scroll-fade">
          {/* 1. Hero */}
          <div className="flex flex-col gap-4 mb-3">
            <InfoSection
              step={1}
              icon={FileSpreadsheet}
              title="Select and upload the file of your choice"
              subtitle="Use our template so every column matches the expected format."
            >
              <Button
                type="button"
                variant="link"
                onClick={handleDownloadTemplate}
                disabled={isDownloading}
                className="h-auto self-start p-0 text-[#6359E9]"
              >
                {isDownloading ? (
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                ) : (
                  <Download data-icon="inline-start" />
                )}
                {isDownloading ? "Downloading..." : "Download template"}
              </Button>
            </InfoSection>

            <InfoSection
              step={2}
              icon={ShieldCheck}
              title="Review your data before importing"
              subtitle="Make sure dates, amounts and categories are filled in correctly."
            />
          </div>

          {downloadError && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Download failed</AlertTitle>
              <AlertDescription>{downloadError}</AlertDescription>
            </Alert>
          )}

          {/* 2. Upload */}
          <label
            htmlFor="import-dropzone-file"
            onDragOver={handleDragOver}
            onDragLeave={() => setIsDragging(false)}
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
              <span className="font-semibold text-[#6359E9]">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              {ACCEPTED_EXTENSIONS.map((ext) => ext.slice(1).toUpperCase()).join(" or ")} (max.{" "}
              {MAX_FILE_SIZE_MB} MB)
            </p>
            <input
              ref={inputRef}
              id="import-dropzone-file"
              type="file"
              accept={ACCEPTED_EXTENSIONS.join(",")}
              className="sr-only"
              onChange={(event) => selectFile(event.target.files?.[0])}
            />
          </label>

          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Invalid file</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {uploadError && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Import failed</AlertTitle>
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

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
                aria-label="Remove file"
                onClick={clearFile}
              >
                <X />
              </Button>
            </div>
          )}
        </div>

        <DrawerFooter className="flex-row gap-3">
          <DrawerClose render={<Button variant="outline" className="h-[34px] flex-1 border-[#8C89B4]">Close</Button>} />
          <Button
            onClick={handleImport}
            disabled={!file || isUploading}
            className="h-[34px] flex-1 bg-[#6359E9] text-white hover:bg-[#6359E9]/90"
          >
            {isUploading && <Loader2 data-icon="inline-start" className="animate-spin" />}
            {isUploading ? "Importing..." : "Import"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
