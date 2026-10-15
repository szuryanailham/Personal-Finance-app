"use client"

import { useEffect, useRef, useState } from "react"
import { GOOGLE_CLIENT_ID, loadGoogleIdentity } from "@/lib/google-identity"

// Batas lebar tombol yang didukung GIS
const BUTTON_MIN_WIDTH = 200
const BUTTON_MAX_WIDTH = 400
const BUTTON_HEIGHT_CLASS = "h-11"

interface GoogleLoginButtonProps {
  /** Dipanggil dengan ID token Google setelah user memilih akun */
  onCredential: (idToken: string) => void
  onError: (message: string) => void
}

function buttonWidthOf(container: HTMLElement): number {
  return Math.min(BUTTON_MAX_WIDTH, Math.max(BUTTON_MIN_WIDTH, Math.floor(container.clientWidth)))
}

export function GoogleLoginButton({ onCredential, onError }: GoogleLoginButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)
  // Simpan callback terbaru di ref agar inisialisasi GIS tidak diulang tiap render
  const onCredentialRef = useRef(onCredential)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onCredentialRef.current = onCredential
    onErrorRef.current = onError
  }, [onCredential, onError])

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      onErrorRef.current("Login Google belum dikonfigurasi (NEXT_PUBLIC_GOOGLE_CLIENT_ID kosong)")
      return
    }

    let isCancelled = false
    loadGoogleIdentity()
      .then((gis) => {
        const container = containerRef.current
        if (isCancelled || !container) return
        gis.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: ({ credential }) => onCredentialRef.current(credential),
          ux_mode: "popup",
          cancel_on_tap_outside: true,
        })
        gis.renderButton(container, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "center",
          width: buttonWidthOf(container),
        })
        setIsReady(true)
      })
      .catch((error: Error) => {
        if (!isCancelled) onErrorRef.current(error.message)
      })

    return () => {
      isCancelled = true
    }
  }, [])

  return (
    <div className={`relative w-full ${BUTTON_HEIGHT_CLASS}`}>
      <div ref={containerRef} className="flex w-full justify-center" />
      {!isReady && <div className="absolute inset-0 animate-pulse rounded-md bg-slate-100" />}
    </div>
  )
}
