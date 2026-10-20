"use client"
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ImageIcon, PlusIcon, type LucideIcon } from "lucide-react";
import { AddTransactionDialog } from "@/components/header/add-transaction-dialog";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

// Icon masih dummy (placeholder); ganti per item setelah aset icon tersedia
const NAV_ITEMS_LEFT: NavItem[] = [
  { label: "Beranda", href: "/dashboard", icon: ImageIcon },
  { label: "Transaksi", href: "/transaction", icon: ImageIcon },
];

const NAV_ITEMS_RIGHT: NavItem[] = [
  { label: "Analisis", href: "/analysis", icon: ImageIcon },
  { label: "Pengaturan", href: "/settings", icon: ImageIcon },
];

function NavLink({ label, href, icon: Icon, isActive }: NavItem & { isActive: boolean }) {
  return (
    <li>
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex h-full flex-col items-center justify-center gap-1 text-xs font-medium transition-colors active:opacity-60",
          isActive ? "text-[#6359E9]" : "text-slate-500"
        )}
      >
        <Icon className="size-6" aria-hidden />
        {label}
      </Link>
    </li>
  );
}

// Navbar bawah versi mobile; item aktif ditandai warna ungu,
// tombol bulat di tengah membuka dialog tambah transaksi
export function MobileBottomNav() {
  const pathname = usePathname();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <nav
        aria-label="Navigasi utama"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-violet-100 bg-white pb-[env(safe-area-inset-bottom)]"
      >
        <ul className="grid h-16 grid-cols-5">
          {NAV_ITEMS_LEFT.map((item) => (
            <NavLink key={item.href} {...item} isActive={isActive(item.href)} />
          ))}
          <li className="flex items-start justify-center">
            <button
              type="button"
              aria-label="Tambah transaksi"
              onClick={() => setIsAddOpen(true)}
              className="-mt-6 flex size-14 items-center justify-center rounded-full bg-[#6B64CD] text-white shadow-lg shadow-[#6B64CD]/40 ring-4 ring-white transition-transform active:scale-95"
            >
              <PlusIcon className="size-7" aria-hidden />
            </button>
          </li>
          {NAV_ITEMS_RIGHT.map((item) => (
            <NavLink key={item.href} {...item} isActive={isActive(item.href)} />
          ))}
        </ul>
      </nav>
      <AddTransactionDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
    </>
  );
}
