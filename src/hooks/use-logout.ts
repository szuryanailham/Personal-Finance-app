"use client"

import { useRouter } from "next/navigation"

import { LOGIN_PATH, clearSession } from "@/lib/auth"

// Hapus sesi lalu arahkan ke halaman login; dipakai sidebar desktop & halaman pengaturan mobile
export function useLogout(): () => void {
  const router = useRouter()

  return () => {
    clearSession()
    router.replace(LOGIN_PATH)
  }
}
