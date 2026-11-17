import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Admin | Artoku",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return (
    <main aria-label="Dashboard admin">
      <h1 className="text-2xl font-semibold">Home</h1>
      <p className="mt-2 text-sm text-[#646970]">Selamat datang di dashboard admin Artoku.</p>
    </main>
  );
}
