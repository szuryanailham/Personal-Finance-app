import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono, Manrope, Anton_SC } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope-sans",
  subsets: ["latin"],
});

const antonSc = Anton_SC({
  variable: "--font-anton-sc",
  weight: "400",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Artoku",
  description: "Kelola keuangan pribadi dengan lebih mudah: catat transaksi, pantau pengeluaran, dan pahami kondisi finansialmu bersama Artoku.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${manrope.variable} ${antonSc.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#F3F3FC]">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
