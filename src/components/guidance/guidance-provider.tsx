"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import { getSessionToken } from "@/lib/auth"
import { completeGuidance, fetchGuidanceStatus } from "@/lib/api/guidance"
import { TUTORIALS, type TutorialId } from "@/lib/guidance/tutorials"
import { createTutorialRunner } from "@/lib/guidance/runner"
import { WelcomeScreen } from "./welcome-screen"
import { Spinner } from "@/components/ui/spinner"

const APP_PATHS = ["/dashboard", "/category", "/transaction", "/analysis", "/calender", "/summary", "/import", "/export", "/settings", "/guidance"]
export const isGuidanceAppPath = (path: string) => APP_PATHS.some((base) => path === base || path.startsWith(`${base}/`))

const GuidanceContext = createContext<{ startTutorial: (id: TutorialId) => void; busy: boolean } | null>(null)

export function useGuidance() {
  const value = useContext(GuidanceContext)
  if (!value) throw new Error("GuidanceProvider diperlukan")
  return value
}

// Root-mounted so tutorial navigation does not recreate the status request or Driver instance.
export function GuidanceProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const session = useRef<string | null>(null)
  const status = useRef<boolean | null>(null)
  const checked = useRef(false)
  const attempted = useRef(false)
  const saving = useRef(false)
  const runner = useRef<ReturnType<typeof createTutorialRunner> | null>(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [statusReady, setStatusReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [loadingStep, setLoadingStep] = useState(false)

  const persistCompletion = useCallback(async function persistCompletion(expectedToken = session.current) {
    if (!expectedToken || getSessionToken() !== expectedToken || session.current !== expectedToken) return
    if (saving.current || status.current === true) return
    saving.current = true
    const token = session.current
    try {
      await completeGuidance()
      if (session.current === token) status.current = true
    } catch {
      if (session.current === token && getSessionToken() === token) {
        toast.error("Panduan ditutup, tetapi status belum tersimpan. Coba simpan kembali agar panduan tidak muncul pada login berikutnya.", {
          duration: 10000,
          action: { label: "Coba simpan", onClick: () => void persistCompletion(token) },
        })
      }
    } finally {
      saving.current = false
    }
  }, [])

  const startTutorial = useCallback((id: TutorialId) => {
    if (!getSessionToken() || !document.querySelector("[data-guidance-shell]")) return
    attempted.current = true
    setShowWelcome(false)
    runner.current?.destroy()
    setBusy(true)
    runner.current = createTutorialRunner({
      steps: TUTORIALS[id].steps,
      navigate: (path) => router.push(path),
      onLoading: setLoadingStep,
      onFinish: () => {
        runner.current = null
        setBusy(false)
        if (id === "initial") void persistCompletion()
      },
      onError: (error) => {
        runner.current = null
        setBusy(false)
        toast.error(error instanceof Error ? error.message : "Panduan tidak dapat dimulai. Coba lagi dari Pusat Panduan.")
      },
    })
    runner.current.start()
  }, [persistCompletion, router])

  useEffect(() => {
    if (!isGuidanceAppPath(pathname)) {
      runner.current?.destroy()
      runner.current = null
      session.current = null
      checked.current = false
      attempted.current = false
      status.current = null
      void Promise.resolve().then(() => {
        if (session.current !== null) return
        setBusy(false)
        setShowWelcome(false)
        setStatusReady(false)
        setLoadingStatus(false)
        setLoadingStep(false)
      })
      return
    }
    const token = getSessionToken()
    if (!token || !document.querySelector("[data-guidance-shell]")) return
    if (session.current !== token) {
      session.current = token
      checked.current = false
      attempted.current = false
      status.current = null
    }
    if (checked.current) return
    checked.current = true
    // Keep the same request through Strict Mode effect replay and route changes.
    void Promise.resolve().then(async () => {
      if (session.current !== token || getSessionToken() !== token) return
      setLoadingStatus(true)
      try {
        const result = await fetchGuidanceStatus()
        if (session.current !== token || getSessionToken() !== token) return
        // A slow GET must not overwrite a completion saved while it was pending.
        if (status.current !== true) status.current = result.isGuidanceCompleted
        if (!status.current && !attempted.current) setShowWelcome(true)
      } catch {
        if (session.current === token && getSessionToken() === token) {
          toast.error("Status panduan belum dapat dimuat. Kamu tetap bisa membuka tutorial dari Pusat Panduan.")
        }
      } finally {
        if (session.current === token) {
          setLoadingStatus(false)
          setStatusReady(true)
        }
      }
    })
  }, [pathname, startTutorial])

  useEffect(() => {
    // Restore the current step after external navigation or a responsive layout change.
    const resume = () => runner.current?.resume()
    const breakpoint = window.matchMedia("(max-width: 767px)")
    breakpoint.addEventListener("change", resume)
    return () => breakpoint.removeEventListener("change", resume)
  }, [])

  useEffect(() => {
    if (isGuidanceAppPath(pathname)) runner.current?.resume()
  }, [pathname])

  useEffect(() => () => runner.current?.destroy(), [])

  const inApp = isGuidanceAppPath(pathname)
  const blocked = inApp && (!statusReady || showWelcome)
  return (
    <GuidanceContext.Provider value={{ startTutorial, busy: busy || loadingStatus }}>
      <div inert={blocked} hidden={blocked}>{children}</div>
      {inApp && statusReady && showWelcome && (
        <WelcomeScreen
          onStart={() => startTutorial("initial")}
          onSkip={() => {
            attempted.current = true
            setShowWelcome(false)
            void persistCompletion()
          }}
        />
      )}
      {inApp && !statusReady && (
        <div role="status" className="fixed inset-0 z-[10000] flex items-center justify-center gap-3 bg-[#F7FBF8] text-sm text-slate-600">
          <Spinner /> Memuat Artoku…
        </div>
      )}
      {inApp && (loadingStatus || loadingStep) && (
        <div role="status" className="fixed inset-x-4 top-4 z-[10001] mx-auto flex w-fit max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border bg-popover px-4 py-3 text-sm text-popover-foreground shadow-lg">
          <Spinner />
          {loadingStatus ? "Memuat status panduan…" : "Menyiapkan langkah panduan…"}
          {loadingStep && <button type="button" onClick={() => runner.current?.skip()} className="font-medium text-[#14864A] underline">Lewati tutorial</button>}
        </div>
      )}
    </GuidanceContext.Provider>
  )
}
