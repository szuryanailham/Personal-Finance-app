import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "driver.js/dist/driver.css";
import "./globals.css";
import { GuidanceProvider } from "@/components/guidance/guidance-provider";

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
        <GuidanceProvider>{children}</GuidanceProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
