import { getSessionToken, redirectToLogin } from "@/lib/auth"

// Default kosong → request relatif ke /api/* yang di-proxy oleh rewrites di next.config.ts.
// Isi NEXT_PUBLIC_API_BASE_URL hanya bila ingin memanggil backend langsung (butuh CORS)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

const SESSION_EXPIRED_MESSAGE = "Sesi login berakhir, silakan login kembali"
const HTTP_UNAUTHORIZED = 401
// Fallback bila header Retry-After tidak terbaca (mis. belum di-expose via CORS)
const RETRY_AFTER_MESSAGE_PATTERN = /try again in (\d+) second/i

export class ApiError extends Error {
  readonly status: number
  /** Detik sampai request boleh dicoba lagi (HTTP 429), null bila tidak ada */
  readonly retryAfterSeconds: number | null

  constructor(message: string, status: number, retryAfterSeconds: number | null) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.retryAfterSeconds = retryAfterSeconds
  }
}

function toPositiveInt(value: string | null | undefined): number | null {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

function parseRetryAfter(res: Response, message: string): number | null {
  return (
    toPositiveInt(res.headers.get("Retry-After")) ??
    toPositiveInt(RETRY_AFTER_MESSAGE_PATTERN.exec(message)?.[1])
  )
}

function requireToken(): string {
  const token = getSessionToken()
  if (!token) {
    redirectToLogin()
    throw new Error(SESSION_EXPIRED_MESSAGE)
  }
  return token
}

// Token ditolak backend (expired / dicabut) → paksa login ulang
function assertAuthorized(res: Response, isPublic: boolean): void {
  if (isPublic || res.status !== HTTP_UNAUTHORIZED) return
  redirectToLogin()
  throw new Error(SESSION_EXPIRED_MESSAGE)
}

// Bentuk response dari backend Spring Boot
export interface ApiResponse<T> {
  data: T | null
  message: string | null
  errors: string | null
  paging: Paging | null
}

export interface Paging {
  currentPage: number
  totalPage: number
  size: number
  /** Total baris di semua halaman; opsional agar tetap jalan dengan backend lama */
  totalItem?: number
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

interface ApiRequestOptions {
  method?: HttpMethod
  params?: URLSearchParams
  body?: unknown
  signal?: AbortSignal
  /** true untuk endpoint tanpa autentikasi (mis. login) */
  isPublic?: boolean
}

export async function apiRequest<T>(
  path: string,
  errorLabel: string,
  { method = "GET", params, body, signal, isPublic = false }: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const query = params ? `?${params}` : ""
  const headers: Record<string, string> = {}
  if (!isPublic) headers.Authorization = `Bearer ${requireToken()}`
  if (body !== undefined) headers["Content-Type"] = "application/json"

  const res = await fetch(`${API_BASE_URL}${path}${query}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  })
  assertAuthorized(res, isPublic)

  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null

  if (!res.ok || !json) {
    const message = json?.errors ?? `Gagal ${errorLabel} (HTTP ${res.status})`
    throw new ApiError(message, res.status, parseRetryAfter(res, message))
  }

  return json
}

export interface DownloadedFile {
  blob: Blob
  fileName: string | null
}

// Ambil nama file dari header `Content-Disposition: attachment; filename="..."`
function parseFileName(contentDisposition: string | null): string | null {
  if (!contentDisposition) return null
  const encoded = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition)
  if (encoded) return decodeURIComponent(encoded[1])
  const plain = /filename="?([^";]+)"?/i.exec(contentDisposition)
  return plain ? plain[1] : null
}

// Untuk endpoint yang mengembalikan file (bukan JSON ApiResponse)
export async function apiDownload(
  path: string,
  errorLabel: string,
  params?: URLSearchParams
): Promise<DownloadedFile> {
  const token = requireToken()
  const query = params ? `?${params}` : ""
  const res = await fetch(`${API_BASE_URL}${path}${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  assertAuthorized(res, false)

  if (!res.ok) {
    const json = (await res.json().catch(() => null)) as ApiResponse<unknown> | null
    throw new Error(json?.errors ?? `Gagal ${errorLabel} (HTTP ${res.status})`)
  }

  return {
    blob: await res.blob(),
    fileName: parseFileName(res.headers.get("Content-Disposition")),
  }
}

export function apiGet<T>(
  path: string,
  params: URLSearchParams,
  errorLabel: string,
  signal?: AbortSignal
): Promise<ApiResponse<T>> {
  return apiRequest<T>(path, `memuat ${errorLabel}`, { params, signal })
}

// Upload multipart/form-data. Response dikembalikan apa adanya karena bentuknya bisa berbeda dari ApiResponse
export async function apiUpload<T>(path: string, formData: FormData, errorLabel: string): Promise<T> {
  const token = requireToken()
  // Content-Type sengaja tidak diset agar browser mengisi boundary multipart sendiri
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  assertAuthorized(res, false)

  const json = (await res.json().catch(() => null)) as (T & { errors?: string | null }) | null

  if (!res.ok || !json) {
    throw new Error(json?.errors ?? `Gagal ${errorLabel} (HTTP ${res.status})`)
  }

  return json
}
