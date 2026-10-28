import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Artoku",
  description: "Kelola keuangan pribadi dengan lebih mudah: catat transaksi, pantau pengeluaran, dan pahami kondisi finansialmu bersama Artoku.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className="h-full antialiased"
    >
      <body className="min-h-full bg-[#F3F3FC]">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
