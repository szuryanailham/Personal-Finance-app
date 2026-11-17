import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata = { title: "Login Admin | Artoku" };

export default function AdminLoginPage() {
  return <main className="flex min-h-dvh items-center justify-center bg-[#f0f0f1] p-5 text-[#1d2327]">
    <AdminLoginForm />
  </main>;
}
