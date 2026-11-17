"use client";

import { useState, type FormEvent } from "react";
import { PasswordInput } from "@/components/ui/password-input";
import { adminLogin } from "@/app/admin/actions";

const control = "min-h-10 w-full rounded border border-[#8c8f94] bg-white px-3 text-sm";

export function AdminLoginForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    setBusy(true); setError(null);
    try {
      const result = await adminLogin(String(data.get("email") ?? "").trim(), String(data.get("password") ?? ""));
      if (result.error) { setError(result.error); return; }
      const from = new URLSearchParams(window.location.search).get("from");
      const destination = from && /^\/admin(?:\/|$)/.test(from) && !from.startsWith("/admin/login") && !/[\\\r\n]/.test(from) ? from : "/admin/dashboard";
      window.location.replace(destination);
    } catch { setError("Login gagal. Silakan coba lagi."); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded border border-[#c3c4c7] bg-white p-6 shadow-sm">
    <h1 className="text-2xl font-semibold">Login Admin</h1>
    <p className="text-sm text-[#646970]">Masuk menggunakan akun blog untuk mengakses halaman admin.</p>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <fieldset disabled={busy} className="space-y-4">
      <div className="space-y-1"><label htmlFor="admin-email">Email</label><input id="admin-email" name="email" type="email" autoComplete="username" maxLength={254} required className={control} /></div>
      <div className="space-y-1"><label htmlFor="admin-password">Password</label><PasswordInput id="admin-password" name="password" autoComplete="current-password" maxLength={72} required className={control} /></div>
      <button type="submit" className="min-h-10 w-full cursor-pointer rounded bg-[#2271b1] px-4 text-white hover:bg-[#135e96] disabled:opacity-50">{busy ? "Masuk..." : "Masuk"}</button>
    </fieldset>
  </form>;
}
