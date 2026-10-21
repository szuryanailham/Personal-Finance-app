import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import {
  AUTH_EXPIRED_AT_COOKIE,
  AUTH_TOKEN_COOKIE,
  DEFAULT_AUTHED_PATH,
  LOGIN_PATH,
  REDIRECT_PARAM,
  isSessionValid,
} from "@/lib/auth"

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const isLoggedIn = isSessionValid(
    request.cookies.get(AUTH_TOKEN_COOKIE)?.value,
    request.cookies.get(AUTH_EXPIRED_AT_COOKIE)?.value
  )

  // Sudah login tapi membuka /login → langsung ke dashboard
  if (pathname === LOGIN_PATH) {
    return isLoggedIn
      ? NextResponse.redirect(new URL(DEFAULT_AUTHED_PATH, request.url))
      : NextResponse.next()
  }

  if (isLoggedIn) return NextResponse.next()

  // Belum login / sesi expired → ke login, simpan halaman asal untuk redirect balik
  const loginUrl = new URL(LOGIN_PATH, request.url)
  loginUrl.searchParams.set(REDIRECT_PARAM, `${pathname}${search}`)
  const response = NextResponse.redirect(loginUrl)
  response.cookies.delete(AUTH_TOKEN_COOKIE)
  response.cookies.delete(AUTH_EXPIRED_AT_COOKIE)
  return response
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/transaction/:path*",
    "/analysis/:path*",
    "/settings/:path*",
    "/summary/:path*",
    "/import/:path*",
  ],
}
