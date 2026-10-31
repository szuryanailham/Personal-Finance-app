import { apiRequest } from "./client"

export interface GuidanceStatus {
  isGuidanceCompleted: boolean
}

export async function fetchGuidanceStatus(): Promise<GuidanceStatus> {
  const response = await apiRequest<GuidanceStatus>("/api/users/me", "memuat status panduan")
  // Guidance endpoints may return a direct object or the usual API envelope.
  const status = response.data ?? (response as unknown as GuidanceStatus)
  if (typeof status.isGuidanceCompleted !== "boolean") {
    throw new Error("Status panduan tidak valid")
  }
  return status
}

export async function completeGuidance(): Promise<void> {
  await apiRequest("/api/users/me/guidance", "menyimpan status panduan", {
    method: "PATCH",
    body: { isGuidanceCompleted: true },
  })
}
