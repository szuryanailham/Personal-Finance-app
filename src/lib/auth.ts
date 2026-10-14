// Sesi login disimpan di cookie agar bisa dibaca oleh proxy (server) maupun API client (browser)
export const AUTH_TOKEN_COOKIE = "auth_token"
export const AUTH_EXPIRED_AT_COOKIE = "auth_expired_at"

export const LOGIN_PATH = "/login"
export const DEFAULT_AUTHED_PATH = "/dashboard"
export const REDIRECT_PARAM = "from"

export interface AuthSession {
  token: string
  /** Epoch milidetik dari backend */
  expiredAt: number
}

export function isSessionValid(token: string | undefined, expiredAt: string | undefined): boolean {
  if (!token) return false
  const expiry = Number(expiredAt)
  return Number.isFinite(expiry) && expiry > Date.now()
}

// Hanya izinkan redirect ke path internal agar tidak bisa dipakai untuk open redirect
export function safeRedirectPath(path: string | null): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return DEFAULT_AUTHED_PATH
  return path
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined
  const entry = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`))
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : undefined
}

function writeCookie(name: string, value: string, expires: Date): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Expires=${expires.toUTCString()}; SameSite=Lax${secure}`
}

export function saveSession({ token, expiredAt }: AuthSession): void {
  const expires = new Date(expiredAt)
  writeCookie(AUTH_TOKEN_COOKIE, token, expires)
  writeCookie(AUTH_EXPIRED_AT_COOKIE, String(expiredAt), expires)
}

export function clearSession(): void {
  const past = new Date(0)
  writeCookie(AUTH_TOKEN_COOKIE, "", past)
  writeCookie(AUTH_EXPIRED_AT_COOKIE, "", past)
}

/** Token aktif, atau null bila belum login / sudah expired */
export function getSessionToken(): string | null {
  const token = readCookie(AUTH_TOKEN_COOKIE)
  return isSessionValid(token, readCookie(AUTH_EXPIRED_AT_COOKIE)) ? token ?? null : null
}

/** Hapus sesi lalu arahkan ke halaman login, kembali ke halaman saat ini setelah login */
export function redirectToLogin(): void {
  clearSession()
  const from = `${window.location.pathname}${window.location.search}`
  window.location.replace(`${LOGIN_PATH}?${REDIRECT_PARAM}=${encodeURIComponent(from)}`)
}
