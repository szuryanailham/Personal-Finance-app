import "server-only"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AUTH_TOKEN_COOKIE, AUTH_EXPIRED_AT_COOKIE, DEFAULT_AUTHED_PATH, isSessionValid } from "@/lib/auth"

export async function redirectAuthenticatedUser(): Promise<void> {
  const cookieStore = await cookies()
  if (isSessionValid(cookieStore.get(AUTH_TOKEN_COOKIE)?.value, cookieStore.get(AUTH_EXPIRED_AT_COOKIE)?.value)) {
    redirect(DEFAULT_AUTHED_PATH)
  }
}
