// Loader minimal untuk Google Identity Services (GIS), dipakai untuk mendapatkan ID token Google
const GIS_SCRIPT_SRC = "https://accounts.google.com/gsi/client"

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""

export interface GoogleCredentialResponse {
  /** ID token (JWT) yang diverifikasi oleh backend */
  credential: string
}

interface GoogleButtonOptions {
  type?: "standard" | "icon"
  theme?: "outline" | "filled_blue" | "filled_black"
  size?: "large" | "medium" | "small"
  text?: "signin_with" | "signup_with" | "continue_with" | "signin"
  shape?: "rectangular" | "pill" | "circle" | "square"
  logo_alignment?: "left" | "center"
  width?: number
  locale?: string
}

interface GoogleAccountsId {
  initialize(config: {
    client_id: string
    callback: (response: GoogleCredentialResponse) => void
    ux_mode?: "popup" | "redirect"
    cancel_on_tap_outside?: boolean
  }): void
  renderButton(parent: HTMLElement, options: GoogleButtonOptions): void
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } }
  }
}

let scriptPromise: Promise<GoogleAccountsId> | null = null

/** Muat script GIS sekali saja; panggilan berikutnya memakai promise yang sama */
export function loadGoogleIdentity(): Promise<GoogleAccountsId> {
  if (window.google?.accounts?.id) return Promise.resolve(window.google.accounts.id)
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = GIS_SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => {
      const gis = window.google?.accounts?.id
      if (gis) resolve(gis)
      else reject(new Error("Google Identity Services tidak tersedia"))
    }
    script.onerror = () => {
      // Izinkan percobaan ulang (mis. koneksi sempat terputus)
      scriptPromise = null
      script.remove()
      reject(new Error("Gagal memuat Google Sign-In"))
    }
    document.head.appendChild(script)
  })
  return scriptPromise
}
