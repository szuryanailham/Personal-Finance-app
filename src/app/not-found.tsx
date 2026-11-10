import type { Metadata } from "next";
import { PageStatus } from "@/components/status/page-status";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan",
};

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-white">
      <PageStatus
        className="min-h-screen"
        title="Halaman Tidak Ditemukan"
        description="Halaman yang kamu cari tidak ada atau sudah dipindahkan."
      />
    </main>
  );
}
