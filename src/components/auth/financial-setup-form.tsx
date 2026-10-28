"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { RupiahAmountInput } from "@/components/header/rupiah-amount-input"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { LoadingState, Spinner } from "@/components/ui/spinner"
import {
  completeFinancialSetup,
  fetchFinancialSetup,
  skipFinancialSetup,
  type FinancialSetupRequest,
} from "@/lib/api/financial-setup"
import { ApiError } from "@/lib/api/client"
import { DEFAULT_AUTHED_PATH } from "@/lib/auth"

const INPUT_CLASS = "h-10 px-3 text-sm sm:h-11"
const DEFAULT_BALANCE = 5_000_000
const DEFAULT_SAVINGS = 2_000_000
// Batas backend: @Digits(integer = 13)
const MAX_AMOUNT_DIGITS = 13
const HTTP_CONFLICT = 409
const BRAND_BUTTON_CLASS = "h-10 w-full text-sm sm:h-11 bg-[#14864A] text-white hover:bg-[#10733e]"

type SetupResult = { input: FinancialSetupRequest } | { error: string }

function toAmount(value: FormDataEntryValue | null): number | null {
  const digits = String(value ?? "")
  if (digits.length > MAX_AMOUNT_DIGITS) return null
  return digits ? Number(digits) : 0
}

function toSetupInput(form: HTMLFormElement): SetupResult {
  const data = new FormData(form)
  const balance = toAmount(data.get("balance"))
  const savings = toAmount(data.get("savings"))
  if (balance === null || savings === null) {
    return { error: `Nominal maksimal ${MAX_AMOUNT_DIGITS} digit` }
  }
  return { input: { balance, savings } }
}

function toErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback
}

function isAlreadyCompleted(err: unknown): boolean {
  return err instanceof ApiError && err.status === HTTP_CONFLICT
}

export function FinancialSetupForm() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSkipping, setIsSkipping] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Setup hanya sekali per user; yang sudah selesai langsung ke dashboard
  useEffect(() => {
    const controller = new AbortController()
    fetchFinancialSetup(controller.signal)
      .then((setup) => {
        if (setup.setupCompleted) router.replace(DEFAULT_AUTHED_PATH)
        else setIsChecking(false)
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        setErrorMessage(toErrorMessage(err, "Gagal memuat setup awal"))
        setIsChecking(false)
      })
    return () => controller.abort()
  }, [router])

  function finish(message: string) {
    toast.success(message)
    router.replace(DEFAULT_AUTHED_PATH)
  }

  function handleError(err: unknown, fallback: string) {
    if (isAlreadyCompleted(err)) {
      finish("Setup awal sudah pernah diselesaikan")
      return
    }
    setErrorMessage(toErrorMessage(err, fallback))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const result = toSetupInput(e.currentTarget)
    if ("error" in result) {
      setErrorMessage(result.error)
      return
    }

    setErrorMessage(null)
    setIsSubmitting(true)
    try {
      await completeFinancialSetup(result.input)
      finish("Setup awal berhasil disimpan")
    } catch (err) {
      handleError(err, "Gagal menyimpan setup awal")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSkip() {
    setErrorMessage(null)
    setIsSkipping(true)
    try {
      await skipFinancialSetup()
      finish("Setup awal dilewati, saldo awal diatur ke Rp 0")
    } catch (err) {
      handleError(err, "Gagal melewati setup awal")
    } finally {
      setIsSkipping(false)
    }
  }

  if (isChecking) return <LoadingState label="Memeriksa setup awal..." />


  const isBusy = isSubmitting || isSkipping

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
      <fieldset disabled={isBusy} className="contents">
        <FieldGroup className="gap-4 sm:gap-5">
          <Field>
            <Label htmlFor="setup-balance" className="text-sm">Saldo Rekening Utama</Label>
            <RupiahAmountInput
              id="setup-balance"
              name="balance"
              defaultValue={DEFAULT_BALANCE}
              className={INPUT_CLASS}
            />
            <FieldDescription className="text-xs sm:text-sm">Uang yang kamu pakai untuk kebutuhan sehari-hari.</FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="setup-savings" className="text-sm">Saldo Tabungan</Label>
            <RupiahAmountInput
              id="setup-savings"
              name="savings"
              defaultValue={DEFAULT_SAVINGS}
              className={INPUT_CLASS}
            />
            <FieldDescription className="text-xs sm:text-sm">Uang yang kamu sisihkan dan tidak dipakai rutin.</FieldDescription>
          </Field>
        </FieldGroup>
        {errorMessage && (
          <p role="alert" className="text-center text-xs text-destructive sm:text-sm">
            {errorMessage}
          </p>
        )}
        <div className="flex flex-col gap-2 sm:gap-3">
          <Button type="submit" className={BRAND_BUTTON_CLASS}>
            {isSubmitting && <Spinner />}
            {isSubmitting ? "Menyimpan..." : "Simpan & Lanjutkan"}
          </Button>
          <Button type="button" variant="ghost" onClick={handleSkip} className="h-10 w-full text-sm sm:h-11">
            {isSkipping && <Spinner />}
            Lewati untuk sekarang
          </Button>
        </div>
      </fieldset>
    </form>
  )
}
