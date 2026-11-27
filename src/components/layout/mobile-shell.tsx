import type { ReactNode } from "react";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

interface MobileShellProps {
  header?: ReactNode;
  children?: ReactNode;
}

// Kerangka halaman versi mobile: header di atas, konten di tengah, navbar di bawah.
// Padding bawah main memberi ruang agar konten tidak tertutup navbar yang fixed.
// Main sengaja tanpa padding samping agar konten bisa full lebar layar; gutter diatur per section.
export function MobileShell({ header, children }: MobileShellProps) {
  return (
    <div className="flex min-h-svh w-full flex-col overflow-x-hidden bg-[#F7FBF8]">
      {header}
      <main className="flex-1 pb-[calc(5rem+env(safe-area-inset-bottom))]">{children}</main>
      <MobileBottomNav />
    </div>
  );
}
