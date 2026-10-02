const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN

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
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

interface ApiRequestOptions {
  method?: HttpMethod
  params?: URLSearchParams
  body?: unknown
  signal?: AbortSignal
}

export async function apiRequest<T>(
  path: string,
  errorLabel: string,
  { method = "GET", params, body, signal }: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  if (!API_TOKEN) {
    throw new Error("NEXT_PUBLIC_API_TOKEN belum diset di .env.local")
  }

  const query = params ? `?${params}` : ""
  const headers: HeadersInit = { Authorization: `Bearer ${API_TOKEN}` }
  if (body !== undefined) headers["Content-Type"] = "application/json"

  const res = await fetch(`${API_BASE_URL}${path}${query}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  })

  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null

  if (!res.ok || !json) {
    throw new Error(json?.errors ?? `Gagal ${errorLabel} (HTTP ${res.status})`)
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
export async function apiDownload(path: string, errorLabel: string): Promise<DownloadedFile> {
  if (!API_TOKEN) {
    throw new Error("NEXT_PUBLIC_API_TOKEN belum diset di .env.local")
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  })

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
