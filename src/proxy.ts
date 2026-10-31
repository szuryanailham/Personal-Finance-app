import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import {
  AUTH_EXPIRED_AT_COOKIE,
  AUTH_TOKEN_COOKIE,
  DEFAULT_AUTHED_PATH,
  LOGIN_PATH,
  REDIRECT_PARAM,
  SIGN_UP_PATH,
  isSessionValid,
} from "@/lib/auth"

// Halaman khusus tamu: landing page, login, daftar, dan verifikasi OTP
function isGuestOnlyPath(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname === LOGIN_PATH ||
    pathname === SIGN_UP_PATH ||
    pathname.startsWith(`${SIGN_UP_PATH}/`)
  )
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const isLoggedIn = isSessionValid(
    request.cookies.get(AUTH_TOKEN_COOKIE)?.value,
    request.cookies.get(AUTH_EXPIRED_AT_COOKIE)?.value
  )

  // Sudah login tapi membuka landing page, /login, atau /sign-up → langsung ke dashboard
  if (isGuestOnlyPath(pathname)) {
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
    "/",
    "/login",
    "/sign-up/:path*",
    "/dashboard/:path*",
    "/category/:path*",
    "/guidance/:path*",
    "/transaction/:path*",
    "/analysis/:path*",
    "/settings/:path*",
    "/summary/:path*",
    "/import/:path*",
    "/export/:path*",
    "/calender/:path*",
    "/financial-setup",
  ],
}
