"use client"
import type { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveShellProps {
  mobile: ReactNode;
  children: ReactNode;
}

// Memilih layout mobile atau desktop berdasarkan lebar layar.
// CSS mencegah flash sebelum hydration; setelah terdeteksi mobile, tree desktop di-unmount
// agar halaman desktop (dan fetch datanya) tidak berjalan di mobile.
export function ResponsiveShell({ mobile, children }: ResponsiveShellProps) {
  const isMobile = useIsMobile();

  return (
    <>
      <div className="md:hidden">{mobile}</div>
      {!isMobile && <div className="hidden md:contents">{children}</div>}
    </>
  );
}
