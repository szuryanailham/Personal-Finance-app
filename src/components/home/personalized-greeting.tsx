"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";

export function PersonalizedGreeting({ className }: { className?: string }) {
  const { user } = useCurrentUser();
  const firstName = user?.firstName?.trim();

  return (
    <div className={cn("min-w-0", className)}>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 [overflow-wrap:anywhere] sm:text-3xl">
        {firstName ? `Halo, ${firstName}!` : "Halo!"}
      </h1>
      <p className="mt-2 text-sm text-slate-600 sm:text-base">
        Yuk, lihat ringkasan keuanganmu hari ini.
      </p>
    </div>
  );
}
