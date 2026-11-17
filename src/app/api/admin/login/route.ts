import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, BLOG_BACKEND } from "@/lib/admin-session";
import type { BlogSession } from "@/types/admin/blog-category";

function errorResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? new URL(request.url).host;
  if (request.headers.get("sec-fetch-site") === "cross-site" || (origin && new URL(origin).host !== host)) {
    return errorResponse("Permintaan login tidak diizinkan.", 403);
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return errorResponse("Format permintaan login tidak valid.", 400);
  }
  if (!input || typeof input !== "object" || !("email" in input) || !("password" in input)
    || typeof input.email !== "string" || typeof input.password !== "string"
    || !input.email.trim() || input.email.trim().length > 254 || !input.password || input.password.length > 72) {
    return errorResponse("Email dan password wajib diisi dengan benar.", 400);
  }

  try {
    const response = await fetch(`${BLOG_BACKEND}/api/blog/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: input.email.trim(), password: input.password }),
      cache: "no-store",
    });
    const json = await response.json().catch(() => null);
    if (!response.ok) {
      const fallback = response.status === 401
        ? "Email atau password tidak valid."
        : `Layanan login menolak permintaan (HTTP ${response.status}).`;
      return errorResponse(typeof json?.errors === "string" ? json.errors : fallback, response.status);
    }
    const session = json?.data as BlogSession | undefined;
    if (!session?.token || !session.user || !Array.isArray(session.user.roles)
      || !Number.isFinite(Date.parse(session.expiresAt)) || Date.parse(session.expiresAt) <= Date.now()) {
      return errorResponse("Respons sesi admin tidak valid.", 502);
    }
    const result = NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
    result.cookies.set(ADMIN_SESSION_COOKIE, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(session.expiresAt),
    });
    return result;
  } catch {
    return errorResponse("Tidak dapat menghubungi layanan login. Silakan coba lagi.", 502);
  }
}
