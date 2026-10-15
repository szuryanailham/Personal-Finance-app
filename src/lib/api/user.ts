import { apiRequest } from "./client"

export interface CurrentUser {
  id: string
  firstName: string
  lastName: string
  email: string
}

export async function fetchCurrentUser(signal?: AbortSignal): Promise<CurrentUser> {
  const body = await apiRequest<CurrentUser>("/api/users/me", "memuat profil", { signal })
  if (!body.data) throw new Error("Data profil kosong")
  return body.data
}

// lastName bisa kosong, jadi gabungkan hanya bagian yang terisi
export function getFullName({ firstName, lastName }: CurrentUser): string {
  return [firstName, lastName].map((part) => part?.trim()).filter(Boolean).join(" ")
}
