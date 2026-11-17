"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAdminUsers } from "@/lib/api/admin/users";
import type { ApiError, Paging } from "@/lib/api/client";
import type { AdminUser } from "@/types/admin/user";

export function useAdminUsers(token: string, page: number, size: number) {
  const [version, setVersion] = useState(0);
  const requestKey = JSON.stringify([token, page, size, version]);
  const [state, setState] = useState<{
    key: string; users: AdminUser[]; paging: Paging | null; error: string | null; unauthorized: boolean;
  }>({ key: "", users: [], paging: null, error: null, unauthorized: false });

  useEffect(() => {
    const controller = new AbortController();
    fetchAdminUsers(token, page, size, controller.signal).then((result) => {
      if (!controller.signal.aborted) setState({ key: requestKey, ...result, error: null, unauthorized: false });
    }).catch((error: ApiError) => {
      if (!controller.signal.aborted) setState({ key: requestKey, users: [], paging: null,
        error: error.message || "Gagal memuat pengguna.", unauthorized: error.status === 401 });
    });
    return () => controller.abort();
  }, [token, page, size, requestKey]);

  const reload = useCallback(() => setVersion((value) => value + 1), []);
  return { ...state, isLoading: state.key !== requestKey, reload };
}
