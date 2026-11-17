"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAdminSession } from "@/components/admin/blogs/blog-auth";
import { adminLogout } from "@/app/admin/actions";
import { House, Users, FileText, Tags, Tag, UserRound, LogOut, Pencil, ChevronsUpDown } from "lucide-react";

const menus = [
  { label: "Home", href: "/admin/dashboard", icon: House },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Blogs", href: "/admin/blogs", icon: FileText },
  { label: "Kategori Blog", href: "/admin/blogs/categories", icon: Tags },
  { label: "Tags", href: "/admin/blogs/tags", icon: Tag },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAdminSession();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const account = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (!account.current?.contains(event.target as Node)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  async function logout() {
    setBusy(true); setError("");
    try {
      await adminLogout();
      window.location.replace("/admin/login");
    } catch {
      setError("Gagal keluar. Silakan coba lagi.");
      setBusy(false);
    }
  }

  return (
    <aside className="w-16 shrink-0 bg-[#1d2327] text-[#c3c4c7] sm:w-52">
      <div className="sticky top-0 flex h-dvh flex-col">
        <Link href="/admin/dashboard" aria-label="Artoku Admin" className="flex h-16 items-center border-b border-white/10 px-5 text-lg font-semibold text-white focus-visible:outline-2 focus-visible:outline-[#72aee6] focus-visible:outline-offset-[-2px]">
          <span className="sm:hidden">A</span>
          <span className="hidden sm:inline">Artoku <span className="text-xs font-normal text-[#a7aaad]">Admin</span></span>
        </Link>
        <nav aria-label="Navigasi admin" className="min-h-0 flex-1 overflow-y-auto py-3">
          <ul>
            {menus.map(({ label, href, icon: Icon }) => {
              const active = pathname === href || (href !== "/admin/blogs" && pathname.startsWith(`${href}/`));
              return (
                <li key={href}>
                  <Link href={href} aria-label={label} title={label} aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 items-center gap-3 px-5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-[#72aee6] focus-visible:outline-offset-[-2px] ${active ? "bg-[#2271b1] font-medium text-white" : "hover:bg-[#2c3338] hover:text-[#72aee6]"}`}>
                    <Icon aria-hidden="true" className="size-5 shrink-0" />
                    <span className="hidden sm:inline">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div ref={account} className="relative shrink-0 border-t border-white/10 p-2">
          {open && <div id="admin-account-options" aria-label="Pilihan akun admin" className="absolute bottom-full left-2 z-50 mb-2 w-56 rounded-lg border border-slate-200 bg-white p-1 text-[#1d2327] shadow-xl">
            <Link href="/admin/profile" onClick={() => setOpen(false)} className="flex min-h-11 items-center gap-3 rounded px-3 text-sm hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#2271b1]">
              <Pencil aria-hidden="true" className="size-4" />Edit profile
            </Link>
            <button type="button" disabled={busy} onClick={logout} className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded px-3 text-sm text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-[#2271b1] disabled:opacity-50">
              <LogOut aria-hidden="true" className="size-4" />{busy ? "Keluar…" : "Exit"}
            </button>
            {error && <p role="alert" className="px-3 py-2 text-xs text-red-700">{error}</p>}
          </div>}
          <button ref={trigger} type="button" aria-expanded={open} aria-controls="admin-account-options" aria-label={`Menu akun ${user.displayName}`} title={`${user.displayName} (${user.roles.join(", ")})`} onClick={() => setOpen(value => !value)} className="flex min-h-14 w-full cursor-pointer items-center gap-3 rounded px-3 text-left hover:bg-[#2c3338] focus-visible:outline-2 focus-visible:outline-[#72aee6]">
            <UserRound aria-hidden="true" className="size-5 shrink-0" />
            <span className="hidden min-w-0 flex-1 sm:block"><span className="block truncate text-sm font-medium text-white">{user.displayName}</span><span className="block truncate text-xs">{user.roles.join(", ")}</span></span>
            <ChevronsUpDown aria-hidden="true" className="hidden size-4 shrink-0 sm:block" />
          </button>
        </div>
      </div>
    </aside>
  );
}
